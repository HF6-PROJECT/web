import { ItemClass, type ItemType } from './items';
import { type FolderType } from './folders';
import { upload } from '@vercel/blob/client';
import { api } from '@lib/helpers';

export class FileClass extends ItemClass {
	private _blobUrl: string;

	constructor(fileObject: FileType) {
		super(fileObject);

		this._blobUrl = fileObject.blobUrl;
	}

	static async create(file: File, parent: FolderType | null) {
		await upload(file.name, file, {
			access: 'public',
			handleUploadUrl: api('blob'),
			clientPayload: JSON.stringify({
				parentId: parent?.id ?? null,
			}),
		});

		//return new FileClass(returnedFile);
	}

	get blobUrl() {
		return this._blobUrl;
	}

	static isFile(object: any): object is FileType {
		if (!ItemClass.isItem(object)) return false;

		// BlobUrl
		if (!('blobUrl' in object && typeof object.blobUrl === 'string')) return false;

		return true;
	}
}

export type FileType = {
	blobUrl: string;
} & ItemType;
