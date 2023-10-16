import { ItemClass, type ItemType } from './items';
import { type FolderType } from './folders';
import { api } from '@lib/helpers';

export class DocsClass extends ItemClass {
	private _text: string;

	constructor(docsObject: DocsType) {
		super(docsObject);

		this._text = docsObject.text;
	}

	static async create(name: string, text: string, parent: FolderType | null) {
		const response = await fetchFromApi('docs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				name: name,
				parentId: parent?.id ?? null,
				text: text,
			}),
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		return new DocsClass(await response.json());
	}

	async update(name: string, text: string) {
		const response = await fetchFromApi('docs', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				id: this.id,
				name: name,
				text: text,
			}),
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		return new DocsClass(await response.json());
	}

	async delete() {
		const response = await fetchFromApi('docs/' + this.id, {
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

	get text() {
		return this._text;
	}

	static isDocs(object: any): object is DocsType {
		if (!ItemClass.isItem(object)) return false;

		// Text
		if (!('text' in object && typeof object.text === 'string')) return false;

		return true;
	}
}

export type DocsType = {
	text: string;
} & ItemType;
