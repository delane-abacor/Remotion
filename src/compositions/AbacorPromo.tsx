import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {BRAND, BRAND_URL} from '../brand';
import {EmailScan} from './abacor/EmailScan';
import {EndCard} from './abacor/EndCard';
import {Intro} from './abacor/Intro';
import {MeetingScan} from './abacor/MeetingScan';
import {Opportunities} from './abacor/Opportunities';
import {RevenueGrowth} from './abacor/RevenueGrowth';
import {seconds} from '../video';

/**
 * ABACOR PROMO
 * ------------
 * A typed title card -> scan an email thread -> scan a meeting note ->
 * populate the opportunity pipeline -> show revenue growth -> end on the URL.
 *
 * Scene lengths are declared once in SCENES below. Change a duration there and
 * everything after it shifts; the composition's total length is derived from
 * the same list, so Root.tsx never needs editing to match.
 *
 * No people and no logo appear anywhere - the story is told entirely through
 * the product surface, and it signs off on the address alone.
 */

export const abacorPromoSchema = z.object({
  /** Shown on the final scene. Editable live in the Studio sidebar. */
  endCardUrl: z.string(),
});

export type AbacorPromoProps = z.infer<typeof abacorPromoSchema>;

export const abacorPromoDefaultProps: AbacorPromoProps = {
  endCardUrl: BRAND_URL,
};

/**
 * Scene running order and lengths, in seconds. Each entry renders itself so a
 * scene can take its own props without every other scene having to accept them.
 */
const SCENES = [
  {
    id: 'intro',
    seconds: 3.2,
    render: (durationInFrames: number) => <Intro durationInFrames={durationInFrames} />,
  },
  {
    id: 'email',
    seconds: 3.0,
    render: (durationInFrames: number) => (
      <EmailScan durationInFrames={durationInFrames} />
    ),
  },
  {
    id: 'meeting',
    seconds: 3.0,
    render: (durationInFrames: number) => (
      <MeetingScan durationInFrames={durationInFrames} />
    ),
  },
  {
    id: 'opportunities',
    seconds: 2.9,
    render: (durationInFrames: number) => (
      <Opportunities durationInFrames={durationInFrames} />
    ),
  },
  {
    id: 'revenue',
    seconds: 2.7,
    render: (durationInFrames: number) => (
      <RevenueGrowth durationInFrames={durationInFrames} />
    ),
  },
  {
    id: 'end',
    seconds: 2.2,
    render: (durationInFrames: number, props: AbacorPromoProps) => (
      <EndCard durationInFrames={durationInFrames} url={props.endCardUrl} />
    ),
  },
];

/**
 * Frames by which each scene overlaps the one before it.
 *
 * Without this the scenes butt up against each other: a scene reaches opacity
 * 0 on its own last frame and the next starts at 0, so the page sits empty for
 * the length of both fades. Overlapping them turns that dead gap into a real
 * cross-dissolve. Keep it <= the 12-frame fade in <Scene />.
 */
const OVERLAP = 12;

/** Start frame of scene `index`, accounting for the overlap. */
const sceneStart = (index: number): number =>
  SCENES.slice(0, index).reduce((total, s) => total + seconds(s.seconds), 0) -
  index * OVERLAP;

/** Total composition length in frames - used by Root.tsx. */
export const promoDuration = (): number =>
  sceneStart(SCENES.length - 1) + seconds(SCENES[SCENES.length - 1]!.seconds);

export const AbacorPromo: React.FC<AbacorPromoProps> = (props) => {
  return (
    <AbsoluteFill style={{background: BRAND.page}}>
      {/* Very soft warm wash so the flat background is not dead flat. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${BRAND.orange}0D 0%, rgba(255,255,255,0) 60%)`,
        }}
      />

      {SCENES.map((scene, index) => {
        const durationInFrames = seconds(scene.seconds);

        return (
          <Sequence
            key={scene.id}
            from={sceneStart(index)}
            durationInFrames={durationInFrames}
            name={scene.id}
          >
            {scene.render(durationInFrames, props)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
