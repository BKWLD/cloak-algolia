import { defu } from 'defu'
import consola from 'consola'
import { singular } from 'pluralize'
import { existsSync } from 'fs'
import { join } from 'path'
import { loadGql } from '@cloak-app/utils'

// This syncs entries to Algolia during SSG, including removing old records.
export default function() {

	// Don't run on deploy previews so WIP changes don't corrupt the prod
	// indices
	if (process.env.NETLIFY && process.env.CONTEXT !== 'production') return

	// Run syncing before generation so collections are SSGed with accurate data
	return this.nuxt.hook('generate:before', () => {
		startRecordSync(this.options)
	})
}

// The main entry point of the sync logic which does the options parsing before
// actually running the sync.
export async function startRecordSync(options) {

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
	const indexSyncConfigs = await Promise.all(config.sync.map(syncConfig => {
		return unpackSyncConfig(syncConfig, options)
	}))

	console.log(indexSyncConfigs)
}

// The sync config supports a simple string shorthand as well as many options
// that are derived from other options. This method expands each config for
// easy consumption later
async function unpackSyncConfig(syncConfig, options) {

	// Support simple string configs
	if (typeof syncConfig == 'string') syncConfig = { name: syncConfig }

	// Build the indexName automatically
	if (!syncConfig.indexName) {
		syncConfig.indexName = makeIndexName(syncConfig.name, options)
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
		}
	}

	// Return the final config object
	return syncConfig
}

// Make the index name given the syncConfig name. This draws both from
// publicRuntimeConfig, for when running normaly through a Nuxt module hook,
// and from ENV, from when running from CLI. This makes an index name like:
// "prod_en-uS_articles".
function makeIndexName(name, options) {
	const $config = options.publicRuntimeConfig || {}
	return [
		$config.cloak &&
			$config.cloak.boilerplate &&
			$config.cloak.boilerplate.appEnv ||
			process.env.APP_ENV,
		$config.cloak &&
			$config.cloak.craft &&
			$config.cloak.craft.site ||
			process.env.CMS_SITE,
		name
	].filter(val => !!val).join('_')
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
function getCms(options) {
	const modules = [...options.modules, ...options.buildModules]
	if (modules.includes('@cloak-app/craft')) return 'craft'
}

// Do the work of converting entries to records
export async function syncIndices() {

	console.log('start')

	await new Promise((resolve) => {
		setTimeout(resolve, 1000)
	})

	console.log('done')

	// Make the list of indices to create and loop through them
	// const indexHandles = await getIndexHandles()

	// // for (let i = 0; i < indexHandles.length; i++) {

	// // }

	// for await (const indexHandle of indexHandles) {
	// 	try {
	// 		results.push((await syncIndex(indexHandle)));
	// 	} catch (error) {
	// 		log(`Sync error on ${indexHandle}`);
	// 		console.error(error)
	// 	}
	// }

	// for (i = 0, len = indexHandles.length; i < len; i++) {
	// 	indexHandle = indexHandles[i];
	// 	try {
	// 		// Sync the the index
	// 		results.push((await syncIndex(indexHandle)));
	// 	} catch (error1) {
	// 		error = error1;
	// 		log(`Sync error on ${indexHandle}`);
	// 		results.push(console.error(error));
	// 	}
	// }
	// return results;
};
