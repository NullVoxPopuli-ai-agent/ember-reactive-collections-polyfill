import { module, test } from 'qunit';
import { setupRenderingTest } from 'vite-app-with-v2-addon/tests/helpers';
import { click, render } from '@ember/test-helpers';
import ItemList from 'v2-addon/components/item-list';

module('Integration | v2-addon | item-list', function (hooks) {
  setupRenderingTest(hooks);

  test('uses trackedArray from @ember/reactive/collections inside the addon', async function (assert) {
    await render(<template><ItemList /></template>);

    assert.dom('li').exists({ count: 1 });

    await click('button');
    await click('button');

    assert.dom('li').exists({ count: 3 });
    assert.dom('li:last-child').hasText('item-2');
  });
});
