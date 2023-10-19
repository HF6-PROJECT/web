import { fetchFromApi } from '@lib/helpers';
import { ItemClass, type ItemType } from './items';
import { FolderClass } from './folders';
import { FileClass } from './files';
import { DocsClass, type DocsType } from './docs';

export class ShortcutClass extends ItemClass {
	public _linkedItemId: number;
	public _linkedItem: FolderClass | FileClass | DocsClass | undefined;

	constructor(shortcutObject: ShortcutType) {
		super(shortcutObject);

		this._linkedItemId = shortcutObject.linkedItemId;
	}

	async setLinkedItem(linkedItemId: number) {
		const response = await fetchFromApi('item/' + linkedItemId + '/single', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		const json = await response.json();

		if (FolderClass.isFolder(json)) {
			this._linkedItem = new FolderClass(json);
			return;
		}

		if (DocsClass.isDocs(json)) {
			this._linkedItem = new DocsClass(json);
			return;
		}

		if (FileClass.isFile(json)) {
			this._linkedItem = new FileClass(json);
		}
	}

	static async create(input: { name: string; parentId: number | null; linkedItemId: number }) {
		const response = await fetchFromApi('shortcut', {
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
		const response = await fetchFromApi('shortcut/' + this.id, {
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

		if (!('linkedItemId' in object && typeof object.linkedItemId === 'number')) return false;

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
	linkedItem: FolderClass | FileClass | DocsClass | undefined;
} & ItemType;
