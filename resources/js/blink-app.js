import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101418);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.4, 3.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
directionalLight.position.set(2, 4, 3);
scene.add(directionalLight);

const loader = new GLTFLoader();
const clock = new THREE.Clock();

let mixer = null;
let blinkAction = null;
let blinkTimeoutId = null;
let isBlinkPlaying = false;
const BLINK_INTERVAL_MS = 3000;

function getRandomBlinkDelay() {
  return BLINK_INTERVAL_MS;
}

function scheduleNextBlink() {
  if (!blinkAction || isBlinkPlaying) return;

  window.clearTimeout(blinkTimeoutId);
  blinkTimeoutId = window.setTimeout(() => {
    playBlink();
  }, getRandomBlinkDelay());
}

function playBlink() {
  if (!blinkAction || isBlinkPlaying) return;

  isBlinkPlaying = true;

  blinkAction.stop();
  blinkAction.reset();
  blinkAction.setLoop(THREE.LoopOnce, 1);
  blinkAction.clampWhenFinished = false;
  blinkAction.enabled = true;
  blinkAction.setEffectiveWeight(1);
  blinkAction.setEffectiveTimeScale(1);
  blinkAction.play();
}

function pickBlinkClip(clips) {
  const namePriority = clips.find((clip) => /(blink|eye|eyelid|close)/i.test(clip.name));
  if (namePriority) return namePriority;

  const withDuration = clips.filter((clip) => clip.duration > 0);
  if (withDuration.length === 0) return clips[0] ?? null;

  withDuration.sort((a, b) => a.duration - b.duration);
  return withDuration[0];
}

loader.load(
  './model.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.position.y -= box.min.y;

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      console.table(
        gltf.animations.map((clip, index) => ({
          index,
          name: clip.name,
          duration: Number(clip.duration.toFixed(3)),
        }))
      );
      const blinkClip = pickBlinkClip(gltf.animations);
      if (!blinkClip) {
        console.warn('No usable animation clip found in model.glb');
        return;
      }
      console.log('Using blink clip:', blinkClip.name || '(unnamed)');

      blinkAction = mixer.clipAction(blinkClip);
      blinkAction.setLoop(THREE.LoopOnce, 1);
      blinkAction.clampWhenFinished = false;
      mixer.addEventListener('finished', (event) => {
        if (event.action !== blinkAction) return;

        isBlinkPlaying = false;
        blinkAction.stop();
        blinkAction.reset();
        scheduleNextBlink();
      });

      playBlink();
      scheduleNextBlink();
    } else {
      console.warn('No animation clips found in model.glb');
    }
  },
  undefined,
  (error) => {
    console.error('Failed to load model.glb', error);
  }
);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }

  renderer.render(scene, camera);
}

render();
