/*
 * @Author: hongbin
 * @Date: 2023-03-28 16:35:20
 * @LastEditors: hongbin
 * @LastEditTime: 2023-03-30 17:08:09
 * @Description:
 */
import * as THREE from 'three';
import vertexShader from './vt.glsl';
import fragmentShader from './fm.glsl';

interface ITranslate {
	geometry: THREE.BufferGeometry;
	color: THREE.Color[];
}

export class ParticleEffect {
	pointNumber: number;
	bufferGeometry: THREE.BufferGeometry;
	particle: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
	position: Float32Array;
	material: THREE.ShaderMaterial;
	toPosition: Float32Array;
	speed: Float32Array;
	color: Float32Array;
	toColor: Float32Array;
	scale: Float32Array;
	initToPosition: Float32Array;

	constructor(pointNumber = 1000) {
		this.pointNumber = pointNumber;

		this.bufferGeometry = new THREE.BufferGeometry();
		this.position = new Float32Array(pointNumber * 3);

		this.bufferGeometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3));

		this.toPosition = new Float32Array(pointNumber * 3);
		this.initToPosition = new Float32Array(pointNumber * 3);

		this.bufferGeometry.setAttribute('toPosition', new THREE.BufferAttribute(this.toPosition, 3));

		this.color = new Float32Array(pointNumber * 3);

		this.bufferGeometry.setAttribute('color', new THREE.BufferAttribute(this.color, 3));

		this.toColor = new Float32Array(pointNumber * 3);

		this.bufferGeometry.setAttribute('toColor', new THREE.BufferAttribute(this.toColor, 3));

		this.speed = new Float32Array(pointNumber);

		this.bufferGeometry.setAttribute('speed', new THREE.BufferAttribute(this.speed, 1));

		this.scale = new Float32Array(pointNumber);

		this.bufferGeometry.setAttribute('scale', new THREE.BufferAttribute(this.scale, 1));

		this.material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				progress: { value: 0 },
				yBoundingBox: { value: new THREE.Vector2(-100, 100) }
			},
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthTest: false
		});

		this.particle = new THREE.Points(this.bufferGeometry, this.material);
		this.init();
	}

	setProgress(progress: number) {
		this.material.uniforms.progress.value = progress;
	}

	init() {
		const { random } = Math;
		for (let index = 0; index < this.pointNumber; index++) {
			const i3 = index * 3;
			this.toPosition[i3] = (0.5 - random()) * 200;
			this.toPosition[i3 + 1] = (0.5 - random()) * 200;
			this.toPosition[i3 + 2] = (0.5 - random()) * 200;

			this.initToPosition[i3] = this.toPosition[i3];
			this.initToPosition[i3 + 1] = this.toPosition[i3 + 1];
			this.initToPosition[i3 + 2] = this.toPosition[i3 + 2];

			this.toColor[i3] = 1;
			this.toColor[i3 + 1] = 1;
			this.toColor[i3 + 2] = 1;

			this.scale[index] = 0.5 + random() * 0.5;

			this.speed[index] = 0.5 + random() * 0.5;
		}
		this.bufferGeometry.attributes.toPosition.needsUpdate = true;
		this.bufferGeometry.attributes.speed.needsUpdate = true;
		this.bufferGeometry.attributes.scale.needsUpdate = true;
	}

	translate(from: ITranslate, to: ITranslate) {
		const fromPosition = from.geometry.getAttribute('position');
		const toPosition = to.geometry.getAttribute('position');

		const fromCount = fromPosition.count;
		const toCount = toPosition.count;

		let fromIndex = 0;
		let toIndex = 0;
		const { random } = Math;

		!from.geometry.boundingBox && from.geometry.computeBoundingBox();
		!to.geometry.boundingBox && to.geometry.computeBoundingBox();
		const { min: fromMin, max: fromMax } = from.geometry.boundingBox!;
		const { min: toMin, max: toMax } = to.geometry.boundingBox!;

		this.particle.material.uniforms.yBoundingBox.value.set(toMin.y, toMax.y);

		const fromDisColor = new THREE.Color();
		const toDisColor = new THREE.Color();
		fromDisColor.r = from.color[1].r - from.color[0].r;
		fromDisColor.g = from.color[1].g - from.color[0].g;
		fromDisColor.b = from.color[1].b - from.color[0].b;
		toDisColor.r = to.color[1].r - to.color[0].r;
		toDisColor.g = to.color[1].g - to.color[0].g;
		toDisColor.b = to.color[1].b - to.color[0].b;

		for (let index = 0; index < this.pointNumber; index++) {
			const i3 = index * 3;
			fromIndex %= fromCount;
			toIndex %= toCount;

			const fromIndex3 = fromIndex * 3;
			const toIndex3 = toIndex * 3;

			this.position[i3] = fromPosition.array[fromIndex3];
			this.position[i3 + 1] = fromPosition.array[fromIndex3 + 1];
			this.position[i3 + 2] = fromPosition.array[fromIndex3 + 2];

			this.toPosition[i3] = toPosition.array[toIndex3];
			this.toPosition[i3 + 1] = toPosition.array[toIndex3 + 1];
			this.toPosition[i3 + 2] = toPosition.array[toIndex3 + 2];

			const fromPercent = (this.position[i3 + 1] - fromMin.x) / (fromMax.x - fromMin.x);
			const toPercent = (this.toPosition[i3 + 1] - toMin.x) / (toMax.x - toMin.x);

			this.color[i3] = from.color[0]['r'] + fromPercent * fromDisColor['r'];
			this.color[i3 + 1] = from.color[0]['g'] + fromPercent * fromDisColor['g'];
			this.color[i3 + 2] = from.color[0]['b'] + fromPercent * fromDisColor['b'];

			this.toColor[i3] = to.color[0]['r'] + toPercent * toDisColor['r'];
			this.toColor[i3 + 1] = to.color[0]['g'] + toPercent * toDisColor['g'];
			this.toColor[i3 + 2] = to.color[0]['b'] + toPercent * toDisColor['b'];

			this.speed[index] = 0.5 + random() * 0.5;
			fromIndex++;
			toIndex++;
		}
		this.bufferGeometry.attributes.position.needsUpdate = true;
		this.bufferGeometry.attributes.speed.needsUpdate = true;
		this.bufferGeometry.attributes.toPosition.needsUpdate = true;
		this.bufferGeometry.attributes.color.needsUpdate = true;
		this.bufferGeometry.attributes.toColor.needsUpdate = true;
	}

	to(geometry: THREE.BufferGeometry, color: THREE.Color[]) {
		const { array, count } = geometry.getAttribute('position');

		!geometry.boundingBox && geometry.computeBoundingBox();
		const { min, max } = geometry.boundingBox!;

		const disColor = new THREE.Color();
		disColor.r = color[1].r - color[0].r;
		disColor.g = color[1].g - color[0].g;
		disColor.b = color[1].b - color[0].b;

		let targetIndex = 0;
		const { random } = Math;
		for (let index = 0; index < this.pointNumber; index++) {
			const i3 = index * 3;
			targetIndex %= count;
			const targetIndex3 = targetIndex * 3;
			this.position[i3] = this.toPosition[i3];
			this.position[i3 + 1] = this.toPosition[i3 + 1];
			this.position[i3 + 2] = this.toPosition[i3 + 2];

			this.toPosition[i3] = array[targetIndex3];
			this.toPosition[i3 + 1] = array[targetIndex3 + 1];
			this.toPosition[i3 + 2] = array[targetIndex3 + 2];

			this.color[i3] = this.toColor[i3];
			this.color[i3 + 1] = this.toColor[i3 + 1];
			this.color[i3 + 2] = this.toColor[i3 + 2];

			const percent = (this.toPosition[i3 + 1] - min.y) / (max.y - min.y);

			this.toColor[i3] = color[0].r + percent * disColor['r'];
			this.toColor[i3 + 1] = color[0].g + percent * disColor['g'];
			this.toColor[i3 + 2] = color[0].b + percent * disColor['b'];

			this.speed[index] = 0.5 + random() * 0.5;

			targetIndex++;
		}

		this.bufferGeometry.attributes.position.needsUpdate = true;
		this.bufferGeometry.attributes.speed.needsUpdate = true;
		this.bufferGeometry.attributes.toPosition.needsUpdate = true;
		this.bufferGeometry.attributes.color.needsUpdate = true;
		this.bufferGeometry.attributes.toColor.needsUpdate = true;
	}
}
