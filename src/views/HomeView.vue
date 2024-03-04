<script setup lang="ts">
import * as THREE from 'three';
import * as GSAP from 'gsap';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// static
// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene,
	renderer: THREE.WebGLRenderer,
	camera: THREE.PerspectiveCamera,
	mainOrbit: OrbitControls,
	lightHolder: THREE.Group;

// 创建场景和渲染器
const setScene = () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color('#4bd327');
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	// 设置像素比例同步，让高性能显示更漂亮
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	if (window.innerWidth > 800) {
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.needsUpdate = true;
	}
	if (canvasContainer.value) {
		canvasContainer.value.appendChild(renderer.domElement);
	}
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 创建相机
const setCamera = () => {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 10, 1000);
	camera.position.x = 500;
	camera.position.y = 500;
	camera.position.z = 500;
};

// 创建控制器

const setControls = () => {
	mainOrbit = new OrbitControls(camera, renderer.domElement);
	mainOrbit.minDistance = 45;
	mainOrbit.maxDistance = 120;
	mainOrbit.enablePan = false;
	mainOrbit.enableDamping = true;
	mainOrbit.enableZoom = false;
};

// 创建灯光
const setLight = () => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	lightHolder = new THREE.Group();
	scene.add(lightHolder);
	const light = new THREE.PointLight(0xfff5e1, 0.8);
	light.position.set(0, 5, 50);
	lightHolder.add(light);

	const shadowlight = new THREE.DirectionalLight(0xffffff, 1.8);
	shadowlight.position.set(0, 50, 0);
	shadowlight.castShadow = true;
	shadowlight.shadow.bias = 0.1;
	scene.add(shadowlight);

	const cubeLight = new THREE.DirectionalLight(0xffffff, 1.8);
	cubeLight.position.set(60, 100, 20);
	scene.add(cubeLight);

	const backLight = new THREE.DirectionalLight(0xffffff, 1);
	backLight.position.set(-40, 100, 20);
	scene.add(backLight);
};

let macGroup: THREE.Group = new THREE.Group(),
	lidGroup: THREE.Group = new THREE.Group(),
	bottomGroup: THREE.Group = new THREE.Group();
let screenMaterial: THREE.MeshBasicMaterial,
	darkPlasticMaterial: THREE.MeshStandardMaterial,
	cameraMaterial: THREE.MeshBasicMaterial,
	logoMaterial: THREE.MeshBasicMaterial,
	baseMetalMaterial: THREE.MeshStandardMaterial;

let screenLight: THREE.RectAreaLight, screenImageTexture: THREE.Texture;

