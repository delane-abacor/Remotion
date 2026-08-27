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
 * FINAL SCENE - the call to action.
 *
 * A short orange rule draws out, then the line rises into place and holds
 * through the last frame so an editor has something to cut on. The domain
 * takes the accent colour so the eye lands on where to go.
 *
 * Set in the same face, weight and tracking as the typed title card (see
 * TITLE in src/brand.ts) - only the size differs.
 */
export const EndCard: React.FC<{
  durationInFrames: number;
  lead: string;
  url: string;
}> = ({durationInFrames, lead, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const ruleIn = interpolate(frame, [3, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const leadIn = springEnter({frame, fps, delay: 8, damping: 200, stiffness: 95});
  const urlIn = springEnter({frame, fps, delay: 14, damping: 200, stiffness: 95});

  const rise = (progress: number) => ({
    opacity: progress,
    transform: `translateY(${(1 - progress) * 18 * scale}px)`,
  });

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
            display: 'flex',
            alignItems: 'baseline',
            gap: 0.28 * TITLE.size * scale,
            fontFamily: FONT_FAMILY,
            fontWeight: TITLE.weight,
            fontSize: 84 * scale,
            lineHeight: 1.1,
            letterSpacing: TITLE.tracking * scale,
            whiteSpace: 'pre',
          }}
        >
          <span style={{color: TITLE.color, ...rise(leadIn)}}>{lead}</span>
          <span style={{color: BRAND.orange, ...rise(urlIn)}}>{url}</span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
