import en from '../lang/en';
import da from '../lang/da';

type LocaleObject = {
	[key: string]: string | LocaleObject;
};

/**
 * Get a localized string from a given key and locale
 *
 * If no locale is given, the 'en' locale is used.
 * If document is available, the document's lang attribute is used.
 * If no value is found, the key is returned.
 *
 * @param key The key to the value - Example: 'auth.field.name'
 * @param locale The locale to use
 * @returns The value of the given path or key if not found
 */
export const t = (key: string, locale: App.Locals['currentLocale'] = 'en') => {
	if (typeof document !== 'undefined') {
		locale = document.documentElement.lang as App.Locals['currentLocale'];
	}

	let localeObject: LocaleObject;

	switch (locale) {
		case 'da':
			localeObject = da;
			break;
		case 'en':
		default:
			localeObject = en;
			break;
	}

	const value = getValue(key, localeObject);

	if (value === null) {
		return key;
	}

	return value;
};

/**
 * Iterate into a LocaleObject and return the value of the given path
 *
 * @param path The path to the value - Example: 'auth.field.name'
 * @param obj The LocaleObject to iterate into
 * @returns The value of the given path or null if not found
 */
const getValue = (path: String, obj: LocaleObject) => {
	let candidate: LocaleObject | string = obj;
	let props = path.split('.');

	for (const prop of props) {
		if (typeof candidate === 'string') {
			return null;
		}

		const currentCandidate: LocaleObject | string | undefined = candidate[prop];

		if (currentCandidate === undefined) {
			return null;
		}

		candidate = currentCandidate;
	}

	if (typeof candidate === 'string') {
		return candidate;
	}

	return null;
};
