<!-- Demo using instantsearch with the demo data -->

<template lang='pug'>

ais-instant-search.instantsearch-demo(
	:search-client='searchClient'
	index-name='dev_en-US_articles')

	ais-search-box

	ais-hits: template(#item='{ item }')
		.title {{ item.title }}

</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script lang='coffee'>
import Vue from 'vue'
import InstantSearch from 'vue-instantsearch'
import 'instantsearch.css/themes/satellite-min.css'
import algoliasearch from 'algoliasearch/lite'
Vue.use InstantSearch
export default

	# Build the client
	data: ->
		{ appId, searchKey } = $config.cloak.algolia
		searchClient: algoliasearch appId, searchKey

</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang='stylus' scoped>

.instantsearch-demo
	color secondary-color

</style>
