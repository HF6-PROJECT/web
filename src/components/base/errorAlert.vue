<template>
	<BaseAlert v-if="errorObject && errorObject.errors._" :type="AlertType.Danger">
		<template v-for="error in errorObject.errors._"> {{ error }}<br /> </template>
	</BaseAlert>
</template>

<script lang="ts">
export type ErrorObject = {
	error: string;
	errors: {
		_?: string[];
		[key: string]: string[];
	};
	statusCode: number;
};
</script>

<script setup lang="ts">
import { type PropType } from 'vue';
import BaseAlert, { AlertType } from './alert.vue';

defineProps({
	errorObject: {
		type: Object as PropType<ErrorObject>,
		required: true,
	},
});
</script>
