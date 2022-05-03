/**
 * Helpers for working with Algolia
 */
export default function ({ $config }, inject) {

	// Auto provide configuration options to makeAlgoliaIndexName
	inject('algoliaIndexName', (name) => {
		return algoliaIndexName(name, { $config })
	})

}

// Make the index name given the syncConfig name. This draws both from
// publicRuntimeConfig, for when running normaly through a Nuxt module hook,
// and from ENV, from when running from CLI. This makes an index name like:
// "prod_en-US_articles" given a `name` of `articles`.
export function algoliaIndexName(name, { $config } = {}) {
	return [
		$config.cloak &&
			$config.cloak.boilerplate &&
			$config.cloak.boilerplate.appEnv ||
			process.env.APP_ENV,
		$config.cloak &&
			$config.cloak.craft &&
			$config.cloak.craft.site ||
			process.env.CMS_SITE,
		name
	].filter(val => !!val).join('_')
}
