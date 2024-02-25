<!-- <script setup lang="ts">
import * as THREE from 'three';
import { TweenMax, Power1 } from 'gsap';

// 容器
const canvasContainer = ref<HTMLElement | null>(null);

// 先集中创建容器变量
let scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera;

let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();

let createCarPos = true;
let uSpeed = 0.001;
let setcolor = 0xf02050;

let setTintNum = true;

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
	// 调整朝向
	camera.lookAt(0, 0, 0);
};

// 创建几何体
const setGeometry = () => {
	var segments = 2;
	for (var i = 1; i < 100; i++) {
		var geometry = new THREE.BoxGeometry(1, 0, 0, segments, segments, segments);
		var material = new THREE.MeshPhongMaterial({
			color: setTintColor(),
			wireframe: false,
			flatShading: false,
			side: THREE.DoubleSide
		});
		var wmaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			wireframe: true,
			transparent: true,
			opacity: 0.03,
			side: THREE.DoubleSide
		});

		var cube = new THREE.Mesh(geometry, material);
		var wire = new THREE.Mesh(geometry, wmaterial);
		var floor = new THREE.Mesh(geometry, material);
		var wfloor = new THREE.Mesh(geometry, wmaterial);

		cube.add(wfloor);
		cube.castShadow = true;
		cube.receiveShadow = true;
		cube.rotation.set(
			Math.random() * Math.PI * 2, // 随机旋转角度绕 X 轴
			Math.random() * Math.PI * 2, // 随机旋转角度绕 Y 轴
			Math.random() * Math.PI * 2 // 随机旋转角度绕 Z 轴
		);

		floor.scale.y = 0.05; //+mathRandom(0.5);
		cube.scale.y = 0.1 + Math.abs(mathRandom(8));

		var cubeWidth = 0.9;
		cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
		//cube.position.y = cube.scale.y / 2;
		cube.position.x = Math.round(mathRandom());
		cube.position.z = Math.round(mathRandom());

		floor.position.set(cube.position.x, 0 /*floor.scale.y / 2*/, cube.position.z);

		town.add(floor);
		town.add(cube);
	}
	//----------------------------------------------------------------- Particular

	var gmaterial = new THREE.MeshToonMaterial({ color: 0xffff00, side: THREE.DoubleSide });
	var gparticular = new THREE.CircleGeometry(0.01, 3);
	var aparticular = 5;

	for (var h = 1; h < 300; h++) {
		var particular = new THREE.Mesh(gparticular, gmaterial);
		particular.position.set(
			mathRandom(aparticular),
			mathRandom(aparticular),
			mathRandom(aparticular)
		);
		particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
		smoke.add(particular);
	}

	var pmaterial = new THREE.MeshStandardMaterial({
		color: 0x000000,
		side: THREE.DoubleSide,
		roughness: 10,
		metalness: 0.6,
		opacity: 0.9,
		transparent: true
	});
	var pgeometry = new THREE.PlaneGeometry(60, 60);
	var pelement = new THREE.Mesh(pgeometry, pmaterial);
	pelement.rotation.x = (-90 * Math.PI) / 180;
	pelement.position.y = -0.001;
	pelement.receiveShadow = true;

	city.add(pelement);
};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
	INTERSECTED;
var intersected;

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

//----------------------------------------------------------------- Lights
var ambientLight = new THREE.AmbientLight(0xffffff, 4);
var lightFront = new THREE.SpotLight(0xffffff, 20, 10);
var lightBack = new THREE.PointLight(0xffffff, 0.5);

var spotLightHelper = new THREE.SpotLightHelper(lightFront);
//scene.add( spotLightHelper );

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

var gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
city.add(gridHelper);

var createCars = function (cScale = 2, cPos = 20, cColor = 0xffff00) {
	var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
	var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
	var cElem = new THREE.Mesh(cGeo, cMat);
	var cAmp = 3;

	if (createCarPos) {
		createCarPos = false;
		cElem.position.x = -cPos;
		cElem.position.z = mathRandom(cAmp);

		TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
	} else {
		createCarPos = true;
		cElem.position.x = mathRandom(cAmp);
		cElem.position.z = -cPos;
		cElem.rotation.y = (90 * Math.PI) / 180;

		TweenMax.to(cElem.position, 5, {
			z: cPos,
			repeat: -1,
			yoyo: true,
			delay: mathRandom(3),
			ease: Power1.easeInOut
		});
	}
	cElem.receiveShadow = true;
	cElem.castShadow = true;
	cElem.position.y = Math.abs(mathRandom(5));
	city.add(cElem);
};

var generateLines = function () {
	for (var i = 0; i < 60; i++) {
		createCars(0.1, 20);
	}
};

var cameraSet = function () {
	createCars(0.1, 20, 0xffffff);
};

// 渲染函数
const render = () => {
	var time = Date.now() * 0.00005;
	requestAnimationFrame(render);

	city.rotation.y -= (mouse.x * 8 - camera.rotation.y) * uSpeed;
	city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
	if (city.rotation.x < -0.05) city.rotation.x = -0.05;
	else if (city.rotation.x > 1) city.rotation.x = 1;
	var cityRotation = Math.sin(Date.now() / 5000) * 13;

	for (let i = 0, l = town.children.length; i < l; i++) {
		var object = town.children[i];
	}

	smoke.rotation.y += 0.01;
	smoke.rotation.x += 0.01;

	camera.lookAt(city.position);
	renderer.render(scene, camera);
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setGeometry();
	generateLines();
	render();
};

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
	<div ref="canvasContainer">
		<div class="container-fluid fixed-top header disable-selection">
			<div class="row">
				<div class="col"></div>
				<div class="col-md-6">
					<div class="row">
						<div class="col">
							<h1><strong>Lab City 3D</strong></h1>
							<p class="small">– Back to the red –</p>
							<!--.btn.btn-danger(href='#',role='button', onclick='cameraSet()') + ADD LINE-->
						</div>
					</div>
				</div>
				<div class="col"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
body {
	margin: 0;
	color: #fff;
	text-align: center;
	background-color: #000;
	cursor: crosshair;
}

canvas {
	display: block;
	width: 100%;
	height: 100%;
}

p {
	color: rgb(255 255 255 / 50%);
}

.header {
	top: 42%;
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
</style> -->
