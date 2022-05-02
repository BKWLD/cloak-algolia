# @cloak-app/algolia

Record syncing generate hook and SSR components for Algolia with Nuxt.

- [View demo](https://cloak-algolia.netlify.app)
- [Edit CodeSandbox](https://githubbox.com/BKWLD/cloak-algolia)

## Install

1. Install with `yarn add @cloak-app/algolia`
2. Add to `nuxt.config` with `buildModules: ['@cloak-app/algolia']`

### Module Options

Set these properties within `cloak: { algolia: { ... } }` in the nuxt.config.js:

- `blockMaxWidth` - A string that should match a global CSS class that adds horizontal `padding` and a `max-width` to the block component.  Defaults to `max-w`.

### Project Dependencies

- `.max-w*` styles (included in Cloak via `whitespace.styl`)

## Usage

### Components

`<cloak-algolia-block/>`

Renders a Block to be used within a Tower.

- props:
  - `maxWidth` - A string that should match a global CSS class that adds horizontal `padding` and a `max-width` to the block component.  Defaults to `max-w`.

## Contributing

Run `yarn dev` to open a Nuxt dev build of [the demo directory](./demo).

To work on the [record-sync module](./modules/record-sync.js), run `chmod +x ./cli.js` to make [cli.js](./cli.js) executable and then run `./cli.js demo` to run the `record-sync` process using the demo Nuxt environment.
