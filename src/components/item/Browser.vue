<template>
	<div class="relative h-full w-full px-4 pt-6" v-on:contextmenu.capture="openContextMenu">
		<!-- Files & Folders -->
		<NoFiles v-if="hasItemsLoaded && !Object.values(items).length" :modelValue="modelValue" />
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
				<!-- prettier-ignore-attribute -->
				<Docs v-for="doc in docs" :key="doc.id" v-model="(items[doc.id] as DocsClass)" />
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
						>{{ t('fileBrowser.folder.action.create') }}</a
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
						>{{ t('fileBrowser.file.action.create') }}</a
					>
					<input ref="fileInput" type="file" class="hidden" @change="uploadFiles" />
				</li>
			</ul>
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						@click="createDocsModal?.open()"
						href="javascript:void(0)"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.create') }}</a
					>
				</li>
			</ul>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<CreateFolderModal ref="createFolderModal" :parentFolder="props.modelValue" />
	<CreateDocsModal ref="createDocsModal" :parentFolder="props.modelValue" />

	<!-- Toasts -->
	<div class="fixed right-5 top-24 z-50 flex w-full max-w-xs flex-col">
		<BaseToast v-for="toast in toasts" :type="toast.type">{{ toast.message }}</BaseToast>
	</div>
</template>

<script setup lang="ts">
// Lib
import { computed, ref, type PropType } from 'vue';

// Helpers
import { t } from '@lib/i18n';
import { fetchFromApi } from '@lib/helpers';

// Stores
import { useStore } from '@nanostores/vue';
import { addItem, removeItem, itemsStore } from '@stores/items';
import { isModalOpen } from '@stores/modal';

// Components
import ContextMenu from '@components/base/contextMenu.vue';
import BaseToast, { ToastType } from '@components/base/toast.vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderType>,
		required: false,
	},
	user: {
		type: Object as PropType<User>,
		required: true,
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
import { ItemClass, type ItemType } from '@lib/items/items';
import { ItemFactory } from '@lib/items/factory';

import NoFiles from './file/NoFiles.vue';

const hasItemsLoaded = ref(false);
const items = useStore(itemsStore);

getItems();

async function getItems() {
	try {
		const response = await fetchFromApi(
			`item/${FolderClass.isFolder(props.modelValue) ? `${props.modelValue.id}` : ''}`,
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
import { FolderClass, type FolderType } from '@lib/items/folders';
import Folder from './folder/Folder.vue';
import CreateFolderModal from './folder/CreateModal.vue';

const createFolderModal = ref<InstanceType<typeof CreateFolderModal>>();

const folders = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof FolderClass) as FolderClass[];
});

/**
 * Files
 */
import { FileClass } from '@lib/items/files';
import File from './file/File.vue';

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
		} catch (error) {
			toasts.value.push({
				message: `Failed to upload file ${file.name}`,
				type: ToastType.Danger,
			});
		}
	});
}

/**
 * Docs
 */
import { DocsClass, type DocsType } from '@lib/items/docs';
import Docs from './docs/Docs.vue';
import CreateDocsModal from './docs/CreateModal.vue';

const createDocsModal = ref<InstanceType<typeof CreateDocsModal>>();

const docs = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof DocsClass) as DocsClass[];
});

/**
 * Live Updates
 */
import { getFolderChannel } from '@lib/pusher';

const channel = getFolderChannel(props.user.id, props.modelValue?.id);
channel.bind('update', (data: ItemType) => {
	if (!ItemClass.isItem(data)) return;

	const item = ItemFactory.getItemFromObject(data);

	if (item === null) return;

	const isNew = items.value[item.id] === undefined;
	const isOwner = item.ownerId === props.user.id;

	if (isNew && isOwner) {
		// TODO: Fix toasts
		toasts.value.push({
			message: `${item.name} has been created`,
			type: ToastType.Success,
		});
	}

	addItem(item);
});

channel.bind('delete', (data: ItemType) => {
	if (!ItemClass.isItem(data)) return;

	const item = ItemFactory.getItemFromObject(data);

	if (item === null) return;

	removeItem(item);
});
</script>
