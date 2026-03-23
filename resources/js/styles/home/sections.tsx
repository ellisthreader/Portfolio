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
    "background": "radial-gradient(980px 540px at 12% 8%, rgba(168, 85, 247, 0.26), transparent 72%),\n    linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)",
  },
  ".s-model-shift": {
    "background": "radial-gradient(820px 460px at 78% 24%, rgba(147, 51, 234, 0.18), transparent 72%),\n    linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%)",
  },
  ".s-model-hold": {
    "background": "radial-gradient(920px 500px at 86% 18%, rgba(192, 132, 252, 0.24), transparent 74%),\n    linear-gradient(180deg, #120a22 0%, #090612 100%)",
  },
  ".s-outro": {
    "background": "linear-gradient(180deg, #090612 0%, #030208 100%)",
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
