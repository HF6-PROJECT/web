<template>
	<div class="relative">
		<!-- File -->
		<a
			href="#"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="fileContextMenu?.openMenu"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ modelValue.name }}
			</h5>
			<svg v-if="(modelValue instanceof ShortcutClass)" class="absolute -left-6 -bottom-1/3" fill="lightblue" version="1.0" xmlns="http://www.w3.org/2000/svg"
			width="50.000000pt" height="50.000000pt" viewBox="0 0 50.000000 50.000000"
			preserveAspectRatio="xMidYMid meet">
				<g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)" stroke="black" stroke-width="6px">
					<path d="M236 449 c-49 -10 -92 -21 -95 -24 -3 -3 8 -16 24 -29 l30 -24 -25
					-43 c-19 -35 -25 -58 -25 -109 1 -68 19 -114 69 -175 30 -37 43 -28 22 14 -30
					57 -14 146 39 215 15 19 15 19 38 -2 42 -40 47 -30 47 88 0 127 12 118 -124
					89z"/>
				</g>
			</svg>
		</a>

		<!-- File ContextMenu -->
		<ContextMenu ref="fileContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						@click="editFileModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.rename') }}</a
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
				<li>
					<a
						href="javascript:void(0)"
						@click="shareItemModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Share</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="deleteFileModal?.open()"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.file.delete') }}</a
				>
			</div>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<BaseConfirmModal ref="deleteFileModal" :type="ConfirmModalType.Danger" @confirm="deleteFile">
		{{ t('fileBrowser.file.areYouSureYouWantToDeleteThisFile') }}</BaseConfirmModal
	>
	<EditFileModal ref="editFileModal" :file="modelValue" />
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
	<CreateShortcutModal ref="createShortcutModal" :item="modelValue" />
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { FileClass } from '@lib/items/files';
import { ShortcutClass } from '@lib/items/shortcuts';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFileModal from './EditModal.vue';
import ShareItemModal from '../ShareItemModal.vue';
import CreateShortcutModal from '../CreateShortcutModal.vue';
import { t } from '@lib/i18n';
import { removeItem } from '@stores/items';

const fileContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});

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

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
const createShortcutModal = ref<InstanceType<typeof CreateShortcutModal>>();
</script>
