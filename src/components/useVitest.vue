<script setup lang="ts">
defineProps<{
	msg: string;
}>();
</script>

<template>
	<div class="greetings">
		<h1 class="green">{{ msg }}</h1>
		<h3>You’ve successfully created a project with UATP</h3>
	</div>
</template>

<style scoped>
h1 {
	position: relative;
	top: -10px;
	font-weight: 500;
	font-size: 2.6rem;
}

h3 {
	font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
	text-align: center;
}

@media (width >= 1024px) {
	.greetings h1,
	.greetings h3 {
		text-align: left;
	}
}
</style>
