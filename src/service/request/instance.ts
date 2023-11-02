import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { REFRESH_TOKEN_CODE } from './config';
import {
	handleAxiosError,
	handleBackendError,
	handleResponseError,
	handleServiceResult,
	transformRequestData
} from './handles';
import { localStg } from '@/utils';
import { handleRefreshToken } from './helpers';

/**
 * 封装axios请求类
 */
export default class CustomAxiosInstance {
	/**
	 * @param axiosConfig - axios配置
	 * @param backendConfig - 后端返回的数据配置
	 */

	instance: AxiosInstance;

	backendConfig: Service.BackendResultConfig;

	constructor(
		axiosConfig: AxiosRequestConfig,
		backendConfig: Service.BackendResultConfig = {
			codeKey: 'code',
			dataKey: 'data',
			msgKey: 'message',
			successCode: 200
		}
	) {
		this.backendConfig = backendConfig;
		this.instance = axios.create(axiosConfig);
		this.setInterceptor();
	}

	setInterceptor() {
		/** 设置请求拦截器 */
		this.instance.interceptors.request.use(
			async (config) => {
				const handleConfig = { ...config };
				if (handleConfig.headers) {
					// 数据转换
					const contentType = handleConfig.headers['Content-Type'] as ApiCommon.ContentType;
					handleConfig.data = await transformRequestData(handleConfig.data, contentType);
					// 设置token
					handleConfig.headers.Accesstoken = localStg.get('token') || '';
				}
				return handleConfig;
			},
			(axiosError: AxiosError) => {
				const error = handleAxiosError(axiosError);
				return handleServiceResult(error, null);
			}
		);
		/** 设置响应拦截器 */
		this.instance.interceptors.response.use(
			(async (response) => {
				const { status } = response;
				console.log('响应', response);
				if (status === 200 || status < 300 || status === 304 || status === 201) {
					const backend = response.data;
					const { codeKey, dataKey, successCode } = this.backendConfig;
					if (!backend[codeKey]) {
						return handleServiceResult(null, backend);
					}
					// 请求成功
					if (backend[codeKey] === successCode) {
						return handleServiceResult(null, backend[dataKey]);
					}

					// token失效, 刷新token
					if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
						const config = await handleRefreshToken(response.config);
						if (config) {
							return this.instance.request(config);
						}
					}

					const error = handleBackendError(backend, this.backendConfig);
					return handleServiceResult(error, null);
				}
				const error = handleResponseError(response);
				return handleServiceResult(error, null);
			}) as (response: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>,
			(axiosError: AxiosError) => {
				const error = handleAxiosError(axiosError);
				return handleServiceResult(error, null);
			}
		);
	}
}
