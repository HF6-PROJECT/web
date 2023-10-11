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
