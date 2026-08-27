import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../brand';
import {enterExit, springEnter} from '../lib/animation';
import {FONT_FAMILY} from '../fonts';

/**
 * Small building blocks shared by the promo scenes. They intentionally mimic
 * the product's real surface treatment: white cards, hairline borders,
 * generous radius, orange as the only accent.
 */

/**
 * Wraps a scene so it fades in and fully out within its own Sequence.
 *
 * Pass `hold` for a final scene that should stay on screen through the last
 * frame instead of fading away - an end card that dissolves to an empty page
 * gives an editor nothing to cut on.
 */
export const Scene: React.FC<{
  durationInFrames: number;
  hold?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, hold = false, children}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const opacity = hold
    ? fadeIn
    : enterExit({frame, durationInFrames, enterFrames: 12, exitFrames: 12});

  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Section label above a scene's card, e.g. "STEP 01 - EMAIL". */
export const StepLabel: React.FC<{
  step: string;
  title: string;
  scale: number;
  progress: number;
}> = ({step, title, scale, progress}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14 * scale,
      marginBottom: 26 * scale,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 16 * scale}px)`,
    }}
  >
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: 17 * scale,
        letterSpacing: 2.2 * scale,
        color: BRAND.orange,
      }}
    >
      {step}
    </span>
    <span
      style={{width: 22 * scale, height: 2 * scale, background: BRAND.orangeTintEdge}}
    />
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 17 * scale,
        letterSpacing: 2.2 * scale,
        color: BRAND.inkSoft,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </span>
  </div>
);

/** White surface with a hairline border and soft shadow. */
export const Card: React.FC<{
  scale: number;
  width: number;
  progress?: number;
  padding?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({scale, width, progress = 1, padding = 40, style, children}) => (
  <div
    style={{
      position: 'relative',
      width: width * scale,
      background: BRAND.card,
      borderRadius: 22 * scale,
      border: `${1.5 * scale}px solid ${BRAND.line}`,
      boxShadow: `0 ${2 * scale}px ${4 * scale}px rgba(11, 32, 41, 0.06), 0 ${
        30 * scale
      }px ${64 * scale}px rgba(11, 32, 41, 0.20)`,
      padding: padding * scale,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 34 * scale}px) scale(${interpolate(
        progress,
        [0, 1],
        [0.975, 1],
      )})`,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * SCAN BEAM
 * A horizontal line that sweeps top -> bottom across its parent, leaving a
 * faint tinted wash behind it. `progress` is 0 -> 1 over the scan.
 */
export const ScanBeam: React.FC<{scale: number; progress: number}> = ({
  scale,
  progress,
}) => {
  if (progress <= 0 || progress >= 1) {
    return null;
  }

  const y = progress * 100;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Wash over the part already scanned. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: `${y}%`,
          background: `linear-gradient(180deg, rgba(250,100,0,0.00) 0%, rgba(250,100,0,0.05) 70%, rgba(250,100,0,0.10) 100%)`,
        }}
      />
      {/* The beam itself. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${y}%`,
          height: 3 * scale,
          background: `linear-gradient(90deg, rgba(250,100,0,0) 0%, ${BRAND.orange} 18%, ${BRAND.orange} 82%, rgba(250,100,0,0) 100%)`,
          boxShadow: `0 0 ${26 * scale}px ${BRAND.orange}`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * HIGHLIGHT
 * Inline text whose tinted background wipes in once the scan beam has passed.
 * `at` is the 0 -> 1 scan position where this phrase gets picked up.
 */
export const Highlight: React.FC<{
  children: React.ReactNode;
  scanProgress: number;
  at: number;
  scale: number;
}> = ({children, scanProgress, at, scale}) => {
  const fill = interpolate(scanProgress, [at, at + 0.1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    // The tint sits INSIDE the span's own padding rather than overhanging it.
    // An absolutely positioned box that spills outside paints on top of the
    // next character, which silently swallows any punctuation that follows.
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: `${3 * scale}px ${5 * scale}px`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: BRAND.orangeTint,
          border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
          borderRadius: 7 * scale,
          transformOrigin: 'left center',
          transform: `scaleX(${fill})`,
        }}
      />
      <span
        style={{
          position: 'relative',
          fontWeight: fill > 0.5 ? 600 : 400,
          color: fill > 0.5 ? BRAND.ink : 'inherit',
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Floating "Opportunity detected" pill. */
export const DetectChip: React.FC<{
  label: string;
  scale: number;
  frame: number;
  fps: number;
  delay: number;
  style?: React.CSSProperties;
}> = ({label, scale, frame, fps, delay, style}) => {
  const pop = springEnter({frame, fps, delay, damping: 13, stiffness: 150});

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 12 * scale,
        padding: `${13 * scale}px ${22 * scale}px`,
        background: BRAND.orange,
        borderRadius: 999,
        boxShadow: `0 ${14 * scale}px ${34 * scale}px rgba(250, 100, 0, 0.35)`,
        opacity: pop,
        transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
        ...style,
      }}
    >
      <SparkIcon size={19 * scale} color="#FFFFFF" />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 21 * scale,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Four-point sparkle, echoing the product's "Enhanced Notes" affordance. */
export const SparkIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{display: 'block'}}
  >
    <path
      d="M12 1.5c.9 4.6 2.2 6.6 6.8 7.5-4.6.9-5.9 2.9-6.8 7.5-.9-4.6-2.2-6.6-6.8-7.5 4.6-.9 5.9-2.9 6.8-7.5Z"
      fill={color}
    />
    <path
      d="M18.8 15c.45 2.3 1.05 3.2 3.2 3.6-2.15.45-2.75 1.35-3.2 3.6-.45-2.25-1.05-3.15-3.2-3.6 2.15-.4 2.75-1.3 3.2-3.6Z"
      fill={color}
      opacity={0.75}
    />
  </svg>
);

/** Rounded monogram used instead of any human imagery. */
export const Monogram: React.FC<{
  text: string;
  size: number;
  background: string;
  color: string;
}> = ({text, size, background, color}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 10,
      background,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_FAMILY,
      fontWeight: 700,
      fontSize: size * 0.4,
      letterSpacing: 0.5,
      flexShrink: 0,
    }}
  >
    {text}
  </div>
);
