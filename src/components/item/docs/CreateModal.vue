<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.docs.create.header') }}</h3>
		<form class="space-y-6" @submit.prevent="createDocs" ref="form">
			<BaseInput
				id="docsName"
				type="text"
				v-model="docs.name"
				:required="true"
				:errors="errorObject?.errors.name"
				>{{ t('fileBrowser.docs.create.name') }}</BaseInput
			>
			<BaseButton type="submit" :color="ButtonColor.Primary">{{
				t('fileBrowser.docs.create.submit')
			}}</BaseButton>
			<ErrorAlert v-if="errorObject" :errorObject="errorObject"></ErrorAlert>
		</form>
	</BaseModal>
</template>

<script setup lang="ts">
import { addItem } from '@stores/items';
import { ref, type PropType } from 'vue';
import { type FolderType } from '@lib/items/folders';
import { DocsClass } from '@lib/items/docs';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import ErrorAlert, { type ErrorObject } from '@components/base/errorAlert.vue';
import { t } from '@lib/i18n';
import { addToast } from '@stores/toasts';
import { v4 as uuid } from 'uuid';
import { ToastType } from '@components/base/toast.vue';

const props = defineProps({
	parentFolder: {
		type: Object as PropType<FolderType | undefined>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

const docs = ref<{ name: string }>({ name: '' });
const form = ref<HTMLFormElement>();
const errorObject = ref<null | ErrorObject>(null);

async function createDocs() {
	errorObject.value = null;

	if (!form.value?.checkValidity() || errorObject.value) {
		form.value?.reportValidity();
		return;
	}

	try {
		const createdDocs = await DocsClass.create(docs.value.name, uuid(), props.parentFolder ?? null);

		addItem(createdDocs);

		addToast({
			message: docs.value.name + ' ' + t('fileBrowser.docs.toast.create.success'),
			type: ToastType.Success,
		});

		close();
	} catch (e) {
		addToast({
			message: t('fileBrowser.docs.toast.create.failed') + ' ' + docs.value.name,
			type: ToastType.Danger,
		});
	}
}

function open() {
	modal.value?.open();
}

function close() {
	docs.value = { name: '' };
	modal.value?.close(false);
}
</script>
