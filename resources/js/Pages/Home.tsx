import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HomeStyles } from '../styles/home';

gsap.registerPlugin(ScrollTrigger);

type ModelScrollState = {
  positionX: number;
  rotationY: number;
  scale: number;
};

const TITLES = ['AI ENGINEER', 'FULL STACK DEVELOPER', 'SOFTWARE ENGINEER'];
const TERMINAL_LINES = [
  '> Initializing portfolio...',
  '> Loading projects...',
  '> Compiling experience...',
  '> Optimizing performance...',
  '> Launching interface...',
  '> Done.',
];
const TOTAL_TERMINAL_CHARS = TERMINAL_LINES.reduce((count, line) => count + line.length, 0);

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
  const loaderOverlayRef = useRef<HTMLDivElement | null>(null);
  const loaderIrisRef = useRef<HTMLDivElement | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const hasStartedRevealRef = useRef(false);
  const isSceneReadyRef = useRef(false);
  const isTypingDoneRef = useRef(false);
  const typingProgressRef = useRef(0);
  const modelProgressRef = useRef(0);
  const overallProgressRef = useRef(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeTerminalLine, setActiveTerminalLine] = useState('');
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showSocial, setShowSocial] = useState(false);
  const typed = useTyping(TITLES);

  useEffect(() => {
    const root = pageRef.current;
    const canvas = canvasRef.current;
    const loaderOverlay = loaderOverlayRef.current;
    const loaderIris = loaderIrisRef.current;
    if (!root || !canvas || !loaderOverlay || !loaderIris) return;

    const maybeStartReveal = () => {
      if (!isSceneReadyRef.current || !isTypingDoneRef.current || hasStartedRevealRef.current) return;
      hasStartedRevealRef.current = true;
      overallProgressRef.current = 100;
      setTerminalProgress(100);
      const terminalShell = loaderOverlay.querySelector<HTMLElement>('.terminal-shell');
      const shellRect = terminalShell?.getBoundingClientRect();
      const shellScaleTarget = shellRect
        ? Math.max(window.innerWidth / shellRect.width, window.innerHeight / shellRect.height) * 1.18
        : 4.2;

      revealTimeoutRef.current = window.setTimeout(() => {
        introTimelineRef.current = gsap
          .timeline({
            defaults: {
              ease: 'power3.out',
            },
            onComplete: () => {
              setShowLoader(false);
              setShowSocial(true);
            },
          })
          .set([canvas, root], {
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity, filter',
            force3D: true,
          })
          .set('.terminal-shell', {
            transformOrigin: '50% 50%',
            willChange: 'transform, border-radius, box-shadow, filter',
            force3D: true,
          })
          .set(loaderIris, { autoAlpha: 0, scale: 0.6 })
          .to(
            '.terminal-topbar, .terminal-body, .terminal-footer',
            {
              autoAlpha: 0,
              y: -8,
              duration: 0.3,
              ease: 'power1.out',
            },
            0
          )
          .to(
            loaderIris,
            {
              autoAlpha: 0.72,
              scale: 10,
              duration: 0.92,
              ease: 'power4.out',
            },
            0.1
          )
          .to(
            '.terminal-shell',
            {
              scale: shellScaleTarget * 0.9,
              duration: 0.64,
              ease: 'power2.in',
            },
            0.08
          )
          .to(
            '.terminal-shell',
            {
              scale: shellScaleTarget,
              borderRadius: '0px',
              duration: 0.5,
              ease: 'power4.out',
            },
            0.72
          )
          .fromTo(
            [canvas, root],
            {
              autoAlpha: 1,
              scale: 1.09,
              filter: 'blur(16px) brightness(0.65)',
            },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1)',
              duration: 0.96,
              stagger: 0.05,
              ease: 'power2.out',
              onStart: () => setIsIntroComplete(true),
            },
            0.74
          )
          .to(
            '.terminal-shell',
            {
              borderColor: 'rgba(0, 0, 0, 0)',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              duration: 0.42,
              ease: 'sine.out',
            },
            0.9
          )
          .to(
            loaderOverlay,
            {
              backgroundColor: 'rgba(5, 3, 11, 0)',
              autoAlpha: 0,
              duration: 0.54,
              ease: 'power2.inOut',
            },
            0.92
          )
          .call(() => {
            gsap.set([canvas, root], { clearProps: 'filter,transform,willChange,force3D' });
            gsap.set('.terminal-shell', { clearProps: 'transform,borderRadius,boxShadow,borderColor,willChange,force3D' });
          })
          .fromTo(
            '.hero-nav-links a',
            { autoAlpha: 0, y: -14 },
            { autoAlpha: 1, y: 0, duration: 0.92, stagger: 0.07, ease: 'power2.out' },
            1.1
          )
          .fromTo(
            '.hero-greeting, .hero-name, .hero-job-label, .hero-job-title',
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 1.15, stagger: 0.08, ease: 'power3.out' },
            1.18
          )
          .to(ambientLight, { intensity: ambientTarget, duration: 1.9, ease: 'sine.out' }, 0.74)
          .to(directionalLight, { intensity: directionalTarget, duration: 2.2, ease: 'sine.out' }, '<')
          .to(accentLight, { intensity: accentTarget, duration: 2.35, ease: 'sine.out' }, '<')
          .to(pinkRim, { intensity: rimTarget, duration: 2.55, ease: 'sine.out' }, '<')
          .to(backlight, { intensity: backlightTarget, duration: 2.7, ease: 'sine.out' }, '<');
      }, 1200);
    };

    const finishIntro = () => {
      modelProgressRef.current = 100;
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      setTerminalProgress(nextProgress);
      isSceneReadyRef.current = true;
      maybeStartReveal();
    };

    const updateTerminalProgress = (lineIndex: number, charIndex: number) => {
      const completedChars = TERMINAL_LINES.slice(0, lineIndex).reduce((count, line) => count + line.length, 0);
      const typedChars = Math.min(completedChars + charIndex, TOTAL_TERMINAL_CHARS);
      typingProgressRef.current = Math.round((typedChars / TOTAL_TERMINAL_CHARS) * 100);
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      setTerminalProgress(nextProgress);
    };

    const typeTerminalLine = (lineIndex: number) => {
      if (lineIndex >= TERMINAL_LINES.length) {
        typingProgressRef.current = 100;
        isTypingDoneRef.current = true;
        maybeStartReveal();
        return;
      }

      const line = TERMINAL_LINES[lineIndex];
      let charIndex = 0;

      const typeCharacter = () => {
        if (charIndex <= line.length) {
          updateTerminalProgress(lineIndex, charIndex);
          setActiveTerminalLine(line.slice(0, charIndex));
          charIndex += 1;
          const baseDelay = lineIndex === TERMINAL_LINES.length - 1 ? 30 : 22;
          const jitter = Math.floor(Math.random() * 28);
          typingTimeoutRef.current = window.setTimeout(typeCharacter, baseDelay + jitter);
          return;
        }

        setTerminalLines((prev) => [...prev, line]);
        setActiveTerminalLine('');
        typingTimeoutRef.current = window.setTimeout(
          () => typeTerminalLine(lineIndex + 1),
          170 + Math.floor(Math.random() * 140)
        );
      };

      typeCharacter();
    };

    typeTerminalLine(0);

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

    const ambientTarget = 0.96;
    const directionalTarget = 1.72;
    const accentTarget = 1.15;
    const rimTarget = 0.95;
    const backlightTarget = 1.34;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf5d0fe, 0);
    directionalLight.position.set(2.8, 4.2, 3.8);
    scene.add(directionalLight);

    const accentLight = new THREE.PointLight(0xa855f7, 0, 18, 1.2);
    accentLight.position.set(-1.8, 1.3, 2.2);
    scene.add(accentLight);

    const pinkRim = new THREE.PointLight(0xe879f9, 0, 16, 1.3);
    pinkRim.position.set(1.5, 1.7, 2.4);
    scene.add(pinkRim);
    const backlight = new THREE.PointLight(0xa855f7, 0, 20, 1.15);
    backlight.position.set(0, 1.05, -2.8);
    scene.add(backlight);

    const modelAnchor = new THREE.Group();
    scene.add(modelAnchor);

    const modelState: ModelScrollState = {
      positionX: 0,
      rotationY: 0,
      scale: 0.72,
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
            modelState.scale = 0.64;

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
              scale: 0.58,
              ease: 'none',
            });

            return () => tl.kill();
          },
          '(min-width: 768px)': () => {
            modelState.positionX = 0;
            modelState.rotationY = 0;
            modelState.scale = 0.72;

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
              scale: 0.66,
              ease: 'none',
            });

            return () => tl.kill();
          },
        });

        ScrollTrigger.refresh();
        finishIntro();
      },
      (progressEvent: ProgressEvent<EventTarget>) => {
        if (progressEvent.total <= 0) return;

        modelProgressRef.current = Math.min(100, Math.round((progressEvent.loaded / progressEvent.total) * 100));
        const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
        const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
        overallProgressRef.current = nextProgress;
        setTerminalProgress(nextProgress);
      },
      (error) => {
        console.error('Unable to load model:', error);
        finishIntro();
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
        backlight.position.x = modelAnchor.position.x;
        backlight.intensity = backlightTarget + Math.sin(idleTime * 1.35) * 0.08;

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
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      introTimelineRef.current?.kill();
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
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

  const terminalComplete = terminalLines.length >= TERMINAL_LINES.length;
  const terminalProgressLabel = `${String(terminalProgress).padStart(3, '0')}%`;
  const isTotalLoadDone = terminalComplete && terminalProgress >= 100;

  return (
    <>
      <Head title="Ellis Threader | 3D Scroll Experience" />
      <HomeStyles />
      {showLoader ? (
        <div ref={loaderOverlayRef} className="site-loader">
          <div ref={loaderIrisRef} className="loader-iris" aria-hidden="true" />
          <div className="terminal-shell">
            <div className="terminal-topbar" aria-hidden="true">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-amber" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="terminal-title">portfolio://boot</span>
            </div>

            <div className="terminal-body">
              {terminalLines.map((line) => (
                <p className="terminal-line" key={line}>
                  {line}
                </p>
              ))}

              {!terminalComplete ? (
                <p className="terminal-line terminal-line-active">
                  {activeTerminalLine}
                  <span className="terminal-cursor" />
                </p>
              ) : null}

              {isTotalLoadDone ? (
                <div className="terminal-welcome-wrap">
                  <p className="terminal-welcome">WELCOME</p>
                </div>
              ) : null}
            </div>

            <div className="terminal-footer">
              <span className="terminal-footer-label">{isTotalLoadDone ? 'ready' : 'loading'}</span>
              <div className="terminal-footer-progress" aria-live="polite">
                <span className="terminal-progress">{terminalProgressLabel}</span>
                <span className="terminal-progress-meter" aria-hidden="true">
                  <span className="terminal-progress-fill" style={{ width: `${terminalProgress}%` }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="model-backlight" aria-hidden="true" />
      <canvas ref={canvasRef} className={`model-canvas ${isIntroComplete ? 'is-ready' : 'is-preloading'}`} />

      <nav className={`social-dock ${showSocial ? 'is-visible' : 'is-hidden'}`} aria-label="Social links">
        <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.66.5.1.68-.22.68-.5 0-.25-.01-.92-.01-1.8-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .85-.28 2.78 1.05A9.5 9.5 0 0 1 12 6.9c.85 0 1.7.12 2.5.35 1.92-1.33 2.77-1.05 2.77-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.59 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .28.18.61.69.5A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.27l-4.9-6.4L6.4 22H3.3l7.26-8.3L1 2h6.35l4.42 5.85L18.9 2Zm-1.1 18h1.74L6.39 3.9H4.53L17.8 20Z" fill="currentColor" />
          </svg>
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm8.85 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.5h4v11H3v-11Zm6 0h3.83v1.56h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.11v5.39h-4V15.7c0-1.15-.02-2.64-1.61-2.64-1.62 0-1.87 1.26-1.87 2.56v4.88H9v-11Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </nav>

      <main ref={pageRef} className={`scroll-page ${isIntroComplete ? 'is-ready' : 'is-preloading'}`}>
        <header className="hero-nav">
          <div className="hero-nav-inner">
            <a className="hero-nav-email" href="mailto:ellis.threader3001@gmail.com">
              ellis.threader3001@gmail.com
            </a>

            <nav className="hero-nav-links">
              <a href="#about" aria-label="ABOUT">
                <span className="nav-label nav-label-current">ABOUT</span>
                <span className="nav-label nav-label-next">ABOUT</span>
              </a>
              <a href="#work" aria-label="WORK">
                <span className="nav-label nav-label-current">WORK</span>
                <span className="nav-label nav-label-next">WORK</span>
              </a>
              <a href="#contact" aria-label="CONTACT">
                <span className="nav-label nav-label-current">CONTACT</span>
                <span className="nav-label nav-label-next">CONTACT</span>
              </a>
            </nav>
          </div>
        </header>

        <section className="scroll-section s-hero">
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
