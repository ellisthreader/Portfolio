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
      "transform": "translate3d(0, -10px, 0) scale(1.035)",
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
      "transform": "translateY(10px)",
      "filter": "blur(10px)",
    },
    "100%": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)",
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
      "transform": "translateZ(-140px) scale(0.76)",
      "letter-spacing": "0.34em",
      "filter": "blur(18px)",
    },
    "55%": {
      "opacity": "1",
      "transform": "translateZ(0) scale(1.03)",
      "letter-spacing": "0.27em",
      "filter": "blur(0)",
    },
    "100%": {
      "opacity": "1",
      "transform": "translateZ(0) scale(1)",
      "letter-spacing": "0.24em",
      "filter": "blur(0)",
    },
  },
  "@keyframes terminal-welcome-glow": {
    "0%, 100%": {
      "text-shadow": "0 0 22px rgba(255, 187, 241, 0.34), 0 0 40px rgba(236, 72, 153, 0.22), 0 0 72px rgba(168, 85, 247, 0.16)",
    },
    "50%": {
      "text-shadow": "0 0 30px rgba(255, 213, 248, 0.54), 0 0 56px rgba(236, 72, 153, 0.34), 0 0 96px rgba(168, 85, 247, 0.24)",
    },
  },
  "@keyframes scroll-cue-float": {
    "0%,\n  100%": {
      "transform": "translate3d(-50%, 0, 0)",
      "opacity": "0.84",
    },
    "50%": {
      "transform": "translate3d(-50%, 8px, 0)",
      "opacity": "1",
    },
  },
  "@keyframes scroll-cue-dot": {
    "0%": {
      "transform": "translateY(0)",
      "opacity": "0",
    },
    "18%": {
      "opacity": "1",
    },
    "72%": {
      "transform": "translateY(11px)",
      "opacity": "1",
    },
    "100%": {
      "transform": "translateY(11px)",
      "opacity": "0",
    },
  },
};
