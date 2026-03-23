import type { StyleSheet } from './types';

export const styleSheet: StyleSheet = {
  ".hero-nav-links .nav-label-current": {
    "color": "#ffffff",
    "text-shadow": "0 0 12px rgba(255, 255, 255, 0.35), 0 0 20px rgba(168, 85, 247, 0.26)",
    "transform": "translateY(0%)",
    "opacity": "1",
  },
  ".hero-nav-links .nav-label-next": {
    "color": "#d8b4fe",
    "text-shadow": "0 0 12px rgba(216, 180, 254, 0.55), 0 0 22px rgba(147, 51, 234, 0.44)",
    "transform": "translateY(-130%)",
    "opacity": "0",
  },
  ".hero-nav-links a:hover .nav-label-current,\n.hero-nav-links a:focus-visible .nav-label-current": {
    "transform": "translateY(130%)",
    "opacity": "0",
  },
  ".hero-nav-links a:hover .nav-label-next,\n.hero-nav-links a:focus-visible .nav-label-next": {
    "transform": "translateY(0%)",
    "opacity": "1",
  },
};
