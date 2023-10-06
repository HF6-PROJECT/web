<template>
	<div
		v-if="showMenu"
		ref="menu"
		tabindex="-1"
		:style="{ top: `${top}px`, left: `${left}px` }"
		class="absolute z-10 block w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
	>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';
import bus from '@lib/contextMenu';

const menu = ref<HTMLElement | null>(null);
const showMenu = ref(false);
const top = ref(0);
const left = ref(0);

onClickOutside(menu, closeMenu);

function setMenu(x: number, y: number) {
	left.value = x;
	top.value = y;
}

function closeMenu() {
	showMenu.value = false;
}

function openMenu(e: MouseEvent) {
	showMenu.value = true;

	nextTick(() => {
		if (!menu.value) return;
		if (!e.currentTarget || !(e.currentTarget instanceof HTMLElement)) return;

		const currentTargetRect = e.currentTarget.getBoundingClientRect();
		const offsetX = e.pageX - currentTargetRect.left;
		const offsetY = e.pageY - currentTargetRect.top;

		setMenu(offsetX, offsetY);

		bus.off(closeMenu);
		bus.emit();
		bus.on(closeMenu);
	});
}

defineExpose({
	openMenu,
	closeMenu,
});
</script>
