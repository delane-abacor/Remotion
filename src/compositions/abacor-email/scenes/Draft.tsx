import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand';
import {Card, Scene, Sfx, SparkIcon} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * BEAT 3 - the enriched draft writes itself.
 *
 * Three phrases in the reply could not have been written from the incoming
 * email alone, so each one is tinted and carries the source it came from.
 * That pairing is the proof: without the tags this is just autocomplete, and
 * with them the viewer can see the draft is assembled from their own history.
 *
 * The whole paragraph is laid out from frame 0 and revealed word by word
 * through opacity. Appending words instead would re-wrap the paragraph on
 * every reveal, which reads as a twitch rather than as writing.
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

/**
 * Give every word a position in the whole paragraph, so one counter drives the
 * reveal and each highlight knows when its last word has landed.
 */
const build = () => {
  let index = 0;

  return PARTS.map((part) => {
    const words = part.text.split(' ').map((word) => ({word, index: index++}));

    return {
      source: part.source,
      words,
      lastIndex: index - 1,
    };
  });
};

const PARAGRAPH = build();
const WORD_COUNT = PARAGRAPH.reduce((n, part) => n + part.words.length, 0);

const DRAFT_FROM = 6;
/** Lower = faster writing. */
const FRAMES_PER_WORD = 1.6;
/** A word fades in over this many frames rather than snapping on. */
const WORD_FADE = 3;

const wordLands = (index: number): number => DRAFT_FROM + index * FRAMES_PER_WORD;

const DRAFT_DONE = wordLands(WORD_COUNT - 1) + WORD_FADE;
const SEND_AT = Math.round(DRAFT_DONE + 8);

/** A keystroke run under the writing, every few words rather than per word. */
const KEY_EVERY = 4;

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

  const wordOpacity = (index: number): number =>
    interpolate(frame, [wordLands(index), wordLands(index) + WORD_FADE], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });

  /** A highlight fills once its final word has landed. */
  const fillFor = (lastIndex: number): number =>
    interpolate(frame, [wordLands(lastIndex), wordLands(lastIndex) + 7], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });

  const keyFrames = Array.from({length: Math.floor(WORD_COUNT / KEY_EVERY)}, (_, i) =>
    wordLands(i * KEY_EVERY),
  );

  return (
    <Scene durationInFrames={durationInFrames}>
      {keyFrames.map((at, i) => (
        <Sfx
          key={`key-${i}`}
          src={SFX.key}
          at={at}
          durationInFrames={4}
          name={`Key ${i + 1}`}
          volume={SFX_VOLUME.key * 0.5 * (0.85 + ((i * 37) % 7) / 24)}
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

          {/* The draft */}
          <div
            style={{
              padding: `${38 * scale}px ${36 * scale}px`,
              fontFamily: FONT_FAMILY,
              fontSize: 28 * scale,
              lineHeight: 2.05,
              color: BRAND.inkSoft,
            }}
          >
            {PARAGRAPH.map((part, partIndex) => {
              const words = part.words.map((w, i) => (
                <span key={w.index} style={{opacity: wordOpacity(w.index)}}>
                  {w.word}
                  {i < part.words.length - 1 ? ' ' : ''}
                </span>
              ));

              if (!part.source) {
                return <React.Fragment key={partIndex}>{words} </React.Fragment>;
              }

              const fill = fillFor(part.lastIndex);

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
                        transformOrigin: 'left center',
                        transform: `scaleX(${fill})`,
                      }}
                    />
                    <span
                      style={{
                        position: 'relative',
                        fontWeight: fill > 0.5 ? 600 : 400,
                        color: fill > 0.5 ? BRAND.ink : 'inherit',
                      }}
                    >
                      {words}
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
                      opacity: fill,
                      verticalAlign: 'middle',
                    }}
                  >
                    {part.source}
                  </span>{' '}
                </React.Fragment>
              );
            })}
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
