import {
  appEmberSatisfies,
  importSync,
  macroCondition,
} from '@embroider/macros';

import * as polyfill from './collections/index.ts';

type Collections = typeof polyfill;

const impl: Collections = macroCondition(appEmberSatisfies('>=6.8.0'))
  ? (importSync('@ember/reactive/collections') as Collections)
  : polyfill;

export const trackedArray: Collections['trackedArray'] = impl.trackedArray;
export const trackedMap: Collections['trackedMap'] = impl.trackedMap;
export const trackedObject: Collections['trackedObject'] = impl.trackedObject;
export const trackedSet: Collections['trackedSet'] = impl.trackedSet;
export const trackedWeakMap: Collections['trackedWeakMap'] =
  impl.trackedWeakMap;
export const trackedWeakSet: Collections['trackedWeakSet'] =
  impl.trackedWeakSet;
