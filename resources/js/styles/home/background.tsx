import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  "@keyframes star-drift-far": {
    "0%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.18), calc(var(--space-drift-y, 0px) * 0.18), 0) scale(1)",
    },
    "50%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.18), calc(var(--space-drift-y, 0px) * 0.18), 0) scale(1.012)",
    },
    "100%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.18), calc(var(--space-drift-y, 0px) * 0.18), 0) scale(1)",
    },
  },
  "@keyframes star-drift-mid": {
    "0%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.38), calc(var(--space-drift-y, 0px) * 0.38), 0)",
    },
    "50%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.38), calc(var(--space-drift-y, 0px) * 0.38), 0) scale(1.018)",
    },
    "100%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.38), calc(var(--space-drift-y, 0px) * 0.38), 0)",
    },
  },
  "@keyframes star-drift-near": {
    "0%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.62), calc(var(--space-drift-y, 0px) * 0.62), 0)",
    },
    "50%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.62), calc(var(--space-drift-y, 0px) * 0.62), 0) scale(1.026)",
    },
    "100%": {
      "transform": "translate3d(calc(var(--space-drift-x, 0px) * 0.62), calc(var(--space-drift-y, 0px) * 0.62), 0)",
    },
  },
  "@keyframes star-twinkle-soft": {
    "0%,\n  100%": {
      "opacity": "0.45",
    },
    "50%": {
      "opacity": "0.82",
    },
  },
  "@keyframes star-twinkle-bright": {
    "0%,\n  100%": {
      "opacity": "0.62",
      "filter": "brightness(1)",
    },
    "50%": {
      "opacity": "1",
      "filter": "brightness(1.18)",
    },
  },
  ".site-space": {
    "position": "fixed",
    "inset": "0",
    "z-index": "0",
    "pointer-events": "none",
    "overflow": "hidden",
    "background": "radial-gradient(1200px 820px at 50% -12%, rgba(79, 32, 130, 0.18), transparent 58%), radial-gradient(900px 600px at 80% 18%, rgba(24, 34, 92, 0.16), transparent 62%), linear-gradient(180deg, #010103 0%, #020205 26%, #030309 58%, #04040b 100%)",
  },
  ".space-vignette": {
    "position": "absolute",
    "inset": "0",
    "background": "radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.02), transparent 22%), radial-gradient(circle at 50% 50%, rgba(9, 8, 15, 0) 0%, rgba(3, 3, 7, 0.22) 48%, rgba(0, 0, 0, 0.76) 100%)",
  },
  ".space-nebula": {
    "position": "absolute",
    "inset": "-12%",
    "background": "radial-gradient(520px 280px at 18% 18%, rgba(159, 104, 255, 0.09), transparent 72%), radial-gradient(460px 240px at 78% 14%, rgba(90, 160, 255, 0.08), transparent 70%), radial-gradient(680px 320px at 50% 68%, rgba(176, 108, 255, 0.05), transparent 74%)",
    "filter": "blur(34px)",
    "opacity": "0.72",
    "transform": "translate3d(calc(var(--space-drift-x, 0px) * -0.16), calc(var(--space-drift-y, 0px) * -0.16), 0)",
  },
  ".star-layer": {
    "position": "absolute",
    "inset": "-8%",
    "background-repeat": "repeat",
    "will-change": "transform, opacity",
  },
  ".star-layer-far": {
    "opacity": "0.9",
    "animation": "star-drift-far 24s ease-in-out infinite, star-twinkle-soft 8.5s ease-in-out infinite",
    "background-size": "420px 420px",
    "background-image": "radial-gradient(1px 1px at 6% 12%, rgba(255,255,255,0.88) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 14% 28%, rgba(210,226,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 21% 8%, rgba(255,255,255,0.74) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 27% 38%, rgba(255,255,255,0.76) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 33% 18%, rgba(225,215,255,0.78) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 39% 30%, rgba(255,255,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 46% 14%, rgba(255,255,255,0.66) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 52% 34%, rgba(195,223,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 58% 10%, rgba(255,255,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 64% 26%, rgba(245,231,255,0.82) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 72% 18%, rgba(255,255,255,0.72) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 81% 32%, rgba(255,255,255,0.78) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 88% 16%, rgba(216,231,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 93% 26%, rgba(255,255,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 10% 56%, rgba(255,255,255,0.82) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 18% 70%, rgba(226,219,255,0.76) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 25% 62%, rgba(255,255,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 32% 78%, rgba(195,223,255,0.76) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 40% 58%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 47% 74%, rgba(255,255,255,0.88) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 55% 66%, rgba(236,225,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 63% 82%, rgba(255,255,255,0.72) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 71% 60%, rgba(205,227,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 79% 72%, rgba(255,255,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 86% 64%, rgba(255,255,255,0.78) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 94% 78%, rgba(255,255,255,0.78) 0, rgba(255,255,255,0) 100%)",
  },
  ".star-layer-mid": {
    "opacity": "1",
    "animation": "star-drift-mid 18s ease-in-out infinite, star-twinkle-bright 6.2s ease-in-out infinite",
    "background-size": "520px 520px",
    "background-image": "radial-gradient(1.6px 1.6px at 8% 22%, rgba(255,255,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 18% 12%, rgba(226,236,255,0.92) 0, rgba(255,255,255,0) 100%), radial-gradient(1.5px 1.5px at 29% 24%, rgba(255,255,255,0.92) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 42% 18%, rgba(245,231,255,0.92) 0, rgba(255,255,255,0) 100%), radial-gradient(1.7px 1.7px at 54% 28%, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 66% 14%, rgba(214,230,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(1.7px 1.7px at 78% 24%, rgba(255,255,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 90% 12%, rgba(236,225,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 12% 66%, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 24% 54%, rgba(226,236,255,0.92) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 36% 72%, rgba(255,255,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(1.5px 1.5px at 48% 58%, rgba(245,231,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 60% 74%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 72% 56%, rgba(226,236,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.7px 1.7px at 84% 68%, rgba(255,255,255,0.92) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 94% 58%, rgba(245,231,255,0.9) 0, rgba(255,255,255,0) 100%)",
    "filter": "drop-shadow(0 0 10px rgba(255,255,255,0.14))",
  },
  ".star-layer-near": {
    "opacity": "1",
    "animation": "star-drift-near 14s ease-in-out infinite, star-twinkle-bright 4.8s ease-in-out infinite",
    "background-size": "680px 680px",
    "background-image": "radial-gradient(2.2px 2.2px at 16% 18%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.4px 2.4px at 34% 12%, rgba(225,236,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 58% 22%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(2.3px 2.3px at 74% 16%, rgba(245,231,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.2px 2.2px at 88% 26%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 10% 74%, rgba(255,255,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(2.4px 2.4px at 28% 64%, rgba(225,236,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 46% 78%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.3px 2.3px at 68% 68%, rgba(245,231,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(2.2px 2.2px at 86% 74%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%)",
    "filter": "drop-shadow(0 0 16px rgba(255,255,255,0.18))",
  },
  ".scroll-page": {
    "background": "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(2, 2, 5, 0.26) 100%)",
  },
  ".s-hero": {
    "background": "transparent",
  },
  ".hero-starfield": {
    "position": "absolute",
    "inset": "0",
    "z-index": "1",
    "pointer-events": "none",
    "overflow": "hidden",
  },
  ".hero-starfield-glow": {
    "position": "absolute",
    "inset": "0",
    "background": "radial-gradient(760px 420px at 50% 38%, rgba(130, 82, 255, 0.08), transparent 56%), radial-gradient(520px 320px at 50% 18%, rgba(255, 255, 255, 0.03), transparent 46%)",
    "opacity": "0.9",
  },
  ".hero-starfield-layer": {
    "position": "absolute",
    "inset": "0",
    "background-repeat": "repeat",
    "will-change": "transform, opacity",
  },
  ".hero-starfield-layer-a": {
    "opacity": "1",
    "background-size": "280px 280px, 360px 360px, 520px 520px",
    "background-position": "0 0, 140px 90px, 70px 210px",
    "animation": "star-drift-mid 14s ease-in-out infinite, star-twinkle-bright 4.6s ease-in-out infinite",
    "background-image": "radial-gradient(1.4px 1.4px at 8% 10%, rgba(255,255,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 14% 24%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 22% 16%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 30% 30%, rgba(255,255,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.3px 1.3px at 38% 12%, rgba(245,231,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 46% 26%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 54% 10%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 62% 22%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 70% 12%, rgba(245,231,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.7px 1.7px at 78% 26%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.3px 1.3px at 86% 14%, rgba(226,236,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 94% 28%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 10% 58%, rgba(255,255,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 18% 74%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 28% 64%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 36% 80%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.3px 1.3px at 44% 60%, rgba(245,231,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 52% 72%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 60% 62%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.6px 1.6px at 68% 82%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 78% 60%, rgba(245,231,255,0.98) 0, rgba(255,255,255,0) 100%), radial-gradient(1.8px 1.8px at 86% 74%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 94% 64%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(1.1px 1.1px at 6% 34%, rgba(255,255,255,0.78) 0, rgba(255,255,255,0) 100%), radial-gradient(1.5px 1.5px at 19% 48%, rgba(245,231,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 31% 40%, rgba(226,236,255,0.86) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 47% 44%, rgba(255,255,255,0.86) 0, rgba(255,255,255,0) 100%), radial-gradient(1.1px 1.1px at 59% 36%, rgba(245,231,255,0.78) 0, rgba(255,255,255,0) 100%), radial-gradient(1.5px 1.5px at 73% 42%, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(1.2px 1.2px at 87% 46%, rgba(226,236,255,0.86) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 97% 38%, rgba(255,255,255,0.82) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 12% 88%, rgba(255,255,255,0.72) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 26% 92%, rgba(226,236,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1.1px 1.1px at 42% 90%, rgba(255,255,255,0.76) 0, rgba(255,255,255,0) 100%), radial-gradient(1.5px 1.5px at 57% 94%, rgba(245,231,255,0.84) 0, rgba(255,255,255,0) 100%), radial-gradient(1px 1px at 71% 89%, rgba(255,255,255,0.72) 0, rgba(255,255,255,0) 100%), radial-gradient(1.4px 1.4px at 84% 93%, rgba(226,236,255,0.8) 0, rgba(255,255,255,0) 100%), radial-gradient(1.1px 1.1px at 96% 88%, rgba(255,255,255,0.76) 0, rgba(255,255,255,0) 100%)",
    "filter": "drop-shadow(0 0 12px rgba(255,255,255,0.16))",
  },
  ".hero-starfield-layer-b": {
    "opacity": "0.92",
    "background-size": "420px 420px, 640px 640px",
    "background-position": "40px 10px, 220px 160px",
    "animation": "star-drift-near 11s ease-in-out infinite, star-twinkle-soft 6.2s ease-in-out infinite",
    "background-image": "radial-gradient(2.2px 2.2px at 12% 18%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 32% 12%, rgba(245,231,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 54% 22%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.2px 2.2px at 76% 16%, rgba(226,236,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 90% 26%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 18% 70%, rgba(245,231,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.2px 2.2px at 40% 82%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 64% 68%, rgba(226,236,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 84% 78%, rgba(255,255,255,1) 0, rgba(255,255,255,0) 100%), radial-gradient(2.4px 2.4px at 8% 44%, rgba(255,255,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 24% 52%, rgba(226,236,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(2.3px 2.3px at 51% 46%, rgba(255,255,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(2px 2px at 69% 54%, rgba(245,231,255,0.96) 0, rgba(255,255,255,0) 100%), radial-gradient(2.2px 2.2px at 93% 48%, rgba(255,255,255,0.94) 0, rgba(255,255,255,0) 100%), radial-gradient(2.6px 2.6px at 14% 90%, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(2.1px 2.1px at 48% 92%, rgba(226,236,255,0.9) 0, rgba(255,255,255,0) 100%), radial-gradient(2.4px 2.4px at 78% 88%, rgba(245,231,255,0.92) 0, rgba(255,255,255,0) 100%)",
    "filter": "drop-shadow(0 0 18px rgba(255,255,255,0.22))",
  },
  "@media (prefers-reduced-motion: reduce)": {
    ".space-nebula,\n    .star-layer-far,\n    .star-layer-mid,\n    .star-layer-near,\n    .hero-starfield-layer-a,\n    .hero-starfield-layer-b": {
      "animation": "none",
      "transform": "none",
    },
  },
};
