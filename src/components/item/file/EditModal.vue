<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.file.edit.header') }}</h3>
		<form class="space-y-6" @submit.prevent="updateFile" ref="form">
			<BaseInput
				id="fileName"
				type="text"
				v-model="file.name"
				:required="true"
				:errors="errorObject?.errors.name"
				>{{ t('fileBrowser.file.edit.name') }}</BaseInput
			>
			<BaseButton type="submit" :color="ButtonColor.Primary">{{
				t('fileBrowser.file.edit.submit')
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
import type { FileClass } from '@lib/items/files';

const props = defineProps({
	file: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

const file = ref<{ name: string }>({
	name: props.file.name,
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
		const updatedFile = await props.file.update({
			name: file.value.name,
		});

		updateItem(updatedFile);

		// TODO: Show success toast

		close(false);
	} catch (e) {}
}

function open() {
	file.value = {
		name: props.file.name,
	};
	modal.value?.open();
}

function close(resetValue = true) {
	if (resetValue) {
		file.value = {
			name: props.file.name,
		};
	}

	modal.value?.close(false);
}
</script>
