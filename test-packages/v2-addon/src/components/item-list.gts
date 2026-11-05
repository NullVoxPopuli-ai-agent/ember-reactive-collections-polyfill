import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { trackedArray } from '@ember/reactive/collections';

export default class ItemList extends Component {
  items = trackedArray(['item-0']);

  add = () => this.items.push(`item-${this.items.length}`);

  <template>
    <button type="button" {{on "click" this.add}}>add</button>
    <ul>
      {{#each this.items as |item|}}
        <li>{{item}}</li>
      {{/each}}
    </ul>
  </template>
}
