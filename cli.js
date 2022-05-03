#!/usr/bin/env node -r esm

// Deps
import { loadNuxtConfig } from '@nuxt/config'
import parseArgs from 'minimist'
import { startRecordSync } from './modules/record-sync'
import algoliasearch from 'algoliasearch'
import {
	makeCraftClient,
	makeMockedCraftClient,
} from '@cloak-app/craft/factories'

// Parse CLI args
const argv = parseArgs(process.argv.slice(2)),
	rootDir = argv._[0] || '.'

// Load Nuxt config and then pass options off to the record-sync executor
loadNuxtConfig({ rootDir }).then(config => {

	// Make Algolia client
	const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID,
		process.env.ALGOLIA_ADMIN_KEY)

	// Make Craft client
	const $craft = argv.mock ?
		makeMockedCraftClient(config.cloak.craft.mocks) :
		makeCraftClient()

	// Kick off sync
	return startRecordSync({
		algoliaClient,
		$craft,
		options: config,
	})
})
