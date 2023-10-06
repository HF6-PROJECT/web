<template>
	<div class="relative">
		<a
			href="#"
			class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			v-on:contextmenu.prevent="fileContextMenu?.openMenu"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{ modelValue.name }}
			</h5>
		</a>

		<ContextMenu ref="fileContextMenu">
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						href="javascript:void(0)"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Change Name</a
					>
				</li>
				<li>
					<a
						href="javascript:void(0)"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Share</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="javascript:void(0)"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>Delete</a
				>
			</div>
		</ContextMenu>
	</div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { FileClass } from '@lib/items/files';
import ContextMenu from './ContextMenu.vue';

const fileContextMenu = ref<InstanceType<typeof ContextMenu>>();

defineProps({
	modelValue: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});
defineEmits(['update:modelValue']);
</script>
