<script setup lang="ts">
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import * as cpac5 from '@/assets/3d/cpac5.json';
import * as cpbook2 from '@/assets/3d/cpbook2.json';
import * as cpgame3 from '@/assets/3d/cpgame3.json';
import * as cpkv3 from '@/assets/3d/cpkv3.json';
import * as cpmovie4 from '@/assets/3d/cpmovie4.json';

// 数据集
const db: Record<string, number[]> = {
	ac: cpac5.vertices,
	book: cpbook2.vertices,
	game: cpgame3.vertices,
	kv: cpkv3.vertices,
	movie: cpmovie4.vertices
};

// 当前使用的数据集
let curData = 'ac';

// 当前的点阵数据
let curV: number[] = db['ac'];

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene,
	renderer: THREE.WebGLRenderer,
	camera: THREE.Camera,
	geometry: THREE.BufferGeometry,
	material: THREE.PointsMaterial,
	particles: THREE.Points;

// 相机初始(默认)坐标
const defaultMap = {
	x: 0,
	y: 0,
	z: 10
};

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	//雾化
	scene.fog = new THREE.FogExp2(0x05050c, 0.0005);
	renderer = new THREE.WebGLRenderer();
	// 设置像素比例同步，让高性能显示更漂亮
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	if (canvasContainer.value) {
		canvasContainer.value.appendChild(renderer.domElement);
	}
};

// 创建相机
const setCamera = () => {
	const { x, y, z } = defaultMap;
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(x, y, z);
	// 调整朝向
	camera.lookAt(0, 0, 0);
};

// 创建粒子几何体
const setPointGeometry = () => {
	geometry = new THREE.BufferGeometry();
	// 加载贴图材质
	const textureLoader = new THREE.TextureLoader();
	const mapDot = textureLoader.load('/src/assets/3d/gradient.png');
	material = new THREE.PointsMaterial({
		size: 0.02,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		opacity: 1,
		map: mapDot
	});
	const vertices = [];
	const particleSum = 15000;
	const longestDistance = 1000;

	for (let i = 0; i < particleSum; i++) {
		const x = getRangeRandom(-1 * longestDistance, longestDistance);
		const y = getRangeRandom(-1 * longestDistance, longestDistance);
		const z = getRangeRandom(-1 * longestDistance, longestDistance);
		vertices.push(x, y, z);
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(curV, 3));
	particles = new THREE.Points(geometry, material);
	scene.add(particles);
};

function getRangeRandom(e: number, t: number) {
	return Math.random() * (t - e) + e;
}

// 渲染函数
const render = () => {
	requestAnimationFrame(render);
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(curV, 3));
	renderer.render(scene, camera);
};

// 初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setPointGeometry();
	render();
};

//用vue钩子函数调用
onMounted(init);

function handleChange(key: string) {
	curV.forEach(function (e, i) {
		var length = db[key].length;
		var o = db[key][i % length];
		new TWEEN.Tween(e)
			.to(o, 1000)
			.easing(TWEEN.Easing.Exponential.In)
			.delay(1000 * Math.random())
			.start();
	});
	// curData = key;
	// curV = db[key];
}
</script>

<template>
	<div ref="canvasContainer"></div>
	<div class="absolute right-0 top-0">
		<button @click="handleChange('ac')">ac</button>
		<button @click="handleChange('book')">book</button>
		<button @click="handleChange('game')">game</button>
		<button @click="handleChange('kv')">kv</button>
		<button @click="handleChange('movie')">movie</button>
	</div>
</template>
