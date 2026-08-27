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
 * The running fact count makes the abstract claim countable - "assembled from
 * 9 facts" is checkable in a way that "AI-powered" is not.
 */

type Source = {label: string; date: string; facts: number};

const EMAIL_SOURCES: Source[] = [
  {label: 'Re: Second clinic lease', date: 'Mar 2', facts: 2},
  {label: 'Payroll: 1099 vs W-2', date: 'Mar 6', facts: 3},
  {label: '401(k) proposal from PEO', date: 'Mar 11', facts: 1},
];

const MEETING_SOURCES: Source[] = [
  {label: 'Quarterly review', date: 'Mar 4', facts: 2},
  {label: 'Lease walkthrough', date: 'Mar 9', facts: 1},
];

/** Read order across both panels, so the count rises in one continuous run. */
const READ_ORDER: Source[] = [...EMAIL_SOURCES, ...MEETING_SOURCES];

const FIRST_ROW = 12;
const ROW_STAGGER = 8;
const LIGHT_FRAMES = 10;
const SUMMARY_AT = FIRST_ROW + READ_ORDER.length * ROW_STAGGER + 4;

/** 0 -> 1 as source `index` is read. */
const litAt = (frame: number, index: number): number =>
  interpolate(
    frame,
    [FIRST_ROW + index * ROW_STAGGER, FIRST_ROW + index * ROW_STAGGER + LIGHT_FRAMES],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );

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
      padding: `${19 * scale}px ${24 * scale}px`,
      borderBottom: last ? 'none' : `${1.5 * scale}px solid ${BRAND.lineSoft}`,
      // The row tints as it is read, rather than appearing when read - the
      // sources were always there, which is the point.
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

const Panel: React.FC<{
  title: string;
  sources: Source[];
  offset: number;
  frame: number;
  scale: number;
  progress: number;
}> = ({title, sources, offset, frame, scale, progress}) => (
  <Card scale={scale} width={560} progress={progress} padding={0}>
    <div
      style={{
        padding: `${20 * scale}px ${24 * scale}px`,
        borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 18 * scale,
        letterSpacing: 2 * scale,
        textTransform: 'uppercase',
        color: BRAND.inkSoft,
      }}
    >
      {title}
    </div>
    {sources.map((source, i) => (
      <SourceRow
        key={source.label}
        source={source}
        lit={litAt(frame, offset + i)}
        scale={scale}
        last={i === sources.length - 1}
      />
    ))}
  </Card>
);

export const Context: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const leftIn = springEnter({frame, fps, delay: 1, damping: 200, stiffness: 90});
  const rightIn = springEnter({frame, fps, delay: 5, damping: 200, stiffness: 90});
  const summaryIn = springEnter({
    frame,
    fps,
    delay: SUMMARY_AT,
    damping: 16,
    stiffness: 140,
  });

  // The count is the sum of what has actually lit, so the number on screen can
  // never claim more than the rows above it show.
  const facts = READ_ORDER.reduce(
    (total, source, i) => total + source.facts * litAt(frame, i),
    0,
  );

  return (
    <Scene durationInFrames={durationInFrames}>
      {READ_ORDER.map((source, i) => (
        <Sfx
          key={`tick-${source.label}`}
          src={SFX.tick}
          at={FIRST_ROW + i * ROW_STAGGER}
          durationInFrames={6}
          volume={SFX_VOLUME.tick * 0.9}
          name={`Source ${i + 1}`}
        />
      ))}
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
        <div style={{display: 'flex', gap: 28 * scale, alignItems: 'flex-start'}}>
          <Panel
            title="Previous emails"
            sources={EMAIL_SOURCES}
            offset={0}
            frame={frame}
            scale={scale}
            progress={leftIn}
          />
          <Panel
            title="Meeting notes"
            sources={MEETING_SOURCES}
            offset={EMAIL_SOURCES.length}
            frame={frame}
            scale={scale}
            progress={rightIn}
          />
        </div>

        {/* What the two panels add up to. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16 * scale,
            marginTop: 40 * scale,
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
