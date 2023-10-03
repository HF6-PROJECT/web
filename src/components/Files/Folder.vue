<template>
	<button
		type="button"
		:class="folder.colorClass"
		class="mb-2 mr-2 rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
	>
		{{ folder.name }}
	</button>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { FolderClass } from '@lib/items';

defineProps({
	folder: {
		type: Object as PropType<FolderClass>,
		required: true,
	},
});
</script>
