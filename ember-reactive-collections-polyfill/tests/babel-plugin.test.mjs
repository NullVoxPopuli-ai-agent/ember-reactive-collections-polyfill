import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { transformSync } from '@babel/core';

const require = createRequire(import.meta.url);
const plugin = require('../babel-plugin.cjs');

function transform(code, filename = '/app/component.js') {
  return transformSync(code, {
    filename,
    configFile: false,
    babelrc: false,
    plugins: [plugin],
  }).code;
}

test('rewrites import declarations', () => {
  assert.equal(
    transform(`import { trackedArray } from '@ember/reactive/collections';`),
    `import { trackedArray } from "ember-reactive-collections-polyfill";`,
  );
});

test('rewrites namespace imports', () => {
  assert.equal(
    transform(`import * as c from '@ember/reactive/collections';`),
    `import * as c from "ember-reactive-collections-polyfill";`,
  );
});

test('rewrites re-exports', () => {
  assert.equal(
    transform(
      [
        `export { trackedMap } from '@ember/reactive/collections';`,
        `export * from '@ember/reactive/collections';`,
      ].join('\n'),
    ),
    [
      `export { trackedMap } from "ember-reactive-collections-polyfill";`,
      `export * from "ember-reactive-collections-polyfill";`,
    ].join('\n'),
  );
});

test('rewrites dynamic import()', () => {
  assert.equal(
    transform(`import('@ember/reactive/collections');`),
    `import("ember-reactive-collections-polyfill");`,
  );
});

test('leaves other modules alone', () => {
  let code = [
    `import { tracked } from '@glimmer/tracking';`,
    `import x from '@ember/reactive';`,
    `export const local = 1;`,
  ].join('\n');

  assert.equal(transform(code), code);
});

test('does not rewrite files inside the polyfill package', () => {
  let own = fileURLToPath(new URL('../src/index.ts', import.meta.url));

  assert.equal(
    transform(`import('@ember/reactive/collections');`, own),
    `import('@ember/reactive/collections');`,
  );
});

test('runs before plugins that read import sources', () => {
  let seen = [];
  let observer = () => ({
    visitor: {
      ImportDeclaration(path) {
        seen.push(path.node.source.value);
      },
    },
  });

  transformSync(`import { trackedSet } from '@ember/reactive/collections';`, {
    filename: '/app/a.js',
    configFile: false,
    babelrc: false,
    plugins: [observer, plugin],
  });

  assert.deepEqual(seen, ['ember-reactive-collections-polyfill']);
});
