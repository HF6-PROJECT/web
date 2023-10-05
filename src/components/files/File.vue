<template>
	<a
		href="#"
		class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
	>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{{ modelValue.name }}
		</h5>
	</a>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { FileClass } from '@lib/items/files';

defineProps({
	modelValue: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});
defineEmits(['update:modelValue']);
</script>
