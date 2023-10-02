<template>
	<template v-if="!items.length">
		<NoFiles />
	</template>
	<template v-else>
		<template v-for="folder in folders">
			<button
				type="button"
				:class="randomGradient()"
				class="mb-2 mr-2 rounded-lg bg-gradient-to-br px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				{{ folder.name }}
			</button>
		</template>
		<template v-for="file in files"> </template>
		
	</template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NoFiles from './NoFiles.vue';

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

function randomItems() {
	const items = [];
	for (let i = 0; i < 29; i++) {
		items.push({
			id: i.toString(),
			name: randomName() + (Math.random() > 0.5 ? ' ' + randomName() : ''),
			type: Math.random() > 0.5 ? FolderType.directory : Object.values(FileType)[Math.floor(Math.random() * Object.values(FileType).length)],
		});
	}
	return items as Item[];
}

const items = ref<Item[]>(randomItems());

const folders = computed(() => {
	return items.value.filter((item) => item.type === FolderType.directory) as Folder[];
});

const files = computed(() => {
	return items.value.filter((item) => item.type !== FolderType.directory) as File[];
});

function randomGradient() {
	return `from-${randomColor()}-500 to-${randomColor()}-500`;
}

function randomColor() {
	const colors = [
		'red',
		'orange',
		'amber',
		'yellow',
		'lime',
		'green',
		'emerald',
		'teal',
		'cyan',
		'sky',
		'blue',
		'indigo',
		'violet',
		'purple',
		'fuchsia',
		'pink',
		'rose',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
</script>

<script lang="ts">
const FolderType = <const>{
	directory: 'text/directory',
};
type FolderTypeValue = (typeof FolderType)[keyof typeof FolderType];

const VideoType = <const>{
	mp4: 'video/mp4',
	webm: 'video/webm',
};

const AudioType = <const>{
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	ogg: 'audio/ogg',
};

const ImageType = <const>{
	svg: 'image/svg+xml',
	png: 'image/png',
	jpg: 'image/jpeg',
	gif: 'image/gif',
};

const ApplicationType = <const>{
	doc: 'application/clouddoc',
	pdf: 'application/pdf',
	json: 'application/json',
	zip: 'application/zip',
};

const FileType = <const>{
	...VideoType,
	...AudioType,
	...ImageType,
	...ApplicationType,
};
type FileTypeValue = (typeof FileType)[keyof typeof FileType];

const SupportedItemTypes = <const>{
	...FolderType,
	...FileType,
};
type SupportedItemTypesValue = (typeof SupportedItemTypes)[keyof typeof SupportedItemTypes];

type Item = {
	id: string;
	name: string;
	type: SupportedItemTypesValue;
};

type Folder = {
	id: string;
	name: string;
	type: FolderTypeValue;
};

type File = {
	id: string;
	name: string;
	type: FileTypeValue;
};
</script>
