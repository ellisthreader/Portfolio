import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-kicker": {
    "margin": "0",
    "color": "var(--teal)",
    "text-transform": "uppercase",
    "letter-spacing": "0.13em",
    "font-size": "clamp(0.78rem, 1vw, 0.92rem)",
  },
  ".hero-title": {
    "margin": "0.55rem 0 0",
    "max-width": "11ch",
    "font-size": "clamp(2.3rem, 8vw, 6.6rem)",
    "line-height": "0.94",
    "letter-spacing": "-0.03em",
    "font-weight": "800",
    "text-wrap": "balance",
  },
  ".hero-subtitle": {
    "margin": "1rem 0 0",
    "max-width": "46ch",
    "color": "var(--muted)",
    "font-size": "clamp(1rem, 1.7vw, 1.3rem)",
    "line-height": "1.5",
  },
  ".hero-front": {
    "display": "grid",
    "grid-template-columns": "1fr 1fr",
    "align-items": "center",
    "gap": "clamp(1rem, 5vw, 6rem)",
  },
  ".hero-left-panel": {
    "justify-self": "start",
    "position": "relative",
    "left": "-12vw",
    "top": "-10vh",
  },
  ".hero-right-panel": {
    "justify-self": "end",
    "text-align": "left",
    "width": "min(100%, 520px)",
    "position": "relative",
    "left": "10vw",
    "top": "7vh",
  },
  ".hero-greeting": {
    "margin": "0",
    "color": "#ffffff",
    "font-weight": "700",
    "font-size": "clamp(1.8rem, 3.2vw, 2.95rem)",
    "line-height": "1.1",
    "text-shadow": "0 0 20px rgba(168, 85, 247, 0.36), 0 0 34px rgba(217, 70, 239, 0.27)",
  },
  ".hero-name": {
    "margin": "0.2rem 0 0",
    "color": "#f5d0fe",
    "font-weight": "800",
    "letter-spacing": "0.01em",
    "font-size": "clamp(2.2rem, 4.2vw, 3.9rem)",
    "line-height": "1.04",
    "text-shadow": "0 0 28px rgba(236, 72, 153, 0.4), 0 0 48px rgba(139, 92, 246, 0.44)",
  },
};
