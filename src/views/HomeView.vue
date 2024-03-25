<template>
	<el-row :gutter="16">
		<el-col :span="12">
			<div class="w-full h-full p-20px box-border">
				<p class="text-20px font-bold text-center">AI Chatbot</p>
				<el-input
					label="原文"
					v-model="translationInput"
					placeholder="输入要翻译的文本,按回车键翻译"
					clearable
					type="textarea"
					:disabled="!isAllComputed"
					resize="none"
				></el-input>
				<el-button
					class="w-full mt-10px"
					type="primary"
					:loading="translationLoading"
					@click="handleTranslation(translationInput)"
					>提交</el-button
				>
				<p class="text-16px font-bold mt-10px">{{ translationOutBack[0].translation_text }}</p>
				<span>范本:英</span>
				<p class="text-14px">
					The Amazon rainforest (Portuguese: Floresta Amazônica or Amazônia; Spanish: Selva
					Amazónica, Amazonía or usually Amazonia; French: Forêt amazonienne; Dutch:
					Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist
					broadleaf forest that covers most of the Amazon basin of South America. This basin
					encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square
					kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory
					belonging to nine nations. The majority of the forest is contained within Brazil, with 60%
					of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in
					Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in
					four nations contain "Amazonas" in their names. The Amazon represents over half of the
					planet's remaining rainforests, and comprises the largest and most biodiverse tract of
					tropical rainforest in the world, with an estimated 390 billion individual trees divided
					into 16,000 species.
				</p>
				<span>范本:中</span>
				<p class="text-14px">
					亚马逊雨林（葡萄牙语：Floresta Amazónica或Amazônia；西班牙语：Selva
					Amazó的nica、Amazonía或通常为Amazonia；法语：Forêt
					amazonienne；荷兰语：Amazoneregenwoud），在英语中也被称为亚马逊或亚马逊丛林，是一片潮湿的阔叶林，覆盖了南美洲亚马逊盆地的大部分地区。该流域面积为7000000平方公里（2700000平方英里），其中5500000平方公里（2100000平方公里）被雨林覆盖。这个地区包括九个国家的领土。大部分森林位于巴西境内，占雨林的60%，其次是秘鲁，占13%，哥伦比亚占10%，委内瑞拉、厄瓜多尔、玻利维亚、圭亚那、苏里南和法属圭亚那也有少量森林。四个国家的州或部门的名称中都包含“亚马逊人”。亚马逊代表了地球上一半以上的剩余雨林，是世界上最大、生物多样性最强的热带雨林，估计有3900亿棵树木，分为16000种。
				</p>
			</div>
		</el-col>
		<el-col :span="12">
			<p class="text-16px font-bold text-#f40">
				模型加载，这里需要加载很大量的资源，请保持网络连接
			</p>
			<el-progress
				v-for="item in Object.keys(tsModelsResources)"
				:key="item"
				:text-inside="true"
				:format="(value: number) => item"
				:stroke-width="26"
				:percentage="tsModelsResources[item].progress"
			></el-progress>
			<el-progress
				v-for="item in Object.keys(tgModelsResources)"
				:key="item"
				:text-inside="true"
				:format="(value: number) => item"
				:stroke-width="26"
				:percentage="tgModelsResources[item].progress"
			></el-progress>
			<el-progress
				v-for="item in Object.keys(tsbModelsResources)"
				:key="item"
				:text-inside="true"
				:format="(value: number) => item"
				:stroke-width="26"
				:percentage="tsbModelsResources[item].progress"
			></el-progress>
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
	status: 'progress' | 'done' | 'initiate' | 'download' | 'ready';
	file?: string;
	loaded?: number;
	progress?: number;
	total?: number;
	name?: string;
	task?: string;
	model?: string;
};

type translationOutput = { translation_text: String };

const translationInput = ref('亚马逊雨林是什么');

const translationLoading = ref(false);

const translationOut = ref<translationOutput[]>([{ translation_text: '' }]);

const translationOutBack = ref<translationOutput[]>([{ translation_text: '' }]);

let tspipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

let tsModelsResources = ref<Record<string, Progress>>({
	'generation_config.json': {} as Progress,
	'onnx/decoder_model_merged_quantized.onnx': {} as Progress,
	'onnx/encoder_model_quantized.onnx': {} as Progress,
	'config.json': {} as Progress,
	'tokenizer_config.json': {} as Progress,
	'tokenizer.json': {} as Progress
});

