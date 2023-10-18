<template>
	<div class="relative w-full px-4 py-6">
		<div class="mt-3 flex flex-wrap">
			<div
				v-if="hasLoaded"
				v-for="breadcrumbItem in breadcrumbItems"
				:key="breadcrumbItem.id"
				class="text-gray-500 hover:text-gray-700 dark:text-gray-300"
			>
				<span v-if="breadcrumbItem.id !== 0">&nbsp;/&nbsp;</span>
				<a
					:href="breadcrumbItem.url"
					class="hover:text-gray-700 dark:hover:text-gray-100"
					:class="{
						'font-semibold hover:text-gray-700 dark:hover:text-gray-100': breadcrumbItem.active,
					}"
					>{{ breadcrumbItem.name }}</a
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import { fetchFromApi, url } from '@lib/helpers';
import { type FolderType } from '@lib/items/folders';
import { t } from '@lib/i18n';

const props = defineProps({
	item: {
		type: Object as PropType<FolderType | undefined>,
		required: true,
	},
});

type ItemPath = { id: number; name: string; parent?: ItemPath | null };
type BreadcrumbItem = { id: number; name: string; url: string; active: boolean };

const breadcrumbItemPath = ref<ItemPath | null | undefined>(null);
const hasLoaded = ref(false);

getBreadcrumbItems();

async function getBreadcrumbItems() {
	if (!props.item?.id) {
		hasLoaded.value = true;
		return;
	}

	const response = await fetchFromApi(`item/${props.item.id}/breadcrumb`, {
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

	const rawItemPath = await response.json();

	breadcrumbItemPath.value = rawItemPath;

	hasLoaded.value = true;
}

function getBreadCrumbItems(
	itemPath: ItemPath | null | undefined,
	items: BreadcrumbItem[] = [],
): BreadcrumbItem[] {
	if (itemPath === null) {
		items.unshift({
			id: 0,
			name: t('layout.link.myFiles'),
			url: url('u'),
			active: true,
		});

		return items;
	}

	if (itemPath === undefined) {
		items.unshift({
			id: 0,
			name: t('layout.link.sharedWithMe'),
			url: url('u/shared'),
			active: true,
		});

		return items;
	}

	items.unshift({
		id: itemPath.id,
		name: itemPath.name,
		url: itemPath.id !== 0 ? url(`u/folder/${itemPath.id}`) : url('u'),
		active: itemPath.id === props.item?.id,
	});

	if (itemPath.parent === null) {
		items.unshift({
			id: 0,
			name: t('layout.link.myFiles'),
			url: url('u'),
			active: itemPath.id === null,
		});

		return items;
	}

	if (itemPath.parent === undefined) {
		items.unshift({
			id: 0,
			name: t('layout.link.sharedWithMe'),
			url: url('u/shared'),
			active: itemPath.id === null,
		});

		return items;
	}

	return getBreadCrumbItems(itemPath.parent, items);
}

const breadcrumbItems = computed(() => {
	const breadcrumbItems = getBreadCrumbItems(breadcrumbItemPath.value);

	return breadcrumbItems;
});
</script>
