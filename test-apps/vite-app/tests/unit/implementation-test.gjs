import { module, test } from 'qunit';
import {
  appEmberSatisfies,
  importSync,
  macroCondition,
} from '@embroider/macros';
import * as polyfill from 'ember-reactive-collections-polyfill';

const NAMES = [
  'trackedArray',
  'trackedMap',
  'trackedObject',
  'trackedSet',
  'trackedWeakMap',
  'trackedWeakSet',
];

module('Unit | implementation selection', function () {
  if (macroCondition(appEmberSatisfies('>=6.8.0'))) {
    test('re-exports the native implementation', function (assert) {
      const native = importSync('@ember/reactive/collections');

      for (const name of NAMES) {
        assert.strictEqual(polyfill[name], native[name], name);
      }
    });
  } else {
    test('provides the polyfilled implementation', function (assert) {
      for (const name of NAMES) {
        assert.strictEqual(typeof polyfill[name], 'function', name);
      }
    });
  }
});
