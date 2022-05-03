/*
 * Mock Axios calls to Craft API
 */
import MockAdapter from 'axios-mock-adapter'
import { makeCraftClient } from '@cloak-app/craft/factories'

// Get stubs
import articles from '../stubs/articles.json'

// Nuxt plugin
export default function ({ $craft }) {
	addMocks($craft)
}

// Make a new Craft instance with mocks
export function makeCraftMock() {
	const $craft = makeCraftClient()
	addMocks($craft)
	return $craft
}

// Add mock to axios instances
export function addMocks(client) {

	// Make mock instance
	const mock = new MockAdapter(client)

	// Listen to all requests...
	mock.onAny().reply(config => {
		const payload = JSON.parse(config.data)

		// Return a json stub based on request vars
		if (payload.query.includes('getEntriesToSync')) {
			if (payload.variables.section == 'articles') {
				return [200, articles]
			}
		}

		// A request didn't match expectations
		throw 'Unexepcted request'
	})
}
