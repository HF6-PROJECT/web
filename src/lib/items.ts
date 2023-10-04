/**
 * Item
 */
export abstract class ItemClass {
	private _id: number;
	private _name: string;
	private _mimeType: string;
	private _ownerId: number;
	private _parentId: number | null;
	private _createdAt: Date | undefined;
	private _updatedAt: Date | undefined;
	private _deletedAt: Date | null;

	protected constructor(ItemObject: ItemType) {
		this._id = ItemObject.id;
		this._name = ItemObject.name;
		this._mimeType = ItemObject.mimeType;
		this._ownerId = ItemObject.ownerId;
		this._parentId = ItemObject.parentId;
		this._createdAt = ItemObject.createdAt || undefined;
		this._updatedAt = ItemObject.updatedAt || undefined;
		this._deletedAt = ItemObject.deletedAt || null;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get mimeType() {
		return this._mimeType;
	}

	get ownerId() {
		return this._ownerId;
	}

	get parentId() {
		return this._parentId;
	}

	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	get deletedAt() {
		return this._deletedAt;
	}
}

export type ItemType = {
	id: number;
	name: string;
	mimeType: string;
	ownerId: number;
	parentId: number | null;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
};

/**
 * Folder
 */
export class FolderClass extends ItemClass {
	private _color: FolderColor;

	constructor(folderObject: FolderType) {
		super(folderObject);

		this._color = folderObject.color;
	}

	static create(name: string, parent: FolderClass | null) {
		// Send request to create folder
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

/**
 * File
 */
export class FileClass extends ItemClass {
	private _blobUrl: string;

	constructor(fileObject: FileType) {
		super(fileObject);

		this._blobUrl = fileObject.blobUrl;
	}

	static create(name: string, parent: FolderClass | null) {
		// Send request to create folder
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
}

export type FileType = {
	blobUrl: string;
} & ItemType;
