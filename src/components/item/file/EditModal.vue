<template>
	<BaseModal @close="closeUpdateFileModal">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.file.renameFile') }}</h3>
		<form class="space-y-6" @submit.prevent="updateFile" ref="form">
			<BaseInput id="fileName" type="text" v-model="file.name" :required="true">{{
				t('fileBrowser.file.name')
			}}</BaseInput>
			<BaseButton type="submit" :color="ButtonColor.Primary">{{
				t('fileBrowser.folder.edit')
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

const emit = defineEmits(['close']);
const props = defineProps({
	file: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});

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

		/*toasts.value.push({
			message: `Folder ${folder.value.name} created`,
			type: ToastType.Success,
		});*/

		closeUpdateFileModal();
	} catch (e) {}
}

function closeUpdateFileModal() {
	file.value = {
		name: props.file.name,
	};

	emit('close');
}
</script>
