<template>
	<div>
		<div
			class="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 text-gray-900 shadow dark:bg-gray-800 dark:text-white sm:p-8"
		>
			<h2 class="text-2xl font-bold">Upload file</h2>
			<form class="mt-8 space-y-6" @submit.prevent="onSubmit" ref="form">
				<input type="file" id="name" required ref="fileInput" />
				<BaseButton type="submit" :color="ButtonColor.Primary">Upload</BaseButton>
			</form>
			<div>
				<BaseAlert v-if="blob" :type="AlertType.Success">
					<strong>Successfully uploaded blob!<br /></strong
					><a :href="blob.url" class="text-blue-700 hover:underline">{{ blob.url }}</a>
				</BaseAlert>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton, { ButtonColor } from './base/button.vue';
import BaseAlert, { AlertType } from './base/alert.vue';

import { api } from '@lib/helpers';
import { ref } from 'vue';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

const form = ref<HTMLFormElement>();
const fileInput = ref<HTMLInputElement>();
const blob = ref<PutBlobResult>();

async function onSubmit() {
	if (!form.value?.checkValidity()) {
		form.value?.reportValidity();
		return;
	}

	if (!fileInput.value?.files?.length) {
		return;
	}

	const file = fileInput.value?.files[0];

	if (!file) {
		return;
	}

	const newBlob = await upload(file.name, file, {
		access: 'public',
		handleUploadUrl: api('blob'),
		clientPayload: JSON.stringify({
			parentId: null,
		}),
	});

	blob.value = newBlob;
}
</script>
