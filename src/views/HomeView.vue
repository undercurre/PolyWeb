<script setup lang="ts">
import * as THREE from 'three'
// 先集中创建容器变量
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, 	camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.PointsMaterial, particles: THREE.Points;

// 相机初始(默认)坐标
const defaultMap = {
	x: 0,
	y: 0,
	z: 750
};
	

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	//雾化
	scene.fog = new THREE.FogExp2(0x05050c, 0.0005);
	renderer = new THREE.WebGLRenderer();
	// 设置像素比例同步，让高性能显示更漂亮
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(innerWidth, innerHeight);
	const container = document.querySelector('.box');
	if (container) {
		container.appendChild(renderer.domElement);
	}
}

// 创建相机
const setCamera = () => {
	const { x, y, z } = defaultMap;
	camera = new THREE.PerspectiveCamera(105, innerWidth / innerHeight, 300, 10000);
	camera.position.set(x, y, z);
};

// 创建粒子几何体
const setPointGeometry = () => {
 	geometry = new THREE.BufferGeometry();
	// 加载贴图材质
	const textureLoader = new THREE.TextureLoader();
	const mapDot = textureLoader.load("/src/assets/3d/gradient.png");
	material = new THREE.PointsMaterial({
		size: 4,
		sizeAttenuation: true,
		color: 0xffffff,
		transparent: true,
		opacity: 1,
		map: mapDot,
	});
	const AMOUNTX = 50	// 横轴数量
	const AMOUNTY = 50	// 纵轴数量
	const SEPARATION = 100 // 点距离
	const numParticles = AMOUNTX * AMOUNTY // 点数
	let i = 0
	const vertices = new Float32Array(numParticles * 3)
	for (let ix = 0; ix < AMOUNTX; ix++) {
		for (let iy = 0; iy < AMOUNTY; iy++) {
			vertices[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2) // x
			vertices[i + 1] = -300 // y
			vertices[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2) // z
			i += 3
		}
	}
	// 注入点位置
	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute(vertices, 3)
  	)
	particles = new THREE.Points(geometry, material);
	scene.add(particles);
}

// 渲染函数
const render = () => {
	particles.geometry.attributes.vertices.needsUpdate = true;
	particles.geometry.attributes.color.needsUpdate = true;
  	particles.geometry.attributes.position.needsUpdate = true;
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
	<div class="box">

	</div>
</template>
