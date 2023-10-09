<template>
	<BaseModal @close="closeUpdateFolderModal">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.folder.editFolder') }}</h3>
		<form class="space-y-6" @submit.prevent="updateFolder" ref="form">
			<BaseInput id="folderName" type="text" v-model="folder.name" :required="true">{{
				t('fileBrowser.folder.name')
			}}</BaseInput>
			<BaseSelect id="folderColor" v-model="folder.color" :required="true">
				<template v-slot:label>
					<div class="flex">
						<span>{{ t('fileBrowser.folder.color.name') }}</span>
						<div
							v-if="folder.color"
							:class="
								FolderColors[folder.color] +
								' ml-2 h-5 w-5 rounded-lg bg-gradient-to-br hover:bg-gradient-to-bl'
							"
						></div>
					</div>
				</template>
				<template v-slot:options>
					<option v-for="(_value, key) in FolderColors" :key="key" :value="key">
						{{ t('fileBrowser.folder.color.' + key) }}
					</option>
				</template>
			</BaseSelect>
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
import { FolderClass, FolderColors, type FolderColor } from '@lib/items/folders';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import BaseSelect from '@components/base/select.vue';
import ErrorAlert, { type ErrorObject } from '@components/base/errorAlert.vue';
import { t } from '@lib/i18n';

const emit = defineEmits(['close']);
const props = defineProps({
	folder: {
		type: Object as PropType<FolderClass>,
		required: true,
	},
});

const folder = ref<{ name: string; color: FolderColor | '' }>({
	name: props.folder.name,
	color: props.folder.color,
});
const form = ref<HTMLFormElement>();
const errorObject = ref<null | ErrorObject>(null);

async function updateFolder() {
	errorObject.value = null;

	if (!folder.value.color) {
		errorObject.value = {
			error: 'Validation Error',
			errors: {
				confirmPassword: [t('fileBrowser.folder.color.required')],
			},
			statusCode: 400,
		};
		return;
	}

	if (!form.value?.checkValidity() || errorObject.value) {
		form.value?.reportValidity();
		return;
	}

	try {
		const updatedFolder = await props.folder.update({
			name: folder.value.name,
			color: folder.value.color,
		});

		updateItem(updatedFolder);

		// TODO: Show success toast

		closeUpdateFolderModal();
	} catch (e) {}
}

function closeUpdateFolderModal() {
	folder.value = {
		name: props.folder.name,
		color: props.folder.color,
	};

	emit('close');
}
</script>
