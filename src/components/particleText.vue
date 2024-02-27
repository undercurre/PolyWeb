<template>
	<div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { TweenMax } from 'gsap';

const props = defineProps<{
	scene: THREE.Scene;
	camera: THREE.Camera;
	renderer: THREE.WebGLRenderer;
}>();

// 粒子配置
// const particleCount = 6000;

// const particleSize = 0.3;

const triggers: Array<string> = ['CREATIVE'];

const loader = new FontLoader();
let typeface = '/swiss_black_cond.json';
// 创建用于点的缓冲几何和材质
let geometry = new THREE.BufferGeometry();

let points: THREE.Points;

// 创建粒子材质
const particleMaterial = new THREE.PointsMaterial({
	color: 0xffffff, // 设置粒子颜色
	size: 0.1 // 设置粒子大小
});

let tween = [];

const vertices = [];

// 生成缓冲几何的随机顶点
for (let i = 0; i < 6000; i++) {
	const position = THREE.MathUtils.randFloat(-4, 4);
	vertices.push(position);
}

geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

function setPoints() {
	loader.load(typeface, (font) => {
		triggers.forEach((trigger) => {
			const triggerGeometry = new TextGeometry(trigger, {
				font: font,
				size: window.innerWidth * 0.02,
				height: 4,
				curveSegments: 10
			});
			triggerGeometry.translate(0, 20, 0);

			// 根据文本几何体创建粒子
			points = new THREE.Points(triggerGeometry, particleMaterial);
			points.scale.set(0.05, 0.05, 0.05);
			// 添加到场景中
			props.scene.add(points);
		});
	});
}

onMounted(() => {});
</script>
