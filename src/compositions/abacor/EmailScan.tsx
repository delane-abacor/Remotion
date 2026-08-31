import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LH, S, T, W} from '../../design/tokens';
import {ABACOR_EASE, abacorSpring, useDesignScale} from '../../design/motion';
import {
  Highlight,
  MatteCard,
  PanelHeader,
  RowGlyph,
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
 * SCENE 1 - an email thread is read.
 *
 * Orange budget: the beam while it sweeps, then the toast's tick once the beam
 * is gone. Never both at the same moment. The picked-up phrases use the
 * attention-tag tint, which is a wash rather than a second solid orange.
 */

const SCAN_FROM = 6;
const SCAN_TO = 40;
const HIGHLIGHT_AT = [0.18, 0.46, 0.74];
const TOAST_AT = 44;

export const EmailScan: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
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

  const emails = [
    {
      from: 'Tomas Rivera',
      initials: 'TR',
      time: '09:14',
      lines: [
        <>
          We signed the lease {hl('for a second clinic', HIGHLIGHT_AT[0]!)} three weeks
          ago.
        </>,
        <>It opens in October. Does anything need to change?</>,
      ],
    },
    {
      from: 'Practice admin',
      initials: 'PA',
      time: '09:31',
      lines: [
        <>
          Payroll question too.{' '}
          {hl('5 of our 9 therapists are on 1099', HIGHLIGHT_AT[1]!)}
        </>,
        <>and the PEO sent a 401(k) proposal to sign.</>,
      ],
    },
    {
      from: 'Tomas Rivera',
      initials: 'TR',
      time: '09:48',
      lines: [
        <>
          The landlord also offered to{' '}
          {hl('sell the building for $1.4M.', HIGHLIGHT_AT[2]!)}
        </>,
        <>Worth looking at?</>,
      ],
    },
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

      <AppShell activeRail={1}>
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
              <SectionLabel progress={labelIn}>Email</SectionLabel>
            </div>

            <MatteCard width={1120} progress={cardIn}>
              <PanelHeader
                title="Second clinic and payroll questions"
                right={<span style={text(s, T.t12, W.buch, INK.a45)}>3 emails</span>}
              />

              <div style={{position: 'relative'}}>
                {emails.map((email, i) => (
                  <div
                    key={email.from + i}
                    style={{
                      display: 'flex',
                      gap: S.s3 * s,
                      padding: `${S.s3 * s}px ${S.s4 * s}px`,
                      borderBottom:
                        i < emails.length - 1 ? `${1 * s}px solid ${INK.a08}` : 'none',
                    }}
                  >
                    <RowGlyph label={email.initials} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: S.s2 * s,
                          marginBottom: S.s1 * s,
                        }}
                      >
                        <span style={text(s, T.t14, W.kraftig, INK.base)}>
                          {email.from}
                        </span>
                        <span style={text(s, T.t12, W.buch, INK.a45)}>{email.time}</span>
                      </div>
                      {email.lines.map((line, li) => (
                        <div
                          key={li}
                          style={{
                            ...text(s, T.t14, W.buch, INK.a70),
                            lineHeight: LH.default,
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <ScanBeam progress={scan} />
              </div>
            </MatteCard>

            <Toast
              title="3 opportunities found"
              sub="Added to the pipeline"
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
