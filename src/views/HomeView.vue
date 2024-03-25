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
				<p class="text-20px font-bold text-center">AI问答</p>
				<el-input
					label="问题"
					v-model="textGeneratorInput"
					placeholder="输入问题"
					clearable
					type="textarea"
					resize="none"
					@change="changeTextGeneratorInput"
				></el-input>
				<el-input
					label="内容"
					v-model="textGeneratorInput"
					type="textarea"
					placeholder="输入内容"
					clearable
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
				<p class="text-16px font-bold mt-10px">{{ textGeneratorOut.answer }}</p>
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
import {
	pipeline,
	env,
	TranslationPipeline,
	QuestionAnsweringPipeline
} from '@xenova/transformers';

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

let tsbpipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

let tsbModelsResources = ref<Record<Progress['file'], Progress>>({});

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

type TextGeneratorOutput = {
	score: number;
	start: number;
	end: number;
	answer: string;
};

const textGeneratorInput = ref('');

const textGeneratorLoading = ref(false);

const textGeneratorOut = ref<TextGeneratorOutput>({
	score: 0,
	start: 0,
	end: 0,
	answer: ''
});

let tgpipe: QuestionAnsweringPipeline;

async function handleTextGenerator(text: string) {
	textGeneratorLoading.value = true;
	textGeneratorOut.value = (await tgpipe(
		`What proportion of the planet's rainforests are found in the Amazon?`,
		`The Amazon rainforest (Portuguese: Floresta Amazônica or Amazônia; Spanish: Selva Amazónica, Amazonía or usually Amazonia; French: Forêt amazonienne; Dutch: Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist broadleaf forest that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in four nations contain "Amazonas" in their names. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species.`
	)) as TextGeneratorOutput;
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
	// env.remoteHost = 'http://81.71.85.68:7010/';

	// env.remotePathTemplate = 'models/Xenova/opus-mt-zh-en/';

	// env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	// tspipe = await pipeline('translation', 'Xenova/opus-mt-zh-en', {
	// 	progress_callback: (x: Progress) => {
	// 		tsModelsResources.value[x.file] = x;
	// 		if (x.status === 'initiate' || x.status === 'download') {
	// 			tsModelsResources.value[x.file].progress = 0;
	// 		}
	// 		if (x.status === 'done') {
	// 			tsModelsResources.value[x.file].progress = 100;
	// 		}
	// 	}
	// });

	env.remoteHost = 'http://81.71.85.68:7010/';

	env.remotePathTemplate = 'models/Xenova/opus-mt-en-zh/';

	env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	tsbpipe = await pipeline('translation', 'Xenova/Xenova/opus-mt-en-zh', {
		progress_callback: (x: Progress) => {
			tgModelsResources.value[x.file] = x;
			if (x.status === 'initiate' || x.status === 'download') {
				tsbModelsResources.value[x.file].progress = 0;
			}
			if (x.status === 'done') {
				tsbModelsResources.value[x.file].progress = 100;
			}
		}
	});

	env.remoteHost = 'http://81.71.85.68:7010/';

	env.remotePathTemplate = 'models/Xenova/distilbert-base-cased-distilled-squad/';

	env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	tgpipe = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad', {
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
