import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand';
import {Card, ScanBeam, Scene, Sfx, SparkIcon} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * BEAT 3 - the laser writes the reply.
 *
 * A beam crosses the compose box top to bottom and the draft exists in its
 * wake: everything above the beam is written, everything below is still
 * blank. It is the same beam that read the sources in beat 2, which is the
 * argument of the whole piece in one visual - what was scanned out of the
 * client's history is scanned back into the reply.
 *
 * The reveal is a clip on the paragraph, not a per-word opacity. The text is
 * laid out in full from frame 0 and simply uncovered, so the beam's edge and
 * the text's edge are the same line by construction and can never drift. It
 * also means the wrap is fixed - appending words instead would re-wrap the
 * paragraph on every frame, which reads as a twitch rather than as writing.
 *
 * Three phrases could not have been written from the incoming email alone, so
 * each is tinted and carries the source it came from. That pairing is the
 * proof: without the tags this is just autocomplete.
 */

type Part = {text: string; source?: string};

const PARTS: Part[] = [
  {text: 'Hi Tomás — good to speak on Friday. Confirming what we agreed:'},
  {text: 'the second clinic opens in October', source: 'Thread · Mar 2'},
  {text: 'under a new LLC, and we’ll reclassify'},
  {text: 'the 5 contractor therapists', source: 'Meeting · Mar 4'},
  {text: 'before you open. I’ve attached'},
  {text: 'the 401(k) proposal from the PEO', source: 'Thread · Mar 11'},
  {text: 'so you can review it this week.'},
];

const SCAN_FROM = 8;
const SCAN_TO = 86;
const SEND_AT = SCAN_TO + 8;

/**
 * Where each highlighted phrase sits down the compose box, as a fraction of
 * it, so its sound fires as the beam crosses it. Derived from the body's own
 * padding and line height: four lines, with the tinted phrases opening lines
 * two, three and four.
 */
const HIGHLIGHT_AT = [0.405, 0.593, 0.781];

export const Draft: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 1, damping: 200, stiffness: 90});
  const footerIn = springEnter({
    frame,
    fps,
    delay: SEND_AT,
    damping: 16,
    stiffness: 140,
  });

  /** 0 -> 1 as the beam crosses the compose box. Drives the beam AND the clip. */
  const reveal = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <Scene durationInFrames={durationInFrames}>
      <Sfx
        src={SFX.scan}
        at={SCAN_FROM}
        durationInFrames={SCAN_TO - SCAN_FROM + 8}
        volume={SFX_VOLUME.scan}
        name="Draft sweep"
      />
      {HIGHLIGHT_AT.map((position, i) => (
        <Sfx
          key={`ping-${i}`}
          src={SFX.ping}
          at={SCAN_FROM + position * (SCAN_TO - SCAN_FROM)}
          durationInFrames={12}
          volume={SFX_VOLUME.ping}
          name={`Enriched phrase ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={SEND_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect}
        name="Draft ready"
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Card scale={scale} width={1240} progress={cardIn} padding={0}>
          {/* Compose header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${22 * scale}px ${36 * scale}px`,
              borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 600,
                fontSize: 24 * scale,
                color: BRAND.navy,
              }}
            >
              Reply to Tomás R.
            </span>
            <div style={{display: 'flex', alignItems: 'center', gap: 10 * scale}}>
              <SparkIcon size={19 * scale} color={BRAND.orange} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 18 * scale,
                  letterSpacing: 1.4 * scale,
                  textTransform: 'uppercase',
                  color: BRAND.orangeDeep,
                }}
              >
                Drafted by Abacor
              </span>
            </div>
          </div>

          {/* The compose box. The beam and the clip share this box, so the
              written edge and the beam are the same line. */}
          <div style={{position: 'relative'}}>
            <div
              style={{
                padding: `${38 * scale}px ${36 * scale}px`,
                fontFamily: FONT_FAMILY,
                fontSize: 28 * scale,
                lineHeight: 2.05,
                color: BRAND.inkSoft,
                // Everything below the beam has not been written yet.
                clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`,
              }}
            >
              {PARTS.map((part, partIndex) => {
                if (!part.source) {
                  return <React.Fragment key={partIndex}>{part.text} </React.Fragment>;
                }

                return (
                  <React.Fragment key={partIndex}>
                    <span
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        padding: `${2 * scale}px ${7 * scale}px`,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: BRAND.orangeTint,
                          border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
                          borderRadius: 8 * scale,
                        }}
                      />
                      <span
                        style={{
                          position: 'relative',
                          fontWeight: 600,
                          color: BRAND.ink,
                        }}
                      >
                        {part.text}
                      </span>
                    </span>
                    {/* The receipt for that phrase. */}
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: 8 * scale,
                        padding: `${3 * scale}px ${11 * scale}px`,
                        borderRadius: 999,
                        background: BRAND.card,
                        border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
                        fontFamily: FONT_FAMILY,
                        fontWeight: 600,
                        fontSize: 16 * scale,
                        lineHeight: 1.4,
                        color: BRAND.orangeDeep,
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                      }}
                    >
                      {part.source}
                    </span>{' '}
                  </React.Fragment>
                );
              })}
            </div>

            <ScanBeam scale={scale} progress={reveal} />
          </div>

          {/* Ready to send */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${22 * scale}px ${36 * scale}px`,
              borderTop: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
              opacity: footerIn,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 21 * scale,
                color: BRAND.muted,
              }}
            >
              Drafted from 3 threads and 2 meeting notes
            </span>
            <div
              style={{
                padding: `${14 * scale}px ${34 * scale}px`,
                borderRadius: 999,
                background: BRAND.orange,
                boxShadow: `0 ${12 * scale}px ${28 * scale}px rgba(250, 100, 0, 0.32)`,
                fontFamily: FONT_FAMILY,
                fontWeight: 600,
                fontSize: 22 * scale,
                color: '#FFFFFF',
                transform: `scale(${interpolate(footerIn, [0, 1], [0.85, 1])})`,
              }}
            >
              Send
            </div>
          </div>
        </Card>
      </AbsoluteFill>
    </Scene>
  );
};
