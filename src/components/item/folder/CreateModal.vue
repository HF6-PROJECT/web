<template>
	<BaseModal @close="closeCreateFolderModal">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.folder.createFolder') }}</h3>
		<form class="space-y-6" @submit.prevent="createFolder" ref="form">
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
				t('fileBrowser.folder.create')
			}}</BaseButton>
			<ErrorAlert v-if="errorObject" :errorObject="errorObject"></ErrorAlert>
		</form>
	</BaseModal>
</template>

<script setup lang="ts">
import { addItem } from '@stores/items';
import { ref, type PropType } from 'vue';
import { FolderClass, FolderColors, type FolderColor, type FolderType } from '@lib/items/folders';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import BaseSelect from '@components/base/select.vue';
import ErrorAlert, { type ErrorObject } from '@components/base/errorAlert.vue';
import { t } from '@lib/i18n';

const emit = defineEmits(['close']);
const props = defineProps({
	parentFolder: {
		type: Object as PropType<FolderType | undefined>,
		required: true,
	},
});

const folder = ref<{ name: string; color: FolderColor | '' }>({ name: '', color: '' });
const form = ref<HTMLFormElement>();
const errorObject = ref<null | ErrorObject>(null);

async function createFolder() {
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
		const createdFolder = await FolderClass.create({
			name: folder.value.name,
			parent: props.parentFolder ?? null,
			color: folder.value.color,
		});

		addItem(createdFolder);

		// TODO: Show success toast

		closeCreateFolderModal();
	} catch (e) {}
}

function closeCreateFolderModal() {
	folder.value = { name: '', color: '' };

	emit('close');
}
</script>