// 创建几何体
const setComputer = (macglb: GLTF) => {
	const screenSize = [29.4, 20];
	macGroup = new THREE.Group();
	macGroup.position.z = -10;
	macGroup.visible = false;
	scene.add(macGroup);
	lidGroup = new THREE.Group();
	macGroup.visible = false;
	macGroup.add(lidGroup);
	bottomGroup = new THREE.Group();
	macGroup.add(bottomGroup);

	const textLoader = new THREE.TextureLoader();
	screenImageTexture = textLoader.load(
		'https://ksenia-k.com/img/threejs/macbook-screen-texture.png',
		(tex) => {
			tex.flipY = false;
			tex.wrapS = THREE.RepeatWrapping;
			tex.repeat.y = (tex.image.width / tex.image.height / screenSize[0]) * screenSize[1];
		}
	);

	const videoEl = document.createElement('video');
	const screenCameraTexture = new THREE.VideoTexture(videoEl);
	screenCameraTexture.flipY = false;
	screenMaterial = new THREE.MeshBasicMaterial({
		map: screenImageTexture,
		transparent: true,
		opacity: 0,
		side: THREE.BackSide
	});
	const keyboardTexture = textLoader.load('https://ksenia-k.com/img/threejs/keyboard-overlay.png');
	const keyboardMaterial = new THREE.MeshBasicMaterial({
		color: 0xfffffff,
		alphaMap: keyboardTexture,
		transparent: true
	});

	darkPlasticMaterial = new THREE.MeshStandardMaterial({
		color: 0x000000,
		roughness: 0.9,
		metalness: 0.9
	});
	cameraMaterial = new THREE.MeshBasicMaterial({
		color: 0x333333
	});
	baseMetalMaterial = new THREE.MeshStandardMaterial({
		color: 0xcecfd3
	});
	logoMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});

	[...macglb.scene.children].forEach((child) => {
		if (child.name === '_top') {
			lidGroup.add(child);
			[...child.children].forEach((mesh) => {
				if (mesh.name === 'lid') {
					(mesh as unknown as THREE.Mesh).material = baseMetalMaterial;
				} else if (mesh.name === 'logo') {
					(mesh as unknown as THREE.Mesh).material = logoMaterial;
				} else if (mesh.name === 'screen-frame') {
					(mesh as unknown as THREE.Mesh).material = darkPlasticMaterial;
				} else if (mesh.name === 'camera') {
					(mesh as unknown as THREE.Mesh).material = cameraMaterial;
				}
			});
		} else if (child.name === '_bottom') {
			bottomGroup.add(child);
			[...child.children].forEach((mesh) => {
				if (mesh.name === 'base') {
					(mesh as unknown as THREE.Mesh).material = baseMetalMaterial;
				} else if (mesh.name === 'legs') {
					(mesh as unknown as THREE.Mesh).material = darkPlasticMaterial;
				} else if (mesh.name === 'keyboard') {
					(mesh as unknown as THREE.Mesh).material = darkPlasticMaterial;
				} else if (mesh.name === 'inner') {
					(mesh as unknown as THREE.Mesh).material = darkPlasticMaterial;
				}
			});
		}
	});

	const screenMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(screenSize[0], screenSize[1]),
		screenMaterial
	);
	screenMesh.position.set(0, 10.5, -0.11);
	screenMesh.rotation.set(Math.PI, 0, 0);
	lidGroup.add(screenMesh);

	screenLight = new THREE.RectAreaLight(0xffffff, 0, screenSize[0], screenSize[1]);
	screenLight.position.set(0, 10.5, 0);
	screenLight.rotation.set(Math.PI, 0, 0);
	lidGroup.add(screenLight);

	const darkScreen = screenMesh.clone();
	darkScreen.position.set(0, 10.5, -0.111);
	darkScreen.rotation.set(Math.PI, Math.PI, 0);
	darkScreen.material = darkPlasticMaterial as unknown as THREE.MeshBasicMaterial;
	lidGroup.add(darkScreen);

	const keyboardKeys = new THREE.Mesh(new THREE.PlaneGeometry(27.7, 11.6), keyboardMaterial);
	keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0);
	keyboardKeys.position.set(0, 0.045, 7.21);
	bottomGroup.add(keyboardKeys);
};

// 创建首页立方体

let cubeShapeInstance: THREE.Mesh;
let homeShape: THREE.Group;

const setShape = () => {
	const geometry = new THREE.BoxGeometry(5, 5, 5);
	const material = new THREE.MeshLambertMaterial({ color: 0xf9f8ed, flatShading: true });
	cubeShapeInstance = new THREE.Mesh(geometry, material);
	cubeShapeInstance.castShadow = true;
	cubeShapeInstance.receiveShadow = false;
	homeShape = new THREE.Group();
	homeShape.add(cubeShapeInstance);
	scene.add(homeShape);
	cubeShape();
};

