import { Head } from '@inertiajs/react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Box3, MeshStandardMaterial, Vector3 } from 'three';
import type { Group, Mesh, Object3D } from 'three';

const TITLES = ['AI Engineer', 'Full Stack Developer', 'Software Engineer'];
const MODEL_PATH = '/assets/Untitled.glb';
const MODEL_WORLD_X = 0;
const MODEL_WORLD_Y = 0;
const MODEL_ROT_Y = Math.PI - 0.1;
const TARGET_MODEL_HEIGHT = 6.8;
const HEAD_OFFSET = 1.6;

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

function Model() {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF(MODEL_PATH) as { scene: Object3D };

  const prepared = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const min = box.min.clone();
    const max = box.max.clone();

    const modelHeightRaw = Math.max(size.y, 1);
    const normalizedScale = TARGET_MODEL_HEIGHT / modelHeightRaw;

    cloned.traverse((obj) => {
      const mesh = obj as Mesh;
      if ('isMesh' in mesh && mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (!mesh.material) {
          mesh.material = new MeshStandardMaterial({
            color: '#f5d0fe',
            emissive: '#7e22ce',
            emissiveIntensity: 0.35,
            roughness: 0.4,
            metalness: 0.1,
          });
        }
      }
    });

    const offset: [number, number, number] = [
      -center.x * normalizedScale,
      -center.y * normalizedScale,
      -center.z * normalizedScale,
    ];

    const modelBottomY = (min.y - center.y) * normalizedScale + MODEL_WORLD_Y;
    const modelTopY = (max.y - center.y) * normalizedScale + MODEL_WORLD_Y;
    const modelHeight = Math.max(1, modelTopY - modelBottomY);
    const focusY = modelTopY - modelHeight * 0.08 + HEAD_OFFSET;
    const cameraDistance = Math.max(3.6, modelHeight * 0.52);

    return { model: cloned, scale: normalizedScale, offset, focusY, cameraDistance };
  }, [gltf.scene]);

  useEffect(() => {
    camera.position.set(0, prepared.focusY + 0.12, prepared.cameraDistance);
    camera.lookAt(0, prepared.focusY, 0);
    camera.near = 0.1;
    camera.far = 600;
    camera.updateProjectionMatrix();
  }, [camera, prepared.cameraDistance, prepared.focusY]);

  return (
    <group ref={groupRef} position={[MODEL_WORLD_X, MODEL_WORLD_Y, 0]} rotation={[0, MODEL_ROT_Y, 0]}>
      <group scale={prepared.scale} position={prepared.offset}>
        <primitive object={prepared.model} dispose={null} />
      </group>
    </group>
  );
}

const CenterModel = memo(function CenterModel() {
  const cameraConfig = useMemo(() => ({ position: [0, 1.6, 7.4] as [number, number, number], fov: 35 }), []);
  const glConfig = useMemo(() => ({ alpha: true }), []);

  useEffect(() => {
    const originalWarn = console.warn;

    console.warn = (...args: unknown[]) => {
      const joined = args
        .map((arg) => {
          if (typeof arg === 'string') return arg;
          if (arg && typeof arg === 'object' && 'message' in arg) {
            return String((arg as { message?: string }).message ?? '');
          }
          return '';
        })
        .join(' ');

      if (joined.includes('THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.')) {
        return;
      }

      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div className="hero-canvas-wrap">
      <Canvas camera={cameraConfig} gl={glConfig}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 8, 3]} intensity={2.6} color="#f0c4ff" />
        <pointLight position={[-4, 2, 3]} intensity={2.2} color="#d946ef" />
        <pointLight position={[4, -1, 2]} intensity={1.8} color="#7c3aed" />
        <Model />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
});

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

          <CenterModel />

          <TypingJobs />
        </section>
      </main>
    </>
  );
}

useGLTF.preload(MODEL_PATH);
