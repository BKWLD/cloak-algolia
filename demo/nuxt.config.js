// Nuxt config
export default {

	// Load boilerplate and this package's module
	buildModules: [
		'@cloak-app/boilerplate',
		'@cloak-app/demo-theme',
		'@cloak-app/craft',
		'../nuxt',
	],

	// Cloak settings
	cloak: {

		// Boilerplate settings
		boilerplate: {
			siteName: '@cloak-app/algolia demo',
		},

		// Configure this package
		algolia: {

			// Algolia Credentials
			appId: process.env.ALGOLIA_APP_ID,
			searchKey: process.env.ALGOLIA_SEARCH_KEY,
			adminKey: process.env.ALGOLIA_ADMIN_KEY,

			// Sync settings
			syncHook: 'generate:done',
			sync: [
				'articles'
			]
		}
	},

	// @nuxt/content can't be loaded from module
	modules: ['@nuxt/content'],
}
