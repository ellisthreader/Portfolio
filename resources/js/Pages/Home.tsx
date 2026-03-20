import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

type ModelScrollState = {
  positionX: number;
  rotationY: number;
  scale: number;
};

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

function initParallax(root: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', root);

  layers.forEach((layer) => {
    const amount = Number.parseFloat(layer.dataset.parallax ?? '14');
    const section = layer.closest('.scroll-section') ?? root;

    gsap.to(layer, {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

function initTextReveals(root: HTMLElement) {
  const revealNodes = gsap.utils.toArray<HTMLElement>('.js-reveal-down', root);

  revealNodes.forEach((node) => {
    gsap.fromTo(
      node,
      { y: -44, opacity: 0 },
      {
        y: 34,
        opacity: 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          end: 'top 40%',
          scrub: true,
        },
      }
    );
  });
}

function initTextParallaxUp(root: HTMLElement) {
  const nodes = gsap.utils.toArray<HTMLElement>('.js-parallax-up', root);

  nodes.forEach((node) => {
    const section = node.closest('.scroll-section') ?? root;

    gsap.to(node, {
      y: () => -window.innerHeight * 0.42,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

function initPinnedContent(root: HTMLElement) {
  const frames = gsap.utils.toArray<HTMLElement>('.pin-frame', root);
  if (frames.length === 0) return;

  gsap.set(frames, { autoAlpha: 0, y: 72, scale: 0.94 });
  gsap.set(frames[0], { autoAlpha: 1, y: 0, scale: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root.querySelector('.s-model-hold'),
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  frames.forEach((frame, index) => {
    const isLast = index === frames.length - 1;

    tl.to(frame, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.64,
      ease: 'power3.out',
    });

    if (!isLast) {
      tl.to(
        frame,
        {
          autoAlpha: 0.15,
          y: -46,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '+=0.34'
      );
    }
  });
}

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const typed = useTyping(TITLES);

  useEffect(() => {
    const root = pageRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.085,
    });

    const syncLenisWithScrollTrigger = () => ScrollTrigger.update();
    lenis.on('scroll', syncLenisWithScrollTrigger);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.95, 4.8);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.96);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf5d0fe, 1.72);
    directionalLight.position.set(2.8, 4.2, 3.8);
    scene.add(directionalLight);

    const accentLight = new THREE.PointLight(0xa855f7, 1.15, 18, 1.2);
    accentLight.position.set(-1.8, 1.3, 2.2);
    scene.add(accentLight);

    const pinkRim = new THREE.PointLight(0xe879f9, 0.95, 16, 1.3);
    pinkRim.position.set(1.5, 1.7, 2.4);
    scene.add(pinkRim);

    const modelAnchor = new THREE.Group();
    scene.add(modelAnchor);

    const modelState: ModelScrollState = {
      positionX: 0,
      rotationY: 0,
      scale: 1,
    };

    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Group | null = null;
    let rafId = 0;
    const clock = new THREE.Clock();

    const desktopLeftX = -1.62;
    const mobileLeftX = -0.88;

    const setCanvasSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', setCanvasSize);

    const ctx = gsap.context(() => {
      initParallax(root);
      initTextParallaxUp(root);
      initTextReveals(root);
      initPinnedContent(root);
    }, root);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/Untitled.glb',
      (gltf: GLTF) => {
        const model = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
        });

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
          });
        }

        modelRoot = model;
        modelAnchor.add(modelRoot);

        ScrollTrigger.matchMedia({
          '(max-width: 767px)': () => {
            modelState.positionX = 0;
            modelState.rotationY = 0;
            modelState.scale = 0.9;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root.querySelector('.s-model-shift'),
                start: 'top center',
                end: 'bottom center',
                scrub: true,
              },
            });

            tl.to(modelState, {
              positionX: mobileLeftX,
              rotationY: 0.55,
              scale: 0.82,
              ease: 'none',
            });

            return () => tl.kill();
          },
          '(min-width: 768px)': () => {
            modelState.positionX = 0;
            modelState.rotationY = 0;
            modelState.scale = 1;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root.querySelector('.s-model-shift'),
                start: 'top center',
                end: 'bottom center',
                scrub: true,
              },
            });

            tl.to(modelState, {
              positionX: desktopLeftX,
              rotationY: 0.58,
              scale: 0.92,
              ease: 'none',
            });

            return () => tl.kill();
          },
        });

        ScrollTrigger.refresh();
      },
      undefined,
      (error) => {
        console.error('Unable to load model:', error);
      }
    );

    const render = () => {
      rafId = window.requestAnimationFrame(render);

      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);

      if (modelRoot) {
        const idleTime = clock.elapsedTime;
        modelAnchor.position.x = THREE.MathUtils.lerp(modelAnchor.position.x, modelState.positionX, 0.12);
        modelAnchor.rotation.y = modelState.rotationY + Math.sin(idleTime * 0.8) * 0.05;

        const targetScale = modelState.scale;
        modelAnchor.scale.x = THREE.MathUtils.lerp(modelAnchor.scale.x || 1, targetScale, 0.12);
        modelAnchor.scale.y = THREE.MathUtils.lerp(modelAnchor.scale.y || 1, targetScale, 0.12);
        modelAnchor.scale.z = THREE.MathUtils.lerp(modelAnchor.scale.z || 1, targetScale, 0.12);
      }

      renderer.render(scene, camera);
    };

    render();

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setCanvasSize);
      ScrollTrigger.clearMatchMedia();

      gsap.ticker.remove(onTick);
      lenis.off('scroll', syncLenisWithScrollTrigger);
      lenis.destroy();

      if (modelRoot) {
        modelRoot.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;

          mesh.geometry.dispose();

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        });
      }

      renderer.dispose();
    };
  }, []);

  return (
    <>
      <Head title="Ellis Threader | 3D Scroll Experience" />
      <canvas ref={canvasRef} className="model-canvas" />

      <main ref={pageRef} className="scroll-page">
        <header className="hero-nav">
          <nav className="hero-nav-links">
            <a href="#about">ABOUT</a>
            <a href="#work">WORK</a>
            <a href="#contact">CONTACT</a>
          </nav>
        </header>

        <section className="scroll-section s-hero">
          <div className="parallax-layer orb" data-parallax="18" style={{ left: '6%', top: '14%' }} />
          <div className="parallax-layer halo" data-parallax="-14" style={{ right: '8%', bottom: '8%' }} />

          <div className="section-inner hero-front">
            <div className="hero-left-panel js-reveal-down js-parallax-up">
              <p className="hero-greeting">Hello! I&apos;m</p>
              <p className="hero-name">ELLIS</p>
              <p className="hero-name">THREADER</p>
            </div>

            <div className="hero-right-panel js-reveal-down js-parallax-up">
              <p className="hero-job-label">I am a:</p>
              <p className="hero-job-title">{typed}</p>
            </div>
          </div>
        </section>

        <section className="scroll-section s-model-shift">
          <div className="parallax-layer halo" data-parallax="13" style={{ left: '5%', top: '22%' }} />
          <div className="section-inner split-layout">
            <article className="content-card js-reveal-down js-parallax-up">
              <p className="card-label">Section 2</p>
              <h2>Model Shifts Left</h2>
              <p>
                As this section scrolls, ScrollTrigger scrubs the model position, rotation and scale to
                transition from center to left.
              </p>
            </article>
          </div>
        </section>

        <section className="scroll-section s-model-hold">
          <div className="section-inner split-layout">
            <div className="pin-copy js-reveal-down js-parallax-up">
              <p className="card-label">Section 3</p>
              <h2>Pinned Content Timeline</h2>
              <p>Model remains left while right-side frames animate sequentially in a pinned scene.</p>
            </div>

            <div className="pin-panel">
              <article className="pin-frame">
                <h3>Frame 01</h3>
                <p>Text enters with opacity + translateY.</p>
              </article>
              <article className="pin-frame">
                <h3>Frame 02</h3>
                <p>Scrubbed transitions stay locked to scroll progress.</p>
              </article>
              <article className="pin-frame">
                <h3>Frame 03</h3>
                <p>Pinned sequence resolves cleanly before the outro section.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="scroll-section s-outro">
          <div className="section-inner outro js-reveal-down js-parallax-up">
            <h2>Built with GSAP, ScrollTrigger, Three.js and Lenis</h2>
            <p>Smooth, responsive and ready to customize for your final brand style.</p>
          </div>
        </section>
      </main>
    </>
  );
}
