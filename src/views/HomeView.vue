<script setup lang="ts">
import * as THREE from 'three'
import cpac5 from '@/assets/3d/cpmovie4.json'
// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, 	camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.PointsMaterial, particles: THREE.Points;

// 相机初始(默认)坐标
const defaultMap = {
	x: -3,
	y: 0,
	z: 5
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
}

// 创建相机
const setCamera = () => {
	const { x, y, z } = defaultMap;
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(x, y, z);
};

// 创建粒子几何体
const setPointGeometry = () => {
 	geometry = new THREE.BufferGeometry();
	// 加载贴图材质
	const textureLoader = new THREE.TextureLoader();
	const mapDot = textureLoader.load("/src/assets/3d/gradient.png");
	material = new THREE.PointsMaterial({
		size: 0.02,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		opacity: 1,
		map: mapDot,
	});
	const vertices = []
	const particleSum = 15000;
	const longestDistance = 1000;
	
    for (let i = 0; i < particleSum; i++) {
      const x = getRangeRandom(-1 * longestDistance, longestDistance)
      const y = getRangeRandom(-1 * longestDistance, longestDistance)
      const z = getRangeRandom(-1 * longestDistance, longestDistance)
      vertices.push(x, y, z)
    }
	
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(cpac5.vertices, 3))
	particles = new THREE.Points(geometry, material);
	scene.add(particles);
}

function getRangeRandom(e: number, t: number) {
  return Math.random() * (t - e) + e
}

// 渲染函数
const render = () => {
	requestAnimationFrame(render);
 	renderer.render(scene, camera);
}

// 初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setPointGeometry();
	render();
};

//用vue钩子函数调用
onMounted(init);
</script>

<template>
	<div ref="canvasContainer"></div>
</template>
