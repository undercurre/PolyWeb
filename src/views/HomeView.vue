<script setup lang="ts">
import * as THREE from 'three';
import * as GSAP from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

const textRef = ref<ReturnType<typeof defineComponent> | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera;

let mouse = new THREE.Vector2();

let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();
let cars: Array<THREE.Mesh> = [];
let snows: Array<THREE.Mesh> = [];

let createCarPos = true;
let uSpeed = 0.001;
let setcolor = 0xf02050;

let setTintNum = true;
let isWorksVisible = ref(true);

function mathRandom(num = 8) {
	let numValue = -Math.random() * num + Math.random() * num;
	return numValue;
}

function setTintColor() {
	let setColor;
	if (setTintNum) {
		setTintNum = false;
		setColor = 0x000000;
	} else {
		setTintNum = true;
		setColor = 0x000000;
	}
	return setColor;
}

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(setcolor);
	scene.fog = new THREE.Fog(setcolor, 10, 16);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	// 设置像素比例同步，让高性能显示更漂亮
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	if (window.innerWidth > 800) {
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.needsUpdate = true;
	}
	if (canvasContainer.value) {
		canvasContainer.value.appendChild(renderer.domElement);
	}
};

// 创建相机
const setCamera = () => {
	camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 2, 14);
};

// 创建几何体
const setGeometry = () => {
	let segments = 2;
	for (let i = 1; i < 100; i++) {
		let geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
		let material = new THREE.MeshPhongMaterial({
			color: setTintColor(),
			wireframe: false,
			flatShading: false,
			side: THREE.DoubleSide
		});
		let wmaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			wireframe: true,
			transparent: true,
			opacity: 0.03,
			side: THREE.DoubleSide
		});

		let cube = new THREE.Mesh(geometry, material);
		let floor = new THREE.Mesh(geometry, material);
		let wfloor = new THREE.Mesh(geometry, wmaterial);

		cube.add(wfloor);
		cube.castShadow = true;
		cube.receiveShadow = true;

		floor.scale.y = 0.05;
		cube.scale.y = 0.1 + Math.abs(mathRandom(8));

		let cubeWidth = 0.9;
		cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
		cube.position.x = Math.round(mathRandom());
		cube.position.z = Math.round(mathRandom());

		floor.position.set(cube.position.x, 0, cube.position.z);

		town.add(floor);
		town.add(cube);
	}

	let gmaterial = new THREE.MeshToonMaterial({ color: 0xffff00, side: THREE.DoubleSide });
	let gparticular = new THREE.CircleGeometry(0.01, 3);
	let aparticular = 5;

	for (let h = 1; h < 300; h++) {
		let particular = new THREE.Mesh(gparticular, gmaterial);
		particular.position.set(
			mathRandom(aparticular),
			mathRandom(aparticular),
			mathRandom(aparticular)
		);
		particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
		snows.push(particular);
		smoke.add(particular);
	}

	let pmaterial = new THREE.MeshStandardMaterial({
		color: 0x000000,
		side: THREE.DoubleSide,
		roughness: 10,
		metalness: 0.6,
		opacity: 0.9,
		transparent: true
	});
	let pgeometry = new THREE.PlaneGeometry(60, 60);
	let pelement = new THREE.Mesh(pgeometry, pmaterial);
	pelement.rotation.x = (-90 * Math.PI) / 180;
	pelement.position.y = -0.001;
	pelement.receiveShadow = true;

	city.add(pelement);
};

