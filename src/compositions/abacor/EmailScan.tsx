import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../brand';
import {
  Card,
  DetectChip,
  Highlight,
  Monogram,
  ScanBeam,
  Scene,
  StepLabel,
} from '../../components/ui';
import {FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 1 - an email thread is read and an opportunity is spotted. */

type Message = {
  from: string;
  initials: string;
  time: string;
  lines: React.ReactNode[];
};

export const EmailScan: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 2, damping: 200, stiffness: 80});
  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 90});

  // The beam sweeps between these frames.
  const scan = interpolate(frame, [6, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const hl = (node: React.ReactNode, at: number) => (
    <Highlight scanProgress={scan} at={at} scale={scale}>
      {node}
    </Highlight>
  );

  const messages: Message[] = [
    {
      from: 'Tomás R.',
      initials: 'TR',
      time: '09:14',
      lines: [
        <>We signed the lease {hl('for a second clinic', 0.2)} three weeks ago —</>,
        <>doors open in October. Do we need to change anything?</>,
      ],
    },
    {
      from: 'Practice Admin',
      initials: 'PA',
      time: '09:31',
      lines: [
        <>Payroll question too: {hl('5 of our 9 therapists are on 1099', 0.46)}</>,
        <>and the PEO just sent over a 401(k) proposal to sign.</>,
      ],
    },
    {
      from: 'Tomás R.',
      initials: 'TR',
      time: '09:48',
      lines: [
        <>Also — the landlord offered to {hl('sell the building for $1.4M.', 0.72)}</>,
        <>Not sure if that is something we should look at.</>,
      ],
    },
  ];

  return (
    <Scene durationInFrames={durationInFrames}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <StepLabel step="01" title="Email thread" scale={scale} progress={labelIn} />

          <Card scale={scale} width={1180} progress={cardIn} padding={0}>
            {/* Thread header */}
            <div
              style={{
                padding: `${26 * scale}px ${38 * scale}px`,
                borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 27 * scale,
                  color: BRAND.navy,
                }}
              >
                Re: Second clinic + payroll questions
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 20 * scale,
                  color: BRAND.muted,
                }}
              >
                3 messages
              </div>
            </div>

            {/* Messages */}
            <div style={{position: 'relative'}}>
              {messages.map((m, i) => (
                <div
                  key={m.from + i}
                  style={{
                    display: 'flex',
                    gap: 20 * scale,
                    padding: `${24 * scale}px ${38 * scale}px`,
                    borderBottom:
                      i < messages.length - 1
                        ? `${1.5 * scale}px solid ${BRAND.lineSoft}`
                        : 'none',
                  }}
                >
                  <Monogram
                    text={m.initials}
                    size={44 * scale}
                    background={i === 1 ? BRAND.orangeTint : '#E9EFF2'}
                    color={i === 1 ? BRAND.orangeDeep : BRAND.inkSoft}
                  />
                  <div style={{flex: 1, minWidth: 0}}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 12 * scale,
                        marginBottom: 9 * scale,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontWeight: 600,
                          fontSize: 22 * scale,
                          color: BRAND.ink,
                        }}
                      >
                        {m.from}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontSize: 18 * scale,
                          color: BRAND.muted,
                        }}
                      >
                        {m.time}
                      </span>
                    </div>
                    {m.lines.map((line, li) => (
                      <div
                        key={li}
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontSize: 22 * scale,
                          lineHeight: 1.75,
                          color: BRAND.inkSoft,
                        }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <ScanBeam scale={scale} progress={scan} />
            </div>
          </Card>

          <div style={{position: 'relative', width: '100%'}}>
            <DetectChip
              label="Opportunity detected"
              scale={scale}
              frame={frame}
              fps={fps}
              delay={44}
              style={{right: 0, top: -28 * scale}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
