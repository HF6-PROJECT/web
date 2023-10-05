<template>
	<template v-if="!items.length">
		<NoFiles />
	</template>
	<template v-else>
		<div class="flex flex-wrap gap-3">
			<!-- prettier-ignore-attribute -->
			<Folder
				v-for="folder in folders"
				:key="folder.id"
				v-model="(items[getItemIndex(folder)] as FolderClass)"
			/>
		</div>
		<div class="mt-3 flex flex-wrap gap-3">
			<!-- prettier-ignore-attribute -->
			<File
				v-for="file in files"
				:key="file.id"
				v-model="(items[getItemIndex(file)] as FileClass)"
			/>
		</div>
	</template>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import NoFiles from './NoFiles.vue';
import Folder from './Folder.vue';
import File from './File.vue';
import { ItemClass } from '@lib/items/items';
import { ItemFactory } from '@lib/items/factory';
import { FolderClass, type FolderType } from '@lib/items/folders';
import { FileClass } from '@lib/items/files';
import { api } from '@lib/helpers';

const props = defineProps({
	modelValue: {
		type: Object as PropType<FolderType>,
		required: false,
	},
});

/**
 * Items
 */
const items = ref<ItemClass[]>([]);

getItems();

function getItems() {
	fetch(
		api(
			`item${
				ItemClass.isItem(props.modelValue) && FolderClass.isFolder(props.modelValue)
					? `/${props.modelValue.id}`
					: ''
			}`,
		),
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	)
		.then(async (response) => {
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

				items.value.push(item);
			}

			return items.value;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function getItemIndex(item: ItemClass) {
	return items.value.findIndex((i) => i.id === item.id);
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
