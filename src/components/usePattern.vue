<template>
	<div>
		<h1>Strategy Actions Example</h1>
		<el-button @click="executeActions">Execute Strategy Actions</el-button>
		<h3>请打开控制台观察，策略模式</h3>
	</div>
</template>

<script lang="ts" setup>
import { exeStrategyActions } from '../utils'; // 替换为正确的路径

const executeActions = () => {
	const strategyActions: Array<Common.StrategyAction> = [
		[true, () => console.log('Action 1 executed')],
		[false, () => console.log('Action 2 executed')],
		[true, () => console.log('Action 3 executed')]
		// ... more strategy actions
	];

	exeStrategyActions(strategyActions);
};
</script>
