import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, TITLE} from '../../brand';
import {Scene} from '../../components/ui';
import {FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/**
 * FINAL SCENE - the URL, on its own.
 *
 * A short orange rule draws out first, then the address rises into place and
 * holds through the last frame so an editor has something to cut on.
 */
export const EndCard: React.FC<{durationInFrames: number; url: string}> = ({
  durationInFrames,
  url,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const ruleIn = interpolate(frame, [3, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const urlIn = springEnter({frame, fps, delay: 8, damping: 200, stiffness: 95});

  return (
    <Scene durationInFrames={durationInFrames} hold>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: 132 * scale,
            height: 4 * scale,
            background: BRAND.orange,
            borderRadius: 999,
            marginBottom: 46 * scale,
            transform: `scaleX(${ruleIn})`,
          }}
        />

        <div
          style={{
            // Same face, weight and tracking as the typed title card, so the
            // piece opens and closes in one voice. Only the size differs.
            fontFamily: FONT_FAMILY,
            fontWeight: TITLE.weight,
            fontSize: 96 * scale,
            lineHeight: 1,
            letterSpacing: TITLE.tracking * scale,
            color: BRAND.navy,
            opacity: urlIn,
            transform: `translateY(${(1 - urlIn) * 22 * scale}px)`,
          }}
        >
          {url}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
