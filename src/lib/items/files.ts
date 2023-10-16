import { ItemClass, type ItemType } from './items';
import { type FolderType } from './folders';
import { upload } from '@vercel/blob/client';
import { api, fetchFromApi } from '@lib/helpers';

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
	}

	async update(input: { name: string }) {
		const response = await fetchFromApi('blob', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				id: this.id,
				name: input.name,
			}),
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		return new FileClass(await response.json());
	}

	async delete() {
		const response = await fetchFromApi('blob/' + this.id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}
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
