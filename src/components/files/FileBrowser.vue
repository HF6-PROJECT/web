<template>
	<template v-if="!items.length">
		<NoFiles />
	</template>
	<template v-else>
		<div class="flex flex-wrap gap-3">
			<Folder
				v-for="folder in folders"
				:modelValue="folder"
				@update:modelValue="updateItem(folder)"
			/>
		</div>
		<div class="mt-3 flex flex-wrap gap-3">
			<File v-for="file in files" :modelValue="file" @update:modelValue="updateItem(file)" />
		</div>
	</template>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import NoFiles from './NoFiles.vue';
import Folder from './Folder.vue';
import File from './File.vue';
import { FolderClass, FileClass, ItemClass } from '@lib/items';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderClass>,
		required: false,
	},
});

/**
 * Items
 */
const items = ref<ItemClass[]>([]);

getItems();

function getItems() {
	console.log(props.modelValue instanceof FolderClass);
	if (props.modelValue instanceof FolderClass) {
		//
	}

	for (let i = 0; i < 29; i++) {
		const item =
			Math.random() > 0.5 ? FolderClass.create('jkghk', null) : FileClass.create('grffrw', null);
		items.value.push(item);
	}
}

function updateItem(item: ItemClass) {
	console.log(item);
}

/**
 * Folders
 */
const folders = computed(() => {
	return items.value.filter((item) => item instanceof FolderClass) as FolderClass[];
});

/**
 * Files
 */
const files = computed(() => {
	return items.value.filter((item) => item instanceof FileClass) as FileClass[];
});
</script>
