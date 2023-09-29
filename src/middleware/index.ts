import { sequence } from 'astro:middleware';
import { auth } from './auth';
import { user } from './user';
import { locale } from './locale';

export const onRequest = sequence(auth, user, locale);
