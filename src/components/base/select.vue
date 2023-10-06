<template>
	<div>
		<BaseLabel class="mb-2" :for="props.id"><slot name="label" /></BaseLabel>
		<select
			:id="id"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			:value="modelValue"
			@input="updateValue"
			@change="change"
			:required="props.required"
		>
			<slot name="options" />
		</select>
		<p v-if="props.errors" class="ml-2 mt-2 text-xs text-red-500">
			<template v-for="error in props.errors"> {{ error }}<br /> </template>
		</p>
	</div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import BaseLabel from './label.vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	modelValue: {
		type: String,
		required: true,
	},
	errors: {
		type: Array as PropType<string[] | undefined>,
	},
	required: {
		type: Boolean,
		default: false,
	},
});

// Emits
const emit = defineEmits(['update:modelValue', 'change']);
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
};
const change = (_event: Event) => {
	emit('change');
};
</script>
