import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../brand';
import {
  Card,
  DetectChip,
  Highlight,
  ScanBeam,
  Scene,
  SparkIcon,
  StepLabel,
} from '../../components/ui';
import {FONT_FAMILY} from '../../fonts';
import {springEnter} from '../../lib/animation';
import {useScale} from '../../lib/layout';

/** SCENE 2 - the meeting recap is read the same way. */
export const MeetingScan: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 2, damping: 200, stiffness: 80});
  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 90});

  const scan = interpolate(frame, [24, 100], [0, 1], {
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

            <div style={{position: 'relative', padding: `${28 * scale}px ${38 * scale}px ${34 * scale}px`}}>
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
                  {hl('a new second clinic opening in October,', 0.24)} potential worker
                  misclassification risk for 5 of 9 therapists paid as 1099 contractors, and{' '}
                  {hl('a 401(k) proposal from the PEO.', 0.52)}
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
                <>Consolidated P&amp;L will not show whether the new location is profitable.</>,
                <>{hl('Landlord offered the building at $1.4M', 0.78)} — needs a buy vs. lease analysis.</>,
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
              delay={108}
              style={{right: 0, top: -28 * scale}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
