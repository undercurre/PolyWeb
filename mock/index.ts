import api from './api';
import Mock from 'better-mock/dist/mock.mp';

export function setupMockServer() {
	api.forEach((item) => {
		Mock.mock(item.url, item.method, item.response);
	});
}
