<template>
	<div class="relative">
		<!-- File -->
		<a
			href="javascript:void(0)"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="fileContextMenu?.openMenu"
			@click.prevent="downloadFile"
		>
			<h5
				class="mb-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
			>
				{{ modelValue.name }}
				<svg
					v-if="modelValue instanceof ShortcutClass"
					class="h-6 w-6 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 19 17"
				>
					<path
						d="M2.057 6.9a8.718 8.718 0 0 1 6.41-3.62v-1.2A2.064 2.064 0 0 1 9.626.2a1.979 1.979 0 0 1 2.1.23l5.481 4.308a2.107 2.107 0 0 1 0 3.3l-5.479 4.308a1.977 1.977 0 0 1-2.1.228 2.063 2.063 0 0 1-1.158-1.876v-.942c-5.32 1.284-6.2 5.25-6.238 5.44a1 1 0 0 1-.921.807h-.06a1 1 0 0 1-.953-.7A10.24 10.24 0 0 1 2.057 6.9Z"
					/>
				</svg>
			</h5>
		</a>

		<!-- File ContextMenu -->
		<ContextMenu ref="fileContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
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
						@click="editFileModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.action.edit') }}</a
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
						>{{ t('fileBrowser.file.action.share') }}</a
					>
				</li>
				<li>
					<a
						href="javascript:void(0)"
						@click="downloadFile"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.action.download') }}</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="deleteFileModal?.open()"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.file.action.delete') }}</a
				>
			</div>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<BaseConfirmModal ref="deleteFileModal" :type="ConfirmModalType.Danger" @confirm="deleteFile">
		{{ t('fileBrowser.file.action.confirmDelete') }}</BaseConfirmModal
	>
	<EditFileModal v-if="modelValue instanceof FileClass" ref="editFileModal" :file="modelValue" />
	<EditShortcutModal
		v-if="modelValue instanceof ShortcutClass"
		ref="editShortcutModal"
		:shortcut="modelValue"
	/>
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
	<CreateShortcutModal ref="createShortcutModal" :item="modelValue" />
</template>

<script setup lang="ts">
// Lib
import { ref, type PropType } from 'vue';

// Helpers
import { t } from '@lib/i18n';

// Components
import ContextMenu from '@components/base/contextMenu.vue';

// Stores
import { removeItem } from '@stores/items';

// File
import { FileClass } from '@lib/items/files';

// Shortcut
import { ShortcutClass } from '@lib/items/shortcuts';

const fileContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object as PropType<FileClass | ShortcutClass>,
		required: true,
	},
});

function downloadFile() {
	if (
		props.modelValue instanceof ShortcutClass &&
		props.modelValue.linkedItem instanceof FileClass
	) {
		window.open(props.modelValue.linkedItem.blobUrl, '_blank');
	} else if (props.modelValue instanceof FileClass) {
		window.open(props.modelValue.blobUrl, '_blank');
	}

	fileContextMenu.value?.closeMenu();
}

/*
 * Modals
 */
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFileModal from './EditModal.vue';
import ShareItemModal from '../ShareItemModal.vue';
import EditShortcutModal from './EditShortcutModal.vue';
import CreateShortcutModal from '../CreateShortcutModal.vue';

const deleteFileModal = ref<InstanceType<typeof BaseConfirmModal>>();
async function deleteFile() {
	try {
		await props.modelValue.delete();

		removeItem(props.modelValue);

		// TODO: Show success toast
	} catch (e) {
		console.error('Error: ' + e);

		// TODO: Show error toast
	}
}

const editFileModal = ref<InstanceType<typeof EditFileModal>>();
const editShortcutModal = ref<InstanceType<typeof EditShortcutModal>>();

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
const createShortcutModal = ref<InstanceType<typeof CreateShortcutModal>>();
</script>
