<template>
	<ElButton type="primary" @click="handleLoginBtn">Login</ElButton>
</template>

<script setup lang="ts">
const { login } = useAuthStore();

function handleLoginBtn() {
	login('Admin', 'admin123');
}
</script>
