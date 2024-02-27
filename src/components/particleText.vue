<template>
	<div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// import { TweenMax, Power1 } from 'gsap';

const props = defineProps<{
	scene: THREE.Scene;
	camera: THREE.Camera;
	renderer: THREE.WebGLRenderer;
}>();

// 粒子配置
// const particleCount = 6000;

// const particleSize = 0.3;

const triggers: Array<string> = ['CREATIVE'];

const loader = new FontLoader();
let typeface = '/swiss_black_cond.json';

onMounted(() => {
	loader.load(typeface, (font) => {
		triggers.forEach((trigger) => {
			const triggerGeometry = new TextGeometry(trigger, {
				font: font,
				size: window.innerWidth * 0.02,
				height: 4,
				curveSegments: 10
			});
			let mesh = new THREE.Mesh(triggerGeometry, new THREE.MeshBasicMaterial({ color: '#ffff00' }));
			mesh.scale.set(0.1, 0.1, 0.1);
			props.scene.add(mesh);
		});
	});
});
</script>