// 设置鼠标事件
const setMouse = () => {
	function onMouseMove(event: MouseEvent) {
		event.preventDefault();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
	function onDocumentTouchStart(event: TouchEvent) {
		if (event.touches.length == 1) {
			event.preventDefault();
			mouse.x = event.touches[0].pageX - window.innerWidth / 2;
			mouse.y = event.touches[0].pageY - window.innerHeight / 2;
		}
	}
	function onDocumentTouchMove(event: TouchEvent) {
		if (event.touches.length == 1) {
			event.preventDefault();
			mouse.x = event.touches[0].pageX - window.innerWidth / 2;
			mouse.y = event.touches[0].pageY - window.innerHeight / 2;
		}
	}
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('touchstart', onDocumentTouchStart, false);
	window.addEventListener('touchmove', onDocumentTouchMove, false);
};

const setLight = () => {
	let ambientLight = new THREE.AmbientLight(0xffffff, 4);
	let lightFront = new THREE.SpotLight(0xffffff, 20, 10);
	let lightBack = new THREE.PointLight(0xffffff, 0.5);

	lightFront.rotation.x = (45 * Math.PI) / 180;
	lightFront.rotation.z = (-45 * Math.PI) / 180;
	lightFront.position.set(5, 5, 5);
	lightFront.castShadow = true;
	lightFront.shadow.mapSize.width = 6000;
	lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
	lightFront.penumbra = 0.1;
	lightBack.position.set(0, 6, 0);

	smoke.position.y = 2;

	scene.add(ambientLight);
	city.add(lightFront);
	scene.add(lightBack);
	scene.add(city);
	city.add(smoke);
	city.add(town);

	let gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
	city.add(gridHelper);
};

let createCars = function (cScale = 2, cPos = 10, cColor = 0xffff00) {
	let cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
	let cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
	let cElem = new THREE.Mesh(cGeo, cMat);
	let cAmp = 3;

	if (createCarPos) {
		createCarPos = false;
		cElem.position.x = -cPos;
		cElem.position.z = mathRandom(cAmp);

		GSAP.gsap.to(cElem.position, {
			x: cPos,
			repeat: -1,
			duration: 3,
			yoyo: true,
			delay: mathRandom(3)
		});
	} else {
		createCarPos = true;
		cElem.position.x = mathRandom(cAmp);
		cElem.position.z = -cPos;
		cElem.rotation.y = (90 * Math.PI) / 180;

		GSAP.gsap.to(cElem.position, {
			z: cPos,
			repeat: -1,
			duration: 5,
			yoyo: true,
			delay: mathRandom(3),
			ease: GSAP.Power1.easeInOut
		});
	}
	cElem.receiveShadow = true;
	cElem.castShadow = true;
	cElem.position.y = Math.abs(mathRandom(5));
	cars.push(cElem);
	city.add(cElem);
};

let setLines = function () {
	for (let i = 0; i < 60; i++) {
		createCars(0.1, 20);
	}
};

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshBVH } from 'three-mesh-bvh';

const triggers: Array<string> = ['CREATIVE'];
const loader = new FontLoader();
let typeface = '/swiss_black_cond.json';
let points: THREE.Points;
const params = {
	modelPreviewSize: 2,
	modelSize: 9,
	gridSize: 0.24,
	boxSize: 0.24,
	boxRoundness: 0.03,
	voxelCount: 100
};
// 体素集成体
let instancedMesh: THREE.InstancedMesh;
// 创建体素
const voxelGeometry = new RoundedBoxGeometry(
	params.boxSize,
	params.boxSize,
	params.boxSize,
	2,
	params.boxRoundness
);
// 创建材质
const voxelMaterial = new THREE.MeshLambertMaterial({
	color: new THREE.Color(0xffff55)
});

function generateRandomPointsInBufferGeometry(geometry: THREE.BufferGeometry, numPoints: number) {
	// 创建克隆对象， 避免原型被修改
	const geometryClone = geometry.clone();
	// 创建外框
	const box = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
	// 创建 BVH
	const bvh = new MeshBVH(geometryClone);
	const points = [];
	for (let i = box.min.x; i < box.max.x; i += params.gridSize) {
		for (let j = box.min.y; j < box.max.y; j += params.gridSize) {
			for (let k = box.min.z; k < box.max.z; k += params.gridSize) {
				const curPoint = new THREE.Vector3(i, j, k);
				const direction = new THREE.Vector3(0, 0, -1); // 任意方向
				const intersections = bvh.raycast(new THREE.Ray(curPoint, direction), THREE.DoubleSide);
				if (intersections.length % 2 === 1) {
					points.push(curPoint);
				}
			}
		}
	}

	return points;
}

