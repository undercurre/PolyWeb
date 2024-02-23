<script setup lang="ts">
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera;

// 相机初始(默认)坐标
const defaultMap = {
	x: 0,
	y: 0,
	z: 2
};

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	//雾化
	scene.fog = new THREE.FogExp2(0x05050c, 0.0005);
	renderer = new THREE.WebGLRenderer();
	// 设置像素比例同步，让高性能显示更漂亮
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor('#e6fcf5', 1);
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

// 创建几何体
const setGeometry = () => {
	const geometry = new THREE.PlaneGeometry(1, 1);
	const vertex = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	const fragment = `
		varying vec2 vUv;
		void main() {
			gl_FragColor = vec4(vUv, 1.0, 1.0);
		}
	`;

	const material = new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
};

// 渲染函数
const render = () => {
	requestAnimationFrame(render);
	TWEEN.update();
	renderer.render(scene, camera);
};

// 初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setGeometry();
	render();
};

//用vue钩子函数调用
onMounted(init);
</script>

<template>
	<div ref="canvasContainer"></div>
</template>
