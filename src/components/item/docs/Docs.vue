<template>
	<div class="relative">
		<!-- Docs -->
		<a
			:href="url(`u/docs/${modelValue.id}`)"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="docsContextMenu?.openMenu"
			v-if="!(modelValue instanceof ShortcutClass)"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ modelValue.name }}
			</h5>
		</a>
		<a
			:href="url(`u/docs/${modelValue.linkedItemId}`)"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="docsContextMenu?.openMenu"
			v-else
		>
			<h5
				class="mb-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
			>
				{{ modelValue.name }}

				<svg
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

		<!-- Docs ContextMenu -->
		<ContextMenu ref="docsContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						v-if="!(modelValue instanceof ShortcutClass)"
						:href="url(`u/docs/${modelValue.id}`)"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.openInNewTab') }}</a
					>
					<a
						v-else
						:href="url(`u/docs/${modelValue.linkedItemId}`)"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.openInNewTab') }}</a
					>
				</li>
				<li>
					<a
						v-if="!(modelValue instanceof ShortcutClass)"
						href="javascript:void(0)"
						@click="editDocsModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.docs.action.edit') }}</a
					>
					<a
						v-else
						href="javascript:void(0)"
						@click="editShortcutModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.shortcut.rename') }}</a
					>
				</li>
				<li v-if="!(modelValue instanceof ShortcutClass)">
					<a
						href="javascript:void(0)"
						@click="createShortcutModal?.open()"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{{ t('fileBrowser.shortcut.create') }}</a
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
	<EditDocsModal v-if="modelValue instanceof DocsClass" ref="editDocsModal" :docs="modelValue" />
	<EditShortcutModal v-else ref="editShortcutModal" :shortcut="modelValue" />
	<ShareItemModal ref="shareItemModal" :item="modelValue" />
	<CreateShortcutModal ref="createShortcutModal" :item="modelValue" />
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import ContextMenu from '@components/base/contextMenu.vue';
import { ShortcutClass } from '@lib/items/shortcuts';
import BaseConfirmModal, { ConfirmModalType } from '@components/base/confirmModal.vue';
import EditDocsModal from './EditModal.vue';
import ShareItemModal from '../ShareItemModal.vue';
import EditShortcutModal from './EditShortcutModal.vue';
import { t } from '@lib/i18n';
import { removeItem } from '@stores/items';
import { DocsClass } from '@lib/items/docs';
import CreateShortcutModal from '../CreateShortcutModal.vue';
import { url } from '@lib/helpers';

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

		// TODO: Show success toast
	} catch (e) {
		console.error('Error: ' + e);

		// TODO: Show error toast
	}
}

const editDocsModal = ref<InstanceType<typeof EditDocsModal>>();
const editShortcutModal = ref<InstanceType<typeof EditShortcutModal>>();

const shareItemModal = ref<InstanceType<typeof ShareItemModal>>();
const createShortcutModal = ref<InstanceType<typeof CreateShortcutModal>>();
</script>
