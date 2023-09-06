<template>
  <p>当前网络类型：{{ type }}</p>
</template>

<script lang="ts" setup>
import { useNetwork } from "@uni-helper/uni-use";

const {
  type,
  isWifi,
  is2g,
  is3g,
  is4g,
  is5g,
  isEthernet,
  isUnknown,
  isOnline,
  isOffline,
} = useNetwork();
</script>
