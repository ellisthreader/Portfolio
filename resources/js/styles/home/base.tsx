import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ":root": {
    "--bg-0": "#030209",
    "--bg-1": "#070411",
    "--bg-2": "#0d0718",
    "--ink": "#f5ecff",
    "--muted": "#c9b7e7",
    "--line": "rgba(232, 240, 248, 0.14)",
    "--accent": "#f0abfc",
    "--teal": "#c084fc",
    "--nav-safe-zone": "108px",
  },
  "*": {
    "box-sizing": "border-box",
  },
  "html,\nbody,\n#app": {
    "margin": "0",
    "min-height": "100%",
  },
  "body": {
    "font-family": "'Sora', sans-serif",
    "color": "var(--ink)",
    "background": "var(--bg-0)",
    "overflow-x": "hidden",
  },
  ".ambient-pointer-light": {
    "position": "fixed",
    "left": "0",
    "top": "0",
    "width": "34rem",
    "height": "34rem",
    "border-radius": "999px",
    "transform": "translate(-50%, -50%)",
    "pointer-events": "none",
    "z-index": "0",
    "opacity": "0",
    "background": "radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, rgba(168, 85, 247, 0.13) 34%, rgba(168, 85, 247, 0.05) 58%, rgba(0, 0, 0, 0) 78%)",
    "filter": "blur(30px)",
    "mix-blend-mode": "screen",
    "transition": "opacity 420ms ease",
  },
  ".ambient-pointer-light.is-active": {
    "opacity": "0.7",
  },
  ".ambient-pointer-light.is-hidden": {
    "opacity": "0",
  },
  ".custom-cursor": {
    "position": "fixed",
    "left": "0",
    "top": "0",
    "transform": "translate(-50%, -50%)",
    "pointer-events": "none",
    "z-index": "90",
    "opacity": "0",
    "transition": "opacity 280ms ease",
  },
  ".custom-cursor.is-active": {
    "opacity": "1",
  },
  ".custom-cursor.is-hidden": {
    "opacity": "0",
  },
  ".custom-cursor-aura": {
    "width": "44px",
    "height": "44px",
    "border-radius": "999px",
    "border": "1px solid rgba(236, 190, 255, 0.4)",
    "background": "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(168, 85, 247, 0.05) 54%, rgba(168, 85, 247, 0) 78%)",
    "box-shadow": "0 0 16px rgba(236, 72, 153, 0.12), 0 0 26px rgba(168, 85, 247, 0.1)",
    "backdrop-filter": "blur(2px)",
  },
  "@media (pointer: fine)": {
    "body,\n    a,\n    button,\n    input,\n    textarea,\n    select,\n    [role='button']": {
      "cursor": "auto",
    },
    ".ambient-pointer-light,\n    .custom-cursor": {
      "display": "none",
    },
  },
  "@media (pointer: coarse)": {
    ".ambient-pointer-light,\n    .custom-cursor": {
      "display": "none",
    },
  },
};
