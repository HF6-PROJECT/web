<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.docs.edit.header') }}</h3>
		<form class="space-y-6" @submit.prevent="updateFile" ref="form">
			<BaseInput
				id="docsName"
				type="text"
				v-model="docs.name"
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
import type { DocsClass } from '@lib/items/docs';
import { addToast } from '@stores/toasts';
import { ToastType } from '@components/base/toast.vue';

const props = defineProps({
	docs: {
		type: Object as PropType<DocsClass>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

const docs = ref<{ name: string }>({
	name: props.docs.name,
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
		const updatedDocs = await props.docs.update(docs.value.name, props.docs.text);

		updateItem(updatedDocs);

		addToast({
			message: docs.value.name + ' ' + t('fileBrowser.docs.toast.update.success'),
			type: ToastType.Success,
		});

		close(false);
	} catch (e) {
		console.error('Error: ' + e);
		addToast({
			message: t('fileBrowser.docs.toast.update.success') + ' ' + docs.value.name,
			type: ToastType.Danger,
		});
	}
}

function open() {
	docs.value = {
		name: props.docs.name,
	};
	modal.value?.open();
}

function close(resetValue = true) {
	if (resetValue) {
		docs.value = {
			name: props.docs.name,
		};
	}

	modal.value?.close(false);
}
</script>
