<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">{{ t('fileBrowser.shortcut.action.create') }}</h3>
		<hr />
		<div class="mb-5">
			<div
				class="relative inline-flex w-full items-center py-1 hover:bg-gray-600"
				@click="selectFolder(0)"
				@mouseenter="showChildArrow(0)"
				@mouseleave="hideChildArrow(0)"
				id="folder0"
			>
				<h1 class="ml-2 mr-auto">{{ t('fileBrowser.shortcut.link.myfiles') }}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="svg0"
					height="1em"
					fill="white"
					class="invisible ml-2 mr-2 hover:cursor-pointer hover:fill-gray-300"
					@click.stop="childFolder(0)"
					viewBox="0 0 448 512"
				>
					<path
						d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
					/>
				</svg>
			</div>
			<div
				v-for="folder in folders"
				class="relative inline-flex w-full items-center py-1 hover:bg-gray-600"
				@click="selectFolder(folder.id)"
				@mouseenter="showChildArrow(folder.id)"
				@mouseleave="hideChildArrow(folder.id)"
				:id="'folder' + folder.id.toString()"
			>
				<h1 class="ml-2 mr-auto">{{ folder.name }}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					:id="'svg' + folder.id.toString()"
					height="1em"
					fill="white"
					class="invisible ml-2 mr-2 hover:cursor-pointer hover:fill-gray-300"
					@click.stop="childFolder(folder.id)"
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
			disabled
			@click="createShortcut()"
			:color="ButtonColor.Primary"
			class="dark:brightness-75"
			>{{ t('fileBrowser.shortcut.action.create') }}</BaseButton
		>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { FolderClass } from '@lib/items/folders';
import { ShortcutClass } from '@lib/items/shortcuts';
import BaseModal from '@components/base/modal.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import { t } from '@lib/i18n';
import { api } from '@lib/helpers';
import { ItemFactory } from '@lib/items/factory';
import { ItemClass } from '@lib/items/items';
import { addToast } from '@stores/toasts';
import { ToastType } from '@components/base/toast.vue';

const props = defineProps({
	item: {
		type: Object as PropType<ItemClass>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

const modal = ref<InstanceType<typeof BaseModal>>();

const item = ref<{ id: number; name: string; parentId: number | null }>({
	id: props.item.id,
	name: props.item.name,
	parentId: props.item.parentId,
});

let selectedFolder: number;

async function showChildArrow(folderId: number) {
	const svg = document.getElementById('svg' + folderId);
	svg?.classList.remove('invisible');
}

async function hideChildArrow(folderId: number) {
	if (selectedFolder !== folderId) {
		const svg = document.getElementById('svg' + folderId);
		svg?.classList.add('invisible');
	}
}

async function selectFolder(parentId: number) {
	showChildArrow(parentId);

	const oldFolderId: number = selectedFolder;
	if (oldFolderId !== parentId) {
		selectedFolder = parentId;
		hideChildArrow(oldFolderId);
		const oldDiv = document.getElementById('folder' + oldFolderId);
		oldDiv?.classList.remove('bg-gray-600');
	}

	const div = document.getElementById('folder' + parentId);
	div?.classList.add('bg-gray-600');

	const button = document.getElementById('shortcutAddButton');
	button?.removeAttribute('disabled');
	button?.classList.remove('dark:brightness-75');
}

async function childFolder(parentId: number) {
	folders.value = [];
	getFolders(parentId);
}

async function createShortcut() {
	const folder = await folders.value.filter((x) => x.id === selectedFolder)[0];

	if (folder || selectedFolder === 0) {
		try {
			await ShortcutClass.create({
				name: item.value.name,
				parentId: folder?.id ?? null,
				linkedItemId: item.value.id,
			});
			close();

			addToast({
				message: item.value.name + ' ' + t('fileBrowser.shortcut.toast.create.success'),
				type: ToastType.Success,
			});
		} catch (e) {
			addToast({
				message: t('fileBrowser.shortcut.toast.create.failed') + ' ' + item.value.name,
				type: ToastType.Danger,
			});
		}
	}
}

function open() {
	modal.value?.open();
}

function close() {
	item.value = {
		id: props.item.id,
		name: props.item.name,
		parentId: props.item.parentId,
	};

	folders.value = [];
	getFolders(null);

	modal.value?.close(false);
}

const hasItemsLoaded = ref(false);
const folders = ref<FolderClass[]>([]);

async function getFolders(folderId: number | null) {
	try {
		const response = await fetch(api(`item/${folderId ? `${folderId}` : ''}`), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

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

			folders.value.push(item);
		}
	} catch (e) {
		console.error('Error' + e);
	}

	hasItemsLoaded.value = true;
}

getFolders(item.value.parentId);
</script>
