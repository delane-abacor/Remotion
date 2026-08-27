/**
 * SHARED CANVAS SETTINGS
 * ----------------------
 * This is the ONE place to change resolution and frame rate.
 * Every composition in src/compositions/ is registered with these values
 * in src/Root.tsx, so editing this file re-sizes the whole project.
 *
 * Switching to 4K:    export const RESOLUTION = RESOLUTIONS.UHD_4K;
 * Switching to 60fps: export const FPS = 60;
 *
 * Layout stays correct at any resolution because components size themselves
 * with the `useScale()` helper in src/lib/layout.ts rather than hard pixels.
 */

export const RESOLUTIONS = {
  HD_720: {width: 1280, height: 720},
  FHD_1080: {width: 1920, height: 1080},
  QHD_1440: {width: 2560, height: 1440},
  UHD_4K: {width: 3840, height: 2160},
  SQUARE_1080: {width: 1080, height: 1080},
  VERTICAL_1080: {width: 1080, height: 1920},
} as const;

/** Frames per second for every composition. Try 60 for smoother motion. */
export const FPS = 30;

/** Canvas size for every composition. Try RESOLUTIONS.UHD_4K. */
export const RESOLUTION: {width: number; height: number} = RESOLUTIONS.FHD_1080;

/**
 * Spread straight into <Composition {...CANVAS} /> in Root.tsx.
 */
export const CANVAS = {
  width: RESOLUTION.width,
  height: RESOLUTION.height,
  fps: FPS,
} as const;

/**
 * Author timings in seconds, not frames, so changing FPS doesn't change
 * how long anything lasts.
 *
 *   durationInFrames={seconds(5)}   // 5 seconds at any frame rate
 */
export const seconds = (value: number): number => Math.round(value * FPS);
