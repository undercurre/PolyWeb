<template>
	<div class="boxs">
		<div class="maskLoading" v-if="isLoading">
			<div class="loading">
				<div :style="{ width: loadingWidth + '%' }"></div>
			</div>
			<div style="padding-left: 10px">{{ loadingWidth }}%</div>
		</div>
		<div
			class="flex-col px-20px py-30px rounded-full bg-#fff/40 absolute left-30px bottom-50% transform translate-y-50%"
		>
			<!-- <p>x : {{ x }} y:{{ y }} z :{{ z }}</p> -->
			<!-- <button @click="isAutoFun">转动车</button>
			<button @click="stop">停止</button> -->
			<!-- <div class="flex">
				<div
					@click="setCarColor(index)"
					v-for="(item, index) in colorAry"
					:key="item"
					:style="{ backgroundColor: item }"
				></div>
			</div> -->

			<div
				class="flex-col justify-center items-center"
				v-for="(item, index) in recordColorArr"
				:key="item.name"
			>
				<div
					class="w-400px h-400px rounded-full"
					@click="setCarColor(index)"
					:style="{ backgroundColor: item.value }"
				></div>
				<p class="text-#000 text-center font-bold">{{ item.name }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import {
	Camera,
	DirectionalLight,
	HemisphereLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	AmbientLight,
	// PointLight,
	Color,
	GridHelper
	// PointLightHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//车身颜色数组
// const colorAry = [
// 	'rgb(216, 27, 67)',
// 	'rgb(142, 36, 170)',
// 	'rgb(81, 45, 168)',
// 	'rgb(48, 63, 159)',
// 	'rgb(30, 136, 229)',
// 	'rgb(0, 137, 123)',
// 	'rgb(67, 160, 71)',
// 	'rgb(251, 192, 45)',
// 	'rgb(245, 124, 0)',
// 	'rgb(230, 74, 25)',
// 	'rgb(233, 30, 78)',
// 	'rgb(156, 39, 176)',
// 	'rgb(0, 0, 0)'
// ]; // 车身颜色数组
const recordColorArr: Array<{
	name: string;
	value: string;
}> = [
	{ name: '紫罗兰', value: '#EE82EE' },
	{ name: '午夜', value: '#191970' },
	{ name: '森林', value: '#228B22' },
	{ name: '珊瑚', value: '#FF7F50' }
];
// 设置点光源的初始旋转角度
// let angle = 0;
// const lightColor = new Color();
const loader = new GLTFLoader(); //引入模型的loader实例
const defaultMap = {
	x: 5,
	y: 4,
	z: 5
}; // 相机的默认坐标
const map = reactive(defaultMap); //把相机坐标设置成可观察对象
// const { x, y, z } = toRefs(map); //输出坐标给模板使用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let scene: Scene,
	camera: Camera,
	renderer: WebGLRenderer,
	controls: OrbitControls,
	directionalLight,
	ambientLight,
	pointLight: DirectionalLight,
	// pointLightHelper,
	hemisphereLight; // 定义所有three实例变量
let isLoading = ref(true); //是否显示loading  这个load模型监听的进度
let loadingWidth = ref(0); // loading的进度

//创建灯光
const setLight = () => {
	directionalLight = new DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-4, 8, 4);
	hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 0.4);
	hemisphereLight.position.set(0, 8, 0);
	ambientLight = new AmbientLight(0x404040, 100);
	pointLight = new DirectionalLight(0xffffff, 10);
	pointLight.position.set(0, 3, 0);
	// 创建点光源辅助对象
	// pointLightHelper = new PointLightHelper(pointLight);
	// scene.add(pointLightHelper);
	scene.add(pointLight);
	scene.add(directionalLight);
	scene.add(hemisphereLight);
	scene.add(ambientLight);
};

// 创建场景
const setScene = () => {
	scene = new Scene();
	renderer = new WebGLRenderer();
	renderer.setSize(innerWidth, innerHeight);
	const container = document.querySelector('.boxs');
	renderer.setClearColor('#fff');
	scene.background = new Color('#ccc');
	if (container) {
		container.appendChild(renderer.domElement);
	}
};

