import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue')
		},
		{
			path: '/hooks',
			name: 'hooks',
			component: () => import('../views/HookView.vue')
		},
		{
			path: '/utils',
			name: 'utils',
			component: () => import('../views/UtilView.vue')
		}
	]
});

export default router;
