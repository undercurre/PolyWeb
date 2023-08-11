<template>
	<div>
		<h2>Grandparent</h2>
		<el-badge :value="user.age" class="item">
			<el-button @click="add">{{ user.name }}</el-button>
		</el-badge>
		<UseContextFather />
	</div>
</template>

<script lang="ts" setup>
import { useContext } from '../hooks';

interface TestInfo {
	name: string;
	age: number;
}

const { useProvide: provideUser } = useContext<Ref<TestInfo>>('testInfo');
const user = ref({ name: 'John', age: 30 });
provideUser(user);

function add() {
	user.value.age++;
}
</script>
