<template>
	<p class="mt-10px">
		<span>{{ TestNum }} is {{ isNum ? '' : 'not' }} Number</span>
	</p>
</template>

<script lang="ts" setup>
import { isNumber } from '../utils';

const TestNum = 123;
const isNum = isNumber(TestNum);
</script>
