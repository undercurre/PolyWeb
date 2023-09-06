<template>
	<div>
		<MyTsxComponent />
	</div>
</template>

<script setup lang="tsx">
import { defineComponent } from 'vue';

const MyTsxComponent = defineComponent({
	render() {
		return <h3 class="text-#FF4400 text-left text-30px">Using TSX</h3>;
	}
});
</script>
