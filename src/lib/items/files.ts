import { ItemClass, type ItemType } from './items';
import { FolderClass } from './folders';

export class FileClass extends ItemClass {
	private _blobUrl: string;

	constructor(fileObject: FileType) {
		super(fileObject);

		this._blobUrl = fileObject.blobUrl;
	}

	static create(name: string, parent: FolderClass | null) {
		// TODO: Send request to create folder

		// Placeholder for now
		const returnedFile = {
			id: 1,
			name: name,
			mimeType: 'application/vnd.cloudstore.folder',
			ownerId: 43535,
			parentId: parent?.id || null,
			deletedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			blobUrl: 'https://www.google.com',
		};

		return new FileClass(returnedFile);
	}

	get blobUrl() {
		return this._blobUrl;
	}

	static isFile(object: ItemType): object is FileType {
		// BlobUrl
		if (!('blobUrl' in object && typeof object.blobUrl === 'string')) return false;

		return true;
	}
}

export type FileType = {
	blobUrl: string;
} & ItemType;
