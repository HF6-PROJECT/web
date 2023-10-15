export const url = (path = '') => {
	return `${import.meta.env.BASE_URL}${path}`;
};

export const api = (path = '') => {
	if (path === 'blob') {
		return `${import.meta.env.PUBLIC_API_URL}${path}`;
	}

	if (import.meta.env.PUBLIC_LOCAL_DEVELOPMENT_API_URL) {
		return `${import.meta.env.PUBLIC_LOCAL_DEVELOPMENT_API_URL}${path}`;
	}

	return `${import.meta.env.PUBLIC_API_URL}${path}`;
};

export const fetchFromApi = async (input: string, options: RequestInit = {}) => {
	try {
		const response = await fetch(api(input), options);

		if (response.status === 401) {
			throw new Error('Unauthorized');
		}

		return response;
	} catch (e) {
		return await fetch(api(input), options);
	}
};

export const asset = (path: string) => {
	return `/${path}`;
};

export const getUserColorByInitials = (initials: string) => {
	const colours = [
		'#ef4444', // red-500
		'#f97316', // orange-500
		'#f59e0b', // amber-500
		'#eab308', // yellow-500
		'#84cc16', // lime-500
		'#22c55e', // green-500
		'#10b981', // emerald-500
		'#14b8a6', // teal-500
		'#06b6d4', // cyan-500
		'#0ea5e9', // sky-500
		'#3b82f6', // blue-500
		'#6366f1', // indigo-500
		'#8b5cf6', // violet-500
		'#a855f7', // purple-500
		'#d946ef', // fuchsia-500
		'#ec4899', // pink-500
		'#f43f5e', // rose-500
	];

	const charCode = initials.charCodeAt(0) + initials.charCodeAt(1) || 0;

	return colours[charCode % colours.length];
};

export const getInitialsByName = (name: string) => {
	const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

	const initialsRegex = [...name.matchAll(rgx)] || [];

	return ((initialsRegex.shift()?.[1] || '') + (initialsRegex.pop()?.[1] || '')).toUpperCase();
};
