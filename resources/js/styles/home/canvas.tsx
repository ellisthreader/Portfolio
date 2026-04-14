import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-model-stage": {
    "position": "fixed",
    "inset": "0",
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
    "left": "50%",
    "top": "47%",
    "width": "clamp(280px, 38vw, 620px)",
    "aspect-ratio": "1",
    "transform": "translate(-50%, -50%)",
    "pointer-events": "none",
    "z-index": "0",
    "border-radius": "999px",
    "filter": "blur(30px)",
    "background": "radial-gradient(circle, rgba(168, 85, 247, 0.58) 0%, rgba(168, 85, 247, 0.22) 36%, rgba(168, 85, 247, 0) 74%)",
    "mix-blend-mode": "screen",
    "opacity": "0.7",
    "animation": "backlight-pulse 4.8s ease-in-out infinite",
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
    "background": "radial-gradient(1200px 700px at 50% 0%, rgba(168, 85, 247, 0.12), transparent 58%), linear-gradient(180deg, #080611 0%, #080611 100%)",
  },
};
