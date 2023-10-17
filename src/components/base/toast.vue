<template>
	<div
		v-if="showToast"
		class="mb-4 flex w-full max-w-xs flex-col items-center rounded-lg bg-white text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
		role="alert"
		@mouseenter="isMouseOver = true"
		@mouseleave="isMouseOver = false"
	>
		<div class="flex w-full p-4">
			<div
				v-if="props.toast.type === ToastType.Success"
				class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
			>
				<svg
					class="h-5 w-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
					/>
				</svg>
				<span class="sr-only">Check icon</span>
			</div>
			<div
				v-else-if="props.toast.type === ToastType.Danger"
				class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
			>
				<svg
					class="h-5 w-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
					/>
				</svg>
				<span class="sr-only">Error icon</span>
			</div>
			<div
				v-else-if="props.toast.type === ToastType.Warning"
				class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
			>
				<svg
					class="h-5 w-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
					/>
				</svg>
				<span class="sr-only">Warning icon</span>
			</div>
			<div
				v-else-if="props.toast.type === ToastType.Info"
				class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-700 dark:text-blue-200"
			>
				<svg
					class="h-5 w-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
					/>
				</svg>
				<span class="sr-only">Info icon</span>
			</div>
			<div class="ml-3 text-sm font-normal"><slot /></div>
			<button
				type="button"
				class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
				aria-label="Close"
				@click="closeToast()"
			>
				<span class="sr-only">Close</span>
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
			</button>
		</div>
		<div v-if="showToast" class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
			<div
				class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-600"
				:style="{ width: value + '%' }"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
export enum ToastType {
	Info = 'info',
	Danger = 'danger',
	Success = 'success',
	Warning = 'warning',
}
</script>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { removeToast, type Toast } from '@stores/toasts';

const showToast = ref(true);

const isMouseOver = ref(false);

const value = ref(100);
const timer = setInterval(() => {
	if (isMouseOver.value) return;

	value.value -= 0.2;
	if (value.value < 0) {
		value.value = 100;
		clearInterval(timer);
		closeToast();
	}
}, 10);

function closeToast() {
	showToast.value = false;
	removeToast(props.toast);
}

const props = defineProps({
	toast: {
		type: Object as PropType<Toast>,
		required: true,
	},
});
</script>
