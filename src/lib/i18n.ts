import en from '../lang/en';
import da from '../lang/da';

type LocaleObject = {
	[key: string]: string | LocaleObject;
};

// Get translation from i18n
export const t = (key: string, locale: App.Locals['currentLocale']) => {
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
