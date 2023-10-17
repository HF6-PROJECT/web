import { DocsClass } from './docs';
import { FileClass } from './files';
import { FolderClass } from './folders';
import { ShortcutClass } from './shortcuts';
import { type ItemType } from './items';

export class ItemFactory {
	static async getItemFromObject(object: ItemType) {
		if (FolderClass.isFolder(object)) return new FolderClass(object);
		if (FileClass.isFile(object)) return new FileClass(object);
		if (DocsClass.isDocs(object)) return new DocsClass(object);
		if (ShortcutClass.isShortcut(object)) {
			const shortcutClass = new ShortcutClass(object);
			await shortcutClass.setLinkedItem(object.linkedItemId);
			return shortcutClass;
		}

		console.error('ItemClass.getItemFromObject: Invalid object');
		return null;
	}
}
