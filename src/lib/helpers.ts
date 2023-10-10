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

export const asset = (path: string) => {
	return `/${path}`;
};
