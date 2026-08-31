import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LS, S, T, W} from '../../design/tokens';
import {ABACOR_EASE, abacorSpring, riseIn, useDesignScale} from '../../design/motion';
import {
  MatteCard,
  Meter,
  PanelHeader,
  RowGlyph,
  Scene,
  SectionLabel,
  Sfx,
  Tag,
  text,
} from '../../components/ui';
import {AppShell} from '../../components/AppShell';
import {SFX, SFX_VOLUME} from '../../sfx';

/**
 * SCENE 3 - the opportunities land in the pipeline.
 *
 * Orange budget: the meter is the only orange. The stat figure is ink, per the
 * system - a stat value is 26px Kraftig ink, never the accent. Sources are
 * neutral tags.
 *
 * Rows stagger 2 frames (67ms), close to the system's 30ms in-product value
 * and still legible at 30fps.
 */

const OPPORTUNITIES = [
  {
    title: 'Entity structuring for the second clinic',
    source: 'Email, meeting',
    value: 12000,
  },
  {title: 'Worker classification review', source: 'Email', value: 8500},
  {title: '401(k) plan advisory', source: 'Meeting', value: 6000},
  {title: 'Buy or lease analysis on the building', source: 'Meeting', value: 15000},
];

const TOTAL = OPPORTUNITIES.reduce((sum, o) => sum + o.value, 0);
/** The firm's target for the quarter, so the meter has something to fill. */
const TARGET = 60000;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const ROW_STAGGER = 2;
const FIRST_ROW = 8;
/** Numbers count up over 20 frames and land on the real value. */
const COUNT_FRAMES = 20;

export const Opportunities: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useDesignScale();

  const labelIn = abacorSpring({frame, fps});
  const cardIn = abacorSpring({frame, fps, delay: 2});

  const countProgress = interpolate(
    frame,
    [FIRST_ROW, FIRST_ROW + COUNT_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ABACOR_EASE},
  );
  const counted = TOTAL * countProgress;

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
        at={FIRST_ROW + COUNT_FRAMES}
        durationInFrames={18}
        volume={SFX_VOLUME.detect * 0.85}
        name="Total"
      />

      <AppShell activeRail={3}>
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
              <SectionLabel progress={labelIn}>Opportunities</SectionLabel>
            </div>

            <MatteCard width={1120} progress={cardIn}>
              <PanelHeader
                title="Pipeline"
                right={
                  <div style={{minWidth: 220 * s}}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'flex-end',
                        gap: S.s1 * s,
                        marginBottom: S.s2 * s,
                      }}
                    >
                      <span
                        style={{
                          ...text(s, T.t26, W.kraftig, INK.base),
                          letterSpacing: LS.stat * T.t26 * s,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {money(counted)}
                      </span>
                      <span style={text(s, T.t12, W.buch, INK.a45)}>
                        of {money(TARGET)}
                      </span>
                    </div>
                    <Meter progress={(counted / TARGET) * 1} />
                  </div>
                }
              />

              <div>
                {OPPORTUNITIES.map((o, i) => {
                  const p = abacorSpring({
                    frame,
                    fps,
                    delay: FIRST_ROW + i * ROW_STAGGER,
                  });

                  return (
                    <div
                      key={o.title}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: S.s3 * s,
                        padding: `${S.s3 * s}px ${S.s4 * s}px`,
                        borderBottom:
                          i < OPPORTUNITIES.length - 1
                            ? `${1 * s}px solid ${INK.a08}`
                            : 'none',
                        ...riseIn(p, 8 * s),
                      }}
                    >
                      <RowGlyph label={String(i + 1)} />
                      <div style={{flex: 1, minWidth: 0}}>
                        <div style={{marginBottom: S.s1 * s}}>
                          <span style={text(s, T.t14, W.kraftig, INK.base)}>
                            {o.title}
                          </span>
                        </div>
                        <Tag>{o.source}</Tag>
                      </div>
                      <span
                        style={{
                          ...text(s, T.t14, W.kraftig, INK.base),
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {money(o.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </MatteCard>

            <div
              style={{
                marginTop: S.s4 * s,
                ...text(s, T.t12, W.buch, INK.a45),
                opacity: abacorSpring({frame, fps, delay: FIRST_ROW + COUNT_FRAMES}),
              }}
            >
              {OPPORTUNITIES.length} opportunities from 1 email thread and 1 meeting.
            </div>
          </div>
        </AbsoluteFill>
      </AppShell>
    </Scene>
  );
};
