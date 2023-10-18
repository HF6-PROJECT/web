<template>
	<div class="relative">
		<!-- File -->
		<a
			href="javascript:void(0)"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="fileContextMenu?.openMenu"
			@click.prevent="downloadFile"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ modelValue.name }}
			</h5>
		</a>

		<!-- File ContextMenu -->
		<ContextMenu ref="fileContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						@click="editFileModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.action.edit') }}</a
					>
				</li>
				<li>
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
	<EditFileModal ref="editFileModal" :file="modelValue" />
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
</template>

<script setup lang="ts">
// Lib
import { ref, type PropType } from 'vue';

// Helpers
import { t } from '@lib/i18n';
import { v4 as uuid } from 'uuid';

// Components
import ContextMenu from '@components/base/contextMenu.vue';
import { ToastType } from '@components/base/toast.vue';

// Stores
import { removeItem } from '@stores/items';
import { addToast } from '@stores/toasts';

// File
import { FileClass } from '@lib/items/files';

const fileContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});

function downloadFile() {
	window.open(props.modelValue.blobUrl, '_blank');

	fileContextMenu.value?.closeMenu();
}

/*
 * Modals
 */
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFileModal from './EditModal.vue';
import ShareItemModal from '../ShareItemModal.vue';

const deleteFileModal = ref<InstanceType<typeof BaseConfirmModal>>();
async function deleteFile() {
	try {
		await props.modelValue.delete();

		removeItem(props.modelValue);

		addToast({
			id: uuid(),
			message: props.modelValue.name + ' ' + t('fileBrowser.file.toast.delete.success'),
			type: ToastType.Success,
		});
	} catch (e) {
		console.error('Error: ' + e);

		addToast({
			id: uuid(),
			message: t('fileBrowser.file.toast.delete.failed') + ' ' + props.modelValue.name,
			type: ToastType.Danger,
		});
	}
}

const editFileModal = ref<InstanceType<typeof EditFileModal>>();

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
</script>
