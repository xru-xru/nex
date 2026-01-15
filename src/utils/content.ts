import { get } from 'lodash';

// TODO: this is still WIP - how to define equal contents
// DO we need
export function equalContent(first: any, second: any): boolean {
  const firstColId = get(first, 'collection_id', null);
  const secondColId = get(second, 'collection_id', null);

  if (!firstColId || !secondColId) {
    throw new Error('equalContent can not compare content without data');
  }

  return firstColId === secondColId;
}
export function getContentKey(content: any, prefix = ''): string {
  const provider = get(content, 'provider.provider_id', '') || '';
  const collection = get(content, 'collection.collection_id', '');
  const id = `${provider}-${collection}`;
  return `${prefix ? `${prefix}-` : ''}${id}`;
}
