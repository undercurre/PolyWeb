<template>
	<h2>Tree Helper Example</h2>
	<el-tree :data="treeData" :props="defaultProps" />
</template>

<script lang="ts" setup>
import { flattenToTree, flattenTree, type TreeHelperConfig } from '../utils';

const defaultProps = {
	children: 'children',
	label: 'name'
};

// 定义树形结构
interface TreeNode {
	id: number;
	name: string;
	parentId?: number;
	children?: TreeNode[];
}

// 一个简单的样本数据
const rawData: TreeNode[] = [
	{ id: 1, name: 'Node 1' },
	{ id: 2, name: 'Node 2', parentId: 1 },
	{ id: 3, name: 'Node 3', parentId: 1 },
	{ id: 4, name: 'Node 4', parentId: 2 },
	{ id: 5, name: 'Node 5', parentId: 2 },
	{ id: 6, name: 'Node 6', parentId: 3 }
];

// 配置树形键
const treeConfig: TreeHelperConfig<TreeNode> = {
	idKey: 'id',
	childrenKey: 'children',
	parentKey: 'parentId'
};

// 把数据转成树
const treeData = flattenToTree(rawData, treeConfig);

console.log('treeData', treeData);

const flattenData = flattenTree(treeData);

console.log('flattenData', flattenData);
</script>
