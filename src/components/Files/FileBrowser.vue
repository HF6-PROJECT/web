<template>
	<template v-if="!items.length">
		<NoFiles />
	</template>
	<template v-else>
		<div>
			<Folder v-for="folder in folders" :folder="folder" />
		</div>
		<div>
			<File v-for="file in files" :file="file" />
		</div>
	</template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NoFiles from './NoFiles.vue';
import Folder from './Folder.vue';
import File from './File.vue';
import { FolderClass, FileClass, ItemClass } from '@lib/items';

/**
 * Items
 */
const items = ref<ItemClass[]>([]);

getItems();

function getItems() {
	for (let i = 0; i < 29; i++) {
		const item =
			Math.random() > 0.5 ? FolderClass.create(randomName(), null) : FileClass.create(randomName(), null);
		items.value.push(item);
	}
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

/**
 * TODO: Delete this function
 */
function randomName() {
	const words = [
		'ability',
		'about',
		'absent',
		'brush',
		'budget',
		'cheap',
		'comfort',
		'common',
		'company',
		'compare',
		'deep',
		'define',
		'demand',
		'depth',
		'easily',
		'easy',
		'factor',
		'factory',
		'happy',
		'hard',
		'have',
		'machine',
		'magazine',
		'magic',
		'magical',
	];
	return words[Math.floor(Math.random() * words.length)] as string;
}
</script>
