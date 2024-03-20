<template>
	<el-row :gutter="20">
		<el-col :span="8"
			><div class="grid-content ep-bg-purple" />
			<div class="w-full h-full p-20px box-border">
				<p class="text-20px font-bold text-center">翻译</p>
				<el-input
					label="原文"
					v-model="input"
					placeholder="输入要翻译的文本,按回车键翻译"
					clearable
					type="textarea"
					resize="none"
					@change="changeInput"
				></el-input>
				<el-button
					class="w-full mt-10px"
					type="primary"
					:loading="translationLoading"
					@click="handleTranslation(input)"
					>翻译</el-button
				>
				<p class="text-16px font-bold mt-10px">{{ out[0].translation_text }}</p>
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { pipeline, env, TranslationPipeline } from '@xenova/transformers';

type translationOutput = { translation_text: String };

const input = ref('');

const translationLoading = ref(false);

const out = ref<translationOutput[]>([{ translation_text: '' }]);

let pipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

async function handleTranslation(text: string) {
	translationLoading.value = true;
	out.value = (await pipe(text)) as translationOutput[];
	setTimeout(() => {
		translationLoading.value = false;
	}, 1200);
}

async function changeInput(value: string) {
	translationLoading.value = true;
	handleTranslation(value);
}

onMounted(async () => {
	env.allowLocalModels = true;
	env.allowRemoteModels = false;
	env.localModelPath = 'models/';
	env.backends.onnx.wasm.wasmPaths = 'file/';

	pipe = await pipeline('translation', 'Xenova/opus-mt-zh-en');
});
</script>
