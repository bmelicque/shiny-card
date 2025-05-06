import { Scene } from "three";
import { makeCard, updateCard } from "./card";
import { makeStars, updateStars } from "./stars";
import "./style.css";
import { makeCamera, makeRenderer } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const camera = makeCamera();
const renderer = makeRenderer(canvas);
const scene = new Scene();

const card = makeCard();
const stars = makeStars();

scene.add(card);
scene.add(stars);

const animate = () => {
	updateCard(card);
	updateStars(stars);
	renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
