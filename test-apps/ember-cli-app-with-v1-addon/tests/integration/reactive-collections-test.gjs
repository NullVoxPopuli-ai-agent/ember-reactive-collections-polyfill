import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-cli-app-with-v1-addon/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import {
  trackedArray,
  trackedMap,
  trackedObject,
  trackedSet,
  trackedWeakMap,
  trackedWeakSet,
} from 'v1-addon';

module('Integration | reactive collections', function (hooks) {
  setupRenderingTest(hooks);

  test('trackedArray', async function (assert) {
    const arr = trackedArray([1, 2]);

    await render(
      <template>
        {{#each arr as |x|}}<span>{{x}}</span>{{/each}}
        <output>{{arr.length}}</output>
      </template>,
    );

    assert.dom('span').exists({ count: 2 });
    assert.dom('output').hasText('2');

    arr.push(3);
    await settled();

    assert.dom('span').exists({ count: 3 });
    assert.dom('output').hasText('3');

    arr[0] = 10;
    await settled();

    assert.dom('span').hasText('10');
    assert.true(Array.isArray(arr));
  });

  test('trackedObject', async function (assert) {
    const obj = trackedObject({ name: 'a' });

    await render(<template><output>{{obj.name}}</output></template>);
    assert.dom('output').hasText('a');

    obj.name = 'b';
    await settled();

    assert.dom('output').hasText('b');
  });

  test('trackedMap', async function (assert) {
    const map = trackedMap([['key', 'a']]);
    const get = (m, k) => m.get(k);

    await render(
      <template>
        <output>{{get map "key"}}</output><span>{{map.size}}</span>
      </template>,
    );
    assert.dom('output').hasText('a');
    assert.dom('span').hasText('1');

    map.set('key', 'b');
    map.set('other', 'c');
    await settled();

    assert.dom('output').hasText('b');
    assert.dom('span').hasText('2');
    assert.true(map instanceof Map);
  });

  test('trackedSet', async function (assert) {
    const set = trackedSet([1]);
    const has = (s, v) => String(s.has(v));

    await render(
      <template>
        <output>{{has set 2}}</output><span>{{set.size}}</span>
      </template>,
    );
    assert.dom('output').hasText('false');
    assert.dom('span').hasText('1');

    set.add(2);
    await settled();

    assert.dom('output').hasText('true');
    assert.dom('span').hasText('2');
    assert.true(set instanceof Set);
  });

  test('trackedWeakMap', async function (assert) {
    const key = {};
    const map = trackedWeakMap([[key, 'a']]);
    const get = (m, k) => m.get(k);

    await render(<template><output>{{get map key}}</output></template>);
    assert.dom('output').hasText('a');

    map.set(key, 'b');
    await settled();

    assert.dom('output').hasText('b');
    assert.true(map instanceof WeakMap);
  });

  test('trackedWeakSet', async function (assert) {
    const value = {};
    const set = trackedWeakSet();
    const has = (s, v) => String(s.has(v));

    await render(<template><output>{{has set value}}</output></template>);
    assert.dom('output').hasText('false');

    set.add(value);
    await settled();

    assert.dom('output').hasText('true');
    assert.true(set instanceof WeakSet);
  });

  test('equals option prevents re-render', async function (assert) {
    let renders = 0;
    const obj = trackedObject({ n: 1 }, { equals: () => true });
    const count = (v) => {
      renders++;
      return v;
    };

    await render(<template><output>{{count obj.n}}</output></template>);
    assert.strictEqual(renders, 1);

    obj.n = 2;
    await settled();

    assert.strictEqual(renders, 1);
    assert.dom('output').hasText('1');
  });
});
