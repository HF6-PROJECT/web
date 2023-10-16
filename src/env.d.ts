/// <reference types="astro/client" />

interface User {
	id: number;
	name: string;
	email: string;
}

// https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL: string;
	readonly PUBLIC_SITE_PORT: number | undefined;
	readonly PUBLIC_API_URL: string;
	readonly PUBLIC_LOCAL_DEVELOPMENT_API_URL: string | undefined;
	readonly JWT_PUBLIC_KEY: string;
	readonly NODE_BUILD: boolean | undefined;
	readonly PUBLIC_PUSHER_APP_KEY: string;
	readonly PUBLIC_PUSHER_APP_CLUSTER: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		authHeader: string | undefined;
		userId: string | null;
		isAuthenticated: boolean;
		user: User | null;
		currentLocale: 'en' | 'da';
	}
}
