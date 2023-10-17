<template>
	<div class="relative">
		<!-- Folder -->
		<a
			:href="
				modelValue instanceof ShortcutClass
					? url(`u/folder/${modelValue.linkedItemId}`)
					: url(`u/folder/${modelValue.id}`)
			"
			v-on:contextmenu.prevent="folderContextMenu?.openMenu"
		>
			<button
				type="button"
				:class="classes"
				class="flex h-[40px] items-center gap-2 rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				{{ modelValue.name }}
				<svg
					class="h-4 w-4 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 19 17"
					v-if="modelValue instanceof ShortcutClass"
				>
					<path
						d="M2.057 6.9a8.718 8.718 0 0 1 6.41-3.62v-1.2A2.064 2.064 0 0 1 9.626.2a1.979 1.979 0 0 1 2.1.23l5.481 4.308a2.107 2.107 0 0 1 0 3.3l-5.479 4.308a1.977 1.977 0 0 1-2.1.228 2.063 2.063 0 0 1-1.158-1.876v-.942c-5.32 1.284-6.2 5.25-6.238 5.44a1 1 0 0 1-.921.807h-.06a1 1 0 0 1-.953-.7A10.24 10.24 0 0 1 2.057 6.9Z"
					/>
				</svg>
			</button>
		</a>

		<!-- Folder ContextMenu -->
		<ContextMenu ref="folderContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						:href="
							modelValue instanceof ShortcutClass
								? url(`u/folder/${modelValue.linkedItemId}`)
								: url(`u/folder/${modelValue.id}`)
						"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.action.openInNewTab') }}</a
					>
				</li>
				<li v-if="modelValue instanceof ShortcutClass">
					<a
						href="javascript:void(0)"
						@click="editShortcutModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.shortcut.action.edit') }}</a
					>
				</li>
				<li v-else>
					<a
						href="javascript:void(0)"
						@click="editFolderModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.action.edit') }}</a
					>
				</li>
				<li v-if="!(modelValue instanceof ShortcutClass)">
					<a
						href="javascript:void(0)"
						@click="createShortcutModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.shortcut.action.create') }}</a
					>
				</li>
				<li v-if="!(modelValue instanceof ShortcutClass)">
					<a
						href="javascript:void(0)"
						@click="shareItemModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.action.share') }}</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="deleteFolderModal?.open()"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.folder.action.delete') }}</a
				>
			</div>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<BaseConfirmModal ref="deleteFolderModal" :type="ConfirmModalType.Danger" @confirm="deleteFolder">
		{{ t('fileBrowser.folder.action.confirmDelete') }}</BaseConfirmModal
	>
	<EditFolderModal
		v-if="modelValue instanceof FolderClass"
		ref="editFolderModal"
		:folder="modelValue"
	/>
	<EditShortcutModal v-else ref="editShortcutModal" :shortcut="modelValue" />
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
	<CreateShortcutModal ref="createShortcutModal" :item="modelValue" />
</template>

<script setup lang="ts">
import { type PropType, computed, ref } from 'vue';
import { FolderClass } from '@lib/items/folders';
import { ShortcutClass } from '@lib/items/shortcuts';
import { url } from '@lib/helpers';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFolderModal from './EditModal.vue';
import EditShortcutModal from './EditShortcutModal.vue';
import ShareItemModal from '../ShareItemModal.vue';
import CreateShortcutModal from '../CreateShortcutModal.vue';
import { t } from '@lib/i18n';
import { removeItem } from '@stores/items';

const folderContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderClass>,
		required: true,
	},
});

const classes = computed(() => {
	if (
		props.modelValue instanceof ShortcutClass &&
		props.modelValue.linkedItem instanceof FolderClass
	) {
		return props.modelValue.linkedItem.colorClass;
	}

	return props.modelValue.colorClass;
});

const deleteFolderModal = ref<InstanceType<typeof BaseConfirmModal>>();
async function deleteFolder() {
	try {
		await props.modelValue.delete();

		removeItem(props.modelValue);

		// TODO: Show success toast
	} catch (e) {
		console.error('Error: ' + e);

		// TODO: Show error toast
	}
}

const editFolderModal = ref<InstanceType<typeof EditFolderModal>>();
const editShortcutModal = ref<InstanceType<typeof EditShortcutModal>>();

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
const createShortcutModal = ref<InstanceType<typeof CreateShortcutModal>>();
</script>
