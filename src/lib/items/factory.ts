import { FileClass } from './files';
import { FolderClass } from './folders';
import { type ItemType } from './items';

export class ItemFactory {
	static getItemFromObject(object: ItemType) {
		if (FolderClass.isFolder(object)) return new FolderClass(object);
		if (FileClass.isFile(object)) return new FileClass(object);

		console.error('ItemClass.getItemFromObject: Invalid object');
		return null;
	}
}
