import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  "@media (max-width: 1024px)": {
    ":root": {
      "--nav-safe-zone": "92px",
    },
    ".hero-front": {
      "grid-template-columns": "1fr",
      "gap": "1.2rem",
    },
    ".hero-nav-inner": {
      "width": "100%",
      "justify-content": "flex-end",
    },
    ".hero-nav-email": {
      "position": "static",
      "transform": "none",
      "font-size": "0.78rem",
      "margin-right": "0.9rem",
    },
    ".hero-right-panel": {
      "justify-self": "start",
      "position": "static",
      "left": "auto",
      "top": "auto",
    },
    ".hero-left-panel": {
      "position": "static",
      "left": "auto",
      "top": "auto",
    },
    ".split-layout": {
      "grid-template-columns": "1fr",
      "justify-items": "end",
    },
    ".hero-nav": {
      "padding": "1.15rem 1rem",
    },
    ".hero-nav-links": {
      "gap": "1rem",
      "font-size": "0.9rem",
    },
    ".pin-panel": {
      "width": "min(100%, 520px)",
      "min-height": "320px",
    },
  },
  "@media (max-width: 767px)": {
    ":root": {
      "--nav-safe-zone": "82px",
    },
    ".section-inner": {
      "width": "min(100%, 94vw)",
    },
    ".terminal-shell": {
      "width": "min(95vw, 820px)",
      "border-radius": "12px",
    },
    ".loader-iris": {
      "width": "clamp(140px, 42vw, 220px)",
      "height": "clamp(140px, 42vw, 220px)",
    },
    ".terminal-body": {
      "min-height": "248px",
      "padding": "0.8rem 0.82rem 0.72rem",
    },
    ".terminal-footer": {
      "padding": "0.56rem 0.82rem 0.68rem",
    },
    ".terminal-footer-progress": {
      "gap": "0.46rem",
    },
    ".terminal-progress-meter": {
      "width": "112px",
      "height": "9px",
    },
    ".terminal-line": {
      "font-size": "0.78rem",
    },
    ".social-dock": {
      "inset": "auto auto 1rem 1rem",
      "left": "1rem",
      "right": "auto",
      "top": "auto",
      "bottom": "1rem",
      "transform": "none",
      "flex-direction": "row",
      "gap": "0.75rem",
    },
    ".content-card,\n  .pin-copy,\n  .pin-panel": {
      "justify-self": "center",
      "width": "min(100%, 520px)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    "*": {
      "animation": "none !important",
      "transition": "none !important",
    },
  },
};
