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
    const getRenderPixelRatio = () => Math.min(window.devicePixelRatio, window.innerWidth < 1024 ? 1 : 1.25);
    const getModelOffsetY = () => (window.innerWidth < 768 ? -0.22 : -0.34);
    const getAboutModelOffsetX = () => (window.innerWidth < 768 ? 0 : -0.52);
    const getAboutModelRotationY = () => (window.innerWidth < 768 ? 0 : THREE.MathUtils.degToRad(6));
    const renderFrameBudget = 1000 / 45;
    let pointerNormalizedX = 0;
    let pointerNormalizedY = 0;
    let detachInteractiveCursorHandlers = () => {};

    if (useEnhancedPointer) {
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let auraX = targetX;
      let auraY = targetY;
      let lightX = targetX;
      let lightY = targetY;

      const syncPointer = (event: PointerEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
        pointerNormalizedX = THREE.MathUtils.clamp(event.clientX / window.innerWidth, 0, 1) * 2 - 1;
        pointerNormalizedY = THREE.MathUtils.clamp(event.clientY / window.innerHeight, 0, 1) * 2 - 1;
      };

      const renderPointer = () => {
        auraX += (targetX - auraX) * 0.24;
        auraY += (targetY - auraY) * 0.24;
        lightX += (targetX - lightX) * 0.11;
        lightY += (targetY - lightY) * 0.11;
        cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
        pointerLight.style.transform = `translate3d(${lightX}px, ${lightY}px, 0) translate(-50%, -50%)`;
      };

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

      window.addEventListener('pointermove', syncPointer, { passive: true });
      gsap.ticker.add(renderPointer);
      gsap.set([pointerLight, cursorAura], { x: targetX, y: targetY });
      gsap.set(pointerLight, { opacity: 0.7 });
      gsap.set(cursorAura, { opacity: 0.78, scale: 1 });

      const cleanupEnhancedPointer = () => {
        window.removeEventListener('pointermove', syncPointer);
        gsap.ticker.remove(renderPointer);
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
          .to('.terminal-topbar, .terminal-log, .terminal-footer', { autoAlpha: 0, y: -10, duration: 0.32, ease: 'power2.out' }, 0)
          .fromTo('.terminal-welcome', { autoAlpha: 0, scale: 0.08, z: -320, filter: 'blur(28px)' }, { autoAlpha: 1, scale: 1.82, z: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }, 0)
          .to('.terminal-welcome-wrap', { autoAlpha: 0, scale: 1.02, filter: 'blur(8px)', duration: 0.22, ease: 'power2.inOut' }, 1.88)
          .to(loaderIris, { autoAlpha: 0.72, scale: 10, duration: 1.26, ease: 'power3.out' }, 2.12)
          .to('.terminal-shell', { scale: shellScaleTarget * 0.88, duration: 1.02, ease: 'power2.inOut' }, 2.12)
          .to('.terminal-shell', { scale: shellScaleTarget, borderRadius: '0px', duration: 0.84, ease: 'power3.out' }, 2.82)
          .fromTo(
            [canvas, root],
            { autoAlpha: 1, scale: 1.11, filter: 'blur(18px) brightness(0.46) saturate(0.78)' },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1) saturate(1)',
              duration: 1.22,
              stagger: 0.05,
              ease: 'power2.out',
              onStart: () => {
                isIntroCompleteRef.current = true;
                setIsIntroComplete(true);
              },
            },
            2.88
          )
          .to('.terminal-shell', { borderColor: 'rgba(0, 0, 0, 0)', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', duration: 0.58, ease: 'power1.out' }, 2.96)
          .to(loaderOverlay, { backgroundColor: 'rgba(5, 3, 11, 0)', autoAlpha: 0, duration: 0.76, ease: 'power2.inOut' }, 2.98)
          .call(() => {
            gsap.set([canvas, root], { clearProps: 'filter,transform,willChange,force3D' });
            gsap.set('.terminal-shell', { clearProps: 'transform,borderRadius,boxShadow,borderColor,willChange,force3D' });
          })
          .fromTo('.hero-nav-email, .hero-nav-links a', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.98, stagger: 0.06, ease: 'power2.out' }, 3.18)
          .fromTo('.hero-greeting, .hero-name, .hero-job-label, .hero-job-title', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.08, stagger: 0.07, ease: 'power3.out' }, 3.24)
          .call(() => {
            if (!headControls.length) return;
            gsap.to(headMotion, { lift: 1, track: 1, duration: 1.24, ease: 'power3.out' });
          }, [], 3.06)
          .to(ambientLight, { intensity: ambientTarget, duration: 1.5, ease: 'sine.out' }, 3.02)
          .to(directionalLight, { intensity: directionalTarget, duration: 2.2, ease: 'sine.out' }, '<')
          .to(accentLight, { intensity: accentTarget, duration: 2.35, ease: 'sine.out' }, '<')
          .to(pinkRim, { intensity: rimTarget, duration: 2.55, ease: 'sine.out' }, '<')
          .to(backlight, { intensity: backlightTarget, duration: 2.7, ease: 'sine.out' }, '<');
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
          const baseDelay = lineIndex === TERMINAL_LINES.length - 1 ? 30 : 22;
          const jitter = Math.floor(Math.random() * 28);
          typingTimeoutRef.current = window.setTimeout(typeCharacter, baseDelay + jitter);
          return;
        }

        setTerminalLines((prev) => [...prev, line]);
        setActiveTerminalLine('');
        typingTimeoutRef.current = window.setTimeout(() => typeTerminalLine(lineIndex + 1), 170 + Math.floor(Math.random() * 140));
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
      antialias: window.devicePixelRatio <= 1.5,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(getRenderPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.68, 2.1);
    camera.lookAt(0, 0.84, 0);

    const ambientTarget = 0.96;
    const directionalTarget = 1.72;
    const accentTarget = 1.15;
    const rimTarget = 0.95;
    const backlightTarget = 1.34;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    const directionalLight = new THREE.DirectionalLight(0xf5d0fe, 0);
    directionalLight.position.set(2.8, 4.2, 3.8);
    const accentLight = new THREE.PointLight(0xa855f7, 0, 18, 1.2);
    accentLight.position.set(-1.8, 1.3, 2.2);
    const pinkRim = new THREE.PointLight(0xe879f9, 0, 16, 1.3);
    pinkRim.position.set(1.5, 1.7, 2.4);
    const backlight = new THREE.PointLight(0xa855f7, 0, 20, 1.15);
    backlight.position.set(0, 1.05, -2.8);
    scene.add(ambientLight, directionalLight, accentLight, pinkRim, backlight);

    const modelAnchor = new THREE.Group();
    scene.add(modelAnchor);

    const modelState: ModelScrollState = {
      positionX: 0,
      rotationY: 0,
      scale: 0.72,
    };

    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Group | null = null;
    const headControls: HeadControl[] = [];
    const headMotion = { lift: 0, track: 0 };
    let smoothedHeadPointerX = 0;
    let smoothedHeadPointerY = 0;
    let rafId = 0;
    let lastRenderTime = 0;
    const clock = new THREE.Clock();
    const headTrackYaw = THREE.MathUtils.degToRad(26);
    const headTrackPitch = THREE.MathUtils.degToRad(18);
    const headNeutralPitchOffset = THREE.MathUtils.degToRad(-6);

    const setCanvasSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(getRenderPixelRatio());
      renderer.setSize(window.innerWidth, window.innerHeight);
      modelAnchor.position.y = getModelOffsetY();
      modelState.positionX = 0;
      modelState.rotationY = 0;
      modelState.scale = window.innerWidth < 768 ? 0.64 : 0.72;
    };

    window.addEventListener('resize', setCanvasSize);

    const ctx = gsap.context(() => {
      const aboutSection = root.querySelector<HTMLElement>('.about-section');
      if (!aboutSection) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 92%',
          end: 'top 18%',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      }).to(modelState, {
        positionX: () => getAboutModelOffsetX(),
        rotationY: () => getAboutModelRotationY(),
        ease: 'none',
      });
    }, root);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/FIXED.glb?v=2',
      (gltf: GLTF) => {
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = false;
          mesh.receiveShadow = false;

          if (mesh.name === 'Retopo_head' || mesh.name === 'Sphere' || mesh.name === 'Sphere.001') {
            mesh.frustumCulled = false;
          }

          if (mesh.name === 'Sphere') {
            mesh.renderOrder = 1;
          }

          if (mesh.name === 'Sphere.001') {
            mesh.renderOrder = 2;
            const eyeMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            eyeMaterials.forEach((material) => {
              material.depthWrite = false;
              material.polygonOffset = true;
              material.polygonOffsetFactor = -4;
              material.polygonOffsetUnits = -4;
            });
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
          console.warn('Head bone Bone006L / Bone.006.L / Bone005R / Bone.005.R was not found in FIXED.glb');
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

    const render = (timestamp = 0) => {
      rafId = window.requestAnimationFrame(render);
      if (document.hidden) {
        lastRenderTime = timestamp;
        return;
      }
      if (timestamp - lastRenderTime < renderFrameBudget) return;
      lastRenderTime = timestamp;

      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);

      if (modelRoot) {
        const targetScale = modelState.scale;
        modelAnchor.position.x = THREE.MathUtils.lerp(modelAnchor.position.x, modelState.positionX, 0.075);
        modelAnchor.rotation.y = THREE.MathUtils.lerp(modelAnchor.rotation.y, modelState.rotationY, 0.075);
        modelAnchor.scale.x = THREE.MathUtils.lerp(modelAnchor.scale.x || 1, targetScale, 0.12);
        modelAnchor.scale.y = THREE.MathUtils.lerp(modelAnchor.scale.y || 1, targetScale, 0.12);
        modelAnchor.scale.z = THREE.MathUtils.lerp(modelAnchor.scale.z || 1, targetScale, 0.12);
        backlight.position.x = 0;
        backlight.intensity = backlightTarget;

        if (headControls.length) {
          smoothedHeadPointerX += (pointerNormalizedX - smoothedHeadPointerX) * 0.075;
          smoothedHeadPointerY += (pointerNormalizedY - smoothedHeadPointerY) * 0.075;

          headControls.forEach((control) => {
            const introTilt = (1 - headMotion.lift) * control.introTilt;
            const trackingYaw = smoothedHeadPointerX * headTrackYaw * headMotion.track * control.yawWeight;
            const upwardPitchBoost = smoothedHeadPointerY < 0 ? 1 + Math.abs(smoothedHeadPointerY) * 0.55 : 1;
            const trackingPitch = smoothedHeadPointerY * upwardPitchBoost * headTrackPitch * headMotion.track * control.pitchWeight;

            control.target.rotation.x = THREE.MathUtils.lerp(
              control.target.rotation.x,
              control.neutralRotationX + introTilt + headNeutralPitchOffset + trackingPitch,
              control.lerp
            );
            control.target.rotation.y = THREE.MathUtils.lerp(control.target.rotation.y, control.neutralRotationY + trackingYaw, control.lerp);
            control.target.rotation.z = THREE.MathUtils.lerp(control.target.rotation.z, control.neutralRotationZ, control.lerp);
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
