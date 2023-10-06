<template>
	<div
		tabindex="-1"
		aria-hidden="true"
		class="fixed left-0 right-0 top-0 z-50 flex h-full max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4 md:inset-0"
	>
		<div ref="modal" class="relative max-h-full w-full max-w-lg">
			<div
				class="relative rounded-lg bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
			>
				<button
					type="button"
					class="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
					@click="emit('close')"
				>
					<svg
						class="h-3 w-3"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
					<span class="sr-only">Close modal</span>
				</button>
				<div class="px-6 py-6 lg:px-8">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside, onKeyDown } from '@vueuse/core';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const modal = ref<HTMLElement>();
onClickOutside(modal, () => emit('close'));

onKeyDown('Escape', () => {
	emit('close');
});
</script>
