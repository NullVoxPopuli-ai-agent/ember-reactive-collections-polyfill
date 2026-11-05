declare module '@glimmer/validator' {
  export interface UpdatableTag {
    readonly __brand: 'UpdatableTag';
  }
  export function createUpdatableTag(): UpdatableTag;
  export function consumeTag(tag: UpdatableTag): void;
  export function dirtyTag(tag: UpdatableTag): void;
}
