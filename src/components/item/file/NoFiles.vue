<template>
	<div class="flex w-full items-center justify-center">
		<label
			for="dropzone-file"
			class="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
		>
			<div class="flex flex-col items-center justify-center pb-6 pt-5">
				<svg
					class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 20 16"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
					/>
				</svg>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					<span class="font-semibold">{{ t('noFiles.clickToUpload') }}</span>
					{{ t('noFiles.orDragAndDrop') }}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					{{ t('noFiles.fileRequirements') }}
				</p>
			</div>
			<input id="dropzone-file" ref="fileInput" type="file" class="hidden" @change="uploadFiles" />
		</label>
	</div>
</template>

<script setup lang="ts">
import { t } from '@lib/i18n';
import { FileClass } from '@lib/items/files';
import type { FolderType } from '@lib/items/folders';
import { ref, type PropType } from 'vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderType | undefined>,
		required: true,
	},
});

const fileInput = ref<HTMLInputElement>();
async function uploadFiles(e: Event) {
	const fileInput = e.currentTarget as HTMLInputElement;

	if (!fileInput.files?.length) {
		return;
	}

	Array.from(fileInput.files).forEach(async (file) => {
		try {
			await FileClass.create(file, props.modelValue ?? null);

			// TODO: replace waiting 1 second with websocket
			setTimeout(async () => {
				window.location.reload();

				// TODO: Toast
			}, 1000);
		} catch (error) {
			// TODO: Toast
		}
	});
}
</script>
