# ember-reactive-collections-polyfill

Use `@ember/reactive/collections` ([RFC 1068](https://github.com/emberjs/rfcs/pull/1068)) on ember-source versions older than 6.8.

```js
import {
  trackedArray,
  trackedMap,
  trackedObject,
  trackedSet,
  trackedWeakMap,
  trackedWeakSet,
} from '@ember/reactive/collections';
```

This package has two parts: a babel plugin and a v2 addon.

The babel plugin changes imports from `@ember/reactive/collections` to `ember-reactive-collections-polyfill`.

The v2 addon picks an implementation at build time with `@embroider/macros`:

| Host ember-source | Exports |
| --- | --- |
| < 6.8 | A copy of Ember's code, built on `consumeTag`, `createUpdatableTag`, and `dirtyTag` from `@glimmer/validator` |
| >= 6.8 | Ember's native functions |

The functions have the same signatures and options (`equals`, `description`) as Ember's.

## Compatibility

- ember-source 5.12 or later. The test suite runs against 5.12, 6.4, 6.8, and the latest release.
- Embroider (Vite) or ember-auto-import v2

## Installation

```sh
pnpm add ember-reactive-collections-polyfill
```

Then add the babel plugin to each package that imports from `@ember/reactive/collections`. Each package compiles its own code, so a plugin in the app does not change an addon's code.

### Vite app (Embroider)

`babel.config.mjs`:

```js
import { fileURLToPath } from 'node:url';

export default {
  plugins: [
    fileURLToPath(
      import.meta.resolve('ember-reactive-collections-polyfill/babel-plugin'),
    ),
    // ...
  ],
};
```

### Classic ember-cli app

`ember-cli-build.js`:

```js
const app = new EmberApp(defaults, {
  babel: {
    plugins: [
      require.resolve('ember-reactive-collections-polyfill/babel-plugin'),
    ],
  },
});
```

### v1 addon

Add `ember-reactive-collections-polyfill` and `ember-auto-import` to `dependencies`. Then, in `index.js`:

```js
module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [
        require.resolve('ember-reactive-collections-polyfill/babel-plugin'),
      ],
    },
  },
};
```

### v2 addon

Add `ember-reactive-collections-polyfill` to `dependencies`. Then add the plugin to `babel.publish.config.cjs`. Add it to `babel.config.cjs` too if your tests import from `@ember/reactive/collections`.

```js
module.exports = {
  plugins: [
    require.resolve('ember-reactive-collections-polyfill/babel-plugin'),
    // ...
  ],
};
```

The published `dist` imports from `ember-reactive-collections-polyfill`. The host app's ember-source version then selects the polyfill or the native implementation.

## TypeScript

ember-source < 6.8 does not have types for `@ember/reactive/collections`. To add them, put the types entry in your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "types": [
      "ember-source/types",
      "ember-reactive-collections-polyfill/types",
    ],
  },
}
```

Remove this entry when you upgrade to ember-source 6.8 or later, because ember-source then declares the same module.

## What the babel plugin changes

The plugin changes the module specifier `@ember/reactive/collections` to `ember-reactive-collections-polyfill` in these forms:

- `import { trackedArray } from '@ember/reactive/collections'`
- `import * as collections from '@ember/reactive/collections'`
- `export { trackedMap } from '@ember/reactive/collections'`
- `export * from '@ember/reactive/collections'`
- `import('@ember/reactive/collections')`

It makes the change when the program is entered. Other babel plugins (for example the ember-auto-import analyzer) then see the new specifier.

## License

MIT. The files in `src/collections/` are copied from [ember.js](https://github.com/emberjs/ember.js/tree/main/packages/%40glimmer/validator/lib/collections) (MIT). The only change is that they import from the public `@glimmer/validator` entry point.
