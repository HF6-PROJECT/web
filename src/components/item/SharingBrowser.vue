<template>
	<div class="relative h-full w-full px-4 pt-6">
		<!-- Files & Folders -->
		<div class="flex flex-wrap gap-3">
			<!-- prettier-ignore-attribute -->
			<Folder
				v-for="folder in folders"
				:key="folder.id"
				v-model="(items[folder.id] as FolderClass)"
			/>
		</div>
		<div class="mt-3 flex flex-wrap gap-3">
			<!-- prettier-ignore-attribute -->
			<File v-for="file in files" :key="file.id" v-model="(items[file.id] as FileClass)" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { addItem, itemsStore } from '@stores/items';
import { computed } from 'vue';
import { fetchFromApi } from '@lib/helpers';
import Folder from './folder/Folder.vue';
import File from './file/File.vue';
import { ItemClass } from '@lib/items/items';
import { ItemFactory } from '@lib/items/factory';
import { FolderClass } from '@lib/items/folders';
import { FileClass } from '@lib/items/files';

/**
 * Items
 */
const items = useStore(itemsStore);

getItems();

async function getItems() {
	try {
		const response = await fetchFromApi(`item/shared`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				throw new Error((await response.json()).error);
			}

			throw new Error(await response.text());
		}

		const rawItems = await response.json();

		for (const rawItem of rawItems) {
			if (!ItemClass.isItem(rawItem)) continue;

			const item = ItemFactory.getItemFromObject(rawItem);

			if (item === null) continue;

			addItem(item);
		}
	} catch (e) {
		console.error('Error' + e);
	}
}

/**
 * Folders
 */
const folders = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof FolderClass) as FolderClass[];
});

/**
 * Files
 */
const files = computed(() => {
	return Object.values(items.value).filter((item) => item instanceof FileClass) as FileClass[];
});
</script>