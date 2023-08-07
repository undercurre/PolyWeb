<script setup lang="ts"></script>

<template>
	<div class="flex flex-col items-center">
		<img class="w-125px h-125px block mt-0 mb-2em mx-auto" src="@/assets/logo.png" />
		<nav class="w-full text-12px text-center mt-2em">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
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
			background-color: rgba($color: rgb(4 4 247), $alpha: 65%);
		}

		&:first-of-type {
			border: 0;
		}
	}
}
</style>
