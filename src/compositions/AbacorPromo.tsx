import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {BRAND} from '../brand';
import {AbacorLogo} from '../components/AbacorLogo';
import {EmailScan} from './abacor/EmailScan';
import {EndCard} from './abacor/EndCard';
import {MeetingScan} from './abacor/MeetingScan';
import {Opportunities} from './abacor/Opportunities';
import {RevenueGrowth} from './abacor/RevenueGrowth';
import {useScale} from '../lib/layout';
import {seconds} from '../video';

/**
 * ABACOR PROMO
 * ------------
 * Scan an email thread -> scan a meeting note -> populate the opportunity
 * pipeline -> show revenue growth -> end on the logo and URL.
 *
 * Scene lengths are declared once in SCENES below. Change a duration here and
 * everything after it shifts automatically; the composition's total length is
 * derived from the same list in Root.tsx via promoDuration().
 *
 * No people appear anywhere - the story is told entirely through the product
 * surface.
 */

export const abacorPromoSchema = z.object({
  /** Small persistent logo in the corner during the body scenes. */
  showCornerLogo: z.boolean(),
});

export type AbacorPromoProps = z.infer<typeof abacorPromoSchema>;

export const abacorPromoDefaultProps: AbacorPromoProps = {
  showCornerLogo: true,
};

/** Scene running order and lengths, in seconds. */
export const SCENES = [
  {id: 'email', seconds: 4.5, component: EmailScan},
  {id: 'meeting', seconds: 4.5, component: MeetingScan},
  {id: 'opportunities', seconds: 4.5, component: Opportunities},
  {id: 'revenue', seconds: 4.2, component: RevenueGrowth},
  {id: 'end', seconds: 3.9, component: EndCard},
] as const;

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

/** Frame at which the final scene begins - the corner logo hides from here. */
const endCardStart = (): number => sceneStart(SCENES.length - 1);

export const AbacorPromo: React.FC<AbacorPromoProps> = ({showCornerLogo}) => {
  const scale = useScale();

  return (
    <AbsoluteFill style={{background: BRAND.page}}>
      {/* Very soft warm wash so the flat background is not dead white. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${BRAND.orange}0D 0%, rgba(255,255,255,0) 60%)`,
        }}
      />

      {SCENES.map((scene, index) => {
        const durationInFrames = seconds(scene.seconds);
        const SceneComponent = scene.component;

        return (
          <Sequence
            key={scene.id}
            from={sceneStart(index)}
            durationInFrames={durationInFrames}
            name={scene.id}
          >
            <SceneComponent durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}

      {/* Persistent corner mark, dropped for the end card so it does not double up. */}
      {showCornerLogo ? (
        <Sequence durationInFrames={endCardStart()} name="Corner logo">
          <AbsoluteFill
            style={{
              padding: 54 * scale,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <AbacorLogo size={38 * scale} />
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
