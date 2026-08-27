import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand';
import {Scene, Sfx} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * SHORT CUT, BEAT 1 - the hook.
 *
 * The long promo opens by typing its own title, which costs three seconds
 * before the viewer learns anything. A paid-social cut cannot afford that, so
 * this opens on the problem instead: two counters spin up the week's volume,
 * then the payoff line lands on the number that actually matters.
 *
 * The noise dims as the signal arrives, so the eye is pulled down the frame
 * rather than left to choose where to look.
 */

/** The volume the viewer is drowning in. */
const STATS = [
  {value: 312, label: 'Emails this week'},
  {value: 47, label: 'Meeting notes'},
] as const;

/** Frame each counter starts, and how long it takes to reach its value. */
const FIRST_STAT = 2;
const STAT_STAGGER = 7;
const COUNT_FRAMES = 20;

/** The payoff line lands here, and the counters dim to make room for it. */
const PAYOFF_AT = 34;

const countTo = (frame: number, target: number, start: number): number => {
  const t = interpolate(frame, [start, start + COUNT_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return Math.round(target * t);
};

export const Hook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  // Once the payoff is on screen the volume stats are context, not the point.
  const noiseOpacity = interpolate(frame, [PAYOFF_AT, PAYOFF_AT + 12], [1, 0.32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const payoffIn = springEnter({
    frame,
    fps,
    delay: PAYOFF_AT,
    damping: 15,
    stiffness: 140,
  });

  return (
    <Scene durationInFrames={durationInFrames}>
      {STATS.map((stat, i) => (
        <Sfx
          key={`stat-${stat.label}`}
          src={SFX.tick}
          at={FIRST_STAT + i * STAT_STAGGER}
          durationInFrames={6}
          volume={SFX_VOLUME.tick}
          name={`Stat ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={PAYOFF_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Payoff"
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* The noise. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 64 * scale,
            opacity: noiseOpacity,
          }}
        >
          {STATS.map((stat, i) => {
            const start = FIRST_STAT + i * STAT_STAGGER;
            const statIn = springEnter({
              frame,
              fps,
              delay: start,
              damping: 200,
              stiffness: 95,
            });

            return (
              <React.Fragment key={stat.label}>
                {i > 0 ? (
                  <span
                    style={{
                      width: 1.5 * scale,
                      height: 74 * scale,
                      background: BRAND.line,
                      opacity: statIn,
                    }}
                  />
                ) : null}

                <div
                  style={{
                    textAlign: 'center',
                    opacity: statIn,
                    transform: `translateY(${(1 - statIn) * 16 * scale}px)`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: DISPLAY_FAMILY,
                      fontWeight: 700,
                      fontSize: 104 * scale,
                      lineHeight: 1,
                      color: BRAND.navy,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {countTo(frame, stat.value, start)}
                  </div>
                  <div
                    style={{
                      marginTop: 12 * scale,
                      fontFamily: FONT_FAMILY,
                      fontWeight: 600,
                      fontSize: 19 * scale,
                      letterSpacing: 2.2 * scale,
                      textTransform: 'uppercase',
                      color: BRAND.muted,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* The signal. */}
        <div
          style={{
            marginTop: 58 * scale,
            display: 'flex',
            alignItems: 'baseline',
            gap: 20 * scale,
            opacity: payoffIn,
            transform: `translateY(${(1 - payoffIn) * 22 * scale}px)`,
          }}
        >
          <span
            style={{
              fontFamily: DISPLAY_FAMILY,
              fontWeight: 700,
              fontSize: 96 * scale,
              lineHeight: 1,
              color: BRAND.orange,
            }}
          >
            3
          </span>
          <span
            style={{
              fontFamily: DISPLAY_FAMILY,
              fontWeight: 500,
              fontSize: 46 * scale,
              color: BRAND.navy,
            }}
          >
            were revenue opportunities.
          </span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
