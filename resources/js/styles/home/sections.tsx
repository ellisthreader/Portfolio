import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".scroll-section": {
    "position": "relative",
    "min-height": "100svh",
    "display": "grid",
    "place-items": "center",
    "padding": "clamp(1rem, 2vw, 2rem)",
    "overflow": "clip",
  },
  ".section-inner": {
    "width": "min(1120px, 92vw)",
    "margin": "0 auto",
    "position": "relative",
    "z-index": "4",
  },
  ".s-hero": {
    "background": "transparent",
  },
  ".s-model-shift": {
    "background": "transparent",
  },
  ".s-model-hold": {
    "background": "transparent",
  },
  ".s-outro": {
    "background": "transparent",
  },
  ".story-section": {
    "background": "transparent",
    "min-height": "92svh",
  },
  ".parallax-layer": {
    "position": "absolute",
    "pointer-events": "none",
    "z-index": "1",
    "opacity": "0.85",
    "will-change": "transform",
  },
  ".orb": {
    "width": "clamp(170px, 24vw, 330px)",
    "aspect-ratio": "1",
    "border-radius": "999px",
    "filter": "blur(6px)",
    "background": "radial-gradient(circle at 28% 28%, rgba(192, 132, 252, 0.72), rgba(192, 132, 252, 0.05) 72%)",
  },
  ".halo": {
    "width": "clamp(220px, 30vw, 430px)",
    "aspect-ratio": "1",
    "border-radius": "999px",
    "border": "1px solid rgba(168, 85, 247, 0.56)",
    "box-shadow": "inset 0 0 56px rgba(168, 85, 247, 0.14)",
  },
};
