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
  ScanBeam,
  Scene,
  Sfx,
  SparkIcon,
  StepLabel,
} from '../../components/ui';
import {SFX, SFX_VOLUME} from '../../sfx';
import {FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 2 - the meeting recap is read the same way. */
/** Scan timings in frames, and where along the sweep each phrase lights up. */
const SCAN_FROM = 6;
const SCAN_TO = 40;
const HIGHLIGHT_AT = [0.24, 0.52, 0.78];
const DETECT_AT = 42;

export const MeetingScan: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 2, damping: 200, stiffness: 80});
  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 90});

  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const hl = (node: React.ReactNode, at: number) => (
    <Highlight scanProgress={scan} at={at} scale={scale}>
      {node}
    </Highlight>
  );

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
        at={DETECT_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Detected"
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <StepLabel step="02" title="Meeting note" scale={scale} progress={labelIn} />

          <Card scale={scale} width={1180} progress={cardIn} padding={0}>
            {/* Note header */}
            <div
              style={{
                padding: `${26 * scale}px ${38 * scale}px ${20 * scale}px`,
                borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 27 * scale,
                  color: BRAND.navy,
                  marginBottom: 9 * scale,
                }}
              >
                Therapy Practice Financial and Tax Strategy Review
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 19 * scale,
                  color: BRAND.muted,
                }}
              >
                August 12 &middot; 7 min &middot; 2 attendees
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                padding: `${28 * scale}px ${38 * scale}px ${34 * scale}px`,
              }}
            >
              {/* Recap panel, echoing the product's tinted block */}
              <div
                style={{
                  background: BRAND.orangeTint,
                  border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
                  borderRadius: 16 * scale,
                  padding: `${22 * scale}px ${26 * scale}px`,
                  marginBottom: 26 * scale,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10 * scale,
                    marginBottom: 14 * scale,
                  }}
                >
                  <SparkIcon size={21 * scale} color={BRAND.orange} />
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: 700,
                      fontSize: 21 * scale,
                      color: BRAND.orangeDeep,
                    }}
                  >
                    Recap
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 22 * scale,
                    lineHeight: 1.75,
                    color: BRAND.ink,
                  }}
                >
                  Client raised seven distinct issues, including{' '}
                  {hl('a new second clinic opening in October,', HIGHLIGHT_AT[0]!)}{' '}
                  potential worker misclassification risk for 5 of 9 therapists paid as
                  1099 contractors, and{' '}
                  {hl('a 401(k) proposal from the PEO.', HIGHLIGHT_AT[1]!)}
                </div>
              </div>

              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 23 * scale,
                  color: BRAND.navy,
                  marginBottom: 14 * scale,
                }}
              >
                Key takeaways
              </div>

              {[
                <>
                  Consolidated P&amp;L will not show whether the new location is
                  profitable.
                </>,
                <>
                  {hl('Landlord offered the building at $1.4M', HIGHLIGHT_AT[2]!)} — needs
                  a buy vs. lease analysis.
                </>,
                <>Advised not to sign the 401(k) paperwork before the next discussion.</>,
              ].map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14 * scale,
                    marginBottom: 12 * scale,
                    fontFamily: FONT_FAMILY,
                    fontSize: 21 * scale,
                    lineHeight: 1.7,
                    color: BRAND.inkSoft,
                  }}
                >
                  <span
                    style={{
                      width: 7 * scale,
                      height: 7 * scale,
                      borderRadius: 999,
                      background: BRAND.orange,
                      marginTop: 13 * scale,
                      flexShrink: 0,
                    }}
                  />
                  <span>{line}</span>
                </div>
              ))}

              <ScanBeam scale={scale} progress={scan} />
            </div>
          </Card>

          <div style={{position: 'relative', width: '100%'}}>
            <DetectChip
              label="4 opportunities detected"
              scale={scale}
              frame={frame}
              fps={fps}
              delay={DETECT_AT}
              style={{right: 0, top: -28 * scale}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
