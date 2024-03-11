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
	renderer.setSize(window.innerWidth, window.innerHeight);

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
const setComputerInstance = (macglb: GLTF) => {
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
	screenImageTexture = textLoader.load('works.png', (tex) => {
		tex.flipY = false;
		tex.wrapS = THREE.RepeatWrapping;
		tex.repeat.y = (tex.image.width / tex.image.height / screenSize[0]) * screenSize[1];
	});

	// const videoEl = document.createElement('video');
	// const screenCameraTexture = new THREE.VideoTexture(videoEl);
	// screenCameraTexture.flipY = false;
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
	setComputer();
	setClipboard();
	render();
	onWindowResize();
};

const modelLoader = new GLTFLoader();

function setComputer() {
	modelLoader.load('https://ksenia-k.com/models/mac-noUv.glb', (glb) => {
		setComputerInstance(glb);
		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
	});
}

let clipboardInstance = new THREE.Group();

function setClipboard() {
	modelLoader.load('/regular_ole_clipboard.glb', (glb) => {
		[...glb.scene.children[0].children[0].children[0].children].forEach((mesh) => {
			clipboardInstance.add(mesh);
		});
		clipboardInstance.scale.set(0.1, 0.1, 0.1);
		clipboardInstance.visible = false;
		scene.add(clipboardInstance);
	});
}

let textureLoader = new THREE.TextureLoader();

textureLoader.load(
	'cv.jpg',
	function (texture) {
		// 设置纹理的过滤方式为三线性过滤
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearMipmapLinearFilter;
		let geometry = new THREE.PlaneGeometry(1080, 1786); // 平面大小为2x2
		geometry.rotateX(-Math.PI / 2); // 绕 X 轴旋转 -90 度
		var material = new THREE.MeshBasicMaterial({ map: texture }); // 使用基础材质
		var plane = new THREE.Mesh(geometry, material);
		plane.position.set(0, 10, 0);
		plane.scale.set(0.4, 0.4, 0.4);
		// 渲染场景
		clipboardInstance.add(plane);
	},
	undefined,
	function (error) {
		console.error('An error happened when loading the texture:', error);
	}
);

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
		.to(gsapCamera, {
			duration: 1.5,
			x: 0,
			y: 0,
			z: 75
		});
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

function clipboard() {
	const gsapCamera = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	// ---------------------------------------------------
	const cameraTransformTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.to(gsapCamera, {
			x: 0,
			y: 75,
			z: 75
		});
	// ---------------------------------------------------
	// ---------------------------------------------------
	const clipBoardAppearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			clipboardInstance.rotation,
			{
				x: 0,
				y: 0,
				z: 0
			},
			{
				duration: 2,
				x: 2 * Math.PI,
				y: -2 * Math.PI,
				z: 2 * Math.PI
			},
			0
		)
		.fromTo(
			clipboardInstance.scale,
			{
				x: 0,
				y: 0,
				z: 0
			},
			{
				duration: 2,
				x: 0.1,
				y: 0.1,
				z: 0.1
			}
		)
		.fromTo(
			clipboardInstance.position,
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
	clipboardInstance.visible = true;
	const mainTl = GSAP.gsap
		.timeline({
			delay: 2,
			defaults: {
				ease: 'none'
			}
		})
		.to(
			clipBoardAppearTl,
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
		);

	mainTl.play(0);
}

function cubebox() {
	const gsapCamera = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	// ---------------------------------------------------
	const cameraTransformTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.to(gsapCamera, {
			x: 500,
			y: 500,
			z: 500
		});
	// ---------------------------------------------------
	const cubeShapeAppearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			cubeShapeInstance.rotation,
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
			cubeShapeInstance.position,
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
		);

	mainTl.play(0);
}

function disappearCubebox() {
	// ---------------------------------------------------
	const cubeboxDisappearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			cubeShapeInstance.rotation,
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
			cubeShapeInstance.position,
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
			cubeboxDisappearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0.2
		);

	mainTl.play(0);
}

