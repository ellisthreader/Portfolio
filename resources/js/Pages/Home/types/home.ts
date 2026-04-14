import type { ElementType, MutableRefObject, RefObject } from 'react';
import type gsap from 'gsap';
import type * as THREE from 'three';

export type ModelScrollState = {
  positionX: number;
  rotationY: number;
  scale: number;
};

export type HeadControl = {
  target: THREE.Object3D;
  neutralRotationX: number;
  neutralRotationY: number;
  neutralRotationZ: number;
  introTilt: number;
  yawWeight: number;
  pitchWeight: number;
  lerp: number;
};

export type WorkCard = {
  title: string;
  eyebrow: string;
  summary: string;
  detail: string;
};

export type CareerEntry = {
  title: string;
  subtitle: string;
  year: string;
  description: string;
};

export type AnimatedTextProps = {
  as?: ElementType;
  className?: string;
  text: string;
  delay?: number;
  charDelay?: number;
  amount?: number;
};

export type HomeSceneRefs = {
  pageRef: RefObject<HTMLElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  loaderOverlayRef: RefObject<HTMLDivElement>;
  loaderIrisRef: RefObject<HTMLDivElement>;
  pointerLightRef: RefObject<HTMLDivElement>;
  cursorAuraRef: RefObject<HTMLDivElement>;
};

export type HomeSceneState = HomeSceneRefs & {
  terminalLines: string[];
  activeTerminalLine: string;
  terminalProgress: number;
  isIntroComplete: boolean;
  showLoader: boolean;
  showSocial: boolean;
};

export type HomeSceneInternals = {
  introTimelineRef: MutableRefObject<gsap.core.Timeline | null>;
  revealTimeoutRef: MutableRefObject<number | null>;
  typingTimeoutRef: MutableRefObject<number | null>;
  hasStartedRevealRef: MutableRefObject<boolean>;
  isIntroCompleteRef: MutableRefObject<boolean>;
  isSceneReadyRef: MutableRefObject<boolean>;
  isTypingDoneRef: MutableRefObject<boolean>;
  typingProgressRef: MutableRefObject<number>;
  modelProgressRef: MutableRefObject<number>;
  overallProgressRef: MutableRefObject<number>;
  terminalProgressStateRef: MutableRefObject<number>;
};
