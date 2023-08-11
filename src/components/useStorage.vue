<template>
	<div>
		<h3>LocalStorage and SessionStorage Viewer</h3>

		<div class="w-100vw">
			<div>
				<h4>encrypto localStorage</h4>
				<ul>
					<li v-for="(value, key) in localStorage" :key="key">
						<strong>{{ key }}</strong
						>: {{ value }}
					</li>
				</ul>
				<h4>decrypto localStorage</h4>
				<ul>
					<li v-for="(value, key) in localStorage" :key="key">
						<strong>{{ key }}</strong
						>: {{ decrypto(value) }}
					</li>
				</ul>
			</div>

			<div class="storage-type">
				<h4>sessionStorage</h4>
				<ul>
					<li v-for="(value, key) in sessionStorage" :key="key">
						<strong>{{ key }}</strong
						>: {{ value }}
					</li>
				</ul>
			</div>

			<ElButton @click="handleClear">clear localStorage</ElButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { decrypto, localStg } from '../utils';

// Access localStorage and sessionStorage
const localStorage = ref(window.localStorage); // Storage对象不是普通的 JavaScript 对象，无法响应式
const sessionStorage = ref(window.sessionStorage);

const handleClear = () => {
	localStg.clear(); // Clear localStorage
	localStorage.value = { ...window.localStorage }; // Manually trigger update
};

onMounted(() => {
	window.addEventListener('storage', () => {
		localStorage.value = { ...window.localStorage };
	});
});
</script>
