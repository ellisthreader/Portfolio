import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HERO_3D_CONFIG } from '@/config/hero3d';

const TITLES = ['AI ENGINEER', 'FULL STACK DEVELOPER', 'SOFTWARE ENGINEER'];

function useTyping(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const doneTyping = displayed === current;
    const doneDeleting = displayed === '';
    const delay = deleting ? 50 : doneTyping ? 1200 : 80;

    const timer = window.setTimeout(() => {
      if (!deleting && !doneTyping) {
        setDisplayed(current.slice(0, displayed.length + 1));
        return;
      }

      if (!deleting && doneTyping) {
        setDeleting(true);
        return;
      }

      if (deleting && !doneDeleting) {
        setDisplayed(current.slice(0, displayed.length - 1));
        return;
      }

      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, displayed, wordIndex, words]);

  return displayed;
}

function ThreeHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      HERO_3D_CONFIG.cameraFov,
      container.clientWidth / container.clientHeight,
      HERO_3D_CONFIG.cameraNear,
      HERO_3D_CONFIG.cameraFar
    );
    camera.position.set(HERO_3D_CONFIG.cameraX, HERO_3D_CONFIG.cameraY, HERO_3D_CONFIG.cameraZ);
    camera.lookAt(HERO_3D_CONFIG.targetX, HERO_3D_CONFIG.targetY, HERO_3D_CONFIG.targetZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = HERO_3D_CONFIG.enableShadows;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, HERO_3D_CONFIG.directionalIntensity);
    directionalLight.position.set(
      HERO_3D_CONFIG.directionalX,
      HERO_3D_CONFIG.directionalY,
      HERO_3D_CONFIG.directionalZ
    );
    directionalLight.castShadow = HERO_3D_CONFIG.enableShadows;
    scene.add(directionalLight);

    const purpleRimLight = new THREE.PointLight(0xa855f7, 9.5, 28, 1.35);
    purpleRimLight.position.set(0, 2.45, -3.8);
    scene.add(purpleRimLight);

    const purpleBackFill = new THREE.SpotLight(0xc084fc, 7.2, 32, Math.PI / 3.2, 0.45, 1);
    purpleBackFill.position.set(-1.15, 3.25, -4.9);
    purpleBackFill.target.position.set(0, 1.2, 0);
    scene.add(purpleBackFill);
    scene.add(purpleBackFill.target);

    const neonBackBurst = new THREE.PointLight(0xe879f9, 7.8, 24, 1.15);
    neonBackBurst.position.set(0.75, 1.85, -4.2);
    scene.add(neonBackBurst);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = HERO_3D_CONFIG.groundY;
    ground.receiveShadow = HERO_3D_CONFIG.enableShadows;
    scene.add(ground);

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;
    let frameId = 0;
    const pointer = new THREE.Vector2(0, 0);
    const headEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    const headQuaternion = new THREE.Quaternion();
    let headBone: THREE.Object3D | null = null;
    let headBaseQuaternion: THREE.Quaternion | null = null;

    const updatePointer = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      const normalizedX = (event.clientX / width) * 2 - 1;
      const normalizedY = (event.clientY / height) * 2 - 1;

      pointer.x = THREE.MathUtils.clamp(normalizedX, -1, 1);
      pointer.y = THREE.MathUtils.clamp(normalizedY, -1, 1);
    };

    const resetPointer = () => {
      pointer.set(0, 0);
    };

    window.addEventListener('pointermove', updatePointer);
    window.addEventListener('pointerleave', resetPointer);

    loader.load(
      HERO_3D_CONFIG.modelPath,
      (gltf: GLTF) => {
        const model = gltf.scene;
        model.position.set(HERO_3D_CONFIG.modelX, HERO_3D_CONFIG.modelY, HERO_3D_CONFIG.modelZ);
        model.rotation.y = HERO_3D_CONFIG.modelRotY;
        model.scale.set(HERO_3D_CONFIG.modelScale, HERO_3D_CONFIG.modelScale, HERO_3D_CONFIG.modelScale);

        model.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh;
          if ('isMesh' in mesh && mesh.isMesh) {
            mesh.castShadow = HERO_3D_CONFIG.enableShadows;
            mesh.receiveShadow = HERO_3D_CONFIG.enableShadows;
          }

          if (child.name === 'CC_Base_Head') {
            headBone = child;
            headBaseQuaternion = child.quaternion.clone();
          }
        });

        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip: THREE.AnimationClip) => {
            mixer?.clipAction(clip).play();
          });
        }
      },
      undefined,
      (error: unknown) => {
        console.error('Failed to load model:', error);
      }
    );

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      camera.lookAt(HERO_3D_CONFIG.targetX, HERO_3D_CONFIG.targetY, HERO_3D_CONFIG.targetZ);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (mixer) mixer.update(clock.getDelta());

      if (headBone && headBaseQuaternion) {
        headEuler.set(
          -pointer.y * HERO_3D_CONFIG.headPitchLimit,
          -pointer.x * HERO_3D_CONFIG.headYawLimit,
          0
        );
        headQuaternion.setFromEuler(headEuler);
        headBone.quaternion.copy(headBaseQuaternion).multiply(headQuaternion);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', resetPointer);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-three-container" />;
}

function TypingJobs() {
  const typed = useTyping(TITLES);

  return (
    <div className="hero-right hero-text-panel">
      <p className="hero-role-label">I am a:</p>
      <p className="hero-typed">{typed}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head title="Ellis Threader" />
      <main className="hero-shell">
        <div className="hero-bg-glow" />

        <header className="hero-nav">
          <nav className="hero-nav-links">
            <a href="#about">ABOUT</a>
            <a href="#work">WORK</a>
            <a href="#contact">CONTACT</a>
          </nav>
        </header>

        <section className="hero-content">
          <div className="hero-left hero-text-panel">
            <p className="hero-greeting">Hello! I&apos;m</p>
            <p className="hero-name">ELLIS</p>
            <p className="hero-name">THREADER</p>
          </div>

          <div className="hero-canvas-wrap">
            <ThreeHero />
          </div>

          <TypingJobs />
        </section>
      </main>
    </>
  );
}
