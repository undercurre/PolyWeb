<template>
	<el-button
		class="mt-20px"
		v-loading.fullscreen.lock="fullscreenLoading"
		type="primary"
		@click="openFullScreen1"
	>
		useLoading
	</el-button>
</template>

<script lang="ts" setup>
import { useLoading } from '../hooks';

const { loading: fullscreenLoading, startLoading, endLoading } = useLoading();

const openFullScreen1 = () => {
	startLoading();
	setTimeout(() => {
		endLoading();
	}, 2000);
};
</script>
