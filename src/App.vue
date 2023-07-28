<script setup lang="ts">
import useScssVue from './components/useScss.vue';
import useUnocssVue from './components/useUnocss.vue';

</script>

<template>
  <div>
    <img class="block mt-0 mb-2em mx-auto" src="@/assets/logo.png" width="125" height="125" />
    <useUnocssVue></useUnocssVue>
    <useScssVue></useScssVue>
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
      background-color: rgba($color: #0622f7, $alpha: 0.65);
    }

    &:first-of-type {
      border: 0;
    }
  }
}

</style>