// 渲染函数
const render = () => {
	mainOrbit.update();
	lightHolder.quaternion.copy(camera.quaternion);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

// 初始化所有函数
const init = () => {
	setScene();
	setCamera();
	setLight();
	setControls();
	setShape();
	render();
	onWindowResize();
};

const modelLoader = new GLTFLoader();
modelLoader.load('https://ksenia-k.com/models/mac-noUv.glb', (glb) => {
	setComputer(glb);
	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
});

modelLoader.load('src/assets/glb/regular_ole_clipboard.glb', (glb) => {
	const model = glb.scene;
	glb.scene.scale.set(10, 10, 10);
	console.log(model);
	scene.add(model);
});

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

function computer() {
	const gsapCamera = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	// ---------------------------------------------------
	const cameraTransformTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			gsapCamera,
			{
				x: 500,
				y: 500,
				z: 500
			},
			{
				x: 0,
				y: 0,
				z: 75
			}
		);
	// ---------------------------------------------------
	const cubeShapeDisappearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			homeShape.rotation,
			{
				x: 2 * Math.PI,
				y: -2 * Math.PI
			},
			{
				duration: 2,
				x: 0,
				y: 0
			},
			0
		)
		.fromTo(
			homeShape.position,
			{
				y: 0
			},
			{
				duration: 1,
				y: -120
			},
			0
		);
	// ---------------------------------------------------
	const floatingTl = GSAP.gsap
		.timeline({
			repeat: -1
		})
		.to(
			[lidGroup.position, bottomGroup.position],
			{
				duration: 1.5,
				y: '+=1',
				ease: 'power1.inOut'
			},
			0
		)
		.to([lidGroup.position, bottomGroup.position], {
			duration: 1.5,
			y: '-=1',
			ease: 'power1.inOut'
		})
		.timeScale(0);

	// ---------------------------------------------------
	const screenOnTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.to(
			screenMaterial,
			{
				duration: 0.1,
				opacity: 0.96
			},
			0
		)
		.to(
			screenLight,
			{
				duration: 0.1,
				intensity: 1.5
			},
			0
		);

	// ---------------------------------------------------
	const laptopOpeningTl = GSAP.gsap
		.timeline({
			paused: true,
			onUpdate: () => {}
		})
		.from(
			lidGroup.position,
			{
				duration: 0.75,
				z: '+=.5'
			},
			0
		)
		.fromTo(
			lidGroup.rotation,
			{
				duration: 1,
				x: 0.5 * Math.PI
			},
			{
				x: -0.2 * Math.PI
			},
			0
		)
		.to(
			screenOnTl,
			{
				duration: 0.06,
				progress: 1
			},
			0.05
		);

	// ---------------------------------------------------
	const textureScrollTl = GSAP.gsap
		.timeline({
			paused: true,
			onUpdate: () => {}
		})
		.to(screenImageTexture.offset, {
			duration: 2,
			y: 0.4,
			ease: 'power1.inOut'
		});

	// ---------------------------------------------------
	const laptopAppearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			macGroup.rotation,
			{
				x: 0.5 * Math.PI,
				y: 0.2 * Math.PI
			},
			{
				duration: 2,
				x: 0.05 * Math.PI,
				y: -0.1 * Math.PI
			},
			0
		)
		.fromTo(
			macGroup.position,
			{
				y: -50
			},
			{
				duration: 1,
				y: -8
			},
			0
		);
	// ---------------------------------------------------
	macGroup.position.y = -50;
	macGroup.visible = true;
	const mainTl = GSAP.gsap
		.timeline({
			delay: 2,
			defaults: {
				ease: 'none'
			}
		})
		.to(
			cubeShapeDisappearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0
		)
		.to(
			laptopAppearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0.2
		)
		.to(
			cameraTransformTl,
			{
				duration: 2,
				progress: 1,
				onUpdate: () => {
					camera.position.x = gsapCamera.x;
					camera.position.y = gsapCamera.y;
					camera.position.z = gsapCamera.z;
					camera.updateProjectionMatrix(); // 在动画更新时手动更新相机的投影矩阵
				}
			},
			0
		)
		.to(
			laptopOpeningTl,
			{
				duration: 1,
				progress: 0.34
			},
			0.5
		)
		.to(
			textureScrollTl,
			{
				duration: 1.5,
				progress: 1
			},
			1.5
		)
		.to(textureScrollTl, {
			duration: 1,
			progress: 0
		})
		.to(
			floatingTl,
			{
				duration: 1,
				timeScale: 1
			},
			1
		);

	mainTl.play(0);
}

