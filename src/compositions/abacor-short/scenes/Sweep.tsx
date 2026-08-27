import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand';
import {
  Card,
  DetectChip,
  Highlight,
  Monogram,
  ScanBeam,
  Scene,
  Sfx,
  SparkIcon,
} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * SHORT CUT, BEAT 2 - one sweep over everything.
 *
 * The long promo gives email and meetings a scene each, which costs six
 * seconds to make a single point: Abacor reads what you already have. Here
 * both sources sit in one card and one beam crosses the lot, so the same
 * point lands in under three.
 *
 * Every line is trimmed to one row - a paid-social viewer reads shapes, not
 * paragraphs.
 */

const SCAN_FROM = 5;
const SCAN_TO = 54;
/** Where along the sweep each phrase lights up. */
const HIGHLIGHT_AT = [0.2, 0.5, 0.8];
const DETECT_AT = 57;

export const Sweep: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 1, damping: 200, stiffness: 90});

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

  /** Header status flips from the act to its result. */
  const done = scan >= 1;

  const rows = [
    {
      kind: 'email' as const,
      initials: 'TR',
      who: 'Tomás R.',
      meta: 'Email · 09:14',
      line: (
        <>
          We signed the lease {hl('for a second clinic', HIGHLIGHT_AT[0]!)} — doors open
          in October.
        </>
      ),
    },
    {
      kind: 'email' as const,
      initials: 'PA',
      who: 'Practice Admin',
      meta: 'Email · 09:31',
      line: (
        <>
          Payroll: {hl('5 of our 9 therapists are on 1099', HIGHLIGHT_AT[1]!)}, plus a
          401(k) proposal to sign.
        </>
      ),
    },
    {
      kind: 'meeting' as const,
      initials: 'MN',
      who: 'Quarterly review',
      meta: 'Meeting note · Fri',
      line: (
        <>Landlord offered to {hl('sell the building for $1.4M.', HIGHLIGHT_AT[2]!)}</>
      ),
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
        at={DETECT_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Detected"
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <Card scale={scale} width={1240} progress={cardIn} padding={0}>
            {/* Header - both sources named, so the single sweep reads as covering both. */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${26 * scale}px ${38 * scale}px`,
                borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 13 * scale}}>
                <SparkIcon size={24 * scale} color={BRAND.orange} />
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 28 * scale,
                    color: BRAND.navy,
                  }}
                >
                  Inbox + meeting notes
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 20 * scale,
                  letterSpacing: 1.4 * scale,
                  textTransform: 'uppercase',
                  color: done ? BRAND.orange : BRAND.muted,
                }}
              >
                {done ? '3 found' : 'Reading…'}
              </span>
            </div>

            {/* Body - the beam covers every source in one pass. */}
            <div style={{position: 'relative'}}>
              {rows.map((row, i) => (
                <div
                  key={row.who}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20 * scale,
                    padding: `${26 * scale}px ${38 * scale}px`,
                    borderBottom:
                      i < rows.length - 1
                        ? `${1.5 * scale}px solid ${BRAND.lineSoft}`
                        : 'none',
                  }}
                >
                  <Monogram
                    text={row.initials}
                    size={46 * scale}
                    background={row.kind === 'meeting' ? BRAND.orangeTint : '#E9EFF2'}
                    color={row.kind === 'meeting' ? BRAND.orangeDeep : BRAND.inkSoft}
                  />
                  <div style={{flex: 1, minWidth: 0}}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 12 * scale,
                        marginBottom: 7 * scale,
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
                        {row.who}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_FAMILY,
                          fontSize: 18 * scale,
                          color: BRAND.muted,
                        }}
                      >
                        {row.meta}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontSize: 23 * scale,
                        lineHeight: 1.6,
                        color: BRAND.inkSoft,
                      }}
                    >
                      {row.line}
                    </div>
                  </div>
                </div>
              ))}

              <ScanBeam scale={scale} progress={scan} />
            </div>
          </Card>

          <div style={{position: 'relative', width: '100%'}}>
            <DetectChip
              label="3 opportunities detected"
              scale={scale}
              frame={frame}
              fps={fps}
              delay={DETECT_AT}
              style={{right: 0, top: -30 * scale}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
