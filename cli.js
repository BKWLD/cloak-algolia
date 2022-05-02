#!/usr/bin/env node -r esm

// Deps
import { loadNuxtConfig } from '@nuxt/config'
import parseArgs from 'minimist'
import { startRecordSync } from './modules/record-sync'

// Parse CLI args
const argv = parseArgs(process.argv.slice(2)),
	rootDir = argv._[0] || '.'

// Load Nuxt config and then pass options off to the record-sync executor
loadNuxtConfig({ rootDir }).then(config => {
	return startRecordSync(config.cloak && config.cloak.algolia)
})
