<template>
	<div>
		<h1>Reload Example</h1>
		<p>已经更新: {{ reloadFlag }}</p>
		<el-button @click="handleImmediateReload">Reload Immediately</el-button>
		<el-button @click="handleDelayedReload">Reload After 3 Seconds</el-button>
	</div>
</template>

<script lang="ts" setup>
import { useReload } from '../hooks'; // 替换为正确的路径

const { reloadFlag, handleReload } = useReload();

const handleImmediateReload = () => {
	handleReload();
};

const handleDelayedReload = () => {
	handleReload(3000); // 3000 milliseconds = 3 seconds
};
</script>
