<!-- Demo using instantsearch with the demo data -->

<template lang='pug'>

//- Use $algoliaIndexName helper to make index name
ais-instant-search.instantsearch-demo(
	:search-client='searchClient'
	:index-name='$algoliaIndexName("articles")')

	//- Shared search box
	ais-search-box

	//- Render articles results
	ais-hits: template(#item='{ item }')
		| {{ item.title }}
		span.badge Article

	//- Render products results
	ais-index(:index-name='$algoliaIndexName("products")')
		ais-hits: template(#item='{ item }')
			| {{ item.title }}
			span.badge Product


</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>

# Bootstrap instantsearch per:
# https://www.algolia.com/doc/guides/building-search-ui/getting-started/vue/#initialization
import Vue from 'vue'
import InstantSearch from 'vue-instantsearch'
import 'instantsearch.css/themes/satellite-min.css'
import algoliasearch from 'algoliasearch/lite'
Vue.use InstantSearch

export default

	# Build the client using publicRuntimeConfig values
	data: ->
		{ appId, searchKey } = @$config.cloak.algolia
		searchClient: algoliasearch appId, searchKey

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

.instantsearch-demo
	color secondary-color

.badge
	border 1px solid currentColor
	font-size .75em
	border-radius 2px
	display inline-block
	margin-left 1em
	padding-h 0.5em

>>> .ais-Hits-item
	padding-v 1em

</style>
