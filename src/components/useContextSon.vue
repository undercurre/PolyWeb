<template>
	<div>
		<h4>Child</h4>
		<el-badge :value="user.age" class="item">
			<el-button @click="add">{{ user.name }}</el-button>
		</el-badge>
	</div>
</template>

<script lang="ts" setup>
interface TestInfo {
	name: string;
	age: number;
}
import { useContext } from '../hooks';

const { useInject: useUser } = useContext<Ref<TestInfo>>('testInfo');
const user = useUser();

function add() {
	user.value.age++;
}
</script>
