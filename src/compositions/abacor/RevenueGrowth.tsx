import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LS, ORANGE, OUTLINE, OUTLINE_W, R, S, T, W} from '../../design/tokens';
import {ABACOR_EASE, abacorSpring, riseIn, useDesignScale} from '../../design/motion';
import {
  MatteCard,
  PanelHeader,
  Scene,
  SectionLabel,
  Sfx,
  Tag,
  text,
} from '../../components/ui';
import {AppShell} from '../../components/AppShell';
import {SFX, SFX_VOLUME} from '../../sfx';

/**
 * SCENE 4 - what the pipeline is worth over time.
 *
 * Orange budget: the final bar only. Earlier bars use orange-wash, which is
 * the system's empty-bar chart fill. The growth figure is a neutral tag, not
 * green: green means synced or connected, and the system is explicit that it
 * is never decorative.
 */

const BARS = [
  {label: 'Q1', value: 0.42},
  {label: 'Q2', value: 0.51},
  {label: 'Q3', value: 0.58},
  {label: 'Q4', value: 0.72},
  {label: 'Q1', value: 0.88},
  {label: 'Q2', value: 1.0},
];

const START_REVENUE = 486000;
const END_REVENUE = 927500;
const CHART_H = 220;

const BAR_STAGGER = 2;
const FIRST_BAR = 4;
const COUNT_FRAMES = 20;

export const RevenueGrowth: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useDesignScale();

  const labelIn = abacorSpring({frame, fps});
  const cardIn = abacorSpring({frame, fps, delay: 2});

  const countProgress = interpolate(
    frame,
    [FIRST_BAR, FIRST_BAR + COUNT_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ABACOR_EASE},
  );
  const revenue = interpolate(countProgress, [0, 1], [START_REVENUE, END_REVENUE]);
  const growth = Math.round(
    ((END_REVENUE - START_REVENUE) / START_REVENUE) * 100 * countProgress,
  );
  const badgeIn = abacorSpring({frame, fps, delay: FIRST_BAR + COUNT_FRAMES});

  return (
    <Scene durationInFrames={durationInFrames}>
      {BARS.map((bar, i) => (
        <Sfx
          key={`bar-${i}`}
          src={SFX.tick}
          at={FIRST_BAR + i * BAR_STAGGER}
          durationInFrames={6}
          volume={SFX_VOLUME.tick * (i === BARS.length - 1 ? 1.15 : 0.8)}
          name={`Bar ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={FIRST_BAR + COUNT_FRAMES}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Growth"
      />

      <AppShell>
        <AbsoluteFill
          style={{
            padding: S.s8 * s,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Label and card share a column so the label aligns to the card edge. */}
          <div style={{width: 1120 * s}}>
            <div style={{marginBottom: S.s5 * s}}>
              <SectionLabel progress={labelIn}>Usage</SectionLabel>
            </div>

            <MatteCard width={1120} progress={cardIn}>
              <PanelHeader
                title="Advisory revenue"
                right={
                  <div style={{...riseIn(badgeIn, 8 * s)}}>
                    <Tag>+{growth}% over six quarters</Tag>
                  </div>
                }
              />

              <div style={{padding: S.s4 * s}}>
                <div
                  style={{
                    ...text(s, T.t28, W.kraftig, INK.base),
                    letterSpacing: LS.stat * T.t28 * s,
                    fontVariantNumeric: 'tabular-nums',
                    marginBottom: S.s5 * s,
                  }}
                >
                  ${Math.round(revenue).toLocaleString('en-US')}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: S.s3 * s,
                    height: CHART_H * s,
                    borderBottom: `${OUTLINE_W * s}px solid ${OUTLINE}`,
                  }}
                >
                  {BARS.map((bar, i) => {
                    const grow = abacorSpring({
                      frame,
                      fps,
                      delay: FIRST_BAR + i * BAR_STAGGER,
                    });
                    const isLast = i === BARS.length - 1;

                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${bar.value * grow * 100}%`,
                          borderRadius: `${R.r4 * s}px ${R.r4 * s}px 0 0`,
                          // orange-wash is the system's chart fill, but at
                          // this size on a graded frame it reads beige rather
                          // than orange. orange-mid keeps the hue readable.
                          background: isLast ? ORANGE.base : ORANGE.mid,
                        }}
                      />
                    );
                  })}
                </div>

                <div style={{display: 'flex', gap: S.s3 * s, marginTop: S.s2 * s}}>
                  {BARS.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        ...text(
                          s,
                          T.t12,
                          i === BARS.length - 1 ? W.kraftig : W.buch,
                          i === BARS.length - 1 ? INK.base : INK.a45,
                        ),
                      }}
                    >
                      {bar.label}
                    </div>
                  ))}
                </div>
              </div>
            </MatteCard>

            <div
              style={{
                marginTop: S.s4 * s,
                ...text(s, T.t12, W.buch, INK.a45),
                opacity: badgeIn,
              }}
            >
              Abacor reads your email and meetings. It does not send, reply or file
              anything.
            </div>
          </div>
        </AbsoluteFill>
      </AppShell>
    </Scene>
  );
};
