<template>
	<div class="relative">
		<!-- Folder -->
		<a
			:href="url(`u/folder/${modelValue.id}`)"
			v-on:contextmenu.prevent="folderContextMenu?.openMenu"
			v-if="!(modelValue instanceof ShortcutClass)"
		>
			<button
				type="button"
				:class="classes"
				class="h-[40px] rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				{{ modelValue.name }}
			</button>
		</a>
		<a
			:href="url(`u/folder/${modelValue._linkedItemId}`)"
			v-on:contextmenu.prevent="folderContextMenu?.openMenu"
			v-if="(modelValue instanceof ShortcutClass)"
		>
			<button
				type="button"
				:class="classes"
				class="h-[40px] rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				{{ modelValue.name }}
			</button>
			<svg class="absolute -left-3 -bottom-3" fill="lightblue" version="1.0" xmlns="http://www.w3.org/2000/svg"
			width="25.000000pt" height="25.000000pt" viewBox="0 0 50.000000 50.000000"
			preserveAspectRatio="xMidYMid meet">
				<g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)" stroke="black" stroke-width="6px">
					<path d="M236 449 c-49 -10 -92 -21 -95 -24 -3 -3 8 -16 24 -29 l30 -24 -25
					-43 c-19 -35 -25 -58 -25 -109 1 -68 19 -114 69 -175 30 -37 43 -28 22 14 -30
					57 -14 146 39 215 15 19 15 19 38 -2 42 -40 47 -30 47 88 0 127 12 118 -124
					89z"/>
				</g>
			</svg>
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
				<li>
					<a
						href="javascript:void(0)"
						@click="createShortcutModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('item.createShortcut') }}</a
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
	if (props.modelValue instanceof ShortcutClass && props.modelValue._linkedItem instanceof FolderClass) {
		return props.modelValue._linkedItem.colorClass;
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
const createShortcutModal = ref<InstanceType<typeof CreateShortcutModal>>();
</script>
