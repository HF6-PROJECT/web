<template>
	<ContextMenu>
		<template v-slot:content>
			<a :href="url(`u/folder/${modelValue.id}`)">
				<button
					v-on:click.ctrl.prevent="
						console.log('ctrl');
						editingName = !editingName;
					"
					type="button"
					:contenteditable="editingName ? 'true' : 'false'"
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
						href="#"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Dashboard</a
					>
				</li>
				<li>
					<a
						href="#"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Settings</a
					>
				</li>
				<li>
					<a
						href="#"
						class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Earnings</a
					>
				</li>
			</ul>
			<div class="py-2">
				<a
					href="#"
					class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
					>Separated link</a
				>
			</div>
		</template>
	</ContextMenu>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
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

const editingName = ref(false);

const classes = computed(() => {
	return props.modelValue.colorClass + (editingName.value ? '' : '');
});
</script>
