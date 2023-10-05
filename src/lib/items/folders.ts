import { ItemClass, type ItemType } from './items';

export class FolderClass extends ItemClass {
	private _color: FolderColor;

	constructor(folderObject: FolderType) {
		super(folderObject);

		this._color = folderObject.color;
	}

	static create(name: string, parent: FolderClass | null) {
		// TODO: Send request to create folder

		// Placeholder for now
		const returnedFolder = {
			id: 1,
			name: name,
			mimeType: 'application/vnd.cloudstore.folder',
			ownerId: 43535,
			parentId: parent?.id || null,
			deletedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			color: FolderClass.randomColor(),
		};

		return new FolderClass(returnedFolder);
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

	static isFolder(object: ItemType): object is FolderType {
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

const FolderColors = <const>{
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
type FolderColor = keyof typeof FolderColors;
type FolderColorValue = (typeof FolderColors)[FolderColor];
