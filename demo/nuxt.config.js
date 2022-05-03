import { addPluginAfter } from '@cloak-app/utils'
import { makeCraftMock } from './plugins/mock-craft'

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

	// Make a mock that is used in nuxt hooks of this module
	craftMock: makeCraftMock(),

	// Load plugin that mocks runtime craft data
	extendPlugins(plugins) {
		return addPluginAfter(plugins, 'craft-client', '~/plugins/mock-craft')
	}
}
