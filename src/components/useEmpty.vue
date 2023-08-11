<template>
	<h3 v-if="!empty">似乎有点什么~~~~</h3>
	<el-empty v-if="empty">
		<el-button
			class="mt-20px"
			v-loading.fullscreen.lock="fullscreenLoading"
			type="primary"
			@click="openFullScreen1"
		>
			Loading
		</el-button>
	</el-empty>
	<h4 v-if="!empty">温馨提示：加载出两秒后重置</h4>
</template>

<script lang="ts" setup>
import { useLoadingEmpty } from '../hooks';

const { empty, setEmpty, loading: fullscreenLoading, startLoading, endLoading } = useLoadingEmpty();

const openFullScreen1 = () => {
	startLoading();
	setTimeout(() => {
		endLoading();
		setEmpty(false);
	}, 2000);
	setTimeout(() => {
		setEmpty(true);
	}, 4000);
};
</script>
