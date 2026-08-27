import {Easing, interpolate, spring} from 'remotion';

/**
 * Two small helpers used by every composition. They wrap Remotion's
 * `interpolate` and `spring` so that each graphic gets a full ENTER and EXIT
 * and never pops on at frame 0 or cuts mid-motion on the last frame.
 *
 * The compositions still call useCurrentFrame / interpolate / spring / Easing
 * directly as well - these are a convenience, not an abstraction layer.
 */

/**
 * THE OFF-BY-ONE THAT CAUSES HARD CUTS
 * A composition of N frames renders frames 0..N-1 - frame N is never drawn.
 * Animating an exit to `durationInFrames` therefore leaves the graphic still
 * partly on screen on the final rendered frame, which reads as a cut when the
 * clip ends. Every exit below lands on `durationInFrames - 1` instead, so the
 * last frame is genuinely empty.
 */
export const lastFrame = (durationInFrames: number): number =>
  Math.max(durationInFrames - 1, 1);

type EnterExitOptions = {
  frame: number;
  durationInFrames: number;
  /** Frames the enter animation takes. */
  enterFrames: number;
  /** Frames the exit animation takes, measured back from the last frame. */
  exitFrames: number;
  easing?: (input: number) => number;
};

/**
 * A 0 -> 1 -> 1 -> 0 curve across the whole composition.
 * Multiply it into opacity, and reuse it for transforms.
 */
export const enterExit = ({
  frame,
  durationInFrames,
  enterFrames,
  exitFrames,
  easing = Easing.inOut(Easing.cubic),
}: EnterExitOptions): number => {
  const last = lastFrame(durationInFrames);

  return interpolate(
    frame,
    [0, enterFrames, last - exitFrames, last],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    },
  );
};

type SpringEnterOptions = {
  frame: number;
  fps: number;
  /** Frames to wait before this element starts moving - use for staggering. */
  delay?: number;
  /** Higher = less overshoot. 200 is critically damped (no bounce at all). */
  damping?: number;
  stiffness?: number;
  mass?: number;
};

/**
 * A 0 -> 1 spring for entrances. Drive translate/scale with it; springs
 * settle naturally, which reads better than a linear slide.
 */
export const springEnter = ({
  frame,
  fps,
  delay = 0,
  damping = 18,
  stiffness = 110,
  mass = 0.7,
}: SpringEnterOptions): number =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping, stiffness, mass},
  });

/**
 * A 0 -> 1 ramp over the final `exitFrames` of a composition.
 * 0 while the graphic is on screen, 1 once it has fully left.
 */
export const exitProgress = ({
  frame,
  durationInFrames,
  exitFrames,
  easing = Easing.in(Easing.cubic),
}: {
  frame: number;
  durationInFrames: number;
  exitFrames: number;
  easing?: (input: number) => number;
}): number => {
  const last = lastFrame(durationInFrames);

  return interpolate(frame, [last - exitFrames, last], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};
