import { api } from '@lib/helpers';
import { ItemClass, type ItemType } from './items';

export class FolderClass extends ItemClass {
	private _color: FolderColor;

	constructor(folderObject: FolderType) {
		super(folderObject);

		this._color = folderObject.color;
	}

	static async create(name: string, parent: FolderType | null, color: FolderColor) {
		// TODO: Send request to create folder

		const returnedFolder = await fetch(api('folder'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				name: name,
				parentId: parent?.id ?? null,
				color: color,
			}),
		})
			.then(async (response) => {
				if (!response.ok) {
					if (response.status >= 400 && response.status < 500) {
						const json = await response.json();

						throw new Error(json.error);
					}

					throw new Error(await response.text());
				}

				return response.json();
			})
			.then((data) => {
				console.log('Success:', data);

				return data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});

		return new FolderClass(returnedFolder);
	}

	async delete() {
		return await fetch(api('folder/' + this.id), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) {
					if (response.status >= 400 && response.status < 500) {
						const json = await response.json();

						throw new Error(json.error);
					}

					throw new Error(await response.text());
				}

				return response.json();
			})
			.then((data) => {
				console.log('Success:', data);

				return true;
			})
			.catch((error) => {
				console.error('Error:', error);

				return false;
			});
	}

	get color() {
		return this._color;
	}

	get colorClass(): FolderColorValue {
		return FolderColors[this._color];
	}

	private static randomColor() {
		return Object.keys(FolderColors)[
			Math.floor(Math.random() * Object.keys(FolderColors).length)
		] as FolderColor;
	}

	static isFolder(object: any): object is FolderType {
		if (!ItemClass.isItem(object)) return false;

		// Color
		if (!('color' in object && typeof object.color === 'string')) return false;

		// MimeType
		if (object.mimeType !== 'application/vnd.cloudstore.folder') return false;

		return true;
	}
}

export type FolderType = {
	color: FolderColor;
} & ItemType;

export const FolderColors = <const>{
	red: 'from-red-500 to-orange-500',
	orange: 'from-orange-500 to-amber-500',
	amber: 'from-amber-500 to-yellow-500',
	yellow: 'from-yellow-500 to-lime-500',
	lime: 'from-lime-500 to-green-500',
	green: 'from-green-500 to-emerald-500',
	emerald: 'from-emerald-500 to-teal-500',
	teal: 'from-teal-500 to-cyan-500',
	cyan: 'from-cyan-500 to-sky-500',
	sky: 'from-sky-500 to-blue-500',
	blue: 'from-blue-500 to-indigo-500',
	indigo: 'from-indigo-500 to-violet-500',
	violet: 'from-violet-500 to-purple-500',
	purple: 'from-purple-500 to-fuchsia-500',
	fuchsia: 'from-fuchsia-500 to-pink-500',
	pink: 'from-pink-500 to-rose-500',
	rose: 'from-rose-500 to-red-500',
};
export type FolderColor = keyof typeof FolderColors;
type FolderColorValue = (typeof FolderColors)[FolderColor];
