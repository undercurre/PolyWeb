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
			<el-progress
				v-for="item in Object.keys(modelsResources)"
				:key="item"
				:text-inside="true"
				:stroke-width="26"
				:percentage="modelsResources[item].progress"
			/>
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

type Progress = {
	status: 'progress' | 'done' | 'initiate' | 'download';
	file: string;
	loaded?: number;
	progress?: number;
	total?: number;
	name: string;
};

let modelsResources = ref<Record<Progress['file'], Progress>>({});

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
	env.remoteHost = 'http://81.71.85.68:7010/';

	env.remotePathTemplate = 'models/Xenova/opus-mt-zh-en/';

	env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	pipe = await pipeline('translation', 'Xenova/opus-mt-zh-en', {
		progress_callback: (x: Progress) => {
			modelsResources.value[x.file] = x;
			if (x.status === 'initiate' || x.status === 'download') {
				modelsResources.value[x.file].progress = 0;
			}
			if (x.status === 'done') {
				modelsResources.value[x.file].progress = 100;
			}
		}
	});
});
</script>
