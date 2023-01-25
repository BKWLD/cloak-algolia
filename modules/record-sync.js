import consola from 'consola'
import { singular } from 'pluralize'
import { existsSync } from 'fs'
import { join } from 'path'
import { loadGql } from '@cloak-app/utils'
import algoliasearch from 'algoliasearch'
import { algoliaIndexName } from '../plugins/helpers'

// This syncs entries to Algolia during SSG, including removing old records.
export default function() {

	// Don't run on deploy previews so WIP changes don't corrupt the prod
	// indices
	if (process.env.NETLIFY && process.env.CONTEXT !== 'production') return

	// Hook into Nuxt lifecycle
	const hookName = this.options.cloak.algolia.syncHook
	return this.nuxt.hook(hookName, async ({ options }) => {

		// Make Algolia instance
		const { appId, adminKey } = options.cloak.algolia,
			algoliaClient = algoliasearch(appId, adminKey)

		// Start payload for startRecordSync
		const payload = { algoliaClient, options }

		// Add CMS instances
		switch (getCms(options)) {
			case 'craft':
				const craftFactories = await import('@cloak-app/craft/factories')
				payload.$craft = craftFactories.makeModuleCraftClient(this)
		}

		// Add Shopify instance
		if (hasShopify(options)) {
			const shopifyFactories = await import('@cloak-app/shopify/factories')
			payload.$storefront = shopifyFactories.makeModuleStorefrontClient(this)
		}

		// Kick off sync
		await startRecordSync(payload)
	})
}

// The main entry point of the sync logic which does the options parsing before
// actually running the sync.
export async function startRecordSync({
	algoliaClient, $craft, $storefront, options,
}) {

	// Get package specific config
	const config = options.cloak.algolia

	// Make a consola scope
	const log = consola.withTag('@cloak-app/algolia')

	// Require a sync array
	if (!config.sync || !config.sync.length) {
		return log.warn('No sync configuration detected')
	}

	// Build unpacked array of index sync configuration
	log.info('Unpacking sync config')
	const syncConfigs = await Promise.all(config.sync.map(syncConfig => {
		return unpackSyncConfig(syncConfig, options)
	}))

	// Loop through indices and sync records
	for (let syncConfig of syncConfigs) {
		log.info(`Syncing to ${syncConfig.indexName}`)
		await executeSync(syncConfig, { algoliaClient, $craft, $storefront })
	}

	// Log success
	log.success('Syncing to Algolia complete')
}

// The sync config supports a simple string shorthand as well as many options
// that are derived from other options. This method expands each config for
// easy consumption later
async function unpackSyncConfig(syncConfig, options) {

	// Support simple string configs
	if (typeof syncConfig == 'string') syncConfig = { name: syncConfig }

	// Build the indexName automatically
	if (!syncConfig.indexName) {
		syncConfig.indexName = algoliaIndexName(syncConfig.name, {
			$config: options.publicRuntimeConfig
		})
	}

	// Build query if one wasn't explicitly defined
	if (!syncConfig.records) {
		syncConfig.query = syncConfig.query ||
			await buildQueryFromFragment(syncConfig, options)
	}

	// Set query variables from options
	if (syncConfig.query && !syncConfig.variables) {
		syncConfig.variables = {
			section: syncConfig.section || syncConfig.name,
			type: syncConfig.type,
			site: syncConfig.site || process.env.CMS_SITE
		}
	}

	// Return the final config object
	return syncConfig
}

// Get the default query for the CMS
async function buildQueryFromFragment(syncConfig, options) {

	// Determine the fragment path
	const fragmentPath = syncConfig.fragmentPath ||
		`queries/fragments/${singular(syncConfig.name)}.gql`

	// Determine the full path to the fragment
	const fragmentFullPath = join(options.rootDir, fragmentPath)

	// Require a fragment, which is required when uing the default query
	if (!existsSync(fragmentFullPath)) {
		throw 'Valid fragmentPath is required when no query is provided'
	}

	// Load the fragment content
	const fragment = await loadGql(fragmentFullPath),
		fragmentName = getFragmentName(fragment)

	// Build the CMS specific query
	switch (getCms(options)) {
		case 'craft': return `
				query getEntriesToSync(
					$site:    [String]
					$section: [String]
					$type:    [String]) {
					entries(
						site:    $site
						section: $section
						type:    $type) {
						...${fragmentName}
					}
				}
			` + fragment
		default: throw 'Unknown CMS'
	}
}

// Get the first fragment name from the fragment string
// https://regex101.com/r/pAe0Ra/1
function getFragmentName(fragment) {
	const matches = fragment.match(/fragment\s+(\w+)/i)
	if (!matches) throw 'Fragment name could not be detected'
	return matches[1]
}

// Get the CMS name by looking for Cloak CMS modules.
export function getCms(options) {
	const modules = allModules(options)
	if (modules.includes('@cloak-app/craft')) return 'craft'
}

// Do we have a Shopify dependency
export function hasShopify(options) {
	return allModules(options).includes('@cloak-app/shopify')
}

// Get all modules
function allModules(options) {
	return [...(options.modules || []), ...(options.buildModules || [])]
}

// Act on a syncConfig to sync records to Algolia
async function executeSync({
	indexName, query, variables, settings, records, mergeShopify,
}, { algoliaClient, $craft, $storefront }) {

	// Get index reference
	const index = algoliaClient.initIndex(indexName)

	// Set index settings. If this index hasn't been created for, use this to
	// create the index to work around issues I experienced where the index
	// wouldn't be created when using replaceAllObjects.
	if (settings) await index.setSettings(settings)
	else if (!await index.exists()) await index.setSettings({})

	// Fetch records to index
	if (!records) {
		if ($craft) records = await $craft.getEntries({ query, variables })
		else throw 'CMS adapter not found'
	}

	// Merge Shopify data
	if (mergeShopify) {
		records = await mergeShopifyData($storefront, records, mergeShopify)
	}

	// Add objectID to records automatically based on uri or id
	records = records.map(record => ({
		...record,
		objectID: record.uri || record.id
	}))

	// Write entries to Algolia
	await index.replaceAllObjects(records, { safe: true })
}

// Merge Shopify data with records
function mergeShopifyData($storefront, records, shopifyEntryType) {
	switch(shopifyEntryType) {
		case 'products': return mergeShopifyProducts($storefront, records)
		default: throw `Unexpected shopifyEntryType ${shopifyEntryType}`
	}
}

// Merge Shopify products with records
async function mergeShopifyProducts($storefront, records) {

	// Load fragment
	const fragmentPath = '@cloak-app/shopify/queries/fragments/product.gql',
		fragment = await loadGql(fragmentPath)

	// Run query
	const { products } = await $storefront.execute({ query: `
		query getAllProducts {
			products(first: 250) {
				edges {
					node { ...product }
				}
			}
		}
	` + fragment})

	// Do the merging
	return mergeShopifyDataIntoRecords(records, products)
}

// Loop through records and merge product data when there is a match.  When
// there is no match, filter the record
function mergeShopifyDataIntoRecords(records, products) {
	return records.map(record => {
		const product = products.find(product => product.handle == record.slug)
		if (product) return { ...record, ...product }
	}).filter(record => !!record)
}
