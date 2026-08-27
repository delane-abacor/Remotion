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
 * TRANSPARENT OVERLAY DEMO
 * A corner badge on a genuinely transparent background.
 *
 * THE RULE FOR ALPHA: nothing in the tree may paint an opaque backdrop.
 * There is no `backgroundColor` on the root AbsoluteFill here - that single
 * omission is what leaves the alpha channel intact. Add one and the export
 * silently becomes opaque even with the ProRes 4444 flags.
 *
 * Render it with:
 *   npx remotion render OverlayBadge out/OverlayBadge.mov --codec=prores \
 *     --prores-profile=4444 --pixel-format=yuva444p10le --imageformat=png
 *
 * The Studio shows transparent areas as a checkerboard.
 */
export const overlayBadgeSchema = z.object({
  label: z.string(),
  sublabel: z.string(),
  position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  badgeColor: zColor(),
  textColor: zColor(),
  accentColor: zColor(),
  /** 0 = fully see-through badge, 1 = solid. */
  badgeOpacity: z.number().min(0).max(1).step(0.05),
});

export type OverlayBadgeProps = z.infer<typeof overlayBadgeSchema>;

export const overlayBadgeDefaultProps: OverlayBadgeProps = {
  label: 'LIVE',
  sublabel: 'Transparent overlay',
  position: 'top-right',
  badgeColor: COLORS.surface,
  textColor: COLORS.text,
  accentColor: COLORS.accent,
  badgeOpacity: 0.92,
};

const EXIT_FRAMES = 16;

/** Maps the schema's position enum onto flexbox alignment. */
const ALIGNMENT: Record<
  OverlayBadgeProps['position'],
  {justifyContent: 'flex-start' | 'center' | 'flex-end'; alignItems: 'flex-start' | 'center' | 'flex-end'}
> = {
  'top-left': {justifyContent: 'flex-start', alignItems: 'flex-start'},
  'top-right': {justifyContent: 'flex-start', alignItems: 'flex-end'},
  'bottom-left': {justifyContent: 'flex-end', alignItems: 'flex-start'},
  'bottom-right': {justifyContent: 'flex-end', alignItems: 'flex-end'},
  center: {justifyContent: 'center', alignItems: 'center'},
};

export const OverlayBadge: React.FC<OverlayBadgeProps> = ({
  label,
  sublabel,
  position,
  badgeColor,
  textColor,
  accentColor,
  badgeOpacity,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const scale = useScale();
  const safeArea = useSafeArea();

  const enter = springEnter({frame, fps, damping: 14, stiffness: 130});
  const leaving = exitProgress({frame, durationInFrames, exitFrames: EXIT_FRAMES});

  // Scale up on the way in, back down on the way out.
  const badgeScale =
    interpolate(enter, [0, 1], [0.82, 1]) * interpolate(leaving, [0, 1], [1, 0.88]);

  const opacity = enter * (1 - leaving);

  // Slow pulse on the accent dot so a static hold still has some life.
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.6),
    [-1, 1],
    [0.45, 1],
    {easing: Easing.inOut(Easing.ease)},
  );

  const alignment = ALIGNMENT[position];

  return (
    // No backgroundColor - the frame stays transparent outside the badge.
    <AbsoluteFill
      style={{
        ...safeArea.padding,
        flexDirection: 'column',
        justifyContent: alignment.justifyContent,
        alignItems: alignment.alignItems,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16 * scale,
          paddingTop: 18 * scale,
          paddingBottom: 18 * scale,
          paddingLeft: 26 * scale,
          paddingRight: 30 * scale,
          borderRadius: 999,
          backgroundColor: badgeColor,
          opacity: opacity * badgeOpacity,
          transform: `scale(${badgeScale})`,
          transformOrigin: 'center',
        }}
      >
        <div
          style={{
            width: 14 * scale,
            height: 14 * scale,
            borderRadius: 999,
            backgroundColor: accentColor,
            opacity: pulse,
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span
            style={{
              fontSize: TYPE.badge * scale,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: 0.1 * TYPE.badge * scale,
              lineHeight: 1.2,
              color: textColor,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
          {sublabel ? (
            <span
              style={{
                fontSize: TYPE.badge * 0.62 * scale,
                fontWeight: FONT_WEIGHT.regular,
                lineHeight: 1.3,
                color: textColor,
                opacity: 0.65,
                whiteSpace: 'nowrap',
              }}
            >
              {sublabel}
            </span>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
