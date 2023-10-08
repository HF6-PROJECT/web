<template>
	<BaseModal @close="emit('close')" class="text-center">
		<svg
			class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 20"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
		<h3 class="mx-auto mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			<slot />
		</h3>
		<div class="flex">
			<button
				type="button"
				@click.prevent="$emit('confirm')"
				:class="
					classes +
					' ml-auto mr-2 inline-flex items-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
				"
			>
				{{ t('yesImSure') }}
			</button>
			<button
				type="button"
				@click.prevent="$emit('close')"
				class="mr-auto rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
			>
				{{ t('noCancel') }}
			</button>
		</div>
	</BaseModal>
</template>

<script lang="ts">
export enum ConfirmModalType {
	Danger = 'danger',
}
</script>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import BaseModal from '@components/base/modal.vue';
import { t } from '@lib/i18n';

const emit = defineEmits(['close', 'confirm']);
const props = defineProps({
	type: {
		type: String as PropType<ConfirmModalType>,
		required: true,
	},
});

const classes = computed(() => {
	switch (props.type) {
		case ConfirmModalType.Danger:
			return 'bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800';
	}
});
</script>
