<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.shortcut.action.create') }}</h3>
		<h4
			v-if="parentFolder !== null"
			:class="`${selectedFolderId === parentFolder.id ? 'font-bold' : ''}`"
			class="mb-4 inline-flex cursor-pointer items-center text-lg"
			@click="setFolders(parentFolder.parentId)"
		>
			<svg
				class="h-6 w-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 10"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 5H1m0 0 4 4M1 5l4-4"
				/>
			</svg>
			<span class="ml-2">{{ parentFolder.name }}</span>
		</h4>
		<hr />
		<div class="mb-5 mt-2 flex flex-col gap-1">
			<!-- Root Folder -->
			<div
				v-if="parentFolder === null"
				:class="`${selectedFolderId === HOME_FOLDER_ID ? '' : 'brightness-75'}`"
				class="group relative inline-flex w-full select-none items-center rounded-lg bg-gray-100 py-1 hover:cursor-pointer dark:bg-gray-600"
				@click="selectFolder(HOME_FOLDER_ID)"
			>
				<h1 class="ml-2 mr-auto">{{ t('fileBrowser.shortcut.link.myfiles') }}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					:class="`${selectedFolderId === HOME_FOLDER_ID ? 'visible' : 'invisible'}`"
					class="ml-2 mr-2 fill-black group-hover:visible hover:fill-gray-500 dark:fill-white"
					@click.stop="setFolders(HOME_FOLDER_ID)"
					viewBox="0 0 448 512"
				>
					<path
						d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
					/>
				</svg>
			</div>

			<!-- Loading -->
			<div
				v-else-if="!hasLoadedFolders"
				class="group relative inline-flex w-full select-none items-center justify-center rounded-lg py-1 text-white"
			>
				<div role="status">
					<svg
						aria-hidden="true"
						class="mr-2 h-8 w-8 animate-spin fill-primary-600 text-gray-200 dark:text-gray-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
				</div>
			</div>

			<!-- No Folders -->
			<div
				v-else-if="folders.length === 0"
				class="group relative inline-flex w-full select-none items-center rounded-lg py-1 text-white"
			>
				<h1 class="ml-2 mr-auto text-black dark:text-white">
					{{ t('fileBrowser.shortcut.action.empty') }}
				</h1>
			</div>

			<!-- Folders -->
			<div
				v-else
				v-for="folder in folders"
				:class="`${folder.colorClass} ${folder.id === selectedFolderId ? '' : 'brightness-75'}`"
				class="group relative inline-flex w-full select-none items-center rounded-lg bg-gradient-to-br py-1 text-white hover:cursor-pointer hover:bg-gradient-to-bl"
				@click="selectFolder(folder.id)"
			>
				<h1 class="ml-2 mr-auto">{{ folder.name }}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					fill="white"
					:class="`${folder.id === selectedFolderId ? 'visible' : 'invisible'}`"
					class="ml-2 mr-2 group-hover:visible hover:fill-gray-100"
					@click.stop="setFolders(folder.id)"
					viewBox="0 0 448 512"
				>
					<path
						d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
					/>
				</svg>
			</div>
		</div>
		<BaseButton
			type="button"
			id="shortcutAddButton"
			@click="createShortcut()"
			:color="ButtonColor.Primary"
			>{{ `${t('fileBrowser.shortcut.action.createIn')} "${selectedFolderName}"` }}</BaseButton
		>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import { FolderClass } from '@lib/items/folders';
import { ShortcutClass } from '@lib/items/shortcuts';
import BaseModal from '@components/base/modal.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import { t } from '@lib/i18n';
import { fetchFromApi } from '@lib/helpers';
import { ItemFactory } from '@lib/items/factory';
import { ItemClass } from '@lib/items/items';
import { addToast } from '@stores/toasts';
import { ToastType } from '@components/base/toast.vue';

const HOME_FOLDER_PARENT_ID = -1 as const;
const HOME_FOLDER_ID = null;

const hasLoadedFolders = ref(false);

const props = defineProps({
	item: {
		type: Object as PropType<ItemClass>,
		required: true,
	},
});

// Shortcut
async function createShortcut() {
	try {
		await ShortcutClass.create({
			name: props.item.name,
			parentId: selectedFolderId.value,
			linkedItemId: props.item.id,
		});
		close();

		addToast({
			message: props.item.name + ' ' + t('fileBrowser.shortcut.toast.create.success'),
			type: ToastType.Success,
		});
	} catch (e) {
		addToast({
			message: t('fileBrowser.shortcut.toast.create.failed') + ' ' + props.item.name,
			type: ToastType.Danger,
		});
	}
}

// Browser
const selectedFolderId = ref<number | typeof HOME_FOLDER_ID>(null);
function selectFolder(folderId: number | null) {
	selectedFolderId.value = folderId;
}

const selectedFolderName = computed(() => {
	if (selectedFolderId.value === null) {
		return t('fileBrowser.shortcut.link.myfiles');
	}

	const folder = folders.value.find((folder) => folder.id === selectedFolderId.value);

	if (folder === undefined) {
		if (parentFolder.value?.id === selectedFolderId.value) {
			return parentFolder.value.name;
		} else {
			return '';
		}
	}

	return folder.name;
});

const folders = ref<FolderClass[]>([]);
const parentFolder = ref<{ id: number | null; name: string; parentId: number | null } | null>(null);

setFolders(HOME_FOLDER_PARENT_ID);

async function setFolders(folderId: number | null) {
	hasLoadedFolders.value = false;

	if (folderId === HOME_FOLDER_PARENT_ID) {
		parentFolder.value = null;
		folders.value = [];
		selectedFolderId.value = HOME_FOLDER_ID;
		return;
	}

	if (folderId === HOME_FOLDER_ID) {
		parentFolder.value = {
			id: HOME_FOLDER_ID,
			name: t('fileBrowser.shortcut.link.myfiles'),
			parentId: HOME_FOLDER_PARENT_ID,
		};
	} else {
		parentFolder.value = folders.value.find((folder) => folder.id === folderId) ?? null;

		if (parentFolder.value === null) {
			return;
		}
	}

	folders.value = [];
	selectedFolderId.value = parentFolder.value.id;

	await getFolders();
}

async function getFolders() {
	try {
		if (parentFolder.value === null) {
			return;
		}

		const response = await fetchFromApi(
			`item/${parentFolder.value.id ? `${parentFolder.value.id}` : ''}`,
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

			const item = await ItemFactory.getItemFromObject(rawItem);

			if (item === null) continue;

			if (!FolderClass.isFolder(item)) continue;

			if (item.parentId !== parentFolder.value.id) {
				throw new Error(
					"Invalid parent id, user must've changed the parent folder before the request finished",
				);
			}

			folders.value.push(item);
		}

		hasLoadedFolders.value = true;
	} catch (e) {
		console.error('Error' + e);
	}
}

// Modal
defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

function open() {
	modal.value?.open();
}

function close() {
	setFolders(HOME_FOLDER_PARENT_ID);

	modal.value?.close(false);
}
</script>
