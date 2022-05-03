# [@cloak-app/algolia](https://github.com/BKWLD/cloak-algolia)

## Vue Instantsearch with Synced Records

This demos using [Vue InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/vue/) with the records that were synced by the module using mocked data.

<instantsearch-demo></instantsearch-demo>


```vue
<template lang='pug'>

ais-instant-search.instantsearch-demo(
	:search-client='searchClient'
	index-name='dev_en-US_articles')

	ais-search-box

	ais-hits: template(#item='{ item }')
    .title {{ item.title }}

</template>

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
```
