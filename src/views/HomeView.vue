<script setup lang="ts">
import { showToast } from 'vant';
import 'vant/es/toast/style';

const openVn = () => {
	ElMessage({
		message: h('p', null, [h('span', null, '不需要手动引入并引入css')])
	});
};
</script>

<template>
	<div>
		<h3 class="text-left">Based on Vue3+TS+Vite</h3>
		<h4 class="text-10px text-left">using Vue-router</h4>
		<useStore></useStore>
		<useAutoImport></useAutoImport>
		<van-button @click="showToast('记得部分组件要手动引入并引入css')" class="mt-10px" type="success"
			>Vant 成功按钮</van-button
		>
		<el-button @click="openVn" class="mt-10px ml-10px" size="large" type="primary"
			>Element Plus</el-button
		>
		<h4 class="text-20px text-left text-amber">Using Iconify</h4>
		<UseIconify></UseIconify>
	</div>
</template>
