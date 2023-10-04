<template>
	<div class="relative" v-on:contextmenu.prevent="openMenu">
		<slot name="content"></slot>
		<div
			v-if="showMenu"
			ref="menu"
			v-on:blur="closeMenu"
			tabindex="-1"
			:style="{ top: `${top}px`, left: `${left}px` }"
			class="absolute z-10 block w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
		>
			<slot name="menu"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const menu = ref<HTMLElement | null>(null);
const showMenu = ref(false);
const top = ref(0);
const left = ref(0);

onMounted(() => console.log(menu.value));

function setMenu(y: number, x: number) {
	top.value = y;
	left.value = x;
}

function closeMenu() {
	showMenu.value = false;
}

function openMenu(e: MouseEvent) {
	showMenu.value = true;

	nextTick(() => {
		if (!menu.value) return;

		menu.value.focus();

		setMenu(e.offsetY, e.offsetX);
	});
}
</script>
