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
import {exitProgress, springEnter} from '../lib/animation';
import {useSafeArea, useScale} from '../lib/layout';
import {COLORS, FONT_WEIGHT, TYPE} from '../theme';

/**
 * LOWER THIRD
 * Name-and-role strip for the bottom-left of the frame.
 *
 * This composition has NO background fill, so it renders with a real alpha
 * channel - export it with the ProRes 4444 command in the README and drop it
 * straight over footage in your editor. In the Studio you'll see it on a
 * checkerboard, which is what "transparent" looks like there.
 *
 * The reveals use clipPath rather than scaleX so nothing gets stretched.
 */
export const lowerThirdSchema = z.object({
  name: z.string(),
  role: z.string(),
  accentColor: zColor(),
  plateColor: zColor(),
  textColor: zColor(),
  mutedColor: zColor(),
  /** 0 = invisible plate (text floats on footage), 1 = fully solid. */
  plateOpacity: z.number().min(0).max(1).step(0.05),
});

export type LowerThirdProps = z.infer<typeof lowerThirdSchema>;

export const lowerThirdDefaultProps: LowerThirdProps = {
  name: 'Jane Doe',
  role: 'Lower Third',
  accentColor: COLORS.accent,
  plateColor: COLORS.surface,
  textColor: COLORS.text,
  mutedColor: COLORS.textMuted,
  plateOpacity: 0.9,
};

const EXIT_FRAMES = 16;

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  role,
  accentColor,
  plateColor,
  textColor,
  mutedColor,
  plateOpacity,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const scale = useScale();
  const safeArea = useSafeArea();

  const leaving = exitProgress({frame, durationInFrames, exitFrames: EXIT_FRAMES});

  // Exit multiplier: 1 while on screen, easing down to 0 as it leaves.
  const wipeOut = interpolate(leaving, [0, 1], [1, 0], {
    easing: Easing.in(Easing.cubic),
  });

  // Staggered entrances: rule, then plate, then each line of text.
  const ruleIn = springEnter({frame, fps, damping: 200, stiffness: 130});
  const plateIn = springEnter({frame, fps, delay: 4, damping: 200, stiffness: 90});
  const nameIn = springEnter({frame, fps, delay: 10});
  const roleIn = springEnter({frame, fps, delay: 14});

  /** Left-to-right reveal that also nudges the text into place. */
  const wipe = (progress: number) => {
    const p = progress * wipeOut;
    return {
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      transform: `translateX(${(1 - progress) * 24 * scale}px)`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        // No backgroundColor here on purpose - this is what preserves alpha.
        ...safeArea.padding,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{display: 'flex', alignItems: 'stretch'}}>
        {/* Vertical accent rule - grows from the bottom up. */}
        <div
          style={{
            width: 6 * scale,
            backgroundColor: accentColor,
            transformOrigin: 'bottom center',
            transform: `scaleY(${ruleIn * wipeOut})`,
          }}
        />

        {/* Plate - wipes open to the right from behind the rule. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 22 * scale,
            paddingBottom: 22 * scale,
            paddingLeft: 32 * scale,
            paddingRight: 64 * scale,
            backgroundColor: plateColor,
            opacity: plateOpacity,
            ...wipe(plateIn),
          }}
        >
          <div
            style={{
              fontSize: TYPE.name * scale,
              fontWeight: FONT_WEIGHT.bold,
              lineHeight: 1.1,
              color: textColor,
              whiteSpace: 'nowrap',
              ...wipe(nameIn),
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 10 * scale,
              fontSize: TYPE.role * scale,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: 0.08 * TYPE.role * scale,
              textTransform: 'uppercase',
              color: mutedColor,
              whiteSpace: 'nowrap',
              ...wipe(roleIn),
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
