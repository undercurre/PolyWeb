<template>
	<el-row :gutter="20">
		<el-col :span="8"
			><div class="grid-content ep-bg-purple" />
			<div class="w-full h-full p-20px box-border">
				<p class="text-20px font-bold text-center">翻译</p>
				<el-input
					label="原文"
					v-model="translationInput"
					placeholder="输入要翻译的文本,按回车键翻译"
					clearable
					type="textarea"
					resize="none"
					@change="changeTranslationInput"
				></el-input>
				<el-button
					class="w-full mt-10px"
					type="primary"
					:loading="translationLoading"
					@click="handleTranslation(translationInput)"
					>翻译</el-button
				>
				<p class="text-16px font-bold mt-10px">{{ translationOut[0].translation_text }}</p>
			</div>
			<el-progress
				v-for="item in Object.keys(tsModelsResources)"
				:key="item"
				:text-inside="true"
				:stroke-width="26"
				:percentage="tsModelsResources[item].progress"
			/>
		</el-col>
		<el-col :span="8"
			><div class="grid-content ep-bg-purple" />
			<div class="w-full h-full p-20px box-border">
				<p class="text-20px font-bold text-center">文本生成</p>
				<el-input
					label="原文"
					v-model="textGeneratorInput"
					placeholder="输入提示词"
					clearable
					type="textarea"
					resize="none"
					@change="changeTextGeneratorInput"
				></el-input>
				<el-button
					class="w-full mt-10px"
					type="primary"
					:loading="textGeneratorLoading"
					@click="handleTextGenerator(textGeneratorInput)"
					>提交</el-button
				>
				<p class="text-16px font-bold mt-10px">{{ textGeneratorOut[0].translation_text }}</p>
			</div>
			<el-progress
				v-for="item in Object.keys(tgModelsResources)"
				:key="item"
				:text-inside="true"
				:stroke-width="26"
				:percentage="tgModelsResources[item].progress ?? 0"
			/>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { pipeline, env, TranslationPipeline } from '@xenova/transformers';

type Progress = {
	status: 'progress' | 'done' | 'initiate' | 'download';
	file: string;
	loaded?: number;
	progress?: number;
	total?: number;
	name: string;
};

type translationOutput = { translation_text: String };

const translationInput = ref('');

const translationLoading = ref(false);

const translationOut = ref<translationOutput[]>([{ translation_text: '' }]);

let tspipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

let tsModelsResources = ref<Record<Progress['file'], Progress>>({});

async function handleTranslation(text: string) {
	translationLoading.value = true;
	translationOut.value = (await tspipe(text)) as translationOutput[];
	setTimeout(() => {
		translationLoading.value = false;
	}, 1200);
}

async function changeTranslationInput(value: string) {
	translationLoading.value = true;
	handleTranslation(value);
}

const textGeneratorInput = ref('');

const textGeneratorLoading = ref(false);

const textGeneratorOut = ref<translationOutput[]>([{ translation_text: '' }]);

let tgpipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

async function handleTextGenerator(text: string) {
	textGeneratorLoading.value = true;
	textGeneratorOut.value = (await tgpipe(text)) as translationOutput[];
	setTimeout(() => {
		textGeneratorLoading.value = false;
	}, 1200);
}

async function changeTextGeneratorInput(value: string) {
	textGeneratorLoading.value = true;
	handleTextGenerator(value);
}

let tgModelsResources = ref<Record<Progress['file'], Progress>>({});

onMounted(async () => {
	env.remoteHost = 'http://81.71.85.68:7010/';

	env.remotePathTemplate = 'models/Xenova/opus-mt-zh-en/';

	env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	tspipe = await pipeline('translation', 'Xenova/opus-mt-zh-en', {
		progress_callback: (x: Progress) => {
			tsModelsResources.value[x.file] = x;
			if (x.status === 'initiate' || x.status === 'download') {
				tsModelsResources.value[x.file].progress = 0;
			}
			if (x.status === 'done') {
				tsModelsResources.value[x.file].progress = 100;
			}
		}
	});

	tgpipe = await pipeline('text-generation', 'Xenova/llama-160m', {
		progress_callback: (x: Progress) => {
			tgModelsResources.value[x.file] = x;
			if (x.status === 'initiate' || x.status === 'download') {
				tgModelsResources.value[x.file].progress = 0;
			}
			if (x.status === 'done') {
				tgModelsResources.value[x.file].progress = 100;
			}
		}
	});
});
</script>
