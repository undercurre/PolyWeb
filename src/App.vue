<script setup lang="ts"></script>

<template>
  <div>
    <img class="block mt-0 mb-2em mx-auto" src="@/assets/logo.png" width="125" height="125" />
    <nav class="w-full 
    text-12px text-center mt-2em">
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
      background-color: rgba($color: rgb(0 0 255), $alpha: 65%);
    }

    &:first-of-type {
      border: 0;
    }
  }
}
</style>
