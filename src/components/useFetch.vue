<template>
	<u-button @click="handleLoginBtn">Login</u-button>
	<p>{{ responseShow }}</p>
</template>

<script setup lang="ts">
import axios, {
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';

import uniAdapter from 'uni-axios-adapter-all';

const responseShow = ref('');

axios.defaults.adapter = uniAdapter;

function handleLoginBtn() {
	// 定义请求配置
	const requestOptions = {
		url: 'https://jsonplaceholder.typicode.com/posts/1', // 替换成你要请求的 URL
		method: 'GET'
	};

	// 发送 GET 请求
	axios(requestOptions)
		.then((response) => {
			// 请求成功处理
			responseShow.value = JSON.stringify(response.data);
			console.log('Response Data:', response.data);
			console.log('Status Code:', response.status);
		})
		.catch((error) => {
			// 请求失败处理
			console.error('Error:', error);
		});
}
</script>
