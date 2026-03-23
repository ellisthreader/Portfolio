import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ":root": {
    "--bg-0": "#05030b",
    "--bg-1": "#0b0714",
    "--bg-2": "#130a22",
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
};
