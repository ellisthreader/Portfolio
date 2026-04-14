import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-model-stage": {
    "position": "relative",
    "width": "100%",
    "height": "100%",
    "pointer-events": "none",
    "z-index": "1",
    "overflow": "hidden",
  },
  ".model-canvas": {
    "position": "absolute",
    "inset": "0",
    "width": "100%",
    "height": "100%",
    "z-index": "1",
    "pointer-events": "none",
  },
  ".model-backlight": {
    "position": "absolute",
    "left": "58%",
    "top": "74%",
    "width": "clamp(260px, 70%, 460px)",
    "aspect-ratio": "1",
    "transform": "translate(-50%, -50%)",
    "pointer-events": "none",
    "z-index": "0",
    "border-radius": "999px",
    "filter": "blur(34px)",
    "background": "radial-gradient(circle, rgba(240, 220, 255, 0.92) 0%, rgba(168, 85, 247, 0.56) 24%, rgba(168, 85, 247, 0.2) 46%, rgba(168, 85, 247, 0) 74%)",
    "opacity": "0.92",
  },
  ".model-canvas.is-preloading,\n.scroll-page.is-preloading": {
    "opacity": "0",
  },
  ".model-canvas.is-ready,\n.scroll-page.is-ready": {
    "opacity": "1",
  },
  ".scroll-page.is-preloading": {
    "pointer-events": "none",
  },
  ".scroll-page": {
    "position": "relative",
    "background": "radial-gradient(980px 560px at 50% 0%, rgba(168, 85, 247, 0.08), transparent 52%), linear-gradient(180deg, #04020a 0%, #05030b 48%, #030209 100%)",
  },
};
