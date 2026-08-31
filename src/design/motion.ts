import {Easing, interpolate, spring} from 'remotion';
import {useVideoConfig} from 'remotion';
import {LAYOUT} from './tokens';

/**
 * ABACOR MOTION
 * -------------
 * From the design system's `references/motion.md`. The language is calm, short
 * and has no overshoot anywhere.
 */

/** Entrances, and most things. */
export const ABACOR_EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Exits. */
export const ABACOR_EASE_OUT = Easing.bezier(0.33, 1, 0.68, 1);

/** Durations in frames at 30fps. */
export const D = {
  micro: 4,
  fast: 6,
  element: 7,
  surface: 10,
  scene: 12,
} as const;

/** Minimum time on screen once a beat has finished animating. */
export const HOLD = {headline: 45, long: 75} as const;

/**
 * The system's spring. damping 200 removes overshoot entirely - a springy
 * surface looks like a different product.
 */
export const abacorSpring = ({
  frame,
  fps,
  delay = 0,
}: {
  frame: number;
  fps: number;
  delay?: number;
}): number => spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}});

/** Surfaces rise 8px and fade in. No scale, ever. */
export const riseIn = (progress: number, distance = 8) => ({
  opacity: progress,
  transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
});

/**
 * Opacity-only fades are linear. Easing them reads as a mistake at 30fps, so
 * this deliberately passes no easing function.
 */
export const linearFade = (
  frame: number,
  inputRange: number[],
  outputRange: number[],
): number =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * DESIGN SPACE
 * The system says: build the UI at 1440x900 and scale it into the frame at
 * 1.24, which leaves a 67px margin either side. Rendering UI at 1920 wide
 * directly makes the type too small relative to the frame.
 *
 * Everything in this project is authored in 1440x900 units and multiplied by
 * this, so the same code is correct at 1080p and at 4K.
 */
export const DESIGN_SCALE = 1.24;

export const useDesignScale = (): number => {
  const {width} = useVideoConfig();
  return (width / 1920) * DESIGN_SCALE;
};

/** Convenience: the shell's rendered size at the current canvas. */
export const useShellSize = () => {
  const scale = useDesignScale();
  return {
    width: LAYOUT.shellW * scale,
    height: LAYOUT.shellH * scale,
    scale,
  };
};