function disappearComputer() {
	const gsapCamera = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	// ---------------------------------------------------
	const cameraTransformTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			gsapCamera,
			{
				x: 0,
				y: 0,
				z: 75
			},
			{
				x: 500,
				y: 500,
				z: 500
			}
		);
	// ---------------------------------------------------
	const cubeShapeAppearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			homeShape.rotation,
			{
				x: 0,
				y: 0
			},
			{
				duration: 2,
				x: 2 * Math.PI,
				y: -2 * Math.PI
			},
			0
		)
		.fromTo(
			homeShape.position,
			{
				y: -120
			},
			{
				duration: 1,
				y: 0
			},
			0
		);

	// ---------------------------------------------------
	const laptopClosingTl = GSAP.gsap
		.timeline({
			paused: true,
			onUpdate: () => {}
		})
		.from(
			lidGroup.position,
			{
				duration: 0.75,
				z: '+=.5'
			},
			0
		)
		.fromTo(
			lidGroup.rotation,
			{
				duration: 1,
				x: 0.2 * Math.PI
			},
			{
				x: 0.5 * Math.PI
			},
			0
		);

	const laptopAppearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			macGroup.rotation,
			{
				x: 0.05 * Math.PI,
				y: -0.1 * Math.PI
			},
			{
				duration: 2,
				x: 0.5 * Math.PI,
				y: 0.2 * Math.PI
			},
			0
		)
		.fromTo(
			macGroup.position,
			{
				y: -8
			},
			{
				duration: 1,
				y: -120
			},
			0
		);
	// ---------------------------------------------------
	const mainTl = GSAP.gsap
		.timeline({
			defaults: {
				ease: 'none'
			}
		})
		.to(
			cubeShapeAppearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0
		)
		.to(
			cameraTransformTl,
			{
				duration: 2,
				progress: 1,
				onUpdate: () => {
					camera.position.x = gsapCamera.x;
					camera.position.y = gsapCamera.y;
					camera.position.z = gsapCamera.z;
					camera.updateProjectionMatrix(); // 在动画更新时手动更新相机的投影矩阵
				}
			},
			0
		)
		.to(
			laptopClosingTl,
			{
				duration: 1,
				progress: 0.34
			},
			0.5
		)
		.to(
			laptopAppearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0.2
		);

	mainTl.play(0);
}

function cubeShape() {
	let tl = GSAP.gsap.timeline({
		repeat: -1,
		repeatDelay: 0.5
	});
	tl.to(cubeShapeInstance.scale, 0.5, { x: 2, ease: GSAP.Expo.easeOut });
	tl.to(cubeShapeInstance.scale, 0.5, { z: 2, ease: GSAP.Expo.easeOut });
	tl.to(cubeShapeInstance.scale, 1, { y: 2, ease: GSAP.Elastic.easeOut });
	tl.to(cubeShapeInstance.scale, 0.7, { z: 1, x: 1, y: 1, ease: GSAP.Expo.easeOut });
	tl.to(cubeShapeInstance.rotation, 0.7, { y: -Math.PI, ease: GSAP.Expo.easeOut }, '=-0.7');
}

const isWorksVisible = ref(false);

function go2Home() {
	if (!isWorksVisible.value) return;
	isWorksVisible.value = false;
	disappearComputer();
}

function go2Works() {
	if (isWorksVisible.value) return;
	isWorksVisible.value = true;
	computer();
}

//用vue钩子函数调用
onMounted(() => {
	init();
	introduce();
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', onWindowResize);
});
</script>

<template>
	<div ref="canvasContainer" class="body">
		<div class="w-full flex absolute top-0 left-0 p-20px justify-between items-center text-#fff">
			<span ref="introduceRef" id="introduce" class="text-30px pl-20px">Hello ！</span>
			<div class="text-20px">
				<span class="pr-20px" @click="go2Home">Top</span
				><span class="pr-20px" @click="go2Works">Works</span><span class="pr-20px">About me</span>
			</div>
		</div>
		<transition name="fade">
			<div
				v-if="!isWorksVisible"
				class="w-full absolute bottom-20% flex w-full justify-center items-center text-36px text-#fff"
			>
				<span>Continuous improvement</span>
				<span class="p-20px">&</span>
				<span>Infinite transcendence</span>
			</div>
		</transition>
	</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
