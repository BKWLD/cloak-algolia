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

		// Sync settings
		algolia: {
			syncHook: 'generate:done',
			sync: [
				'articles'
			]
		}
	},

	// @nuxt/content can't be loaded from module
	modules: ['@nuxt/content'],
}