function disappearComputer() {
	// ---------------------------------------------------
	const laptopClosingTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.from(
			lidGroup.position,
			{
				duration: 0.75,
				z: '+=.5'
			},
			0
		)
		.to(
			lidGroup.rotation,
			{
				x: 0.5 * Math.PI
			},
			0
		);

	const laptopDisappearTl = GSAP.gsap
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
			laptopClosingTl,
			{
				duration: 1,
				progress: 0.34
			},
			0.5
		)
		.to(
			laptopDisappearTl,
			{
				duration: 1.5,
				progress: 1
			},
			0.2
		);

	mainTl.play(0);
}

function disappearClipboard() {
	const clipBoardDisappearTl = GSAP.gsap
		.timeline({
			paused: true
		})
		.fromTo(
			clipboardInstance.rotation,
			{
				x: 2 * Math.PI,
				y: -2 * Math.PI,
				z: 2 * Math.PI
			},
			{
				duration: 2,
				x: 0,
				y: 0,
				z: 0
			},
			0
		)
		.fromTo(
			clipboardInstance.scale,
			{
				x: 0.1,
				y: 0.1,
				z: 0.1
			},
			{
				duration: 2,
				x: 0,
				y: 0,
				z: 0
			}
		)
		.fromTo(
			clipboardInstance.position,
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
	clipboardInstance.visible = true;
	const mainTl = GSAP.gsap
		.timeline({
			delay: 2,
			defaults: {
				ease: 'none'
			}
		})
		.to(
			clipBoardDisappearTl,
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

const isHomeVisible = ref(true);
const isWorksVisible = ref(false);
const isAboutVisible = ref(false);

function go2Home() {
	if (isHomeVisible.value) return;
	isHomeVisible.value = true;
	if (isWorksVisible.value) {
		isWorksVisible.value = false;
		disappearComputer();
	}
	if (isAboutVisible.value) {
		isAboutVisible.value = false;
		disappearClipboard();
	}
	cubebox();
}

function go2Works() {
	if (isWorksVisible.value) return;
	isWorksVisible.value = true;
	if (isHomeVisible.value) {
		isHomeVisible.value = false;
		disappearCubebox();
	}
	if (isAboutVisible.value) {
		isAboutVisible.value = false;
		disappearClipboard();
	}
	computer();
}

const page = ref(0);

function leftWorks() {
	if (page.value < 1) return;
	page.value = page.value - 1;
	GSAP.gsap.to(screenImageTexture.offset, {
		duration: 2,
		y: page.value * 0.12,
		ease: 'power1.inOut',
		onComplete: () => {
			console.log(screenImageTexture.offset);
		}
	});
}

function rightWorks() {
	if (page.value > 6) return;
	page.value = page.value + 1;
	GSAP.gsap.to(screenImageTexture.offset, {
		duration: 2,
		y: page.value * 0.12,
		ease: 'power1.inOut',
		onComplete: () => {
			console.log(screenImageTexture.offset);
		}
	});
}

const works = computed(() => {
	switch (page.value) {
		case 0:
			return {
				title: 'My Blog',
				link: 'https://blog.lirh42.xyz/'
			};
		case 1:
			return {
				title: 'My Github',
				link: 'https://github.com/undercurre'
			};
		case 2:
			return {
				title: 'HOMLUX System(Home version)',
				link: 'https://www.sohu.com/a/729938927_121123819'
			};
		case 3:
			return {
				title: 'Midea App',
				link: 'https://sj.qq.com/appdetail/com.midea.ai.appliances?g_f=1185403&fromcase=70053'
			};
		case 4:
			return {
				title: 'NPM Packages',
				link: 'https://www.npmjs.com/~lirh42'
			};
		case 5:
			return {
				title: 'HOMLUX System(Business version)',
				link: 'https://m.tech.china.com/hea/article/20231225/122023_1461206.html'
			};
		case 6:
			return {
				title: 'Midea SmartScreen',
				link: 'https://tech.chinadaily.com.cn/a/202205/30/WS629480e6a3101c3ee7ad7ee0.html'
			};
		case 7:
			return {
				title: 'My UI Component Library',
				link: 'https://undercurre.github.io/Marvels-Dosc/'
			};
	}
});

function go2About() {
	if (isAboutVisible.value) return;
	isAboutVisible.value = true;
	if (isHomeVisible.value) {
		isHomeVisible.value = false;
		disappearCubebox();
	}
	if (isWorksVisible.value) {
		isWorksVisible.value = false;
		disappearComputer();
	}
	clipboard();
}

function downCV() {
	const url = '/cv.pdf';
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', '');
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

// import { pipeline } from '@xenova/transformers';

// const questionAI = ref('你是谁');

// const answerAI = ref('');

// async function go2AI() {
// 	let pipe = await pipeline('question-answering', 'uer/roberta-base-chinese-extractive-qa');

// 	// let context =
// 	// 	"You are an AI chatbot developed based on transformer.js. You know some information about the work of the host, Li Yunhua, which will help visitors understand the master's abilities, work experience, and development habits. The visitor is currently on the owner's profile. The owner, Li Runhua, is a Web front-end development engineer with a professional degree in network engineering, and is accustomed to using the front-end framework Vue in his work, and mostly develops in a cross-terminal environment.";

// 	let context = '我是黎润华制作的基于transformer.js的聊天机器人！';

// 	let out = await pipe('你是什么?', context);

// 	answerAI.value = out;
// }

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
	<div ref="canvasContainer" class="w-100vw h-100vh">
		<div
			class="w-full h-10 leading-5 flex absolute top-0 left-0 p-20px justify-between items-center text-#fff z-999"
		>
			<span ref="introduceRef" id="introduce" class="text-4 pl-20px max-w-1/2">Hello ！</span>
			<div class="text-3 max-w-1/2">
				<span class="pr-20px" @click="go2Home">Top</span
				><span class="pr-20px" @click="go2Works">Works</span
				><span class="pr-20px" @click="go2About">About me</span>
			</div>
		</div>
		<transition name="fade">
			<div
				v-if="!isWorksVisible && !isAboutVisible"
				class="w-full absolute bottom-20% left-0 flex w-full justify-center items-center text-4 text-#fff"
			>
				<!-- <span class="">Chatbot help you learn me!</span>
				<el-input
					v-model="questionAI"
					style="width: 240px"
					placeholder="Please input"
					@change="go2AI"
				/>
				<p>{{ answerAI }}</p> -->
				<span class="text-right">Continuous improvement</span>
				<span class="p-20px">&</span>
				<span>Infinite transcendence</span>
			</div>
		</transition>
		<transition name="exfade">
			<div
				v-if="isWorksVisible"
				class="w-full absolute top-15% left-0 flex w-full justify-center items-center text-4 text-#fff"
			>
				<div class="w-full flex flex-col items-center justify-center">
					<div class="flex mb-1">
						<div @click="leftWorks">
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M18.464 2.114a.998.998 0 0 0-1.033.063l-13 9a1.003 1.003 0 0 0 0 1.645l13 9A1 1 0 0 0 19 21V3a1 1 0 0 0-.536-.886M17 19.091L6.757 12L17 4.909z"
								/>
							</svg>
						</div>
						<span class="tracking--8 mx-20px">{{ page + 1 }}/8</span>
						<div @click="rightWorks">
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A.998.998 0 0 0 5 3v18a1 1 0 0 0 .536.886M7 4.909L17.243 12L7 19.091z"
								/>
							</svg>
						</div>
					</div>
					<div class="text-6 text-#fff">
						<a class="text-#fff" :href="works.link">{{ works.title }}</a>
					</div>
				</div>
			</div>
		</transition>
		<transition name="cvfade">
			<div
				v-if="isAboutVisible"
				class="w-full absolute top-8% left-0 flex w-full justify-center items-center text-4 text-#fff"
			>
				<el-button @click="downCV" class="w-40 h-12 text-4 rounded-full" size="large"
					>Download CV</el-button
				>
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

.exfade-enter-active,
.exfade-leave-active {
	transition: opacity 0.5s;
}

.exfade-enter,
.exfade-leave-to {
	opacity: 0;
}

.cvfade-enter-active,
.cvfade-leave-active {
	transition: opacity 0.5s;
}

.cvfade-enter,
.cvfade-leave-to {
	opacity: 0;
}
</style>
