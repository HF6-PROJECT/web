<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.shortcut.action.edit') }}</h3>
		<form class="space-y-6" @submit.prevent="updateFile" ref="form">
			<BaseInput
				id="docsName"
				type="text"
				v-model="shortcut.name"
				:required="true"
				:errors="errorObject?.errors.name"
				>{{ t('fileBrowser.docs.edit.name') }}</BaseInput
			>
			<BaseButton type="submit" :color="ButtonColor.Primary">{{
				t('fileBrowser.docs.edit.submit')
			}}</BaseButton>
			<ErrorAlert v-if="errorObject" :errorObject="errorObject"></ErrorAlert>
		</form>
	</BaseModal>
</template>

<script setup lang="ts">
import { updateItem } from '@stores/items';
import { ref, type PropType } from 'vue';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import ErrorAlert, { type ErrorObject } from '@components/base/errorAlert.vue';
import { t } from '@lib/i18n';
import type { ShortcutClass } from '@lib/items/shortcuts';
import { addToast } from '@stores/toasts';
import { ToastType } from '@components/base/toast.vue';

const props = defineProps({
	shortcut: {
		type: Object as PropType<ShortcutClass>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

const shortcut = ref<{ name: string }>({
	name: props.shortcut.name,
});
const form = ref<HTMLFormElement>();
const errorObject = ref<null | ErrorObject>(null);

async function updateFile() {
	errorObject.value = null;

	if (!form.value?.checkValidity() || errorObject.value) {
		form.value?.reportValidity();
		return;
	}

	try {
		const updatedShortcut = await props.shortcut.update({
			name: shortcut.value.name,
		});

		await updatedShortcut.setLinkedItem(updatedShortcut._linkedItemId);

		updateItem(updatedShortcut);

		addToast({
			message: props.shortcut.name + ' ' + t('fileBrowser.shortcut.toast.update.success'),
			type: ToastType.Success,
		});

		close(false);
	} catch (e) {
		addToast({
			message: t('fileBrowser.folder.toast.update.failed') + ' ' + props.shortcut.name,
			type: ToastType.Danger,
		});
	}
}

function open() {
	modal.value?.open();
}

function close(resetValue = true) {
	if (resetValue) {
		shortcut.value = {
			name: props.shortcut.name,
		};
	}

	modal.value?.close(false);
}
</script>
