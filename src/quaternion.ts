import { Quaternion, Vector3 } from "three";

const mouse = new Vector3();

export function getQuaternion() {
	const z = new Vector3(0, 0, 1);
	const angle = -(Math.min(1, 2 * mouse.length()) * Math.PI) / 4;
	const normalized = mouse.length() > Number.EPSILON ? mouse.clone().normalize() : new Vector3(1, 0, 0);
	const axis = normalized.cross(z);
	const s = Math.sin(angle / 2);
	const c = Math.cos(angle / 2);
	return new Quaternion(axis.x * s, axis.y * s, axis.z * s, c);
}

export function getHighlightShift() {
	return (Math.atan2(mouse.y, mouse.x) + Math.PI / 4) * Math.min(1, mouse.length());
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.addEventListener("mousemove", (e) => {
	mouse.x = (2 * e.clientX) / innerHeight - innerWidth / innerHeight;
	mouse.y = 1 - (2 * e.clientY) / innerHeight;
});
canvas.addEventListener("touchmove", (e) => {
	e.preventDefault();
	const { touches, changedTouches } = e;
	const touch = touches[0] ?? changedTouches[0];
	mouse.x = (2 * touch.pageX) / innerHeight - innerWidth / innerHeight;
	mouse.y = 1 - (2 * touch.pageY) / innerHeight;
});
