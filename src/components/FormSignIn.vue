<template>
	<div
		class="pt:mt-0 mx-auto flex w-full flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900"
	>
		<a
			:href="url()"
			class="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
		>
			<img :src="asset('images/logo_name.svg')" alt="Logo" class="mr-4 h-11" />
		</a>
		<!-- Card -->
		<div class="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
				{{ $t('auth.login.header') }}
			</h2>
			<form class="mt-8 space-y-6" @submit.prevent="onSubmit" ref="form">
				<BaseInput
					v-model="formFields.email"
					type="email"
					id="email"
					:placeholder="$t('auth.fields.emailPlaceholder')"
					required
					>{{ $t('auth.fields.email') }}</BaseInput
				>
				<BaseInput
					v-model="formFields.password"
					type="password"
					id="password"
					:placeholder="$t('auth.fields.passwordPlaceholder')"
					required
					>{{ $t('auth.fields.password') }}</BaseInput
				>
				<div class="flex flex-wrap items-start">
					<a
						:href="url('auth/forgot-password')"
						class="mt-4 text-left text-sm text-primary-700 hover:underline dark:text-primary-500"
						>{{ $t('auth.link.forgotPassword') }}</a
					>
				</div>
				<BaseButton type="submit" :color="ButtonColor.Primary">{{
					$t('auth.login.submit')
				}}</BaseButton>
				<BaseAlert v-if="errorMessage" :type="AlertType.Danger">{{ errorMessage }}</BaseAlert>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-400">
					{{ $t('auth.link.notRegistered') }}
					<a
						:href="url('auth/register')"
						class="text-primary-700 hover:underline dark:text-primary-500"
						>{{ $t('auth.link.createAccount') }}</a
					>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseInput from './base/input.vue';
import BaseButton, { ButtonColor } from './base/button.vue';
import BaseAlert, { AlertType } from './base/alert.vue';

import { asset, api, url } from '@lib/helpers';
import { ref } from 'vue';

const form = ref<HTMLFormElement>();
const formFields = ref({
	email: '',
	password: '',
});

const errorMessage = ref<null | string>(null);

function onSubmit() {
	errorMessage.value = null;

	fetch(api('auth/login'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(formFields.value),
	})
		.then(async (response) => {
			if (!response.ok) {
				if (response.status === 401 || response.status === 400) {
					const json = await response.json();
					errorMessage.value = json.message;

					throw new Error(json);
				}

				throw new Error(await response.text());
			}

			return response.json();
		})
		.then((data) => {
			console.log('Success:', data);
			window.location.href = url('u');
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}
</script>
