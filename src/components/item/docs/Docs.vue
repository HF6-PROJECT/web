<template>
	<div class="relative">
		<!-- Docs -->
		<a
			:href="url(`u/docs/${modelValue.id}`)"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="docsContextMenu?.openMenu"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ modelValue.name }}
			</h5>
		</a>

		<!-- Docs ContextMenu -->
		<ContextMenu ref="docsContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						:href="url(`u/docs/${modelValue.id}`)"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.openInNewTab') }}</a
					>
				</li>
				<li>
					<a
						href="javascript:void(0)"
						@click="editDocsModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.edit') }}</a
					>
				</li>
				<li>
					<a
						href="javascript:void(0)"
						@click="shareItemModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.share') }}</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					@click="deleteDocsModal?.open()"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>{{ t('fileBrowser.docs.action.delete') }}</a
				>
			</div>
		</ContextMenu>
	</div>

	<!-- Modals -->
	<BaseConfirmModal ref="deleteDocsModal" :type="ConfirmModalType.Danger" @confirm="deleteDocs">
		{{ t('fileBrowser.docs.action.confirmDelete') }}</BaseConfirmModal
	>
	<EditDocsModal ref="editDocsModal" :docs="modelValue" />
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import ContextMenu from '@components/base/contextMenu.vue';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditDocsModal from './EditModal.vue';
import ShareItemModal from '../ShareItemModal.vue';
import { t } from '@lib/i18n';
import { removeItem } from '@stores/items';
import type { DocsClass } from '@lib/items/docs';
import { url } from '@lib/helpers';
import { addToast } from '@stores/toasts';
import { ToastType } from '@components/base/toast.vue';

const docsContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object as PropType<DocsClass>,
		required: true,
	},
});

const deleteDocsModal = ref<InstanceType<typeof BaseConfirmModal>>();
async function deleteDocs() {
	try {
		await props.modelValue.delete();

		removeItem(props.modelValue);

		addToast({
			message: props.modelValue.name + ' ' + t('fileBrowser.docs.toast.delete.success'),
			type: ToastType.Success,
		});
	} catch (e) {
		console.error('Error: ' + e);

		addToast({
			message: t('fileBrowser.docs.toast.delete.success') + ' ' + props.modelValue.name,
			type: ToastType.Danger,
		});
	}
}

const editDocsModal = ref<InstanceType<typeof EditDocsModal>>();

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
</script>
