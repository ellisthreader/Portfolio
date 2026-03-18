import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HERO_3D_CONFIG } from '@/config/hero3d';

const TITLES = ['AI Engineer', 'Full Stack Developer', 'Software Engineer'];

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = HERO_3D_CONFIG.enableShadows;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.target.set(HERO_3D_CONFIG.targetX, HERO_3D_CONFIG.targetY, HERO_3D_CONFIG.targetZ);

    const ambientLight = new THREE.AmbientLight(0xffffff, HERO_3D_CONFIG.ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, HERO_3D_CONFIG.directionalIntensity);
    directionalLight.position.set(
      HERO_3D_CONFIG.directionalX,
      HERO_3D_CONFIG.directionalY,
      HERO_3D_CONFIG.directionalZ
    );
    directionalLight.castShadow = HERO_3D_CONFIG.enableShadows;
    scene.add(directionalLight);

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
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      controls.update();
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      controls.dispose();
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
            <p className="hero-name">Ellis Threader</p>
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
