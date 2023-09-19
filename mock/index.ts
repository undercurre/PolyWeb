import api from './api';
import Mock from 'better-mock';

export function setupMockServer() {
	console.log('mock加载');
	api.forEach((item) => {
		Mock.mock(item.url, item.method, item.response);
	});
}
