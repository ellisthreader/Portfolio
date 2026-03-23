import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".social-dock a:hover,\n.social-dock a:focus-visible": {
    "color": "#05030b",
    "transform": "translateX(3px) scale(1.04)",
  },
  ".social-dock a:hover::before,\n.social-dock a:hover::after,\n.social-dock a:focus-visible::before,\n.social-dock a:focus-visible::after": {
    "opacity": "1",
    "transform": "scale(1)",
  },
  ".social-dock svg": {
    "width": "1.28rem",
    "height": "1.28rem",
    "display": "block",
    "position": "relative",
    "z-index": "2",
  },
};
