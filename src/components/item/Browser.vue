<template>
	<div class="relative h-full w-full px-4 pt-6" v-on:contextmenu.capture="openContextMenu">
		<!-- Files & Folders -->
		<NoFiles v-if="hasItemsLoaded && !Object.values(items).length" />
		<template v-else-if="items">
			<div class="flex flex-wrap gap-3">
				<!-- prettier-ignore-attribute -->
				<Folder
					v-for="folder in folders"
					:key="folder.id"
					v-model="(items[folder.id] as FolderClass)"
				/>
			</div>
			<div class="mt-3 flex flex-wrap gap-3">
				<!-- prettier-ignore-attribute -->
				<File v-for="file in files" :key="file.id" v-model="(items[file.id] as FileClass)" />
			</div>
		</template>

		<!-- FileBrowser ContextMenu -->
		<ContextMenu ref="fileBrowserContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						@click="createFolderModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.createFolder') }}</a
					>
				</li>
			</ul>
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						v-on:click="
							fileInput?.click();
							fileBrowserContextMenu?.closeMenu();
						"
						href="javascript:void(0)"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.uploadFile') }}</a
					>
					<input ref="fileInput" type="file" class="hidden" @change="uploadFiles" />
				</li>
			</ul>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<CreateFolderModal ref="createFolderModal" :parentFolder="props.modelValue" />

	<!-- Toasts -->
	<div class="fixed right-5 top-24 z-50 flex w-full max-w-xs flex-col">
		<BaseToast v-for="toast in toasts" :type="toast.type">{{ toast.message }}</BaseToast>
	</div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { addItem, itemsStore } from '@stores/items';
import { computed, ref, type PropType } from 'vue';
import { api } from '@lib/helpers';
import NoFiles from './file/NoFiles.vue';
import Folder from './folder/Folder.vue';
import CreateFolderModal from './folder/CreateModal.vue';
import File from './file/File.vue';
import { ItemClass } from '@lib/items/items';
import { ItemFactory } from '@lib/items/factory';
import { FolderClass, type FolderType } from '@lib/items/folders';
import { FileClass } from '@lib/items/files';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseToast, { ToastType } from '@components/base/toast.vue';
import { t } from '@lib/i18n';
import { isModalOpen } from '@stores/modal';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderType>,
		required: false,
	},
});

const fileBrowserContextMenu = ref<InstanceType<typeof ContextMenu>>();

function openContextMenu(e: MouseEvent) {
	if (isModalOpen.get()) {
		return;
	}

	e.preventDefault();
	fileBrowserContextMenu?.value?.openMenu(e);
}

// TODO: Fix toasts
const toasts = ref<{ message: string; type: ToastType }[]>([]);

/**
 * Items
 */
const hasItemsLoaded = ref(false);
const items = useStore(itemsStore);

getItems();

async function getItems() {
	try {
		const response = await fetch(
			api(`item/${FolderClass.isFolder(props.modelValue) ? `${props.modelValue.id}` : ''}`),
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			},
		);

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				throw new Error((await response.json()).error);
			}

			throw new Error(await response.text());
		}

		const rawItems = await response.json();

		for (const rawItem of rawItems) {
			if (!ItemClass.isItem(rawItem)) continue;

			const item = ItemFactory.getItemFromObject(rawItem);

			if (item === null) continue;

			addItem(item);
		}
	} catch (e) {
		console.error('Error' + e);
	}

	hasItemsLoaded.value = true;
}

/**
 * Folders
 */
const createFolderModal = ref<InstanceType<typeof CreateFolderModal>>();

const folders = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof FolderClass) as FolderClass[];
});

/**
 * Files
 */
const files = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof FileClass) as FileClass[];
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
				await getItems();

				toasts.value.push({
					message: `File ${file.name} uploaded`,
					type: ToastType.Success,
				});
			}, 1000);
		} catch (error) {
			toasts.value.push({
				message: `Failed to upload file ${file.name}`,
				type: ToastType.Danger,
			});
		}
	});
}
</script>