// 创建相机
const setCamera = () => {
	const { x, y, z } = defaultMap;
	camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
	camera.position.set(x, y, z);
};

// 设置模型控制
const setControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = (0.9 * Math.PI) / 2;
	controls.enableZoom = true;
	controls.addEventListener('change', render);
};

// 设置网格地板
const setGround = () => {
	const gridHelper = new GridHelper(10, 10);
	gridHelper.material.opacity = 0.2;
	gridHelper.material.transparent = true;
	scene.add(gridHelper);
};

//返回坐标信息
const render = () => {
	map.x = camera.position.x;
	map.y = camera.position.y;
	map.z = camera.position.z;
};

// 循环场景 、相机、 位置更新
const loop = () => {
	requestAnimationFrame(loop);
	renderer.render(scene, camera);
	// 旋转点光源
	// angle += 0.1;
	// const radius = 5; // 旋转半径
	// pointLight.position.y = radius * Math.sin(angle);
	// pointLight.position.z = radius * Math.cos(angle);

	// 更新点光源辅助对象的位置
	// pointLightHelper.update();
	// 计算光颜色随着旋转角度渐变
	// lightColor.setHSL((angle % Math.PI) / Math.PI, 1, 0.5);
	// pointLight.color.copy(lightColor);
	controls.update();
};

//是否自动转动
// const isAutoFun = () => {
// 	controls.autoRotate = true;
// };
//停止转动
// const stop = () => {
// 	controls.autoRotate = false;
// };

//设置车身颜色
const setCarColor = (index: number) => {
	if (recordColorArr) {
		// scene.traverse遍历场景中的所有对象（包括子对象和孙对象等）
		scene.traverse((child: any) => {
			// 只有Mesh类才有材质
			if (child.isMesh) {
				// 找到
				if (child.name.includes('door_rf_ok_2')) {
					console.log(child);
					child.material.color = new Color(recordColorArr[index].value);
				}
			}
		});
	}
};

// function rgbStringToObject(rgbString: string) {
// 	const matches = rgbString.match(/\d+/g);
// 	if (matches && matches.length === 3) {
// 		const [r, g, b] = matches;
// 		return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
// 	}
// 	return null; // 处理无效的RGB字符串
// }

const loadFile = (url: string) => {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(gltf) => {
				resolve(gltf);
			},
			({ loaded, total }) => {
				let load = Math.abs((loaded / total) * 100);
				loadingWidth.value = load;
				if (load >= 100) {
					setTimeout(() => {
						isLoading.value = false;
					}, 1000);
				}
				console.log((loaded / total) * 100 + '% loaded');
			},
			(err) => {
				reject(err);
			}
		);
	});
};

//初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setLight();
	setControls();
	setGround();
	const gltf = await loadFile('src/assets/3d/mulliner.glb');
	scene.add((gltf as any).scene);
	loop();
};
//用vue钩子函数调用
onMounted(init);
</script>

<style>
body {
	margin: 0;
}

/* stylelint-disable-next-line selector-class-pattern */
.maskLoading {
	position: fixed;
	inset: 0;
	z-index: 1111111;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	background: #000;
}

/* stylelint-disable-next-line selector-class-pattern */
.maskLoading .loading {
	width: 400px;
	height: 20px;
	overflow: hidden;
	background: #000;
	border: 1px solid #fff;
	border-radius: 10px;
}

/* stylelint-disable-next-line selector-class-pattern */
.maskLoading .loading div {
	width: 0;
	height: 20px;
	background: #fff;
	transition-timing-function: ease-in;
	transition-duration: 500ms;
}

canvas {
	width: 100%;
	height: 100%;
	margin: auto;
}

.mask {
	position: absolute;
	bottom: 50%;
	left: 0;
	width: 100%;
	color: #fff;
	transform: translateY(50%);
}
</style>
