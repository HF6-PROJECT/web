<template>
	<BaseModal ref="modal" @close="close">
		<h3 class="mb-4 text-xl font-medium">
			{{ t('shareItemModal.share') + ' "' + item.name + '"' }}
		</h3>
		<form class="mb-4 flex flex-col" @submit.prevent="shareFile" ref="form">
			<div class="flex">
				<div class="flex flex-grow">
					<BaseInput
						id="email"
						type="email"
						class="grid flex-grow items-center"
						v-model="search"
						:required="true"
						:errors="errorObject?.errors.email"
						:placeholder="t('shareItemModal.addPeople')"
					></BaseInput>
				</div>
				<BaseButton
					v-if="search.length"
					class="ml-2 h-11 px-4 py-2"
					type="submit"
					:color="ButtonColor.Primary"
					>+</BaseButton
				>
			</div>
			<ErrorAlert
				v-if="errorObject"
				style="padding: 0; margin-top: 1rem"
				:errorObject="errorObject"
			></ErrorAlert>
		</form>
		<div class="mb-8 flex flex-col space-y-4">
			<h3 class="">{{ t('shareItemModal.peopleWithAccess') }}</h3>
			<div v-if="usersWithAccess.length === 0" class="flex justify-center">
				<div role="status">
					<svg
						aria-hidden="true"
						class="mr-2 h-8 w-8 animate-spin fill-primary-600 text-gray-200 dark:text-gray-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
				</div>
			</div>
			<div v-else class="flex h-12 w-full" v-for="user in usersWithAccess" :key="user.id">
				<div class="mr-2 flex max-h-full rounded-full bg-gray-800 text-sm">
					<div
						:style="`background-color: ${getUserColorByInitials(user.initials)}`"
						class="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
					>
						<span class="font-medium text-neutral-100 dark:text-neutral-950">{{
							user.initials
						}}</span>
					</div>
				</div>

				<div class="flex flex-col">
					<span
						>{{ user.name }}
						<strong v-if="user.id === item.ownerId">({{ t('shareItemModal.owner') }})</strong></span
					>
					<span>{{ user.email }}</span>
				</div>
				<div v-if="user.id !== item.ownerId" class="ml-auto">
					<BaseButton
						type="button"
						:color="ButtonColor.Primary"
						@click="deleteSharing(user.sharingId)"
						>x</BaseButton
					>
				</div>
			</div>
		</div>

		<BaseButton type="submit" :color="ButtonColor.Primary" @click="close">{{
			t('shareItemModal.confirm')
		}}</BaseButton>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import BaseModal from '@components/base/modal.vue';
import BaseInput from '@components/base/input.vue';
import BaseButton, { ButtonColor } from '@components/base/button.vue';
import ErrorAlert, { type ErrorObject } from '@components/base/errorAlert.vue';
import { t } from '@lib/i18n';
import type { ItemClass } from '@lib/items/items';
import { fetchFromApi, getInitialsByName, getUserColorByInitials } from '@lib/helpers';

const props = defineProps({
	item: {
		type: Object as PropType<ItemClass>,
		required: true,
	},
});

defineExpose({
	open,
	close,
});

type userWithAccess = {
	id: number;
	name: string;
	initials: string;
	email: string;
	sharingId?: number;
};

const usersWithAccess = ref<userWithAccess[]>([]);
const search = ref('');
const modal = ref<InstanceType<typeof BaseModal>>();
const form = ref<HTMLFormElement>();
const errorObject = ref<null | ErrorObject>(null);

async function getItem() {
	usersWithAccess.value = [];

	const response = await fetchFromApi(`item/${props.item.id}/sharings`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});

	if (!response.ok) {
		if (response.status >= 400 && response.status < 500) {
			throw new Error((await response.json()).error);
		}

		throw new Error(await response.text());
	}

	const rawItem = await response.json();

	usersWithAccess.value.push({
		id: rawItem.owner.id,
		name: rawItem.owner.name,
		email: rawItem.owner.email,
		initials: getInitialsByName(rawItem.owner.name),
	});

	rawItem.ItemSharing.forEach(
		(sharing: { id: number; user: { id: number; name: string; email: string } }) => {
			usersWithAccess.value.push({
				id: sharing.user.id,
				sharingId: sharing.id,
				name: sharing.user.name,
				email: sharing.user.email,
				initials: getInitialsByName(sharing.user.name),
			});
		},
	);
}

async function shareFile() {
	errorObject.value = null;

	if (!form.value?.checkValidity() || errorObject.value) {
		form.value?.reportValidity();
		return;
	}

	try {
		const response = await fetchFromApi('sharing', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				itemId: props.item.id,
				email: search.value,
			}),
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();
				errorObject.value = json as ErrorObject;

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		search.value = '';

		getItem();

		// TODO: Show success toast
	} catch (e) {}
}

async function deleteSharing(sharingId: number | undefined) {
	if (!sharingId) {
		return;
	}

	try {
		const response = await fetchFromApi('sharing/' + sharingId, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			if (response.status >= 400 && response.status < 500) {
				const json = await response.json();

				throw new Error(json.error);
			}

			throw new Error(await response.text());
		}

		getItem().catch(() => close());

		// TODO: Show success toast
	} catch (e) {}
}

function open() {
	getItem();

	search.value = '';

	modal.value?.open();
}

function close() {
	modal.value?.close(false);
}
</script>
