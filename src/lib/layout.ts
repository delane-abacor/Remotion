import {useVideoConfig} from 'remotion';

/**
 * Sizes in the compositions are written for a 1080p canvas.
 * useScale() converts them for whatever canvas is actually rendering,
 * so switching src/video.ts to 4K or vertical keeps the layout proportional.
 */
export const DESIGN_HEIGHT = 1080;

export const useScale = (): number => {
  const {height} = useVideoConfig();
  return height / DESIGN_HEIGHT;
};

/**
 * TITLE-SAFE AREA
 * Broadcast convention: keep text inside the middle 90% of the frame
 * (5% margin on each edge) so nothing is clipped by overscan, player
 * chrome, or a social-media UI overlay.
 */
export const SAFE_AREA_MARGIN = 0.05;

export const useSafeArea = () => {
  const {width, height} = useVideoConfig();
  const x = width * SAFE_AREA_MARGIN;
  const y = height * SAFE_AREA_MARGIN;

  return {
    x,
    y,
    /** Spread onto a container to inset its children into the safe area. */
    padding: {
      paddingLeft: x,
      paddingRight: x,
      paddingTop: y,
      paddingBottom: y,
    },
  };
};
