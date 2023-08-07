<script setup lang="ts">
import useStore from '@/components/useStore.vue';
import useAutoImport from '@/components/useAutoImport.vue';
</script>

<template>
	<div>
		<h3 class="text-left">Based on Vue3+TS+Vite</h3>
		<h4 class="text-10px text-left">using Vue-router</h4>
		<useStore></useStore>
		<useAutoImport></useAutoImport>
	</div>
</template>
