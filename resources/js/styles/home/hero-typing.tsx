import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-job-label": {
    "margin": "0",
    "color": "#e9d5ff",
    "font-weight": "600",
    "font-size": "clamp(1.08rem, 1.95vw, 1.5rem)",
    "text-shadow": "0 0 14px rgba(168, 85, 247, 0.35)",
  },
  ".hero-job-title": {
    "margin": "0.5rem 0 0",
    "min-height": "2.5em",
    "color": "#f0abfc",
    "font-weight": "700",
    "font-size": "clamp(1.38rem, 2.35vw, 2.26rem)",
    "line-height": "1.2",
    "white-space": "nowrap",
    "text-shadow": "0 0 12px rgba(240, 171, 252, 0.62), 0 0 24px rgba(217, 70, 239, 0.42)",
  },
  ".hero-job-title::after": {
    "content": "''",
    "display": "inline-block",
    "width": "0.12em",
    "height": "1em",
    "margin-left": "0.16em",
    "vertical-align": "-0.1em",
    "background": "#fff",
    "animation": "caret-blink 900ms steps(1, end) infinite",
  },
};
