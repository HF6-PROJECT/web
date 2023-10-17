import { map } from 'nanostores';
export type Toast = { id: string; message: string; type: ToastType };
export const toastsStore = map<Record<string, Toast | undefined>>({});

export function addToast(toast: Toast) {
	toastsStore.setKey(toast.id, toast);
}

export function removeToast(toast: Toast) {
	toastsStore.setKey(toast.id, undefined);
}
