import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  FONT,
  INK,
  LH,
  LS,
  METER,
  ORANGE,
  OUTLINE,
  OUTLINE_W,
  R,
  S,
  SHADOW,
  T,
  W,
  WHITE,
} from '../design/tokens';
import {D, abacorSpring, linearFade, riseIn, useDesignScale} from '../design/motion';

/**
 * Abacor components, built to the measured specs in the design system's
 * `references/components.md`. Sizes are in 1440x900 design units; every
 * component multiplies by useDesignScale() so the same code is correct at
 * 1080p and 4K.
 */

/* ------------------------------------------------------------------ audio */

/**
 * A one-shot sound effect at a specific frame of the scene it sits in.
 * `at` is rounded because Sequence needs a whole frame.
 */
export const Sfx: React.FC<{
  src: string;
  at: number;
  volume?: number;
  durationInFrames?: number;
  name?: string;
}> = ({src, at, volume = 0.5, durationInFrames = 45, name}) => (
  <Sequence
    from={Math.round(at)}
    durationInFrames={durationInFrames}
    name={name ?? 'SFX'}
  >
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/* ------------------------------------------------------------------ scene */

/**
 * Wraps a scene so it fades in and out within its own Sequence.
 *
 * The fade is LINEAR: the system is explicit that easing an opacity-only fade
 * reads as a mistake at 30fps. Scene crossfades run 12 frames (400ms).
 *
 * `hold` keeps a final scene on screen through the last frame instead of
 * dissolving to an empty page.
 */
export const Scene: React.FC<{
  durationInFrames: number;
  hold?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, hold = false, children}) => {
  const frame = useCurrentFrame();
  const last = Math.max(durationInFrames - 1, 1);

  const opacity = hold
    ? linearFade(frame, [0, D.scene], [0, 1])
    : linearFade(frame, [0, D.scene, last - D.scene, last], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        /**
         * Forces the scene onto its own composited layer, which makes Chromium
         * fall back to GRAYSCALE text antialiasing.
         *
         * By default it uses LCD subpixel antialiasing, which paints an orange
         * fringe down the left of every stem and a blue one down the right
         * (measured: rgb(169,90,40) and rgb(26,76,147) either side of the ink).
         * Those fringes are real colour data, so 4:2:0 chroma subsampling
         * smears them on encode and the type reads soft and chromatic.
         *
         * -webkit-font-smoothing does not help: it is honoured only on macOS.
         * Promoting the layer is the portable fix.
         */
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- typography */

/** 11px Buch, uppercase, 4% tracking, ink-45. The only uppercase in the system. */
export const SectionLabel: React.FC<{children: React.ReactNode; progress?: number}> = ({
  children,
  progress = 1,
}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: W.buch,
        fontSize: T.t11 * s,
        letterSpacing: LS.label * T.t11 * s,
        textTransform: 'uppercase',
        color: INK.a45,
        ...riseIn(progress, 8 * s),
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ cards */

/**
 * THE MATTE INSET CARD - the signature Abacor container.
 *
 * Outer shell at ink-03 with an ink-08 border OUTSIDE, 4px of padding, and a
 * white panel with its own ink-08 border INSIDE. The 4px gap is doing the
 * work: small enough that the layers read as one object, large enough that the
 * tint at the edge gives depth. A single flat bordered card is not the same
 * thing and looks noticeably cheaper.
 */
export const MatteCard: React.FC<{
  width: number;
  progress?: number;
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = ({width, progress = 1, style, panelStyle, children}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        width: width * s,
        background: INK.a03,
        border: `${OUTLINE_W * s}px solid ${OUTLINE}`,
        borderRadius: R.r12 * s,
        padding: S.s1 * s,
        ...riseIn(progress, 8 * s),
        ...style,
      }}
    >
      <div
        style={{
          background: WHITE.base,
          border: `${OUTLINE_W * s}px solid ${OUTLINE}`,
          borderRadius: R.r8 * s,
          overflow: 'hidden',
          ...panelStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- tags */

/** 10px Kraftig pill. Neutral by default; `attention` is the orange tint. */
export const Tag: React.FC<{
  children: React.ReactNode;
  attention?: boolean;
}> = ({children, attention = false}) => {
  const s = useDesignScale();

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${2 * s}px ${6 * s}px`,
        borderRadius: R.r4 * s,
        fontFamily: FONT,
        fontWeight: W.kraftig,
        fontSize: T.t10 * s,
        letterSpacing: LS.tag * T.t10 * s,
        lineHeight: LH.tight,
        background: attention ? ORANGE.a07 : INK.a04,
        border: `${1 * s}px solid ${attention ? ORANGE.a25 : OUTLINE}`,
        color: attention ? ORANGE.base : INK.a60,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ meter */

/**
 * The three-stop meter. Solid, washed at 47.5%, solid at 70%, plus the glow.
 * A two-stop fade loses the detail that makes it recognisable.
 *
 * Width animates with ABACOR_EASE. Never spring a progress bar.
 */
export const Meter: React.FC<{progress: number}> = ({progress}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        width: '100%',
        height: 2 * s,
        background: METER.track,
        borderRadius: R.pill,
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: '100%',
          background: METER.orange,
          boxShadow: METER.glowOrange,
          borderRadius: R.pill,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ toast */

/**
 * Confirmation toast. 24px from the bottom-right of the content area, with an
 * orange circular tick, a 13px Kraftig title and a 12px Buch subline.
 *
 * This is the one orange element in a scan scene, and it only appears once the
 * beam has finished, so the budget is never spent twice at the same moment.
 */
export const Toast: React.FC<{
  title: string;
  sub: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({title, sub, frame, fps, delay}) => {
  const s = useDesignScale();
  const p = abacorSpring({frame, fps, delay});

  return (
    <div
      style={{
        position: 'absolute',
        right: S.s6 * s,
        bottom: S.s6 * s,
        display: 'flex',
        alignItems: 'center',
        gap: S.s3 * s,
        padding: `${14 * s}px ${S.s4 * s}px`,
        borderRadius: R.r12 * s,
        background: WHITE.base,
        border: `${OUTLINE_W * s}px solid ${OUTLINE}`,
        boxShadow: SHADOW.menu,
        ...riseIn(p, 8 * s),
      }}
    >
      <div
        style={{
          width: S.s6 * s,
          height: S.s6 * s,
          borderRadius: R.pill,
          background: ORANGE.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={14 * s} height={14 * s} viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 8.4l3 3 6-6.4"
            stroke={WHITE.base}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 2 * s}}>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: W.kraftig,
            fontSize: T.t13 * s,
            lineHeight: LH.tight,
            color: INK.base,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: W.buch,
            fontSize: T.t12 * s,
            lineHeight: LH.tight,
            color: INK.a55,
            whiteSpace: 'nowrap',
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- scan */

/**
 * The scan beam. A 1px orange line sweeping the panel, leaving a faint tint
 * behind it. This is the single orange element while it is on screen.
 */
export const ScanBeam: React.FC<{progress: number}> = ({progress}) => {
  const s = useDesignScale();
  if (progress <= 0 || progress >= 1) {
    return null;
  }
  const y = progress * 100;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: `${y}%`,
          background: ORANGE.a05,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${y}%`,
          height: 2 * s,
          background: ORANGE.base,
          // No glow here. A glow is a blur, and on a hairline it reads as
          // softness rather than light. The meter keeps its glow; that one is
          // specified by the system.
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * A phrase the scan has picked up. The tint wipes in as the beam passes,
 * using the attention-tag treatment rather than a second solid orange.
 */
export const Highlight: React.FC<{
  children: React.ReactNode;
  scanProgress: number;
  at: number;
}> = ({children, scanProgress, at}) => {
  const s = useDesignScale();
  const fill = linearFade(scanProgress, [at, at + 0.08], [0, 1]);

  return (
    // The tint sits inside the span's own padding. An absolutely positioned
    // box that spills outside paints over the next character and swallows any
    // punctuation that follows.
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: `${2 * s}px ${S.s1 * s}px`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: ORANGE.a07,
          border: `${1 * s}px solid ${ORANGE.a25}`,
          borderRadius: R.r4 * s,
          transformOrigin: 'left center',
          transform: `scaleX(${fill})`,
        }}
      />
      <span
        style={{
          position: 'relative',
          fontWeight: fill > 0.5 ? W.kraftig : W.buch,
          color: fill > 0.5 ? ORANGE.deep : 'inherit',
        }}
      >
        {children}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------- rows */

/** 28px rounded-square glyph. A glyph means a record about to be created. */
export const RowGlyph: React.FC<{label: string}> = ({label}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        width: 28 * s,
        height: 28 * s,
        borderRadius: R.r6 * s,
        background: INK.a03,
        border: `${OUTLINE_W * s}px solid ${OUTLINE}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: W.kraftig,
        fontSize: T.t12 * s,
        color: INK.a60,
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
};

/** Panel header: title left, optional right slot, bottom hairline. */
export const PanelHeader: React.FC<{
  title: string;
  right?: React.ReactNode;
  sub?: string;
}> = ({title, right, sub}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: sub ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        padding: `${S.s4 * s}px`,
        borderBottom: `${OUTLINE_W * s}px solid ${OUTLINE}`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: S.s1 * s}}>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: W.kraftig,
            fontSize: T.t18 * s,
            lineHeight: LH.tight,
            color: INK.base,
          }}
        >
          {title}
        </span>
        {sub ? (
          <span
            style={{
              fontFamily: FONT,
              fontWeight: W.buch,
              fontSize: T.t12 * s,
              lineHeight: LH.default,
              color: INK.a55,
            }}
          >
            {sub}
          </span>
        ) : null}
      </div>
      {right}
    </div>
  );
};

/** Text style helpers so scenes never restate the ramp inline. */
export const text = (
  s: number,
  size: number,
  weight: number = W.buch,
  color: string = INK.base,
): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: weight,
  fontSize: size * s,
  lineHeight: LH.default,
  color,
});
