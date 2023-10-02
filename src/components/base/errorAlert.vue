<template>
	<div>
		<BaseAlert v-if="errorObject && errorObject.errors._" :type="AlertType.Danger">
			<template v-for="error in errorObject.errors._"> {{ error }}<br /> </template>
		</BaseAlert>
	</div>
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

/**
 * @deprecated Use ErrorObject instead
 */
export type DeprecatedErrorObject = {
	error: string;
	message: string;
	statusCode: number;
};

export const isDeprecatedErrorObject = (
	errorObject: Object,
): errorObject is DeprecatedErrorObject => {
	return 'message' in errorObject;
};

export const convertDeprecatedErrorObject = (errorObject: DeprecatedErrorObject): ErrorObject => {
	return {
		error: errorObject.error,
		errors: {
			_: [errorObject.message],
		},
		statusCode: errorObject.statusCode,
	};
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
