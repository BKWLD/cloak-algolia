import craftArticles from './stubs/craft-articles.json'
import craftProducts from './stubs/craft-products.json'
import shopifyProducts from './stubs/shopify-products.json'

// Nuxt config
export default {

	// Load boilerplate and this package's module
	buildModules: [
		'@cloak-app/boilerplate',
		'@cloak-app/demo-theme',
		'@cloak-app/craft',
		'@cloak-app/shopify',
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
			sync: [
				'articles',
				{
					name: 'products',
					mergeShopify: 'products',
				}
			]
		},

		// Mock Craft queries
		craft: {
			mocks: [
				{
					query: 'getEntriesToSync',
					variables: { section: 'articles' },
					response: craftArticles,
				},
				{
					query: 'getEntriesToSync',
					variables: { section: 'products' },
					response: craftProducts,
				}
			]
		},

		// Mock Storefront queries
		shopify: {
			mocks: [
				{
					query: 'getAllProducts',
					response: shopifyProducts
				}
			]
		}
	},

	// Always show logs
	build: {
		quiet: false,
	},

	// @nuxt/content can't be loaded from module
	modules: ['@nuxt/content'],
}
