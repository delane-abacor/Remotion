import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LH, ORANGE, R, S, T, W} from '../../design/tokens';
import {ABACOR_EASE, abacorSpring, useDesignScale} from '../../design/motion';
import {
  Highlight,
  MatteCard,
  PanelHeader,
  ScanBeam,
  Scene,
  SectionLabel,
  Sfx,
  Toast,
  text,
} from '../../components/ui';
import {AppShell} from '../../components/AppShell';
import {SFX, SFX_VOLUME} from '../../sfx';

/**
 * SCENE 2 - the meeting note is read the same way.
 *
 * The recap block uses the orange-07 status-strip tint, which is a wash, not a
 * second solid orange. The beam and then the toast tick carry the budget.
 */

const SCAN_FROM = 6;
const SCAN_TO = 38;
const HIGHLIGHT_AT = [0.2, 0.5, 0.76];
const TOAST_AT = 42;

export const MeetingScan: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useDesignScale();

  const labelIn = abacorSpring({frame, fps});
  const cardIn = abacorSpring({frame, fps, delay: 2});

  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ABACOR_EASE,
  });

  const hl = (node: React.ReactNode, at: number) => (
    <Highlight scanProgress={scan} at={at}>
      {node}
    </Highlight>
  );

  const takeaways = [
    <>The consolidated P&amp;L will not show whether the new location is profitable.</>,
    <>
      {hl('The building is on offer at $1.4M.', HIGHLIGHT_AT[2]!)} Needs a buy or lease
      comparison.
    </>,
    <>Do not sign the 401(k) paperwork before the next call.</>,
  ];

  return (
    <Scene durationInFrames={durationInFrames}>
      <Sfx
        src={SFX.scan}
        at={SCAN_FROM}
        durationInFrames={SCAN_TO - SCAN_FROM + 8}
        volume={SFX_VOLUME.scan}
        name="Scan sweep"
      />
      {HIGHLIGHT_AT.map((p, i) => (
        <Sfx
          key={`ping-${i}`}
          src={SFX.ping}
          at={SCAN_FROM + p * (SCAN_TO - SCAN_FROM)}
          durationInFrames={12}
          volume={SFX_VOLUME.ping}
          name={`Highlight ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={TOAST_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Found"
      />

      <AppShell activeRail={2}>
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
              <SectionLabel progress={labelIn}>Meeting</SectionLabel>
            </div>

            <MatteCard width={1120} progress={cardIn}>
              <PanelHeader
                title="Therapy practice financial and tax strategy review"
                sub="12 August, 7 minutes, 2 attendees"
              />

              <div style={{position: 'relative', padding: S.s4 * s}}>
                {/* Status strip tint, carrying the assistant's summary. */}
                <div
                  style={{
                    background: ORANGE.a07,
                    borderRadius: R.r8 * s,
                    padding: S.s3 * s,
                    marginBottom: S.s4 * s,
                  }}
                >
                  <div style={{marginBottom: S.s2 * s}}>
                    <span style={text(s, T.t12, W.kraftig, ORANGE.deep)}>Recap</span>
                  </div>
                  <div
                    style={{...text(s, T.t14, W.buch, INK.a70), lineHeight: LH.default}}
                  >
                    Seven issues came up, including{' '}
                    {hl('a second clinic opening in October,', HIGHLIGHT_AT[0]!)} worker
                    classification for 5 of 9 therapists paid as 1099 contractors, and{' '}
                    {hl('a 401(k) proposal from the PEO.', HIGHLIGHT_AT[1]!)}
                  </div>
                </div>

                <div style={{marginBottom: S.s3 * s}}>
                  <span style={text(s, T.t15, W.kraftig, INK.base)}>Key takeaways</span>
                </div>

                {takeaways.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: S.s2 * s,
                      marginBottom: S.s2 * s,
                      ...text(s, T.t14, W.buch, INK.a70),
                    }}
                  >
                    <span
                      style={{
                        width: 4 * s,
                        height: 4 * s,
                        borderRadius: R.pill,
                        background: INK.a40,
                        marginTop: 8 * s,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{lineHeight: LH.default}}>{line}</span>
                  </div>
                ))}

                <ScanBeam progress={scan} />
              </div>
            </MatteCard>

            <Toast
              title="4 opportunities found"
              sub="Across 2 sources"
              frame={frame}
              fps={fps}
              delay={TOAST_AT}
            />
          </div>
        </AbsoluteFill>
      </AppShell>
    </Scene>
  );
};
