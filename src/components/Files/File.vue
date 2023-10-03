<template>
	<div>{{ file.name }}</div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { FileClass } from '@lib/items';

defineProps({
	file: {
		type: Object as PropType<FileClass>,
		required: true,
	},
});
</script>
