import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import api from './api';

export function setupMockServer() {
	console.log('加载mock');
	createProdMockServer(api);
}
