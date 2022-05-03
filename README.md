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

The `sync` module option is an array that takes either objects or strings.  The full object payload looks like:

- `name` - Used to generate defaults as described below.  Ex: "articles".
- `indexName` - The name of the Algolia index that will be written to.  If empty, is set to `${env}_${site}_${name}` where `env` is set to `$config.cloak.boilerplate.appEnv` and `site` is set to `$config.cloak.craft.site`.
- *TODO* - Finish documenting

### CLI

You can manually run the sync operation by running:

```sh
$ yarn @cloak-app/algolia
```

## Contributing

Run `yarn dev` to open a Nuxt dev build of [the demo directory](./demo).

To work on the [record-sync module](./modules/record-sync.js), run `chmod +x ./cli.js` to make [cli.js](./cli.js) executable and then run `./cli.js demo --mock` to run the `record-sync` process using the demo Nuxt environment.
