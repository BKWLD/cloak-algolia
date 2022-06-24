# @cloak-app/algolia

Record syncing generate hook and SSR components for Algolia with Nuxt.

- [View demo](https://cloak-algolia.netlify.app)
- [Edit CodeSandbox](https://githubbox.com/BKWLD/cloak-algolia)

## Install

1. Install with `yarn add @cloak-app/algolia`
2. Add to `nuxt.config` with `buildModules: ['@cloak-app/algolia']`

### Module Options

Set these properties within `cloak: { algolia: { ... } }` in the nuxt.config.js:

#### Credentials
- `appId` - Algolia app ID, defaults to `process.env.ALGOLIA_APP_ID`.
- `searchKey` - Algolia public search API key, defaults to `process.env.ALGOLIA_SEARCH_KEY`.
- `adminKey` - Algolia private admin API key, defaults to `process.env.ALGOLIA_ADMIN_KEY`.

#### Syncing
- `syncHook` - The Nuxt lifecycle to run sync operation on.  Defaults to `generate:before`, a good default if you are using Algolia data during SSR.  If you only use client side, change to `generate:done` to prevent syncing if the `generate` operation fails.
- `sync` - An array of sync configuration rules.  There shoud be an array item for each index you want to sync to.  See Usage for more information.


### Project Dependencies

- `.max-w*` styles (included in Cloak via `whitespace.styl`)

## Usage

### Sync

In the `sync` array's simplest form, give it a simple string per index:

```js
// nuxt.config.js
export default {
  cloak: {
    algolia: {
      sync: ['articles'],
    }
  }
}
```

This does a couple a couple of things:

- It will create an Algolia index automatically during `yarn generate` that named `${env}_${site}_${name}` where `env` is derived from `$config.cloak.boilerplate.appEnv` and `site` is derived from `$config.cloak.craft.site`.  For example, `prod_en-US_articles`.

- It will query the CMS for records matching that name.  If using Craft, this means querying for all entries that have a section of `articles`.  The composition of these entry objects is made using a gql fragment that is expected to live at `~/queries/fragments/article.gql`.  This should be the same fragment that is used to render these entries in other places on the site where they are listed.  Thus, if you render these entries in some sort of card UX, the objects returned by Algolia and the objects returned by the CMS should be identical so you can directly render the card components without any massaging of Algolia data.

The `sync` array also supports an expanded form, if you want to tweak any of these names.

```js
// nuxt.config.js
export default {
  cloak: {
    algolia: {
      sync: [
        {
          name: 'blogs',
          indexName: 'prod_articles',
          
          // Use Craft helpers ...
          fragmentPath: 'path/to/fragment.gql',
          section: 'blog', // Craft section type
          type: 'article', // Craft entry type

          // ... or completely replace the query and variables ...
          // query: `query($section:[String]) {...}`,
          // variables: { section: "blog", category: "..." },

          // ... or fetch all your records some other way ...
          // records: [{ ... }],
          
          // Set Algolia index settings
          // https://www.algolia.com/doc/api-reference/settings-api-parameters/
          settings: {},
        }
      ],
    }
  }
}
```

Another common pattern is merging Shopify product data with CMS product data. This can be easily accomplished with the `mergeShopify` option:

```js
// nuxt.config.js
export default {
  cloak: {
    algolia: {
      sync: [{
        name: 'products,
        mergeShopify: 'products',
      }],
    }
  }
}
```

This uses the [`@cloak-app/shopify`](https://github.com/BKWLD/cloak-shopify) package to fetch products that match the CMS products, comparing CMS slugs with Shopify handles.  The [`product` fragment](https://github.com/BKWLD/cloak-shopify/blob/master/queries/fragments/product.gql) is used with the Shopify data.

### CLI

You can manually run the sync operation by running the following from *within your Nuxt directory*:

```sh
$ yarn algolia-sync
```

## Contributing

Run `yarn dev` to open a Nuxt dev build of [the demo directory](./demo).

To work on the [record-sync module](./modules/record-sync.js), run `chmod +x ./cli.js` to make [cli.js](./cli.js) executable and then run `./cli.js demo --mock` to run the `record-sync` process using the demo Nuxt environment.
