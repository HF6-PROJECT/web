import { map } from 'nanostores';
import type { ItemClass } from '@lib/items/items';

export const itemsStore = map<Record<number, ItemClass | undefined>>({});

export function addItem(item: ItemClass) {
	itemsStore.setKey(item.id, item);
}

export function updateItem(item: ItemClass) {
	itemsStore.setKey(item.id, item);
}

export function removeItem(item: ItemClass) {
	itemsStore.setKey(item.id, undefined);
}
