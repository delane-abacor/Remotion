import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../brand';
import {Card, Scene, StepLabel} from '../../components/ui';
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 4 - the pipeline turns into revenue growth. */

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

const CHART_HEIGHT = 300;
const BAR_STAGGER = 3;
const FIRST_BAR = 4;

export const RevenueGrowth: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 90});
  const cardIn = springEnter({frame, fps, delay: 2, damping: 200, stiffness: 80});

  // Headline number counts from the starting revenue to the new one.
  const countProgress = interpolate(frame, [FIRST_BAR, FIRST_BAR + 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const revenue = interpolate(countProgress, [0, 1], [START_REVENUE, END_REVENUE]);
  const growthPct = ((END_REVENUE - START_REVENUE) / START_REVENUE) * 100;

  return (
    <Scene durationInFrames={durationInFrames}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <StepLabel step="04" title="Revenue growth" scale={scale} progress={labelIn} />

          <Card scale={scale} width={1180} progress={cardIn} padding={44}>
            {/* Headline figure */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40 * scale,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 17 * scale,
                    letterSpacing: 1.8 * scale,
                    textTransform: 'uppercase',
                    color: BRAND.muted,
                    marginBottom: 10 * scale,
                  }}
                >
                  Advisory revenue
                </div>
                <div
                  style={{
                    fontFamily: DISPLAY_FAMILY,
                    fontWeight: 700,
                    fontSize: 76 * scale,
                    lineHeight: 1,
                    color: BRAND.navy,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ${Math.round(revenue).toLocaleString('en-US')}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9 * scale,
                  padding: `${10 * scale}px ${18 * scale}px`,
                  borderRadius: 999,
                  background: BRAND.greenTint,
                  opacity: springEnter({frame, fps, delay: FIRST_BAR + 18, damping: 200}),
                }}
              >
                <svg
                  width={19 * scale}
                  height={19 * scale}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 16.5 11 10l3.5 3.5L20 7"
                    stroke={BRAND.green}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 7h5v5"
                    stroke={BRAND.green}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 23 * scale,
                    color: BRAND.green,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{Math.round(growthPct * countProgress)}%
                </span>
              </div>
            </div>

            {/* Bars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 26 * scale,
                height: CHART_HEIGHT * scale,
                borderBottom: `${2 * scale}px solid ${BRAND.line}`,
                paddingBottom: 2 * scale,
              }}
            >
              {BARS.map((bar, i) => {
                const grow = springEnter({
                  frame,
                  fps,
                  delay: FIRST_BAR + i * BAR_STAGGER,
                  damping: 19,
                  stiffness: 95,
                });
                const isLast = i === BARS.length - 1;

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${bar.value * grow * 100}%`,
                        borderRadius: `${10 * scale}px ${10 * scale}px 0 0`,
                        background: isLast
                          ? `linear-gradient(180deg, ${BRAND.orange} 0%, ${BRAND.orangeDeep} 100%)`
                          : `linear-gradient(180deg, ${BRAND.orange}38 0%, ${BRAND.orange}1F 100%)`,
                        border: isLast
                          ? 'none'
                          : `${1.5 * scale}px solid ${BRAND.orange}33`,
                        borderBottom: 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{display: 'flex', gap: 26 * scale, marginTop: 14 * scale}}>
              {BARS.map((bar, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: FONT_FAMILY,
                    fontSize: 18 * scale,
                    fontWeight: i === BARS.length - 1 ? 700 : 400,
                    color: i === BARS.length - 1 ? BRAND.navy : BRAND.muted,
                  }}
                >
                  {bar.label}
                </div>
              ))}
            </div>
          </Card>

          <div
            style={{
              marginTop: 22 * scale,
              fontFamily: FONT_FAMILY,
              fontSize: 21 * scale,
              color: BRAND.inkSoft,
              opacity: springEnter({frame, fps, delay: FIRST_BAR + 24, damping: 200}),
            }}
          >
            Opportunities surfaced automatically &middot; nothing left buried in a thread
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
