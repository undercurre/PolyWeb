<template>
	<p>随机数字: {{ randomNum }}</p>
	<p>倒计时: {{ countdown }}</p>
	<p>数字对应汉字: {{ hanCharacter }}</p>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import { getRandomInteger, getHanByNumber, transformToTimeCountDown } from '../utils';

// 组件逻辑
const randomNum = ref(getRandomInteger(10));
const countdown = ref(transformToTimeCountDown(150));
const hanCharacter = ref(getHanByNumber(5));

onMounted(() => {
	// 在组件挂载后更新倒计时
	const interval = setInterval(() => {
		countdown.value = transformToTimeCountDown(
			Math.max(
				0,
				parseInt(countdown.value.split(':')[0]) * 60 + parseInt(countdown.value.split(':')[1]) - 1
			)
		);
	}, 1000);
	// 卸载组件时清除计时器以防止内存泄漏
	return () => {
		clearInterval(interval);
	};
});
</script>
