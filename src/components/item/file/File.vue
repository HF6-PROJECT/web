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
		</a>

		<!-- File ContextMenu -->
		<ContextMenu ref="fileContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						@click="
							showEditModal = true;
							fileContextMenu?.closeMenu();
						"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.file.rename') }}</a
					>
				</li>
				<!--
				<li>
					<a
						href="javascript:void(0)"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Share</a
					>
				</li>
				-->
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="
						showDeleteModal = true;
						fileContextMenu?.closeMenu();
					"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.file.delete') }}</a
				>
			</div>
		</ContextMenu>

		<!-- Modals -->
		<BaseConfirmModal
			v-if="showDeleteModal"
			:type="ConfirmModalType.Danger"
			@confirm="deleteFile"
			@close="showDeleteModal = false"
		>
			{{ t('fileBrowser.file.areYouSureYouWantToDeleteThisFile') }}</BaseConfirmModal
		>
		<EditFileModal v-if="showEditModal" :file="modelValue" @close="showEditModal = false" />
	</div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { FileClass } from '@lib/items/files';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditFileModal from './EditModal.vue';
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

const showDeleteModal = ref(false);
async function deleteFile() {
	try {
		await props.modelValue.delete();

		removeItem(props.modelValue);

		// TODO: Show success toast
	} catch (e) {
		console.error('Error: ' + e);

		// TODO: Show error toast
	}

	showDeleteModal.value = false;
}

const showEditModal = ref(false);
</script>
