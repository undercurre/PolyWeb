<template>
	<el-input v-model="input" @change="changeInput"></el-input>
	<div>{{ out }}</div>
</template>

<script lang="ts" setup>
import { pipeline, env, TranslationPipeline } from '@xenova/transformers';

const input = ref('');

const out = ref('');

let pipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

async function changeInput(value: string) {
	out.value = (await pipe(value)) as string;
}

onMounted(async () => {
	env.allowLocalModels = true;
	env.allowRemoteModels = false;
	env.localModelPath = 'models/';
	env.backends.onnx.wasm.wasmPaths = 'file/';

	pipe = await pipeline('translation', 'Xenova/opus-mt-zh-en');
});
</script>
async
