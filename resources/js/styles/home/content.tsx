import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".split-layout": {
    "display": "grid",
    "grid-template-columns": "1fr minmax(340px, 460px)",
    "gap": "clamp(1rem, 3vw, 3rem)",
    "align-items": "center",
  },
  ".content-card,\n.pin-copy": {
    "justify-self": "end",
    "width": "min(100%, 450px)",
    "padding": "clamp(1rem, 2vw, 1.4rem)",
    "border-radius": "20px",
    "border": "1px solid var(--line)",
    "background": "linear-gradient(140deg, rgba(192, 132, 252, 0.12), rgba(168, 85, 247, 0.04))",
    "backdrop-filter": "blur(4px)",
  },
  ".card-label": {
    "margin": "0",
    "color": "var(--accent)",
    "text-transform": "uppercase",
    "letter-spacing": "0.12em",
    "font-size": "clamp(0.76rem, 0.95vw, 0.9rem)",
  },
  ".content-card h2,\n.pin-copy h2": {
    "margin": "0.45rem 0 0",
    "font-size": "clamp(1.45rem, 2.8vw, 2.2rem)",
    "line-height": "1.05",
  },
  ".content-card p,\n.pin-copy p": {
    "margin": "0.9rem 0 0",
    "color": "var(--muted)",
    "line-height": "1.55",
  },
  ".pin-panel": {
    "position": "relative",
    "min-height": "420px",
    "border-radius": "20px",
    "border": "1px solid var(--line)",
    "background": "linear-gradient(145deg, rgba(216, 180, 254, 0.08), rgba(255, 255, 255, 0)),\n    rgba(10, 7, 20, 0.84)",
    "overflow": "hidden",
  },
};
