import { Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector4 } from "three";
import fragmentShader from "./card.frag?raw";
import { getHighlightShift, getQuaternion } from "./quaternion";

export function makeCard() {
	return new Mesh(
		new PlaneGeometry(0.707, 1),
		new ShaderMaterial({
			uniforms: {
				time: { value: performance.now() / 1000 },
				highlightShift: { value: 0 },
				characterTexture: { value: new TextureLoader().load("/gopher.png") },
				quaternion: { value: new Vector4() },
			},
			vertexShader: `
                varying vec3 vUv; 

                void main() {
                vUv = position; 

                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition; 
                }
            `,
			fragmentShader,
		})
	);
}

export function updateCard(card: Mesh) {
	const quaternion = getQuaternion();
	const material = card.material as ShaderMaterial;

	material.uniforms.time.value = performance.now() / 1000;
	material.uniforms.highlightShift.value = getHighlightShift();
	material.uniforms.quaternion.value = quaternion;

	card.setRotationFromQuaternion(quaternion);
}
