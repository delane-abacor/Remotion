import {zColor} from '@remotion/zod-types';
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {FONT_FAMILY} from '../fonts';
import {lastFrame, springEnter} from '../lib/animation';
import {useSafeArea, useScale} from '../lib/layout';
import {COLORS, FONT_WEIGHT, TYPE} from '../theme';

/**
 * KINETIC TEXT
 * Words arrive one at a time on a spring, hold, then leave one at a time.
 *
 * The whole effect is a stagger: word `i` uses a delay of `i * staggerFrames`,
 * so adding or removing words needs no other change. Edit the `text` prop in
 * the Studio sidebar and the timing re-derives itself.
 */
export const kineticTextSchema = z.object({
  /** Split on whitespace - one animated word per chunk. */
  text: z.string(),
  backgroundColor: zColor(),
  textColor: zColor(),
  accentColor: zColor(),
  /** Frames between consecutive words. Lower = tighter, punchier. */
  staggerFrames: z.number().int().min(1).max(20),
  /** Highlights the final word in the accent colour. */
  accentLastWord: z.boolean(),
});

export type KineticTextProps = z.infer<typeof kineticTextSchema>;

export const kineticTextDefaultProps: KineticTextProps = {
  text: 'Every word enters and exits',
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
  accentColor: COLORS.accent,
  staggerFrames: 4,
  accentLastWord: true,
};

/** How long the last word's exit takes, in frames. */
const EXIT_FRAMES = 20;

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  backgroundColor,
  textColor,
  accentColor,
  staggerFrames,
  accentLastWord,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const scale = useScale();
  const safeArea = useSafeArea();

  const words = text.split(/\s+/).filter(Boolean);

  // Words leave in the same order they arrived, so the exit stagger has to
  // start early enough that the LAST word still finishes before the last frame.
  const exitStagger = Math.max(1, Math.round(staggerFrames / 2));
  const exitWindow = EXIT_FRAMES + exitStagger * Math.max(words.length - 1, 0);
  // Land the final word's exit on the last RENDERED frame, not on
  // durationInFrames - see lastFrame() for why that distinction matters.
  const last = lastFrame(durationInFrames);

  return (
    <AbsoluteFill style={{backgroundColor}}>
      <AbsoluteFill
        style={{
          ...safeArea.padding,
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: FONT_FAMILY,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: `${0.18 * TYPE.kinetic * scale}px ${0.28 * TYPE.kinetic * scale}px`,
            maxWidth: '100%',
          }}
        >
          {words.map((word, index) => {
            // ENTER: spring, staggered by word index.
            const enter = springEnter({
              frame,
              fps,
              delay: index * staggerFrames,
              damping: 16,
              stiffness: 120,
            });

            // EXIT: the same stagger, measured back from the last frame.
            const exitStart = last - exitWindow + index * exitStagger;
            const leaving = interpolate(
              frame,
              [exitStart, exitStart + EXIT_FRAMES],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.in(Easing.cubic),
              },
            );

            const y = (1 - enter) * 70 * scale - leaving * 70 * scale;
            const isLast = index === words.length - 1;

            return (
              <span
                key={`${word}-${index}`}
                style={{
                  display: 'inline-block',
                  fontSize: TYPE.kinetic * scale,
                  lineHeight: 1,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: -0.025 * TYPE.kinetic * scale,
                  color: accentLastWord && isLast ? accentColor : textColor,
                  opacity: enter * (1 - leaving),
                  transform: `translateY(${y}px) scale(${
                    interpolate(enter, [0, 1], [0.86, 1]) *
                    interpolate(leaving, [0, 1], [1, 0.9])
                  })`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
