import {
	AdditiveBlending,
	BufferGeometry,
	Float32BufferAttribute,
	Points,
	Quaternion,
	ShaderMaterial,
	TextureLoader,
} from "three";
import { getQuaternion } from "./quaternion";

const PARTICLE_COUNT = 12;
const BASE_SIZE = 40;

const vertexShader = `
    attribute float size;
    attribute float blinkOffset;
  
    varying float vBlinkOffset;
    
    void main() {
        vBlinkOffset = blinkOffset;
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0) ;
    }
  `;

const fragmentShader = `
    varying float vBlinkOffset;

    uniform vec4 quaternion;
    uniform sampler2D starTexture;
  
    void main() {
        vec2 uv = gl_PointCoord;
        float brightness = 0.7+0.3*cos(10.*(quaternion.x + quaternion.y) + vBlinkOffset);
        gl_FragColor = texture2D(starTexture, uv)*brightness;
    }
`;

function makeGeometry() {
	const positions = [];
	const sizes = [];
	const timeOffsets = [];

	for (let i = 0; i < PARTICLE_COUNT; i++) {
		const line = (i / 3) | 0;
		const col = i % 3;
		const x = ((Math.random() + col - 1.5) / 3) * 0.7;
		const y = (Math.random() + line - 2) / 4;
		const z = 0.05;
		positions.push(x, y, z);

		const size = BASE_SIZE * (Math.random() + 0.5);
		sizes.push(size);

		timeOffsets.push(Math.random() * 5);
	}

	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
	geometry.setAttribute("blinkOffset", new Float32BufferAttribute(timeOffsets, 1));
	return geometry;
}

export function makeStars() {
	return new Points(
		makeGeometry(),
		new ShaderMaterial({
			uniforms: {
				starTexture: { value: new TextureLoader().load("/star.png") },
				quaternion: { value: new Quaternion() },
			},
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,
			alphaTest: 0.1,
		})
	);
}

export function updateStars(stars: Points) {
	const quaternion = getQuaternion();
	(stars.material as ShaderMaterial).uniforms.quaternion.value = quaternion;
	stars.setRotationFromQuaternion(quaternion);
}
