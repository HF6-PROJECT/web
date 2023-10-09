<template>
	<div class="relative">
		<!-- Folder -->
		<a
			:href="url(`u/folder/${modelValue.id}`)"
			v-on:contextmenu.prevent="folderContextMenu?.openMenu"
		>
			<button
				type="button"
				:class="classes"
				class="h-[40px] rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				{{ modelValue.name }}
			</button>
		</a>

		<!-- Folder ContextMenu -->
		<ContextMenu ref="folderContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						:href="url(`u/folder/${modelValue.id}`)"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.openInNewTab') }}</a
					>
				</li>
				<li>
					<a
						href="javascript:void(0)"
						@click="editFolderModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.edit') }}</a
					>
				</li>
				<!--
				<li>
					<a
						href="#"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.folder.share') }}</a
					>
				</li>
				-->
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="deleteFolderModal?.open()"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.folder.delete') }}</a
				>
			</div>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<BaseConfirmModal ref="deleteFolderModal" :type="ConfirmModalType.Danger" @confirm="deleteFolder">
		{{ t('fileBrowser.folder.areYouSureYouWantToDeleteThisFolder') }}</BaseConfirmModal
	>
	<EditFolderModal ref="editFolderModal" :folder="modelValue" />
</template>

<script setup lang="ts">
import { type PropType, computed, ref } from 'vue';
import { FolderClass } from '@lib/items/folders';
import { url } from '@lib/helpers';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFolderModal from './EditModal.vue';
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
</script>