let tsbpipe: TranslationPipeline | ((arg0: string) => string | PromiseLike<string>);

let tsbModelsResources = ref<Record<string, Progress>>({
	'generation_config.json': {} as Progress,
	'onnx/decoder_model_merged_quantized.onnx': {} as Progress,
	'onnx/encoder_model_quantized.onnx': {} as Progress,
	'config.json': {} as Progress,
	'tokenizer_config.json': {} as Progress,
	'tokenizer.json': {} as Progress
});

async function handleTranslation(text: string) {
	translationLoading.value = true;
	translationOut.value = (await tspipe(text)) as translationOutput[];
	handleTextGenerator(translationOut.value[0].translation_text as string);
}

async function handleTranslationBack(text: string) {
	translationOutBack.value = (await tsbpipe(text)) as translationOutput[];
	setTimeout(() => {
		translationLoading.value = false;
	}, 1200);
}

type TextGeneratorOutput = {
	score: number;
	start: number;
	end: number;
	answer: string;
};

const textGeneratorOut = ref<TextGeneratorOutput>({
	score: 0,
	start: 0,
	end: 0,
	answer: ''
});

let tgpipe: QuestionAnsweringPipeline;

async function handleTextGenerator(text: string) {
	textGeneratorOut.value = (await tgpipe(
		text,
		`The Amazon rainforest (Portuguese: Floresta Amazônica or Amazônia; Spanish: Selva Amazónica, Amazonía or usually Amazonia; French: Forêt amazonienne; Dutch: Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist broadleaf forest that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in four nations contain "Amazonas" in their names. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species.`
	)) as TextGeneratorOutput;
	handleTranslationBack(textGeneratorOut.value.answer);
}

let tgModelsResources = ref<Record<string, Progress>>({
	'onnx/model_quantized.onnx': {} as Progress,
	'config.json': {} as Progress,
	'tokenizer_config.json': {} as Progress,
	'tokenizer.json': {} as Progress
});

const isAllComputed = computed(() => {
	const all = {
		...tsModelsResources.value,
		...tsbModelsResources.value,
		...tgModelsResources.value
	};
	return Object.values(all).filter((res) => res.progress !== 100).length === 0;
});

onMounted(async () => {
	env.remoteHost = 'http://81.71.85.68:7010/';

	env.remotePathTemplate = 'models/Xenova/opus-mt-zh-en/';

	env.backends.onnx.wasm.wasmPaths = 'http://81.71.85.68:7010/file/';

	tspipe = await pipeline('translation', 'Xenova/opus-mt-zh-en', {
		progress_callback: (x: Progress) => {
			if (x.file) {
				tsModelsResources.value[x.file] = x;
				if (x.status === 'initiate' || x.status === 'download') {
					tsModelsResources.value[x.file].progress = 0;
				}
				if (x.status === 'done') {
					tsModelsResources.value[x.file].progress = 100;
					console.log('ts', x.file);
				}
			}
		}
	});

	env.remotePathTemplate = 'models/Xenova/opus-mt-en-zh/';

	tsbpipe = await pipeline('translation', 'Xenova/opus-mt-en-zh', {
		progress_callback: (x: Progress) => {
			if (x.file) {
				tsbModelsResources.value[x.file] = x;
				if (x.status === 'initiate' || x.status === 'download') {
					tsbModelsResources.value[x.file].progress = 0;
				}
				if (x.status === 'done') {
					tsbModelsResources.value[x.file].progress = 100;
					console.log('tsb', x.file);
				}
			}
		}
	});

	env.remotePathTemplate = 'models/Xenova/distilbert-base-cased-distilled-squad/';

	tgpipe = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad', {
		progress_callback: (x: Progress) => {
			if (x.file) {
				tgModelsResources.value[x.file] = x;

				if (x.status === 'initiate' || x.status === 'download') {
					tgModelsResources.value[x.file].progress = 0;
				}
				if (x.status === 'done') {
					tgModelsResources.value[x.file].progress = 100;
					console.log('tg', x.file);
				}
			}
		}
	});
});
</script>
