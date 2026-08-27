import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, TITLE} from '../../../brand';
import {Scene} from '../../../components/ui';
import {DISPLAY_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * SHORT CUT, BEAT 4 - the call to action.
 *
 * Same furniture as the long promo's end card (orange rule, lead line, domain
 * in the accent colour) but on a tighter spring and with the headline set
 * larger, so it reads at a glance in a feed. Holds through the final frame so
 * an editor has something to cut on.
 */
export const CTA: React.FC<{
  durationInFrames: number;
  headline: string;
  lead: string;
  url: string;
}> = ({durationInFrames, headline, lead, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const ruleIn = interpolate(frame, [1, 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const headlineIn = springEnter({frame, fps, delay: 5, damping: 18, stiffness: 140});
  const ctaIn = springEnter({frame, fps, delay: 12, damping: 18, stiffness: 140});

  const rise = (progress: number) => ({
    opacity: progress,
    transform: `translateY(${(1 - progress) * 16 * scale}px)`,
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
            marginBottom: 40 * scale,
            transform: `scaleX(${ruleIn})`,
          }}
        />

        <div
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontWeight: 600,
            fontSize: 62 * scale,
            letterSpacing: TITLE.tracking * scale,
            color: TITLE.color,
            marginBottom: 26 * scale,
            ...rise(headlineIn),
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16 * scale,
            fontFamily: DISPLAY_FAMILY,
            fontWeight: TITLE.weight,
            fontSize: 46 * scale,
            letterSpacing: TITLE.tracking * scale,
            whiteSpace: 'pre',
            ...rise(ctaIn),
          }}
        >
          <span style={{color: BRAND.inkSoft}}>{lead}</span>
          <span style={{color: BRAND.orange, fontWeight: 600}}>{url}</span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
