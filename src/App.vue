<script setup lang="ts">
</script>

<template>
  <img class="block mt-0 mb-2em mx-auto" src="@/assets/logo.png" width="125" height="125" />
  <nav class="w-full text-12px text-center mt-2em">
    <RouterLink class="hover:(bg-transparent) router-link-exact-active" to="/">Home</RouterLink>
    <RouterLink class="hover:(bg-transparent) router-link-exact-active" to="/about">About</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
