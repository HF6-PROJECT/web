<template>
	<div
		class="relative h-full w-full px-4 pt-6"
		v-on:contextmenu.self.prevent="fileBrowserContextMenu?.openMenu"
	>
		<!-- Files & Folders -->
		<NoFiles v-if="items && !items.length" />
		<template v-else-if="items">
			<div class="flex flex-wrap gap-3">
				<!-- prettier-ignore-attribute -->
				<Folder
					v-for="folder in folders"
					:key="folder.id"
					v-model="(items[getItemIndex(folder)] as FolderClass)"
				/>
			</div>
			<div class="mt-3 flex flex-wrap gap-3">
				<!-- prettier-ignore-attribute -->
				<File
					v-for="file in files"
					:key="file.id"
					v-model="(items[getItemIndex(file)] as FileClass)"
				/>
			</div>
		</template>

		<!-- FileBrowser ContextMenu -->
		<ContextMenu ref="fileBrowserContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						@click="
							showCreateFolderModal = true;
							fileBrowserContextMenu?.closeMenu();
						"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Create folder</a
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
						>Upload file</a
					>
					<input ref="fileInput" type="file" class="hidden" @change="uploadFiles" />
				</li>
			</ul>
		</ContextMenu>

		<!-- Modals -->
		<BaseModal v-show="showCreateFolderModal" @close="closeCreateFolderModal">
			<h3 class="mb-4 text-xl font-medium">Create folder</h3>
			<form class="space-y-6" @submit.prevent="createFolder">
				<BaseInput id="folderName" type="text" v-model="folder.name">Name</BaseInput>
				<BaseSelect id="folderColor" v-model="folder.color">
					<template v-slot:label>
						<div class="flex">
							<span>Color</span>
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
						<option v-for="(_value, key) in FolderColors" :key="key">
							{{ key }}
						</option>
					</template>
				</BaseSelect>
				<BaseButton type="submit" :color="ButtonColor.Primary">Create</BaseButton>
			</form>
		</BaseModal>

		<!-- Toasts -->
		<TransitionGroup
			name="toasts"
			tag="div"
			class="fixed right-5 top-24 z-50 flex w-full max-w-xs flex-col"
		>
			<BaseToast v-for="toast in toasts" :type="toast.type">{{ toast.message }}</BaseToast>
		</TransitionGroup>
	</div>
</template>
<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { api } from '@lib/helpers';
import NoFiles from './NoFiles.vue';
import Folder from './Folder.vue';
import File from './File.vue';
import { ItemClass } from '@lib/items/items';
import { ItemFactory } from '@lib/items/factory';
import { FolderClass, FolderColors, type FolderColor, type FolderType } from '@lib/items/folders';
import { FileClass } from '@lib/items/files';
import ContextMenu from './ContextMenu.vue';
import BaseToast, { ToastType } from '@components/base/toast.vue';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import BaseSelect from '@components/base/select.vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderType>,
		required: false,
	},
});

const fileBrowserContextMenu = ref<InstanceType<typeof ContextMenu>>();

const toasts = ref<{ message: string; type: ToastType }[]>([]);

/**
 * Items
 */
const items = ref<ItemClass[] | null>(null);

getItems();

async function getItems() {
	fetch(
		/* TODO: use api function */
		`http://localhost:3000/api/${
			FolderClass.isFolder(props.modelValue) ? `${props.modelValue.id}` : ''
		}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	)
		.then(async (response) => {
			if (!response.ok) {
				if (response.status >= 400 && response.status < 500) {
					throw new Error((await response.json()).error);
				}

				throw new Error(await response.text());
			}

			const rawItems = await response.json();

			items.value = [];
			for (const rawItem of rawItems) {
				if (!ItemClass.isItem(rawItem)) continue;

				const item = ItemFactory.getItemFromObject(rawItem);

				if (item === null) continue;

				items.value.push(item);
			}

			return items.value;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function getItemIndex(item: ItemClass) {
	return (items.value as ItemClass[]).findIndex((i) => i.id === item.id);
}

/**
 * Folders
 */
const showCreateFolderModal = ref(false);
const folder = ref<{ name: string; color: FolderColor | '' }>({ name: '', color: '' });
function closeCreateFolderModal() {
	showCreateFolderModal.value = false;
	folder.value = { name: '', color: '' };
}
async function createFolder() {
	if (!folder.value.color) return;

	items.value?.push(
		await FolderClass.create(folder.value.name, props.modelValue ?? null, folder.value.color),
	);

	toasts.value.push({
		message: `Folder ${folder.value.name} created`,
		type: ToastType.Success,
	});

	closeCreateFolderModal();
}

const folders = computed(() => {
	return (items.value as ItemClass[]).filter(
		(item) => item instanceof FolderClass,
	) as FolderClass[];
});

/**
 * Files
 */
const files = computed(() => {
	return (items.value as ItemClass[]).filter((item) => item instanceof FileClass) as FileClass[];
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
