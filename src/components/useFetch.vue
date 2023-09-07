<template>
	<u-button @click="handleLoginBtn">Login</u-button>
</template>

<script setup lang="ts">
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const getResponse = (res: UniApp.Request, config: UniApp.RequestOptions): AxiosResponse => {
  const { statusCode, errMsg } = res;
  const response: AxiosResponse = {
    ...res,
    status: statusCode,
    statusText: errMsg,
    config,
    request: null,
  };

  return response;
};

axios.defaults.adapter = (config: AxiosRequestConfig) => {
  if (!uni) {
    throw new Error("please use this in uni-app project!");
  }
  return new Promise((resolve, reject) => {
    const { baseURL, url, headers, data, params } = config;
    const uniConfig: UniApp.RequestOptions = {
      ...config,
      url: (baseURL || '') + url,
      header: headers,
    };

    if (data || params) {
      try {
        uniConfig.data = JSON.parse(data || params);
      } catch (e) {
        uniConfig.data = data || params;
      }
    }
    uni.request({
      ...uniConfig,
      success(res) {
        const response = getResponse(res, config);
        resolve(response);
      },
      fail(res) {
        const response = getResponse(res, config);
        reject(response);
      },
    });
  });
};

function handleLoginBtn() {}
</script>
