export abstract class ItemClass {
	private _id: number;
	private _name: string;
	private _mimeType: string;
	private _ownerId: number;
	private _parentId: number | null;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	protected constructor(ItemObject: ItemType) {
		this._id = ItemObject.id;
		this._name = ItemObject.name;
		this._mimeType = ItemObject.mimeType;
		this._ownerId = ItemObject.ownerId;
		this._parentId = ItemObject.parentId;

		const createdAt = ItemClass.convertDate(ItemObject.createdAt);
		const updatedAt = ItemClass.convertDate(ItemObject.updatedAt);
		const deletedAt = ItemClass.convertDate(ItemObject.deletedAt);

		if (createdAt === null) throw new Error('Invalid createdAt');
		if (updatedAt === null) throw new Error('Invalid updatedAt');

		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._deletedAt = deletedAt;
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

	static isItem(object: any): object is ItemType {
		// Id
		if (!('id' in object && typeof object.id === 'number')) return false;

		// Name
		if (!('name' in object && typeof object.name === 'string')) return false;

		// MimeType
		if (!('mimeType' in object && typeof object.mimeType === 'string')) return false;

		// OwnerId
		if (!('ownerId' in object && typeof object.ownerId === 'number')) return false;

		// ParentId
		if (
			!(('parentId' in object && typeof object.parentId === 'number') || object.parentId === null)
		)
			return false;

		// CreatedAt
		if (
			!(
				'createdAt' in object &&
				(object.createdAt === undefined ||
					object.createdAt instanceof Date ||
					typeof object.createdAt === 'string')
			)
		)
			return false;

		// UpdatedAt
		if (
			!(
				'updatedAt' in object &&
				(object.updatedAt === undefined ||
					object.updatedAt instanceof Date ||
					typeof object.updatedAt === 'string')
			)
		)
			return false;

		// DeletedAt
		if (
			!(
				'deletedAt' in object &&
				(object.deletedAt === undefined ||
					object.deletedAt === null ||
					object.deletedAt instanceof Date ||
					typeof object.deletedAt === 'string')
			)
		)
			return false;

		return true;
	}

	private static convertDate(date: Date | string | undefined | null) {
		if (typeof date === 'string') return new Date(date);
		if (date instanceof Date) return date;
		return null;
	}
}

export type ItemType = {
	id: number;
	name: string;
	mimeType: string;
	ownerId: number;
	parentId: number | null;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	deletedAt?: Date | string | null;
};
