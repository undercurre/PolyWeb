<template>
	<div>
		<p>Window Width: {{ windowSize.width }}px</p>
		<p>Window Height: {{ windowSize.height }}px</p>
	</div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core';

// 使用useWindowSize获取窗口尺寸信息
const windowSize = useWindowSize();
</script>
