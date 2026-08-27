import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, BRAND_URL} from '../../brand';
import {AbacorLogo} from '../../components/AbacorLogo';
import {Scene} from '../../components/ui';
import {FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 5 - the mark assembles, the wordmark wipes in, the URL follows. */
export const EndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  // The mark drops in, then its cut-outs open, then the wordmark wipes across.
  const markIn = springEnter({frame, fps, delay: 4, damping: 15, stiffness: 120});
  const reveal = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const wordmark = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const urlIn = springEnter({frame, fps, delay: 38, damping: 200, stiffness: 90});
  const ruleIn = springEnter({frame, fps, delay: 33, damping: 200, stiffness: 110});

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
            opacity: markIn,
            transform: `translateY(${(1 - markIn) * 26 * scale}px)`,
          }}
        >
          <AbacorLogo size={128 * scale} reveal={reveal} wordmarkReveal={wordmark} />
        </div>

        <div
          style={{
            width: 120 * scale,
            height: 3 * scale,
            background: BRAND.orange,
            borderRadius: 999,
            margin: `${44 * scale}px 0 ${34 * scale}px`,
            transform: `scaleX(${ruleIn})`,
          }}
        />

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 44 * scale,
            letterSpacing: 1.5 * scale,
            color: BRAND.navy,
            opacity: urlIn,
            transform: `translateY(${(1 - urlIn) * 16 * scale}px)`,
          }}
        >
          {BRAND_URL}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
