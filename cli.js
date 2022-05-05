#!/usr/bin/env node -r esm

// Deps
import { loadNuxtConfig } from '@nuxt/config'
import parseArgs from 'minimist'
import { startRecordSync, getCms, hasShopify } from './modules/record-sync'
import algoliasearch from 'algoliasearch'
import { makeModuleCraftClient } from '@cloak-app/craft/factories'
import { makeModuleStorefrontClient } from '@cloak-app/shopify/factories'
import { mockAxiosGql } from '@cloak-app/utils'
import { defu } from 'defu'

// Parse CLI args
const argv = parseArgs(process.argv.slice(2)),
	rootDir = argv._[0] || '.'

// Load Nuxt config and then pass options off to the record-sync executor
loadNuxtConfig({ rootDir }).then(config => {

	// Make an object that is similar to the Nuxt moduleContainer using the config
	// object and some defaults from ENV like the CMS adpaters use
	const quasiModuleContainer = defu(
		{ options: config },
		{
			options: {
				cloak: {
					craft: {
						endpoint: process.env.CMS_ENDPOINT,
						site: process.env.CMS_SITE,
					},
					shopify: {
						url: process.env.SHOPIFY_URL,
						storefront: {
							token: process.env.SHOPIFY_STOREFRONT_TOKEN,
							version: 'unstable',
						}
					}
				}
			}
	})

	// Make Algolia client
	const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID,
		process.env.ALGOLIA_ADMIN_KEY)

	// Make Craft client
	let $craft
	if (getCms(config) == 'craft') {
		$craft = makeModuleCraftClient(quasiModuleContainer)
		if (argv.mock) mockAxiosGql($craft, config.cloak.craft.mocks)
	}

	// Make Shopify client
	let $storefront
	if (hasShopify(config)) {
		$storefront = makeModuleStorefrontClient(quasiModuleContainer)
		if (argv.mock) mockAxiosGql($storefront, config.cloak.shopify.mocks)
	}

	// Kick off sync
	return startRecordSync({
		...quasiModuleContainer,
		algoliaClient,
		$craft,
		$storefront,
	})
})
