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
    ".about-shell,\n    .services-shell": {
      "grid-template-columns": "1fr",
      "gap": "1.6rem",
    },
    ".about-visual": {
      "justify-self": "center",
    },
    ".about-copy": {
      "width": "min(100%, 680px)",
    },
    ".services-intro": {
      "position": "relative",
      "top": "auto",
      "max-width": "none",
    },
    ".career-row": {
      "grid-template-columns": "minmax(0, 1fr) 52px minmax(0, 1fr)",
      "gap": "1rem",
    },
    ".story-shell": {
      "min-height": "68svh",
    },
    ".story-title": {
      "font-size": "clamp(2rem, 7vw, 4rem)",
    },
    ".services-title": {
      "font-size": "clamp(2rem, 6vw, 4rem)",
    },
    ".career-left,\n    .career-right": {
      "width": "100%",
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
      "width": "min(94vw, 820px)",
      "border-radius": "16px",
    },
    ".loader-iris": {
      "width": "clamp(160px, 42vw, 220px)",
      "height": "clamp(160px, 42vw, 220px)",
    },
    ".terminal-topbar": {
      "grid-template-columns": "auto 1fr",
      "gap": "0.65rem",
      "padding": "0.82rem 0.9rem",
    },
    ".terminal-footer": {
      "padding": "0.78rem 0.9rem 0.88rem",
    },
    ".terminal-footer-progress": {
      "gap": "0.58rem",
    },
    ".terminal-progress-meter": {
      "width": "136px",
      "height": "5px",
    },
    ".terminal-body": {
      "min-height": "312px",
      "padding": "1.05rem 0.95rem 1rem",
    },
    ".terminal-line": {
      "font-size": "0.8rem",
    },
    ".terminal-welcome": {
      "font-size": "clamp(2.15rem, 10.8vw, 3.25rem)",
    },
    ".story-shell": {
      "min-height": "62svh",
    },
    ".about-shell,\n    .services-shell": {
      "gap": "1.2rem",
    },
    ".about-portrait": {
      "width": "min(100%, 320px)",
      "border-radius": "24px",
    },
    ".about-portrait-core": {
      "padding": "1rem 1rem 1.1rem",
    },
    ".about-portrait-caption": {
      "font-size": "0.76rem",
    },
    ".story-title": {
      "font-size": "clamp(1.8rem, 11vw, 3rem)",
      "line-height": "1",
    },
    ".story-body": {
      "font-size": "0.98rem",
      "max-width": "30ch",
    },
    ".services-title": {
      "font-size": "clamp(1.9rem, 10vw, 3.2rem)",
      "line-height": "0.98",
    },
    ".career-shell": {
      "padding-left": "1.1rem",
    },
    ".career-timeline": {
      "left": "0.55rem",
      "transform": "none",
    },
    ".career-row": {
      "grid-template-columns": "1fr",
      "gap": "0.7rem",
      "min-height": "unset",
      "padding": "0.2rem 0 1rem 0.8rem",
    },
    ".career-left": {
      "justify-self": "start",
      "text-align": "left",
    },
    ".career-year": {
      "margin-top": "0.6rem",
    },
    ".career-center": {
      "display": "none",
    },
    ".career-title": {
      "font-size": "1.18rem",
    },
    ".career-description": {
      "font-size": "0.94rem",
      "line-height": "1.65",
    },
    ".service-card": {
      "padding": "1rem 1rem 1.05rem",
      "border-radius": "20px",
    },
    ".service-card-title": {
      "font-size": "1.1rem",
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
