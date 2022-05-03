#!/usr/bin/env node -r esm

// Deps
import { loadNuxtConfig } from '@nuxt/config'
import parseArgs from 'minimist'
import { startRecordSync } from './modules/record-sync'
import algoliasearch from 'algoliasearch'
import { makeCraftClient } from '@cloak-app/craft/factories'
import { makeCraftMock } from './demo/plugins/mock-craft'

// Parse CLI args
const argv = parseArgs(process.argv.slice(2)),
	rootDir = argv._[0] || '.'

// Load Nuxt config and then pass options off to the record-sync executor
loadNuxtConfig({ rootDir }).then(config => {

	// Make Algolia client
	const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID,
		process.env.ALGOLIA_ADMIN_KEY)

	// Make Craft client
	const $craft = argv.mock ? makeCraftMock() : makeCraftClient()

	// Kick off sync
	return startRecordSync({
		algoliaClient,
		$craft,
		options: config,
	})
})
