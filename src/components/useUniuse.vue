<template>
  <p>响应式的暗黑主题偏好：{{ prefersDark }}</p>
</template>

<script lang="ts" setup>
import { usePreferredDark } from "@uni-helper/uni-use";

const prefersDark = usePreferredDark();
</script>
