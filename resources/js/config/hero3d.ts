export const HERO_3D_CONFIG = {
  modelPath: '/assets/Untitled.glb', // Model file in public/assets

  cameraFov: 45, // Lower = more zoomed in
  cameraNear: 0.1, // Near clipping plane
  cameraFar: 1000, // Far clipping plane
  cameraX: 0, // Camera left/right
  cameraY: 1.9, // Camera up/down
  cameraZ: 3.2, // Camera distance

  targetX: 0, // Orbit/look target left/right
  targetY: 1.65, // Orbit/look target up/down (head area)
  targetZ: 0, // Orbit/look target depth

  modelX: 0, // Model left/right
  modelY: -0.95, // Model up/down
  modelZ: 0, // Model depth
  modelScale: 1.9, // Model size
  modelRotY: Math.PI, // Model facing direction

  ambientIntensity: 0.7, // General brightness
  directionalIntensity: 1.2, // Main light strength
  directionalX: 5, // Main light X
  directionalY: 10, // Main light Y
  directionalZ: 5, // Main light Z

  enableShadows: true, // Turn shadows on/off
  groundY: -2.2, // Shadow plane height
} as const;

