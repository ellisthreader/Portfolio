import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-job-label": {
    "margin": "0",
    "color": "#f0abfc",
    "font-weight": "500",
    "font-size": "clamp(0.94rem, 1vw, 1.02rem)",
    "letter-spacing": "0.12em",
    "text-transform": "uppercase",
  },
  ".hero-job-title": {
    "position": "relative",
    "display": "inline-grid",
    "align-items": "start",
    "margin": "0.55rem 0 0",
    "min-height": "2.2em",
    "color": "#ffffff",
    "font-weight": "600",
    "font-size": "clamp(1.28rem, 2.2vw, 2.1rem)",
    "line-height": "1.15",
    "white-space": "nowrap",
    "letter-spacing": "-0.03em",
  },
  ".hero-job-title-ghost": {
    "visibility": "hidden",
    "grid-area": "1 / 1",
    "pointer-events": "none",
  },
  ".hero-job-title-live": {
    "grid-area": "1 / 1",
    "will-change": "contents",
  },
  ".hero-job-title-live::after": {
    "content": "''",
    "display": "inline-block",
    "width": "0.12em",
    "height": "1em",
    "margin-left": "0.16em",
    "vertical-align": "-0.1em",
    "background": "rgba(255, 255, 255, 0.9)",
    "animation": "caret-blink 900ms steps(1, end) infinite",
  },
};
