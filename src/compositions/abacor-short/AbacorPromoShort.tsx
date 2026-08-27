import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {BRAND, BRAND_URL} from '../../brand';
import {seconds} from '../../video';
import {CTA} from './scenes/CTA';
import {Hook} from './scenes/Hook';
import {Pipeline} from './scenes/Pipeline';
import {Sweep} from './scenes/Sweep';

/**
 * ABACOR PROMO - SHORT CUT
 * ------------------------
 * The same product story as AbacorPromo, re-cut for paid social where the
 * first two seconds decide whether the rest gets watched.
 *
 * What changed, and why:
 *   - Opens on the problem (a counter hook) instead of typing its own title,
 *     so the viewer learns something before deciding to scroll.
 *   - The email and meeting scans are one card under one beam rather than two
 *     scenes, which is the same point in half the time.
 *   - The pipeline total is the hero at full size instead of a table header.
 *   - Four beats instead of six, on a tighter overlap.
 *
 * This folder is self-contained: nothing here is imported by the long promo,
 * and nothing here edits it. The two share only src/brand.ts, src/components
 * and src/lib, so a brand correction still lands in both.
 */

export const abacorPromoShortSchema = z.object({
  /** Closing headline. Editable live in the Studio sidebar. */
  headline: z.string(),
  /** Lead-in before the domain on the final scene. */
  endCardLead: z.string(),
  /** Destination, set in the accent colour. */
  endCardUrl: z.string(),
});

export type AbacorPromoShortProps = z.infer<typeof abacorPromoShortSchema>;

export const abacorPromoShortDefaultProps: AbacorPromoShortProps = {
  headline: 'Stop missing them.',
  endCardLead: 'Try it today at',
  endCardUrl: BRAND_URL,
};

/** Scene running order and lengths, in seconds. */
const SCENES = [
  {
    id: 'hook',
    seconds: 2.3,
    render: (durationInFrames: number) => <Hook durationInFrames={durationInFrames} />,
  },
  {
    id: 'sweep',
    seconds: 2.9,
    render: (durationInFrames: number) => <Sweep durationInFrames={durationInFrames} />,
  },
  {
    id: 'pipeline',
    seconds: 2.6,
    render: (durationInFrames: number) => (
      <Pipeline durationInFrames={durationInFrames} />
    ),
  },
  {
    id: 'cta',
    seconds: 1.8,
    render: (durationInFrames: number, props: AbacorPromoShortProps) => (
      <CTA
        durationInFrames={durationInFrames}
        headline={props.headline}
        lead={props.endCardLead}
        url={props.endCardUrl}
      />
    ),
  },
];

/**
 * Frames by which each scene overlaps the one before it.
 *
 * Tighter than the long promo's 12 - a short cut wants the cross-dissolves to
 * feel like cuts. Keep it <= the 12-frame fade in <Scene />.
 */
const OVERLAP = 8;

/** Start frame of scene `index`, accounting for the overlap. */
const sceneStart = (index: number): number =>
  SCENES.slice(0, index).reduce((total, s) => total + seconds(s.seconds), 0) -
  index * OVERLAP;

/** Total composition length in frames - used by Root.tsx. */
export const promoShortDuration = (): number =>
  sceneStart(SCENES.length - 1) + seconds(SCENES[SCENES.length - 1]!.seconds);

export const AbacorPromoShort: React.FC<AbacorPromoShortProps> = (props) => {
  return (
    <AbsoluteFill style={{background: BRAND.page}}>
      {/* Same warm wash as the long cut, so the two read as one campaign. */}
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
