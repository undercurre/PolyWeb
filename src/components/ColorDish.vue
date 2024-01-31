<template>
	<div class="flex flex-col relative">
		<label class="display-block w-200px p-10px border-#ddd border-1px border-solid" for="imgInput"
			>点击选择图片</label
		>
		<input
			class="display-none"
			id="imgInput"
			type="file"
			@change="handleImageUpload"
			accept="image/*"
		/>
		<canvas ref="colorCanvas" :width="radius * 2" :height="radius * 2"></canvas>
		<div v-for="item in colorExcel" :key="item.name">
			<span>{{ item.name }}</span>
			<span class="ml-20px">{{ item.color }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
	radius: {
		type: Number,
		default: 0
	},
	excel: {
		type: Array<{
			i: number;
			x: number;
			y: number;
		}>,
		default: []
	}
});

let image: HTMLImageElement | null = null;

const colorCanvas = ref<HTMLCanvasElement | null>(null);

const colorExcel = ref<
	Array<{
		name: string;
		color: string;
	}>
>([]);

const drawColorPicker = () => {
	if (colorCanvas.value && image) {
		const canvas = colorCanvas.value;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;
		const canvasWidth = props.radius * 2; // Canvas的宽度
		const canvasHeight = props.radius * 2; // Canvas的高度
		// 计算图片在Canvas中的绘制位置和尺寸，使其填满整个Canvas
		const imageAspect = image.width / image.height;
		const canvasAspect = canvasWidth / canvasHeight;

		let drawWidth, drawHeight, offsetX, offsetY;

		if (imageAspect > canvasAspect) {
			drawWidth = canvasWidth;
			drawHeight = canvasWidth / imageAspect;
			offsetX = 0;
			offsetY = (canvasHeight - drawHeight) / 2;
		} else {
			drawWidth = canvasHeight * imageAspect;
			drawHeight = canvasHeight;
			offsetX = (canvasWidth - drawWidth) / 2;
			offsetY = 0;
		}

		ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
	}
};

const handleImageUpload = (event: Event) => {
	const input = event.target as HTMLInputElement;
	const files = input.files;

	if (files && files.length > 0) {
		const file = files[0];

		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target && e.target.result) {
				image = new Image();
				image.src = e.target.result as string;

				image.onload = () => {
					drawColorPicker();
					const radius = 2;
					const color = 'transparent';

					if (colorCanvas.value) {
						const canvas = colorCanvas.value;
						const ctx = canvas.getContext('2d');

						if (!ctx) return;

						props.excel.forEach((item) => {
							// 使用Canvas API绘制点
							ctx.beginPath();
							ctx.arc(item.x + props.radius, -item.y + props.radius, radius, 0, 2 * Math.PI);
							ctx.fillStyle = color;
							ctx.fill();
							ctx.closePath();
						});

						colorExcel.value = props.excel.map((item) => {
							return {
								name: 'LED' + item.i,
								color: getColor(item.x + props.radius, -item.y + props.radius)
							};
						});
					}
				};
			}
		};

		reader.readAsDataURL(file);
	}
};

const getColor = (x: number, y: number) => {
	if (colorCanvas.value) {
		const canvas = colorCanvas.value;
		const ctx = canvas.getContext('2d');

		if (!ctx) return 'none';

		const imageData = ctx.getImageData(Math.round(x), Math.round(y), 1, 1);

		const rgb = Array.from(imageData.data.slice(0, 3));

		console.log(x, y, rgb);

		return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
	}
	return 'none';
};

onMounted(() => {
	drawColorPicker();
});
</script>
