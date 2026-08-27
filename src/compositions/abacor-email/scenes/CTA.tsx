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
 * BEAT 4 - the call to action.
 *
 * Deliberately a copy of the short cut's end card rather than an import of it.
 * The two pieces are edited independently, and a shared end card means a tweak
 * to one silently re-cuts the other. The shared brand tokens keep them
 * consistent; the timing stays local.
 *
 * Holds through the final frame so an editor has something to cut on.
 */
export const CTA: React.FC<{
  durationInFrames: number;
  headline: string;
  subhead: string;
  lead: string;
  url: string;
}> = ({durationInFrames, headline, subhead, lead, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const ruleIn = interpolate(frame, [1, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const headlineIn = springEnter({frame, fps, delay: 6, damping: 20, stiffness: 120});
  const subheadIn = springEnter({frame, fps, delay: 13, damping: 20, stiffness: 120});
  const ctaIn = springEnter({frame, fps, delay: 21, damping: 20, stiffness: 120});

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
            marginBottom: 42 * scale,
            transform: `scaleX(${ruleIn})`,
          }}
        />

        <div
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontWeight: 600,
            fontSize: 58 * scale,
            letterSpacing: TITLE.tracking * scale,
            color: TITLE.color,
            marginBottom: 18 * scale,
            textAlign: 'center',
            ...rise(headlineIn),
          }}
        >
          {headline}
        </div>

        {/* What the product does, said plainly, under the headline. */}
        <div
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontWeight: 500,
            fontSize: 32 * scale,
            lineHeight: 1.4,
            letterSpacing: TITLE.tracking * scale,
            color: BRAND.inkSoft,
            marginBottom: 40 * scale,
            textAlign: 'center',
            maxWidth: 1100 * scale,
            ...rise(subheadIn),
          }}
        >
          {subhead}
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
