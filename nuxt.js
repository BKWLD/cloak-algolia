import { join } from 'path'
import {
	requireOnce,
	setDefaultOptions,
	setPrivateDefaultOptions,
	setPublicDefaultOptions,
} from '@cloak-app/utils'
export default function() {

	// Have Nuxt transpile resources
	this.options.build.transpile.push('@cloak-app/algolia')

	// Set default non-exposed options
	setDefaultOptions(this, 'algolia', {
		sync: [],
		syncHook: 'generate:before',
	})

	// Set default public options
	setPublicDefaultOptions(this, 'algolia', {
		appId: process.env.ALGOLIA_APP_ID,
		searchKey: process.env.ALGOLIA_SEARCH_KEY,
	})

	// Set private config
	setPrivateDefaultOptions(this, 'algolia', {
		adminKey: process.env.ALGOLIA_ADMIN_KEY
	})

	// Add record-sync module if sync array has values
	if (this.options.cloak.algolia.sync.length) {
		requireOnce(this, join(__dirname, 'modules/record-sync'))
	}
}

// Required for published modules
module.exports.meta = require('./package.json')
