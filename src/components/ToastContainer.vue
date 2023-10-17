<template>
	<div class="fixed right-5 top-24 z-50 flex w-full max-w-xs flex-col">
		<BaseToast v-for="toast in toasts" :key="(toast as Toast).id" :toast="toast as Toast">{{
			toast?.message
		}}</BaseToast>
	</div>
</template>

<script setup lang="ts">
import BaseToast from '@components/base/toast.vue';
import { toastsStore, type Toast } from '@stores/toasts';
import { useStore } from '@nanostores/vue';

const toasts = useStore(toastsStore);
</script>
