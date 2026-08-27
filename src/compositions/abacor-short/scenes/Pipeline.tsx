import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand';
import {Scene, Sfx, SparkIcon} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * SHORT CUT, BEAT 3 - the money.
 *
 * The long promo lists the pipeline as a table and keeps the total in the
 * header, which rewards reading. This cut inverts it: the total is the hero
 * at full size, and the three opportunities land underneath as cards to show
 * where the number came from. One glance, one number.
 */

const OPPORTUNITIES = [
  {title: 'Entity structuring', source: 'Second clinic', value: 12000},
  {title: 'Worker classification', source: '1099 review', value: 8500},
  {title: 'Buy vs. lease', source: '$1.4M building', value: 15000},
] as const;

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/** Cards land fast and close together - this beat is a drumroll, not a list. */
const FIRST_CARD = 4;
const CARD_STAGGER = 5;
const COUNT_FRAMES = 16;

export const Pipeline: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const labelIn = springEnter({frame, fps, damping: 200, stiffness: 100});

  // The total is the sum of whatever has landed, so the number and the cards
  // can never disagree on screen.
  const landed = OPPORTUNITIES.reduce((sum, o, i) => {
    const t = interpolate(
      frame,
      [FIRST_CARD + i * CARD_STAGGER, FIRST_CARD + i * CARD_STAGGER + COUNT_FRAMES],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    );

    return sum + o.value * t;
  }, 0);

  const TOTAL_AT = FIRST_CARD + OPPORTUNITIES.length * CARD_STAGGER + COUNT_FRAMES - 6;

  return (
    <Scene durationInFrames={durationInFrames}>
      {OPPORTUNITIES.map((o, i) => (
        <Sfx
          key={`tick-${o.title}`}
          src={SFX.tick}
          at={FIRST_CARD + i * CARD_STAGGER}
          durationInFrames={6}
          volume={SFX_VOLUME.tick}
          name={`Card ${i + 1}`}
        />
      ))}
      <Sfx
        src={SFX.detect}
        at={TOTAL_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect * 0.85}
        name="Total"
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* The hero number. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12 * scale,
            marginBottom: 10 * scale,
            opacity: labelIn,
          }}
        >
          <SparkIcon size={22 * scale} color={BRAND.orange} />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 19 * scale,
              letterSpacing: 2.4 * scale,
              textTransform: 'uppercase',
              color: BRAND.inkSoft,
            }}
          >
            Added to your pipeline
          </span>
        </div>

        <div
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontWeight: 700,
            fontSize: 132 * scale,
            lineHeight: 1.05,
            color: BRAND.orange,
            fontVariantNumeric: 'tabular-nums',
            opacity: labelIn,
          }}
        >
          {money(landed)}
        </div>

        {/* Where the number came from. */}
        <div style={{display: 'flex', gap: 22 * scale, marginTop: 46 * scale}}>
          {OPPORTUNITIES.map((o, i) => {
            const cardIn = springEnter({
              frame,
              fps,
              delay: FIRST_CARD + i * CARD_STAGGER,
              damping: 16,
              stiffness: 130,
            });

            return (
              <div
                key={o.title}
                style={{
                  width: 340 * scale,
                  background: BRAND.card,
                  border: `${1.5 * scale}px solid ${BRAND.line}`,
                  borderRadius: 18 * scale,
                  padding: `${26 * scale}px ${28 * scale}px`,
                  boxShadow: `0 ${2 * scale}px ${4 * scale}px rgba(11, 32, 41, 0.06), 0 ${
                    22 * scale
                  }px ${48 * scale}px rgba(11, 32, 41, 0.16)`,
                  opacity: cardIn,
                  transform: `translateY(${(1 - cardIn) * 30 * scale}px) scale(${interpolate(
                    cardIn,
                    [0, 1],
                    [0.96, 1],
                  )})`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 24 * scale,
                    color: BRAND.ink,
                    marginBottom: 6 * scale,
                  }}
                >
                  {o.title}
                </div>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 18 * scale,
                    color: BRAND.muted,
                    marginBottom: 16 * scale,
                  }}
                >
                  {o.source}
                </div>
                <div
                  style={{
                    fontFamily: DISPLAY_FAMILY,
                    fontWeight: 700,
                    fontSize: 34 * scale,
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
      </AbsoluteFill>
    </Scene>
  );
};
