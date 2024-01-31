<template>
	<div>
		<p>工具：智能采色盘</p>
		<p>功能说明：这个工具将接收一个坐标excel和一张图片，然后输出图片中坐标对应的rgb色值</p>
		<p class="color-red text-40px">注意：必须先上传excel，再上传图片。</p>
		<p class="color-#FFA500">
			温馨提示：遇到bug不要慌，先刷新页面，若果仍然无法解决或者有新需求，联系前端开发工程师：黎润华，联系方式：美信，手机电话15913609821
		</p>
		<label class="display-block w-200px p-10px border-#ddd border-1px border-solid" for="excelInput"
			>点击选择excel文件</label
		>
		<input class="display-none" id="excelInput" type="file" @change="handleFileUpload" />
		<ColorDish :excel="excelData" :radius="radius"></ColorDish>
		<div v-if="excelData.length > 0">
			<h2>Excel Data:</h2>
			<ul>
				<li v-for="(row, index) in excelData" :key="index">{{ row }}</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';

const excelData = ref<
	Array<{
		i: number;
		x: number;
		y: number;
	}>
>([]);

const handleFileUpload = (event: Event) => {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) {
		readExcelFile(file);
	}
};

const readExcelFile = (file: File) => {
	const reader = new FileReader();

	reader.onload = (e: ProgressEvent<FileReader>) => {
		const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
		const workbook = XLSX.read(data, { type: 'array' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const dataRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).splice(2);
		excelData.value = (dataRows as Array<string[]>).map((item: string[]) => {
			return {
				i: parseInt(item[0].split('LED')[1]),
				x: Number(item[1].split('mm')[0]),
				y: Number(item[2].split('mm')[0])
			};
		});
	};

	reader.readAsArrayBuffer(file);
};

const radius = computed(() => {
	const distances = excelData.value.map((point) =>
		Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
	);
	// 找到最大距离对应的点的索引
	const indexOfMaxDistance = distances.indexOf(Math.max(...distances));
	console.log('半径', distances[indexOfMaxDistance]);
	return distances[indexOfMaxDistance];
});
</script>
