<template>
	<u-button @click="handleLoginBtn">Login</u-button>
	<p>{{ responseShow }}</p>
	<p>平台：{{ platform }}</p>
</template>

<script setup lang="ts">
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';
import { method } from 'lodash-es';
import { config } from 'process';

import uniAdapter from 'uni-axios-adapter-all';

const responseShow = ref('');

const platform = ref();

platform.value = uni.getSystemInfoSync().platform;

let axiosInstance: AxiosInstance;

switch (uni.getSystemInfoSync().platform) {
	case 'android':
		axiosInstance = axios.create({
			baseURL: 'https://jsonplaceholder.typicode.com',
			adapter: uniAdapter // 使用自定义适配器
		});
		console.log('运行Android上');
		break;
	case 'ios':
		axios.defaults.adapter = uniAdapter;
		console.log('运行iOS上');
		break;
	case 'windows':
		console.log('运行Windows上');
	default:
		axiosInstance = axios.create({
			baseURL: 'https://jsonplaceholder.typicode.com',
			adapter: uniAdapter // 使用自定义适配器
		});
		console.log('运行在开发者工具上');
		break;
}

function handleLoginBtn() {
	// 发送 GET 请求
	axiosInstance
		.get('/posts/1')
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
