<template>
  <div>
    <p v-if="isDevelopment">当前是开发环境</p>
    <p v-if="isProduction">当前是生产环境</p>
  </div>
</template>

<script setup lang="ts">
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// 在这里可以根据环境变量进行不同的操作
</script>
