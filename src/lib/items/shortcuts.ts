import { api, fetchFromApi } from '@lib/helpers';
import { ItemClass, type ItemType } from './items';
import { FolderClass } from './folders';
import { FileClass } from './files';

export class ShortcutClass extends ItemClass {
	public _linkedItemId: number;
	public _linkedItem: FolderClass | FileClass | undefined;
	public color: string | undefined;

	constructor(shortcutObject: ShortcutType) {
		super(shortcutObject);

		this._linkedItemId = shortcutObject.linkedItemId;
	}

	async setLinkedItem(linkedItemId: number) {
		const response = await fetch(api('item/' + linkedItemId + '/single'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		const json = await response.json();

		// MimeType
		if (json.mimeType === 'application/vnd.cloudstore.folder') {
			const newJson = {
				...json,
				color: json.ItemFolder.color,
			};
			this.color = json.ItemFolder.color;
			this._linkedItem = new FolderClass(newJson);
			return;
		}

		if ('blobUrl' in json.ItemBlob && typeof json.ItemBlob?.blobUrl === 'string') {
			const newJson = {
				...json,
				blobUrl: json.ItemBlob.blobUrl,
			};
			this._linkedItem = new FileClass(newJson);
		}
	}

	static async create(input: { name: string; parentId: number | null; linkedItemId: number }) {
		const response = await fetch(api('shortcut'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				name: input.name,
				parentId: input.parentId ?? null,
				linkedItemId: input.linkedItemId,
			}),
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		return new ShortcutClass(await response.json());
	}

	async update(input: { name: string }) {
		const response = await fetchFromApi('shortcut', {
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

		return new ShortcutClass(await response.json());
	}

	async delete() {
		const response = await fetch(api('shortcut/' + this.id), {
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

	static isShortcut(object: any): object is ShortcutType {
		if (!ItemClass.isItem(object)) return false;

		// MimeType
		if (object.mimeType !== 'application/vnd.cloudstore.shortcut') return false;

		return true;
	}

	get linkedItemId() {
		return this._linkedItemId;
	}

	get linkedItem() {
		return this._linkedItem;
	}
}

export type ShortcutType = {
	linkedItemId: number;
	linkedItem: FileClass | ShortcutClass | undefined;
} & ItemType;
