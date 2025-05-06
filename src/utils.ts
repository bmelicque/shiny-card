import { OrthographicCamera, WebGLRenderer } from "three";

function resizeCamera(camera: OrthographicCamera) {
	const minSize = 1.5;
	const aspect = innerWidth / innerHeight;
	const height = minSize * Math.max(0.7 / aspect, 1);
	const width = minSize * Math.max(0.7, aspect);
	camera.left = -width / 2;
	camera.right = width / 2;
	camera.top = height / 2;
	camera.bottom = -height / 2;
	camera.updateProjectionMatrix();
}

export function makeCamera() {
	const camera = new OrthographicCamera();
	camera.position.z = 15;
	resizeCamera(camera);
	window.addEventListener("resize", () => resizeCamera(camera));
	return camera;
}

export function makeRenderer(canvas: HTMLCanvasElement) {
	const renderer = new WebGLRenderer({ canvas, alpha: true });
	renderer.setSize(innerWidth, innerHeight);
	window.addEventListener("resize", () => renderer.setSize(innerWidth, innerHeight));
	renderer.shadowMap.enabled = true;
	return renderer;
}
