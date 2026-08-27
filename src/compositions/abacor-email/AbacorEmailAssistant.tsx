import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {BRAND, BRAND_URL} from '../../brand';
import {seconds} from '../../video';
import {Context} from './scenes/Context';
import {CTA} from './scenes/CTA';
import {Draft} from './scenes/Draft';
import {Inbox} from './scenes/Inbox';

/**
 * ABACOR EMAIL ASSISTANT
 * ----------------------
 * A different product story from AbacorPromo: that one is about spotting
 * opportunities you missed, this one is about writing the reply for you.
 *
 * The argument runs in four beats, and beat 2 is the one that matters - any
 * tool can produce a reply, so the piece spends a third of its length showing
 * where the content of that reply comes from:
 *
 *   1. Inbox    - a client asks something only prior context can answer, and
 *                 the assistant starts on its own from inside the mail client.
 *   2. Context  - previous threads and meeting notes are read on screen, with
 *                 a running count of the facts pulled from them.
 *   3. Draft    - the reply writes itself, and every phrase that came from
 *                 history is tinted and tagged with the source it came from.
 *   4. CTA      - the close.
 *
 * Self-contained, like abacor-short/: nothing outside this folder imports it
 * and it edits nothing outside itself. It shares only src/brand.ts,
 * src/components and src/lib, so a brand correction still lands here too.
 */

export const abacorEmailSchema = z.object({
  /** Closing headline. Editable live in the Studio sidebar. */
  headline: z.string(),
  /** Lead-in before the domain on the final scene. */
  endCardLead: z.string(),
  /** Destination, set in the accent colour. */
  endCardUrl: z.string(),
});

export type AbacorEmailProps = z.infer<typeof abacorEmailSchema>;

export const abacorEmailDefaultProps: AbacorEmailProps = {
  headline: 'Your inbox, already answered.',
  endCardLead: 'Try it today at',
  endCardUrl: BRAND_URL,
};

/** Scene running order and lengths, in seconds. */
const SCENES = [
  {
    id: 'inbox',
    seconds: 3.0,
    render: (durationInFrames: number) => <Inbox durationInFrames={durationInFrames} />,
  },
  {
    id: 'context',
    seconds: 3.6,
    render: (durationInFrames: number) => <Context durationInFrames={durationInFrames} />,
  },
  {
    id: 'draft',
    seconds: 4.6,
    render: (durationInFrames: number) => <Draft durationInFrames={durationInFrames} />,
  },
  {
    id: 'cta',
    seconds: 2.2,
    render: (durationInFrames: number, props: AbacorEmailProps) => (
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
 * Keep it <= the 12-frame fade in <Scene />.
 */
const OVERLAP = 10;

/** Start frame of scene `index`, accounting for the overlap. */
const sceneStart = (index: number): number =>
  SCENES.slice(0, index).reduce((total, s) => total + seconds(s.seconds), 0) -
  index * OVERLAP;

/** Total composition length in frames - used by Root.tsx. */
export const emailAssistantDuration = (): number =>
  sceneStart(SCENES.length - 1) + seconds(SCENES[SCENES.length - 1]!.seconds);

export const AbacorEmailAssistant: React.FC<AbacorEmailProps> = (props) => {
  return (
    <AbsoluteFill style={{background: BRAND.page}}>
      {/* Same warm wash as the other cuts, so all three read as one campaign. */}
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