function setPoints() {
	loader.load(typeface, (font) => {
		triggers.forEach((trigger) => {
			const triggerGeometry = new TextGeometry(trigger, {
				font: font,
				size: window.innerWidth * 0.03,
				height: 4,
				curveSegments: 10
			});
			// 计算文本的边界框
			triggerGeometry.computeBoundingBox();
			if (triggerGeometry.boundingBox) {
				var textWidth = triggerGeometry.boundingBox.max.x - triggerGeometry.boundingBox.min.x;

				// 计算偏移量使文本居中
				triggerGeometry.translate(-0.5 * textWidth, 0, 0);
			}
			// 根据文本几何体创建粒子
			instancedMesh = new THREE.InstancedMesh(voxelGeometry, voxelMaterial, params.voxelCount);
			instancedMesh.castShadow = true;
			instancedMesh.receiveShadow = true;
			scene.add(instancedMesh);
		});
	});
}

// 渲染函数
const render = () => {
	requestAnimationFrame(render);

	city.rotation.y -= (mouse.x * 8 - camera.rotation.y) * uSpeed;
	city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
	if (city.rotation.x < -0.05) city.rotation.x = -0.05;
	else if (city.rotation.x > 1) city.rotation.x = 1;

	smoke.rotation.y += 0.01;
	smoke.rotation.x += 0.01;

	camera.lookAt(city.position);
	renderer.render(scene, camera);
};

function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 初始化所有函数
const init = () => {
	setMouse();
	setScene();
	setCamera();
	// setLight();
	// setGeometry();
	// setLines();
	setPoints();
	render();
};

function go2Home() {
	// 重启
	cars.map((car) => {
		city.add(car);
	});
	snows.map((snow) => {
		smoke.add(snow);
	});
	isWorksVisible.value = false;
}

function go2Works() {
	// 停止
	cars.map((car) => {
		city.remove(car);
	});
	snows.map((snow) => {
		smoke.remove(snow);
	});
	isWorksVisible.value = true;
}

//用vue钩子函数调用
onMounted(() => {
	init();
	window.addEventListener('resize', onWindowResize, false);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', onWindowResize);
});
</script>

<template>
	<div ref="canvasContainer" class="body">
		<div class="container-fluid fixed-top header disable-selection">
			<div>
				<div class="flex justify-between items-center">
					<span class="text-30px pl-20px">undercurre</span>
					<div class="text-20px">
						<span class="pr-20px" @click="go2Home">Home</span
						><span class="pr-20px" @click="go2Works">Works</span
						><span class="pr-20px">About me</span>
					</div>
				</div>
			</div>
		</div>
		<!-- <ParticleText ref="textRef" :scene="scene" :camera="camera" :renderer="renderer"></ParticleText> -->
		<!-- <transition name="fade">
			<Works2Image
				v-if="isWorksVisible"
				class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			></Works2Image>
		</transition> -->
	</div>
</template>

<style scoped>
.body {
	position: relative;
	width: 100%;
	height: 100%;
	margin: 0;
	color: #fff;
	text-align: center;
	background-color: #000;
	cursor: crosshair;
}

p {
	color: rgb(255 255 255 / 50%);
}

.header {
	top: 5%;
}

.header-content {
	padding: 50px;
	background-color: rgb(0 0 0 / 30%);
	border-radius: 10px;
}

.footer {
	bottom: 3%;
}

.description {
	padding-top: 50px;
	color: #808080;
}

a,
a:hover,
a:visited {
	color: #fff;
	text-decoration: none;
}

.disable-selection {
	/* Firefox */

	/* Internet Explorer */

	/* KHTML browsers (e.g. Konqueror) */
	user-select: none; /* Chrome, Safari, and Opera */
	-webkit-touch-callout: none; /* Disable Android and iOS callouts */
}

h1::after {
	position: absolute;
	top: 3px;
	padding-left: 5px;
	font-weight: 400;
	font-size: 12px;
	content: ' Three JS';
}

h2::after {
	position: absolute;
	top: 14px;
	padding-left: 5px;
	font-size: 12px;
	content: '2';
}

.btn {
	padding: 10px 25px;
	border-radius: 100px;
}

/* 定义淡入淡出动画的 CSS */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
