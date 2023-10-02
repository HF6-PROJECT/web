import { defineMiddleware } from 'astro:middleware';

export const defaultLocale = 'en';
export const languages = {
	en: 'en',
	da: 'da',
} as const;

export type Language = keyof typeof languages;

export const locale = defineMiddleware(async ({ locals, request }, next) => {
	// Get locale from header
	const localeHeader = request.headers.get('Accept-Language');

	if (localeHeader === null) {
		locals.currentLocale = defaultLocale;
		return next();
	}

	if (localeHeader === '*') {
		locals.currentLocale = defaultLocale;
		return next();
	}

	// Find match between supported languages and 'Accept-Language' header
	const locales = localeHeader.split(',');
	for (const locale of locales) {
		for (const language in languages) {
			if (locale.startsWith(language)) {
				locals.currentLocale = language as Language;
				return next();
			}
		}
	}

	// If no match, set default locale
	locals.currentLocale = defaultLocale;
	return next();
});

export default locale;
