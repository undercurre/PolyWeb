<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import livingRoom from '@/assets/3d/livingRoom.jpg';
import kitchen from '@/assets/3d/kitchen.jpg';
// import gsap from 'gsap';

const dataList = [
	{
		image: livingRoom,
		tipsList: [
			{
				position: { x: -200, y: -4, z: -147 },
				content: {
					title: '进入厨房',
					text: '',
					image: 1,
					showTip: false,
					showTitle: true
				}
			},
			{
				position: { x: -100, y: 0, z: -231 },
				content: {
					title: '信息点2',
					text: '77989',
					showTip: true,
					showTitle: false
				}
			},
			{
				position: { x: 150, y: -50, z: -198 },
				content: {
					title: '信息点3',
					text: 'qwdcz',
					showTip: true,
					showTitle: false
				}
			},
			{
				position: { x: 210, y: 11, z: -140 },
				content: {
					title: '信息点4',
					text: '大豆食心虫侦察十大大苏打大大大大大大大',
					showTip: true,
					showTitle: false
				}
			},
			{
				position: { x: 208, y: -12, z: 140 },
				content: {
					title: '信息点5',
					text: 'eq',
					showTip: true,
					showTitle: false
				}
			},
			{
				position: { x: 86, y: -9, z: 236 },
				content: {
					title: '进入房间',
					text: '',
					showTip: false,
					showTitle: true
				}
			}
		]
	},
	{
		image: kitchen,
		tipsList: [
			{
				position: { x: -199, y: -24, z: 145 },
				content: {
					title: '进入大厅',
					text: '',
					image: 0,
					showTip: false,
					showTitle: true
				}
			}
		]
	}
];

const curIndex = 0;

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene,
	renderer: THREE.WebGLRenderer,
	camera: THREE.Camera,
	controls: OrbitControls,
	sphereGeometry: THREE.SphereGeometry,
	sphere: THREE.Mesh;

// 相机初始(默认)坐标
const defaultMap = {
	x: 50,
	y: 0,
	z: 40
};

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x101010);
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
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(x, y, z);
};

// 设置模型控制
const setControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1;
	controls.maxDistance = 100;
	controls.enablePan = false;
};

// 创建几何体
// 全屋VR在于把环境贴图作用于球体，然后从内部看
const setContent = () => {
	sphereGeometry = new THREE.SphereGeometry(16, 50, 50);
	sphereGeometry.scale(16, 16, -16);
	let texture = new THREE.TextureLoader().load(dataList[curIndex].image);
	let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);
};

// 渲染函数
const render = () => {
	controls.update();
	renderer.render(scene, camera);
	renderer.sortObjects = false;
	requestAnimationFrame(render);
};

// 初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setControls();
	setContent();
	render();
};

//用vue钩子函数调用
onMounted(init);
</script>

<template>
	<div ref="canvasContainer"></div>
</template>
