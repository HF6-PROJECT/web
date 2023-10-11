<template></template>

<script setup lang="ts">
import { fetchFromApi, url } from '@lib/helpers';

fetchFromApi('auth/logout', {
	method: 'POST',
	credentials: 'include',
}).then(() => {
	window.location.href = url();
});
</script>
