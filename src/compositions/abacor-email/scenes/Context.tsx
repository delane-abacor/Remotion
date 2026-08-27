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
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * BEAT 2 - where the enrichment comes from.
 *
 * This is the scene the whole piece exists for. Anything can generate a reply;
 * the claim here is that the reply is built from history the client already
 * has, so both sources are named on screen and each one is shown being read.
 *
 * Both source types sit in ONE column under ONE beam rather than in two
 * panels lit on a timer. A row now lights because the beam has physically
 * reached it, which is what makes the scan read as reading rather than as a
 * sequence of things switching on.
 *
 * The running fact count makes the abstract claim countable - "assembled from
 * 9 facts" is checkable in a way that "AI-powered" is not.
 */

type Source = {label: string; date: string; facts: number};

type Block =
  | {kind: 'header'; label: string}
  | {kind: 'row'; source: Source; last: boolean};

/**
 * Read order, top to bottom. The beam crosses these in the order written, so
 * this list is both the layout and the reading order.
 */
const BLOCKS: Block[] = [
  {kind: 'header', label: 'Previous emails'},
  {
    kind: 'row',
    source: {label: 'Re: Second clinic lease', date: 'Mar 2', facts: 2},
    last: false,
  },
  {
    kind: 'row',
    source: {label: 'Payroll: 1099 vs W-2', date: 'Mar 6', facts: 3},
    last: false,
  },
  {
    kind: 'row',
    source: {label: '401(k) proposal from PEO', date: 'Mar 11', facts: 1},
    last: true,
  },
  {kind: 'header', label: 'Meeting notes'},
  {
    kind: 'row',
    source: {label: 'Quarterly review', date: 'Mar 4', facts: 2},
    last: false,
  },
  {
    kind: 'row',
    source: {label: 'Lease walkthrough', date: 'Mar 9', facts: 1},
    last: true,
  },
];

/**
 * Rendered heights in design pixels, used to work out where down the column
 * each row sits. The beam's position is a fraction of the whole stack, so a
 * row has to know its own fraction to light at the moment the beam arrives.
 * Keep these in step with the padding and font sizes below.
 */
const ROW_H = 87;
const HEADER_H = 63;

const blockHeight = (block: Block): number =>
  block.kind === 'header' ? HEADER_H : ROW_H;

const STACK_H = BLOCKS.reduce((total, block) => total + blockHeight(block), 0);

/** Centre of each block as a 0 -> 1 fraction of the stack. */
const CENTRES: number[] = (() => {
  let y = 0;

  return BLOCKS.map((block) => {
    const centre = (y + blockHeight(block) / 2) / STACK_H;
    y += blockHeight(block);

    return centre;
  });
})();

const SCAN_FROM = 10;
const SCAN_TO = 72;
/** How far past a row's centre the beam travels before the row is fully lit. */
const LIGHT_SPAN = 0.06;
const SUMMARY_AT = SCAN_TO + 6;

const scanToFrame = (position: number): number =>
  SCAN_FROM + position * (SCAN_TO - SCAN_FROM);

const SourceRow: React.FC<{
  source: Source;
  lit: number;
  scale: number;
  last: boolean;
}> = ({source, lit, scale, last}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14 * scale,
      padding: `${19 * scale}px ${26 * scale}px`,
      borderBottom: last ? 'none' : `${1.5 * scale}px solid ${BRAND.lineSoft}`,
      // The row tints as the beam reaches it, rather than appearing when read -
      // the sources were always there, which is the point.
      background: `rgba(253, 241, 234, ${lit})`,
    }}
  >
    <div
      style={{
        width: 9 * scale,
        height: 9 * scale,
        borderRadius: 999,
        flexShrink: 0,
        background: lit > 0.5 ? BRAND.orange : BRAND.line,
      }}
    />
    <div style={{flex: 1, minWidth: 0}}>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 21 * scale,
          lineHeight: 1.2,
          color: lit > 0.5 ? BRAND.ink : BRAND.inkSoft,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {source.label}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 17 * scale,
          lineHeight: 1.2,
          color: BRAND.muted,
          marginTop: 3 * scale,
        }}
      >
        {source.date}
      </div>
    </div>
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 18 * scale,
        color: BRAND.orangeDeep,
        opacity: lit,
        whiteSpace: 'nowrap',
      }}
    >
      +{source.facts}
    </div>
  </div>
);

export const Context: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 1, damping: 200, stiffness: 90});
  const summaryIn = springEnter({
    frame,
    fps,
    delay: SUMMARY_AT,
    damping: 16,
    stiffness: 140,
  });

  const scan = interpolate(frame, [SCAN_FROM, SCAN_TO], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  /** A row is lit once the beam has passed its centre. */
  const litAt = (index: number): number =>
    interpolate(scan, [CENTRES[index]!, CENTRES[index]! + LIGHT_SPAN], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });

  // The count is the sum of what has actually lit, so the number on screen can
  // never claim more than the rows above it show.
  const facts = BLOCKS.reduce(
    (total, block, i) =>
      block.kind === 'row' ? total + block.source.facts * litAt(i) : total,
    0,
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
      {BLOCKS.map((block, i) =>
        block.kind === 'row' ? (
          <Sfx
            key={`ping-${block.source.label}`}
            src={SFX.ping}
            at={scanToFrame(CENTRES[i]!)}
            durationInFrames={12}
            volume={SFX_VOLUME.ping}
            name={`Source ${block.source.label}`}
          />
        ) : null,
      )}
      <Sfx
        src={SFX.detect}
        at={SUMMARY_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect * 0.85}
        name="Context assembled"
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Card scale={scale} width={860} progress={cardIn} padding={0}>
          {/* One stack, one beam. The beam's y is a fraction of this box, which
              is why the rows derive their own fractions from the same heights. */}
          <div style={{position: 'relative'}}>
            {BLOCKS.map((block, i) =>
              block.kind === 'header' ? (
                <div
                  key={block.label}
                  style={{
                    padding: `${20 * scale}px ${26 * scale}px`,
                    borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 18 * scale,
                    lineHeight: 1.2,
                    letterSpacing: 2 * scale,
                    textTransform: 'uppercase',
                    color: BRAND.inkSoft,
                  }}
                >
                  {block.label}
                </div>
              ) : (
                <SourceRow
                  key={block.source.label}
                  source={block.source}
                  lit={litAt(i)}
                  scale={scale}
                  last={block.last}
                />
              ),
            )}

            <ScanBeam scale={scale} progress={scan} />
          </div>
        </Card>

        {/* What the stack adds up to. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14 * scale,
            marginTop: 38 * scale,
            padding: `${18 * scale}px ${32 * scale}px`,
            background: BRAND.card,
            border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
            borderRadius: 999,
            boxShadow: `0 ${16 * scale}px ${38 * scale}px rgba(11, 32, 41, 0.14)`,
            opacity: summaryIn,
            transform: `translateY(${(1 - summaryIn) * 18 * scale}px)`,
          }}
        >
          <SparkIcon size={22 * scale} color={BRAND.orange} />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 24 * scale,
              color: BRAND.ink,
            }}
          >
            Context assembled from
          </span>
          <span
            style={{
              fontFamily: DISPLAY_FAMILY,
              fontWeight: 700,
              fontSize: 30 * scale,
              color: BRAND.orange,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.round(facts)}
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 24 * scale,
              color: BRAND.ink,
            }}
          >
            facts
          </span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
