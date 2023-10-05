<template>
	<ContextMenu>
		<template v-slot:content>
			<a :href="url(`u/folder/${modelValue.id}`)">
				<button
					type="button"
					:class="classes"
					class="h-[40px] rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
				>
					{{ modelValue.name }}
				</button>
			</a>
		</template>
		<template v-slot:menu>
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
				<li>
					<a
						:href="url(`u/folder/${modelValue.id}`)"
						target="_blank"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Open in new tab</a
					>
				</li>
				<li>
					<a
						href="#"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Change Name</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="#"
					class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600"
					>Delete</a
				>
			</div>
		</template>
	</ContextMenu>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue';
import { FolderClass } from '@lib/items';
import { url } from '@lib/helpers';
import ContextMenu from './ContextMenu.vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderClass>,
		required: true,
	},
});
defineEmits(['update:modelValue']);

const classes = computed(() => {
	return props.modelValue.colorClass;
});
</script>
