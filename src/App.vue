<script setup lang="ts">
// import logo from '@/assets/logo.png';
</script>

<template>
	<div>
		<RouterView />
	</div>
</template>

<style lang="scss" scoped>
nav {
	a.router-link-exact-active {
		&:hover {
			background: transparent;
		}
	}

	a {
		display: inline-block;
		padding: 0 1rem;
		border-left: 1px solid $color-border;

		&:hover {
			background-color: rgba($color: #123456, $alpha: 65%);
		}

		&:first-of-type {
			border: 0;
		}
	}
}
</style>
