import type { ToastType } from '@components/base/toast.vue';
import { map } from 'nanostores';
export type Toast = { id: string; message: string; type: ToastType };
export type AddToast = Omit<Toast, 'id'>;
export const toastsStore = map<Record<string, Toast | undefined>>({});
import { v4 as uuid } from 'uuid';

export function addToast(input: AddToast): Toast {
	const toast: Toast = {
		id: uuid(),
		...input,
	};
	toastsStore.setKey(toast.id, toast);

	return toast;
}

export function removeToast(toast: Toast) {
	toastsStore.setKey(toast.id, undefined);
}
