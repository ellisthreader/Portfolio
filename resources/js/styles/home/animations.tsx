import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  "@keyframes caret-blink": {
    "0%,\n  48%": {
      "opacity": "1",
    },
    "52%,\n  100%": {
      "opacity": "0",
    },
  },
  "@keyframes loader-float": {
    "0%,\n  100%": {
      "transform": "translate3d(0, 0, 0) scale(1)",
    },
    "50%": {
      "transform": "translate3d(0, -24px, 0) scale(1.05)",
    },
  },
  "@keyframes loader-spin": {
    "to": {
      "transform": "rotate(360deg)",
    },
  },
  "@keyframes loader-sweep": {
    "0%": {
      "transform": "translateX(-18%)",
    },
    "100%": {
      "transform": "translateX(18%)",
    },
  },
  "@keyframes backlight-pulse": {
    "0%,\n  100%": {
      "transform": "translate(-50%, -50%) scale(1)",
      "opacity": "0.63",
    },
    "50%": {
      "transform": "translate(-50%, -50%) scale(1.08)",
      "opacity": "0.84",
    },
  },
  "@keyframes terminal-line-in": {
    "0%": {
      "opacity": "0",
      "transform": "translateY(4px)",
    },
    "100%": {
      "opacity": "1",
      "transform": "translateY(0)",
    },
  },
  "@keyframes terminal-cursor-blink": {
    "0%, 48%": {
      "opacity": "1",
    },
    "52%, 100%": {
      "opacity": "0",
    },
  },
  "@keyframes terminal-dot-pulse": {
    "0%, 100%": {
      "opacity": "0.35",
      "transform": "scale(0.84)",
    },
    "50%": {
      "opacity": "1",
      "transform": "scale(1)",
    },
  },
  "@keyframes terminal-progress-sheen": {
    "0%": {
      "transform": "translateX(-120%)",
    },
    "100%": {
      "transform": "translateX(140%)",
    },
  },
  "@keyframes terminal-welcome-in": {
    "0%": {
      "opacity": "0",
      "transform": "translateY(8px) scale(0.92)",
      "letter-spacing": "0.28em",
      "filter": "blur(6px)",
    },
    "100%": {
      "opacity": "1",
      "transform": "translateY(0) scale(1)",
      "letter-spacing": "0.18em",
      "filter": "blur(0)",
    },
  },
};
