<template>
	<div class="flex justify-between items-center h-100px">
		<ElSwitch class="pr-10px" v-model="testBool"></ElSwitch>
		<span>{{ testBool }}</span>
	</div>
</template>

<script lang="ts" setup>
import type { ElSwitch } from 'element-plus';
import { useBoolean } from '../hooks';

const { bool: testBool } = useBoolean(false);
</script>
