import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".pin-frame": {
    "position": "absolute",
    "inset": "0",
    "display": "grid",
    "place-items": "center",
    "text-align": "center",
    "padding": "1.3rem",
    "will-change": "transform, opacity",
  },
  ".pin-frame h3": {
    "margin": "0",
    "font-size": "clamp(1.2rem, 2.1vw, 1.9rem)",
  },
  ".pin-frame p": {
    "margin": "0.8rem 0 0",
    "color": "var(--muted)",
    "max-width": "28ch",
  },
  ".outro": {
    "text-align": "center",
  },
  ".outro h2": {
    "margin": "0",
    "font-size": "clamp(2rem, 5.4vw, 4.9rem)",
    "letter-spacing": "-0.02em",
    "line-height": "1",
  },
  ".outro p": {
    "margin": "0.9rem 0 0",
    "color": "var(--muted)",
    "font-size": "clamp(1rem, 1.7vw, 1.25rem)",
  },
  ".js-reveal": {
    "will-change": "transform, opacity",
  },
  ".js-reveal-down,\n.js-parallax-up": {
    "will-change": "transform, opacity",
  },
};
