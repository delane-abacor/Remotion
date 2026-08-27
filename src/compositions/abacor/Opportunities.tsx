import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../brand';
import {Card, Scene, Sfx, SparkIcon, StepLabel} from '../../components/ui';
import {SFX, SFX_VOLUME} from '../../sfx';
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 3 - detected opportunities populate the pipeline, with a running total. */

const OPPORTUNITIES = [
  {title: 'Entity structuring - second clinic', source: 'Email + Meeting', value: 12000},
  {title: 'Worker classification review', source: 'Email', value: 8500},
  {title: '401(k) plan advisory', source: 'Meeting', value: 6000},
  {title: 'Buy vs. lease analysis - $1.4M building', source: 'Meeting', value: 15000},
];

const TOTAL = OPPORTUNITIES.reduce((sum, o) => sum + o.value, 0);

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/** Frames between consecutive rows landing. */
const ROW_STAGGER = 5;
const FIRST_ROW = 6;

export const Opportunities: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 90});
  const cardIn = springEnter({frame, fps, delay: 2, damping: 200, stiffness: 80});

  // The total counts up as each row lands, so the number and the list agree.
  const landed = OPPORTUNITIES.reduce((sum, o, i) => {
    const t = interpolate(
      frame,
      [FIRST_ROW + i * ROW_STAGGER, FIRST_ROW + i * ROW_STAGGER + 16],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    );
    return sum + o.value * t;
  }, 0);

  // A tick as each row lands, then a chime once the total has finished counting.
  const TOTAL_AT = FIRST_ROW + OPPORTUNITIES.length * ROW_STAGGER + 6;

  return (
    <Scene durationInFrames={durationInFrames}>
      {OPPORTUNITIES.map((o, i) => (
        <Sfx
          key={`tick-${o.title}`}
          src={SFX.tick}
          at={FIRST_ROW + i * ROW_STAGGER}
          durationInFrames={6}
          volume={SFX_VOLUME.tick}
          name={`Row ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={TOTAL_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect * 0.85}
        name="Total"
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <StepLabel step="03" title="Opportunities" scale={scale} progress={labelIn} />

          <Card scale={scale} width={1180} progress={cardIn} padding={0}>
            {/* Header with the running total */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${26 * scale}px ${38 * scale}px`,
                borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 12 * scale}}>
                <SparkIcon size={23 * scale} color={BRAND.orange} />
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 27 * scale,
                    color: BRAND.navy,
                  }}
                >
                  Opportunity pipeline
                </span>
              </div>
              <div style={{textAlign: 'right'}}>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 16 * scale,
                    letterSpacing: 1.6 * scale,
                    textTransform: 'uppercase',
                    color: BRAND.muted,
                    marginBottom: 2 * scale,
                  }}
                >
                  Identified value
                </div>
                <div
                  style={{
                    fontFamily: DISPLAY_FAMILY,
                    fontWeight: 700,
                    fontSize: 34 * scale,
                    color: BRAND.orange,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {money(landed)}
                </div>
              </div>
            </div>

            {/* Rows */}
            <div>
              {OPPORTUNITIES.map((o, i) => {
                const rowIn = springEnter({
                  frame,
                  fps,
                  delay: FIRST_ROW + i * ROW_STAGGER,
                  damping: 17,
                  stiffness: 120,
                });

                return (
                  <div
                    key={o.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20 * scale,
                      padding: `${23 * scale}px ${38 * scale}px`,
                      borderBottom:
                        i < OPPORTUNITIES.length - 1
                          ? `${1.5 * scale}px solid ${BRAND.lineSoft}`
                          : 'none',
                      opacity: rowIn,
                      transform: `translateX(${(1 - rowIn) * 46 * scale}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 10 * scale,
                        height: 10 * scale,
                        borderRadius: 999,
                        background: BRAND.orange,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontWeight: 600,
                          fontSize: 24 * scale,
                          color: BRAND.ink,
                          marginBottom: 5 * scale,
                        }}
                      >
                        {o.title}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontSize: 18 * scale,
                          color: BRAND.muted,
                        }}
                      >
                        Source: {o.source}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: DISPLAY_FAMILY,
                        fontWeight: 600,
                        fontSize: 27 * scale,
                        color: BRAND.navy,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {money(o.value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Footnote total, appears once every row has landed. */}
          <div
            style={{
              marginTop: 22 * scale,
              alignSelf: 'flex-end',
              fontFamily: FONT_FAMILY,
              fontSize: 21 * scale,
              color: BRAND.inkSoft,
              opacity: springEnter({
                frame,
                fps,
                delay: TOTAL_AT,
                damping: 200,
              }),
            }}
          >
            {OPPORTUNITIES.length} opportunities &middot;{' '}
            <span style={{fontWeight: 700, color: BRAND.navy}}>{money(TOTAL)}</span> added
            to the pipeline
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
