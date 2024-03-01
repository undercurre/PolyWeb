<script setup lang="ts">
import * as THREE from 'three';
import * as GSAP from 'gsap';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene,
	renderer: THREE.WebGLRenderer,
	camera: THREE.Camera,
	mainOrbit: OrbitControls;

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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
	camera.position.set(0, 2, 24);
};

// 创建控制器

const setControls = () => {
	if (canvasContainer.value) {
		mainOrbit = new OrbitControls(camera, canvasContainer.value);
	}
	mainOrbit.enablePan = false;
	mainOrbit.autoRotate = true;
	mainOrbit.minDistance = 13;
	mainOrbit.maxDistance = 40;
	mainOrbit.enableDamping = true;
};

// 创建灯光
const setLight = () => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const lightHolder = new THREE.Group();
	const topLight = new THREE.SpotLight(0xffffff, 0.4);
	topLight.position.set(0, 15, 2);
	topLight.castShadow = true;
	topLight.shadow.camera.near = 10;
	topLight.shadow.camera.far = 30;
	topLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
	lightHolder.add(topLight);
	const sideLight = new THREE.SpotLight(0xffffff, 0.4);
	sideLight.position.set(0, -4, 5);
	lightHolder.add(sideLight);
	scene.add(lightHolder);
};

// 创建几何体

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const params = {
	gridSize: 0.1,
	boxSize: 0.01,
	boxRoundness: 0.1
};

const models = [
	new THREE.SphereGeometry(1),
	new THREE.TorusGeometry(2, 1, 30, 30),
	new THREE.TorusKnotGeometry(2, 0.6, 50, 10)
];

let curModelIndex = 0;

const voxelDatas: Array<
	Array<{
		position: THREE.Vector3;
		color: THREE.Color;
	}>
> = [];

const voxelGeometry = new RoundedBoxGeometry(
	params.boxSize,
	params.boxSize,
	params.boxSize,
	4,
	params.boxRoundness
);
// 材质
const voxelMaterial = new THREE.MeshLambertMaterial({
	color: new THREE.Color(0xffff55)
});

let voxelMesh: THREE.InstancedMesh;

import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
THREE.Mesh.prototype.raycast = acceleratedRaycast;

function generateVoxelDataInBufferGeometry(geometry: THREE.BufferGeometry): Array<{
	position: THREE.Vector3;
	color: THREE.Color;
}> {
	const voxelData: Array<{
		position: THREE.Vector3;
		color: THREE.Color;
	}> = [];
	// 创建克隆对象， 避免原型被修改
	const geometryClone = geometry.clone();
	const mesh = new THREE.Mesh(geometryClone);
	// 加载双面网格
	if (Array.isArray(mesh.material)) {
		mesh.material.map((m) => {
			m.side = THREE.DoubleSide;
		});
	} else {
		mesh.material.side = THREE.DoubleSide;
	}
	// 创建外框
	const box = new THREE.Box3().setFromObject(mesh);
	mesh.updateMatrixWorld(); // 更新网格的世界矩阵，以确保射线投射到正确位置
	// 创建 BVH
	const bvh = new MeshBVH(geometryClone);
	// 使用统一随机颜色
	const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.8);
	console.log(box.min, box.max);
	for (let i = box.min.x; i < box.max.x; i += params.gridSize) {
		for (let j = box.min.y; j < box.max.y; j += params.gridSize) {
			for (let k = box.min.z; k < box.max.z; k += params.gridSize) {
				const curPoint = new THREE.Vector3(i, j, k);
				const direction = new THREE.Vector3(0, -1, 0); // 任意方向
				const intersections = bvh.raycast(new THREE.Ray(curPoint, direction), THREE.DoubleSide);
				if (intersections.length % 2 === 1) {
					voxelData.push({
						position: curPoint,
						color
					});
				}
			}
		}
	}
	return voxelData;
}

function createVoxelMesh(
	voxelData: Array<{
		position: THREE.Vector3;
		color: THREE.Color;
	}>
) {
	// 实例化几何体
	voxelMesh = new THREE.InstancedMesh(voxelGeometry, voxelMaterial, voxelData.length);
	voxelMesh.castShadow = true;
	voxelMesh.receiveShadow = true;
	scene.add(voxelMesh);
}

function updateVoxelMesh(
	voxelData: Array<{
		position: THREE.Vector3;
		color: THREE.Color;
	}>
) {
	const dummy = new THREE.Object3D();

	for (let i = 0; i < voxelData.length; i++) {
		dummy.position.copy(voxelData[i].position);
		dummy.updateMatrix();
		voxelMesh.setMatrixAt(i, dummy.matrix);
		voxelMesh.setColorAt(i, voxelData[i].color);
	}
	if (voxelMesh.instanceColor) voxelMesh.instanceColor.needsUpdate = true; // apply the colors
	voxelMesh.instanceMatrix.needsUpdate = true;
}

models.map((model) => {
	voxelDatas.push(generateVoxelDataInBufferGeometry(model));
});

const setGeometry = () => {
	createVoxelMesh(voxelDatas[curModelIndex]);
	updateVoxelMesh(voxelDatas[curModelIndex]);
	// setInterval(() => {
	// 	scene.remove(voxelMesh);
	// 	if (curModelIndex === voxelDatas.length) curModelIndex = 0;
	// 	createVoxelMesh(voxelDatas[curModelIndex]);
	// 	updateVoxelMesh(voxelDatas[curModelIndex]);
	// 	curModelIndex += 1;
	// }, 5000);
};

// 渲染函数
const render = () => {
	mainOrbit.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 初始化所有函数
const init = () => {
	setScene();
	setCamera();
	setLight();
	setGeometry();
	setControls();
	render();
};

import TextPlugin from 'gsap/TextPlugin';

GSAP.gsap.registerPlugin(TextPlugin);

function introduce() {
	let introduceRef = document.getElementById('introduce');

	let tl = GSAP.gsap.timeline({
		repeat: -1,
		yoyo: false,
		repeatDelay: 2
	});
	tl.to(introduceRef, {
		text: { value: 'My name is Li Runhua.', padSpace: true },
		ease: GSAP.Linear.easeNone,
		duration: 1,
		delay: 2
	});
	tl.to(introduceRef, {
		text: { value: 'I am a creative / front-end developer.', padSpace: true },
		ease: GSAP.Linear.easeNone,
		duration: 1,
		delay: 2
	});
	tl.to(introduceRef, {
		text: { value: 'Welcome to my world！', padSpace: true },
		ease: GSAP.Linear.easeNone,
		duration: 1,
		delay: 2
	});
}

function go2Home() {
	// 重启
}

function go2Works() {
	// 停止
}

//用vue钩子函数调用
onMounted(() => {
	init();
	introduce();
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
				<div class="flex justify-between items-center text-#fff">
					<span ref="introduceRef" id="introduce" class="text-30px pl-20px">Hello ！</span>
					<div class="text-20px">
						<span class="pr-20px" @click="go2Home">Top</span
						><span class="pr-20px" @click="go2Works">Works</span><span class="pr-20px">About</span>
					</div>
				</div>
			</div>
		</div>
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
</style>
