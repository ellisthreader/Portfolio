import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TERMINAL_CHAR_OFFSETS, TERMINAL_LINES, TOTAL_TERMINAL_CHARS } from '../constants/content';
import type { HeadControl, HomeSceneState, ModelScrollState } from '../types/home';

gsap.registerPlugin(ScrollTrigger);

export function useHomeScene(): HomeSceneState {
  const pageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loaderOverlayRef = useRef<HTMLDivElement | null>(null);
  const loaderIrisRef = useRef<HTMLDivElement | null>(null);
  const pointerLightRef = useRef<HTMLDivElement | null>(null);
  const cursorAuraRef = useRef<HTMLDivElement | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const hasStartedRevealRef = useRef(false);
  const isIntroCompleteRef = useRef(false);
  const isSceneReadyRef = useRef(false);
  const isTypingDoneRef = useRef(false);
  const typingProgressRef = useRef(0);
  const modelProgressRef = useRef(0);
  const overallProgressRef = useRef(0);
  const terminalProgressStateRef = useRef(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeTerminalLine, setActiveTerminalLine] = useState('');
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showSocial, setShowSocial] = useState(false);

  useEffect(() => {
    const root = pageRef.current;
    const canvas = canvasRef.current;
    const loaderOverlay = loaderOverlayRef.current;
    const loaderIris = loaderIrisRef.current;
    const pointerLight = pointerLightRef.current;
    const cursorAura = cursorAuraRef.current;
    if (!root || !canvas || !loaderOverlay || !loaderIris || !pointerLight || !cursorAura) return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const useEnhancedPointer = mediaQuery.matches;
    const useDecorativeCursor =
      useEnhancedPointer &&
      window.getComputedStyle(pointerLight).display !== 'none' &&
      window.getComputedStyle(cursorAura).display !== 'none';
    const getRenderPixelRatio = () => Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 0.95 : 1.2);
    const getCanvasViewport = () => {
      const rect = canvas.getBoundingClientRect();
      return {
        width: Math.max(1, Math.round(rect.width || window.innerWidth)),
        height: Math.max(1, Math.round(rect.height || window.innerHeight)),
      };
    };
    const getModelOffsetY = () => (window.innerWidth < 768 ? -0.24 : -0.38);
    const getHeroModelScale = () => (window.innerWidth < 768 ? 0.54 : 0.62);
    const getAboutModelOffsetX = () => (window.innerWidth < 768 ? 0 : -0.52);
    const getAboutModelRotationY = () => (window.innerWidth < 768 ? 0 : THREE.MathUtils.degToRad(6));
    const getHeadPointerCenterY = () => (window.innerWidth < 768 ? 0.44 : 0.42);
    const normalizePointerAxis = (position: number, size: number, centerRatio: number) => {
      const center = size * centerRatio;
      const travel = Math.max(center, size - center, 1);
      return THREE.MathUtils.clamp((position - center) / travel, -1, 1);
    };
    const applyDeadzone = (value: number, deadzone: number) => {
      const magnitude = Math.abs(value);
      if (magnitude <= deadzone) return 0;
      return Math.sign(value) * ((magnitude - deadzone) / (1 - deadzone));
    };
    const shapePointerInput = (value: number, exponent: number) => Math.sign(value) * Math.pow(Math.abs(value), exponent);
    const getCoalescedPointerSample = (event: PointerEvent) => {
      if (typeof event.getCoalescedEvents !== 'function') {
        return { x: event.clientX, y: event.clientY };
      }

      const samples = event.getCoalescedEvents();
      if (!samples.length) {
        return { x: event.clientX, y: event.clientY };
      }

      let totalX = 0;
      let totalY = 0;
      samples.forEach((sample) => {
        totalX += sample.clientX;
        totalY += sample.clientY;
      });

      const averageX = totalX / samples.length;
      const averageY = totalY / samples.length;

      return {
        x: THREE.MathUtils.lerp(averageX, event.clientX, 0.42),
        y: THREE.MathUtils.lerp(averageY, event.clientY, 0.42),
      };
    };
    const headPointerDeadzone = 0.052;
    const headPointerCurve = 1.28;
    const headPointerScreenFollowDamping = 11.5;
    const headPointerScreenReturnDamping = 4.4;
    const headInputFollowDamping = 8.8;
    const headInputReturnDamping = 3.6;
    const headSettledFollowDamping = 5.6;
    const headSettledReturnDamping = 2.6;
    const headRotationFollowDamping = 6.5;
    const headRotationReturnDamping = 2.8;
    const headIdleDelayMs = 110;
    const headIdleEaseWindowMs = 1550;
    const headMicroJitterThreshold = 0.005;
    const modelPositionDamping = 4.4;
    const modelRotationDamping = 4;
    const modelScaleDamping = 5.1;
    let headPointerTargetClientX = window.innerWidth / 2;
    let headPointerTargetClientY = window.innerHeight * getHeadPointerCenterY();
    let headPointerClientX = headPointerTargetClientX;
    let headPointerClientY = headPointerTargetClientY;
    let filteredHeadPointerX = 0;
    let filteredHeadPointerY = 0;
    let settledHeadPointerX = 0;
    let settledHeadPointerY = 0;
    let lastPointerMoveTime = performance.now();
    let detachInteractiveCursorHandlers = () => {};

    if (useEnhancedPointer) {
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let auraX = targetX;
      let auraY = targetY;
      let lightX = targetX;
      let lightY = targetY;

      const syncPointer = (event: PointerEvent) => {
        const sample = getCoalescedPointerSample(event);
        targetX = sample.x;
        targetY = sample.y;
        headPointerTargetClientX = sample.x;
        headPointerTargetClientY = sample.y;
        lastPointerMoveTime = performance.now();
      };
      const resetPointerTracking = () => {
        headPointerTargetClientX = window.innerWidth / 2;
        headPointerTargetClientY = window.innerHeight * getHeadPointerCenterY();
        lastPointerMoveTime = performance.now() - headIdleDelayMs;
      };

      const renderPointer = () => {
        auraX += (targetX - auraX) * 0.24;
        auraY += (targetY - auraY) * 0.24;
        lightX += (targetX - lightX) * 0.11;
        lightY += (targetY - lightY) * 0.11;
        cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
        pointerLight.style.transform = `translate3d(${lightX}px, ${lightY}px, 0) translate(-50%, -50%)`;
      };

      window.addEventListener('pointermove', syncPointer, { passive: true });
      window.addEventListener('pointerleave', resetPointerTracking, { passive: true });
      if (useDecorativeCursor) {
        const interactiveNodes = Array.from(document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select'));
        const onInteractiveEnter = () => {
          gsap.to(cursorAura, { scale: 1.24, opacity: 0.96, duration: 0.2, ease: 'power3.out', overwrite: true });
          gsap.to(pointerLight, { opacity: 0.9, duration: 0.35, ease: 'power2.out', overwrite: true });
        };
        const onInteractiveLeave = () => {
          gsap.to(cursorAura, { scale: 1, opacity: 0.78, duration: 0.3, ease: 'power3.out', overwrite: true });
          gsap.to(pointerLight, { opacity: 0.7, duration: 0.35, ease: 'power2.out', overwrite: true });
        };

        interactiveNodes.forEach((node) => {
          node.addEventListener('pointerenter', onInteractiveEnter);
          node.addEventListener('pointerleave', onInteractiveLeave);
        });

        detachInteractiveCursorHandlers = () => {
          interactiveNodes.forEach((node) => {
            node.removeEventListener('pointerenter', onInteractiveEnter);
            node.removeEventListener('pointerleave', onInteractiveLeave);
          });
        };

        gsap.ticker.add(renderPointer);
        gsap.set([pointerLight, cursorAura], { x: targetX, y: targetY });
        gsap.set(pointerLight, { opacity: 0.7 });
        gsap.set(cursorAura, { opacity: 0.78, scale: 1 });
      }

      const cleanupEnhancedPointer = () => {
        window.removeEventListener('pointermove', syncPointer);
        window.removeEventListener('pointerleave', resetPointerTracking);
        if (useDecorativeCursor) {
          gsap.ticker.remove(renderPointer);
        }
      };

      detachInteractiveCursorHandlers = (() => {
        const detachInteractive = detachInteractiveCursorHandlers;
        return () => {
          detachInteractive();
          cleanupEnhancedPointer();
        };
      })();
    }

    const maybeStartReveal = () => {
      if (!isSceneReadyRef.current || !isTypingDoneRef.current || hasStartedRevealRef.current) return;
      hasStartedRevealRef.current = true;
      overallProgressRef.current = 100;
      terminalProgressStateRef.current = 100;
      setTerminalProgress(100);

      const terminalShell = loaderOverlay.querySelector<HTMLElement>('.terminal-shell');
      const shellRect = terminalShell?.getBoundingClientRect();
      const shellScaleTarget = shellRect ? Math.max(window.innerWidth / shellRect.width, window.innerHeight / shellRect.height) * 1.18 : 4.2;

      revealTimeoutRef.current = window.setTimeout(() => {
        introTimelineRef.current = gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              setShowLoader(false);
              setShowSocial(true);
            },
          })
          .set([canvas, root], { transformOrigin: '50% 50%', willChange: 'transform, opacity, filter', force3D: true })
          .set('.terminal-shell', { transformOrigin: '50% 50%', willChange: 'transform, border-radius, box-shadow, filter', force3D: true })
          .set('.terminal-welcome', { transformOrigin: '50% 50%', willChange: 'transform, opacity, filter', force3D: true })
          .set('.hero-nav-email, .hero-nav-links a, .hero-greeting, .hero-name, .hero-job-label, .hero-job-title', { autoAlpha: 0, y: 18 })
          .set(loaderIris, { autoAlpha: 0, scale: 0.6 })
          .to('.terminal-topbar, .terminal-log, .terminal-footer', { autoAlpha: 0, y: -10, duration: 0.24, ease: 'power2.out' }, 0)
          .fromTo('.terminal-welcome', { autoAlpha: 0, scale: 0.08, z: -320, filter: 'blur(28px)' }, { autoAlpha: 1, scale: 1.82, z: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out' }, 0)
          .to('.terminal-welcome-wrap', { autoAlpha: 0, scale: 1.02, filter: 'blur(8px)', duration: 0.16, ease: 'power2.inOut' }, 1.26)
          .to(loaderIris, { autoAlpha: 0.66, scale: 8.6, duration: 0.92, ease: 'power3.out' }, 1.38)
          .to('.terminal-shell', { scale: shellScaleTarget * 0.88, duration: 0.76, ease: 'power2.inOut' }, 1.38)
          .to('.terminal-shell', { scale: shellScaleTarget, borderRadius: '0px', duration: 0.6, ease: 'power3.out' }, 1.9)
          .fromTo(
            [canvas, root],
            { autoAlpha: 1, scale: 1.09, filter: 'blur(14px) brightness(0.52) saturate(0.84)' },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1) saturate(1)',
              duration: 0.86,
              stagger: 0.04,
              ease: 'power2.out',
              onStart: () => {
                isIntroCompleteRef.current = true;
                setIsIntroComplete(true);
              },
            },
            1.96
          )
          .to('.terminal-shell', { borderColor: 'rgba(0, 0, 0, 0)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', duration: 0.4, ease: 'power1.out' }, 2.02)
          .to(loaderOverlay, { backgroundColor: 'rgba(5, 3, 11, 0)', autoAlpha: 0, duration: 0.48, ease: 'power2.inOut' }, 2.04)
          .call(() => {
            gsap.set([canvas, root], { clearProps: 'filter,transform,willChange,force3D' });
            gsap.set('.terminal-shell', { clearProps: 'transform,borderRadius,boxShadow,borderColor,willChange,force3D' });
          })
          .fromTo('.hero-nav-email, .hero-nav-links a', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power2.out' }, 2.12)
          .fromTo('.hero-greeting, .hero-name, .hero-job-label, .hero-job-title', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, 2.16)
          .call(() => {
            if (!headControls.length) return;
            gsap.to(headMotion, { lift: 1, track: 1, duration: 0.96, ease: 'power3.out' });
          }, [], 2.02)
          .to(ambientLight, { intensity: ambientTarget, duration: 1.05, ease: 'sine.out' }, 1.98)
          .to(directionalLight, { intensity: directionalTarget, duration: 1.6, ease: 'sine.out' }, '<')
          .to(accentLight, { intensity: accentTarget, duration: 1.75, ease: 'sine.out' }, '<')
          .to(pinkRim, { intensity: rimTarget, duration: 1.9, ease: 'sine.out' }, '<')
          .to(backlight, { intensity: backlightTarget, duration: 2.05, ease: 'sine.out' }, '<')
          .to(rearGlow, { intensity: rearGlowTarget, duration: 1.9, ease: 'sine.out' }, '<');
      }, 0);
    };

    const syncTerminalProgress = (nextProgress: number) => {
      if (nextProgress !== terminalProgressStateRef.current) {
        terminalProgressStateRef.current = nextProgress;
        setTerminalProgress(nextProgress);
      }
    };

    const finishIntro = () => {
      modelProgressRef.current = 100;
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      syncTerminalProgress(nextProgress);
      isSceneReadyRef.current = true;
      maybeStartReveal();
    };

    const updateTerminalProgress = (lineIndex: number, charIndex: number) => {
      const completedChars = TERMINAL_CHAR_OFFSETS[lineIndex] ?? TOTAL_TERMINAL_CHARS;
      const typedChars = Math.min(completedChars + charIndex, TOTAL_TERMINAL_CHARS);
      typingProgressRef.current = Math.round((typedChars / TOTAL_TERMINAL_CHARS) * 100);
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      syncTerminalProgress(nextProgress);
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
          const baseDelay = lineIndex === TERMINAL_LINES.length - 1 ? 16 : 12;
          const jitter = Math.floor(Math.random() * 8);
          typingTimeoutRef.current = window.setTimeout(typeCharacter, baseDelay + jitter);
          return;
        }

        setTerminalLines((prev) => [...prev, line]);
        setActiveTerminalLine('');
        typingTimeoutRef.current = window.setTimeout(() => typeTerminalLine(lineIndex + 1), 55 + Math.floor(Math.random() * 30));
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

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.innerWidth >= 768,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    const initialViewport = getCanvasViewport();
    renderer.setPixelRatio(getRenderPixelRatio());
    renderer.setSize(initialViewport.width, initialViewport.height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, initialViewport.width / initialViewport.height, 0.1, 100);
    camera.position.set(0, 1.48, 2.1);
    camera.lookAt(0, 0.64, 0);

    const ambientTarget = 0.96;
    const directionalTarget = 1.72;
    const accentTarget = 1.15;
    const rimTarget = 0.95;
    const backlightTarget = 40.5;
    const rearGlowTarget = 27.5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    const directionalLight = new THREE.DirectionalLight(0xf5d0fe, 0);
    directionalLight.position.set(2.8, 4.2, 3.8);
    const accentLight = new THREE.PointLight(0xa855f7, 0, 18, 1.2);
    accentLight.position.set(-1.8, 1.3, 2.2);
    const pinkRim = new THREE.PointLight(0xe879f9, 0, 16, 1.3);
    pinkRim.position.set(1.5, 1.7, 2.4);
    const backlight = new THREE.PointLight(0xa855f7, 0, 18, 1.05);
    backlight.position.set(0, -0.72, -1.42);
    const rearGlow = new THREE.PointLight(0xe9d5ff, 0, 12, 1.1);
    rearGlow.position.set(0, -1.12, -0.92);
    scene.add(ambientLight, directionalLight, accentLight);

    const modelAnchor = new THREE.Group();
    scene.add(modelAnchor);
    modelAnchor.add(backlight, rearGlow);

    const modelState: ModelScrollState = {
      positionX: 0,
      rotationY: 0,
      scale: getHeroModelScale(),
    };

    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Group | null = null;
    const headControls: HeadControl[] = [];
    const headMotion = { lift: 0, track: 0 };
    let rafId = 0;
    const clock = new THREE.Clock();
    const headTrackYaw = THREE.MathUtils.degToRad(30);
    const headTrackPitch = THREE.MathUtils.degToRad(32);
    const maxHeadYaw = THREE.MathUtils.degToRad(21);
    const maxHeadPitchUp = THREE.MathUtils.degToRad(30);
    const maxHeadPitchDown = THREE.MathUtils.degToRad(10);
    const headNeutralPitchOffset = THREE.MathUtils.degToRad(-6);

    const setCanvasSize = () => {
      const viewport = getCanvasViewport();
      camera.aspect = viewport.width / viewport.height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(getRenderPixelRatio());
      renderer.setSize(viewport.width, viewport.height, false);
      modelAnchor.position.y = getModelOffsetY();
      modelState.positionX = 0;
      modelState.rotationY = 0;
      modelState.scale = getHeroModelScale();
      headPointerTargetClientX = window.innerWidth / 2;
      headPointerTargetClientY = window.innerHeight * getHeadPointerCenterY();
      headPointerClientX = headPointerTargetClientX;
      headPointerClientY = headPointerTargetClientY;
      filteredHeadPointerX = 0;
      filteredHeadPointerY = 0;
      settledHeadPointerX = 0;
      settledHeadPointerY = 0;
    };

    window.addEventListener('resize', setCanvasSize);
    const resizeObserver = new ResizeObserver(() => setCanvasSize());
    resizeObserver.observe(canvas);

    const ctx = gsap.context(() => {}, root);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/FIXEDNOW.glb?v=1',
      (gltf: GLTF) => {
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = false;
          mesh.receiveShadow = false;

          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => {
            if (!('roughness' in material) || !('metalness' in material)) return;
            const standardMaterial = material as THREE.MeshStandardMaterial;
            const textureMaps = [
              standardMaterial.map,
              standardMaterial.normalMap,
              standardMaterial.roughnessMap,
              standardMaterial.metalnessMap,
              standardMaterial.emissiveMap,
              standardMaterial.aoMap,
              standardMaterial.alphaMap,
            ];

            textureMaps.forEach((texture) => {
              if (!texture) return;
              texture.anisotropy = maxAnisotropy;
            });

            standardMaterial.roughness = Math.max(0.16, standardMaterial.roughness * 0.72);
            standardMaterial.metalness = Math.min(0.16, standardMaterial.metalness + 0.02);
            standardMaterial.needsUpdate = true;
          });

          if (mesh.name === 'Retopo_head' || mesh.name === 'Sphere' || mesh.name === 'Sphere.001') {
            mesh.frustumCulled = false;
          }

        });

        const headBone =
          model.getObjectByName('Bone006L') ??
          model.getObjectByName('Bone.006.L') ??
          model.getObjectByName('Bone005R') ??
          model.getObjectByName('Bone.005.R');

        if (headBone) {
          headControls.push({
            target: headBone,
            neutralRotationX: headBone.rotation.x,
            neutralRotationY: headBone.rotation.y,
            neutralRotationZ: headBone.rotation.z,
            introTilt: THREE.MathUtils.degToRad(90),
            yawWeight: 1,
            pitchWeight: 1,
            lerp: 0.18,
          });
        } else {
          console.warn('Head bone Bone006L / Bone.006.L / Bone005R / Bone.005.R was not found in FIXEDNOW.glb');
        }

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const clip = gltf.animations[0];
          const action = mixer.clipAction(clip);
          const isSingleFramePose = clip.tracks.every((track) => track.times.length <= 1);
          action.reset();

          if (isSingleFramePose) {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.play();
            mixer.setTime(clip.duration);
          } else {
            action.play();
          }
        } else {
          console.warn('The GLB was loaded without animation data. If this armature pose should animate, re-export it from Blender with animation. If it should be static, bake the pose before export.');
        }

        modelAnchor.position.set(0, getModelOffsetY(), 0);
        modelAnchor.rotation.set(0, 0, 0);
        headControls.forEach((control) => {
          control.target.rotation.x = control.neutralRotationX + control.introTilt + headNeutralPitchOffset;
          control.target.rotation.y = control.neutralRotationY;
          control.target.rotation.z = control.neutralRotationZ;
        });

        modelRoot = model;
        modelAnchor.add(modelRoot);
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
      if (document.hidden) {
        clock.getDelta();
        return;
      }

      const dt = Math.min(clock.getDelta(), 1 / 30);
      if (mixer) mixer.update(dt);

      if (modelRoot) {
        const targetScale = modelState.scale;
        modelAnchor.position.x = THREE.MathUtils.damp(modelAnchor.position.x, modelState.positionX, modelPositionDamping, dt);
        modelAnchor.rotation.y = THREE.MathUtils.damp(modelAnchor.rotation.y, modelState.rotationY, modelRotationDamping, dt);
        modelAnchor.scale.x = THREE.MathUtils.damp(modelAnchor.scale.x || 1, targetScale, modelScaleDamping, dt);
        modelAnchor.scale.y = THREE.MathUtils.damp(modelAnchor.scale.y || 1, targetScale, modelScaleDamping, dt);
        modelAnchor.scale.z = THREE.MathUtils.damp(modelAnchor.scale.z || 1, targetScale, modelScaleDamping, dt);
        backlight.intensity = backlightTarget;
        rearGlow.intensity = rearGlowTarget;

        if (headControls.length) {
          const now = performance.now();
          const idleProgress = THREE.MathUtils.clamp((now - lastPointerMoveTime - headIdleDelayMs) / headIdleEaseWindowMs, 0, 1);
          const headScreenDampingX = THREE.MathUtils.lerp(headPointerScreenFollowDamping, headPointerScreenReturnDamping, idleProgress);
          const headScreenDampingY = THREE.MathUtils.lerp(headPointerScreenFollowDamping * 1.04, headPointerScreenReturnDamping, idleProgress);
          headPointerClientX = THREE.MathUtils.damp(headPointerClientX, headPointerTargetClientX, headScreenDampingX, dt);
          headPointerClientY = THREE.MathUtils.damp(headPointerClientY, headPointerTargetClientY, headScreenDampingY, dt);

          const normalizedHeadPointerX = normalizePointerAxis(headPointerClientX, window.innerWidth, 0.5);
          const normalizedHeadPointerY = normalizePointerAxis(headPointerClientY, window.innerHeight, getHeadPointerCenterY());
          const rawHeadPointerX = shapePointerInput(applyDeadzone(normalizedHeadPointerX, headPointerDeadzone), headPointerCurve);
          const rawHeadPointerY = shapePointerInput(applyDeadzone(normalizedHeadPointerY, headPointerDeadzone), headPointerCurve);
          const headPointerTargetX = THREE.MathUtils.lerp(rawHeadPointerX, 0, idleProgress);
          const headPointerTargetY = THREE.MathUtils.lerp(rawHeadPointerY, 0, idleProgress);
          const headInputDampingX = THREE.MathUtils.lerp(headInputFollowDamping, headInputReturnDamping, idleProgress);
          const headInputDampingY = THREE.MathUtils.lerp(headInputFollowDamping * 0.96, headInputReturnDamping, idleProgress);
          const headSettledDampingX = THREE.MathUtils.lerp(headSettledFollowDamping, headSettledReturnDamping, idleProgress);
          const headSettledDampingY = THREE.MathUtils.lerp(headSettledFollowDamping * 0.96, headSettledReturnDamping, idleProgress);

          filteredHeadPointerX = THREE.MathUtils.damp(filteredHeadPointerX, headPointerTargetX, headInputDampingX, dt);
          filteredHeadPointerY = THREE.MathUtils.damp(filteredHeadPointerY, headPointerTargetY, headInputDampingY, dt);
          settledHeadPointerX = THREE.MathUtils.damp(settledHeadPointerX, filteredHeadPointerX, headSettledDampingX, dt);
          settledHeadPointerY = THREE.MathUtils.damp(settledHeadPointerY, filteredHeadPointerY, headSettledDampingY, dt);

          const stabilizedHeadPointerX = Math.abs(settledHeadPointerX) < headMicroJitterThreshold ? 0 : settledHeadPointerX;
          const stabilizedHeadPointerY = Math.abs(settledHeadPointerY) < headMicroJitterThreshold ? 0 : settledHeadPointerY;
          const headDriveX = stabilizedHeadPointerX;
          const headDriveY = stabilizedHeadPointerY;

          headControls.forEach((control) => {
            const introTilt = (1 - headMotion.lift) * control.introTilt;
            const upwardPitchBoost = headDriveY < 0 ? 1 + Math.abs(headDriveY) * 1.45 : 1;
            const unclampedYaw = headDriveX * headTrackYaw * headMotion.track * control.yawWeight;
            const unclampedPitch = headDriveY * upwardPitchBoost * headTrackPitch * headMotion.track * control.pitchWeight;
            const trackingYaw = THREE.MathUtils.clamp(unclampedYaw, -maxHeadYaw, maxHeadYaw);
            const trackingPitch = THREE.MathUtils.clamp(unclampedPitch, -maxHeadPitchUp, maxHeadPitchDown);
            const rotationDamping = THREE.MathUtils.lerp(headRotationFollowDamping, headRotationReturnDamping, idleProgress) * (control.lerp / 0.18);
            const targetRotationX = control.neutralRotationX + introTilt + headNeutralPitchOffset + trackingPitch;
            const targetRotationY = control.neutralRotationY + trackingYaw;

            control.target.rotation.x = THREE.MathUtils.damp(control.target.rotation.x, targetRotationX, rotationDamping, dt);
            control.target.rotation.y = THREE.MathUtils.damp(control.target.rotation.y, targetRotationY, rotationDamping, dt);
            control.target.rotation.z = THREE.MathUtils.damp(control.target.rotation.z, control.neutralRotationZ, rotationDamping * 0.92, dt);
          });
        }
      }

      renderer.render(scene, camera);
    };

    render();
    ScrollTrigger.refresh();

    return () => {
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      introTimelineRef.current?.kill();
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      isIntroCompleteRef.current = false;
      detachInteractiveCursorHandlers();
      ctx.revert();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setCanvasSize);
      resizeObserver.disconnect();
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

  return {
    pageRef,
    canvasRef,
    loaderOverlayRef,
    loaderIrisRef,
    pointerLightRef,
    cursorAuraRef,
    terminalLines,
    activeTerminalLine,
    terminalProgress,
    isIntroComplete,
    showLoader,
    showSocial,
  };
}
