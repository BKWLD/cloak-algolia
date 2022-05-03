# [@cloak-app/algolia](https://github.com/BKWLD/cloak-algolia)

## Vue InstantSearch with Synced Records

This demos using [Vue InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/vue/) with the records that were synced by the module using mocked data.

<instantsearch-demo></instantsearch-demo>


```vue
<template lang='pug'>

//- Use $algoliaIndexName helper to make index name
ais-instant-search(
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
    { appId, searchKey } = $config.cloak.algolia
    searchClient: algoliasearch appId, searchKey

</script>
```
