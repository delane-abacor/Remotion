import {zColor} from '@remotion/zod-types';
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {FONT_FAMILY} from '../fonts';
import {enterExit, exitProgress, springEnter} from '../lib/animation';
import {useSafeArea, useScale} from '../lib/layout';
import {COLORS, FONT_WEIGHT, TYPE} from '../theme';

/**
 * TITLE CARD
 * Full-frame opener. Title springs up, a rule wipes open under it, the
 * subtitle follows, then everything drifts up and fades before the last frame.
 *
 * The zod schema below is what makes these props editable live in the Studio
 * sidebar. zColor() renders a colour picker instead of a text field.
 */
export const titleCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  backgroundColor: zColor(),
  textColor: zColor(),
  mutedColor: zColor(),
  accentColor: zColor(),
  /** Plays the placeholder sound effect in public/audio/. */
  playSound: z.boolean(),
});

export type TitleCardProps = z.infer<typeof titleCardSchema>;

export const titleCardDefaultProps: TitleCardProps = {
  title: 'Title Card',
  subtitle: 'A neutral starting point',
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
  mutedColor: COLORS.textMuted,
  accentColor: COLORS.accent,
  playSound: false,
};

/** Frames spent entering and leaving. Everything else is hold time. */
const ENTER_FRAMES = 18;
const EXIT_FRAMES = 14;

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  mutedColor,
  accentColor,
  playSound,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const scale = useScale();
  const safeArea = useSafeArea();

  // Master opacity: 0 -> 1 on the way in, 1 -> 0 on the way out.
  const opacity = enterExit({
    frame,
    durationInFrames,
    enterFrames: ENTER_FRAMES,
    exitFrames: EXIT_FRAMES,
  });

  // 0 while on screen, 1 once fully gone - drives the exit drift.
  const leaving = exitProgress({frame, durationInFrames, exitFrames: EXIT_FRAMES});

  // Staggered springs so the three elements don't all arrive at once.
  const titleIn = springEnter({frame, fps});
  const ruleIn = springEnter({frame, fps, delay: 5, damping: 200});
  const subtitleIn = springEnter({frame, fps, delay: 9});

  const rise = (progress: number, distance: number) =>
    (1 - progress) * distance * scale - leaving * 40 * scale;

  return (
    <AbsoluteFill style={{backgroundColor}}>
      {/*
        A sound effect belongs inside a <Sequence> so its `from` prop controls
        WHEN it plays, in frames. See the README for trimming leading silence.
      */}
      {playSound ? (
        <Sequence from={0} name="Whoosh SFX">
          <Audio src={staticFile('audio/whoosh.wav')} volume={0.6} />
        </Sequence>
      ) : null}

      <AbsoluteFill
        style={{
          ...safeArea.padding,
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: FONT_FAMILY,
          opacity,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: TYPE.title * scale,
            lineHeight: 1.05,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: -0.02 * TYPE.title * scale,
            color: textColor,
            transform: `translateY(${rise(titleIn, 48)}px)`,
          }}
        >
          {title}
        </h1>

        {/* Horizontal rule wipes open from the left, then closes on exit. */}
        <div
          style={{
            marginTop: 28 * scale,
            marginBottom: 28 * scale,
            height: 4 * scale,
            width: 180 * scale,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `scaleX(${ruleIn * (1 - leaving)})`,
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: TYPE.subtitle * scale,
            fontWeight: FONT_WEIGHT.regular,
            color: mutedColor,
            transform: `translateY(${rise(subtitleIn, 32)}px)`,
            // A touch of extra fade on the subtitle so it trails the title out.
            opacity: interpolate(subtitleIn, [0, 1], [0, 1]),
          }}
        >
          {subtitle}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
