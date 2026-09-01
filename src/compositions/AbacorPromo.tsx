import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {EXPOSURE, PAPER} from '../design/tokens';
import {D} from '../design/motion';
import {BRAND_URL} from '../brand';
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
 * A typed title card, an email thread read, a meeting note read, the
 * opportunities landing in the pipeline, what they are worth, then the call to
 * action. Built to the Abacor design system: one ink, one orange per view,
 * matte inset cards, Sohne at two weights, motion with no overshoot.
 *
 * PACING
 * The system sets a 45 frame minimum hold once a beat has finished animating,
 * because dense UI needs reading time. Six beats cannot honour that inside 15
 * seconds, so there are two registered cuts:
 *
 *   tight  15.0s  every scene holds 20-39 frames, under the minimum
 *   calm   18.5s  every scene clears 45, as the system asks
 *
 * Both render from identical scenes; only the durations differ.
 */

export const abacorPromoSchema = z.object({
  /** Lead-in on the final scene. */
  endCardLead: z.string(),
  /** Destination on the final scene, in the accent colour. */
  endCardUrl: z.string(),
});

export type AbacorPromoProps = z.infer<typeof abacorPromoSchema>;

export const abacorPromoDefaultProps: AbacorPromoProps = {
  endCardLead: 'Try it today at',
  endCardUrl: BRAND_URL,
};

/** Scene lengths in seconds, in running order. */
export const PACE = {
  tight: [3.6, 3.0, 3.0, 2.7, 2.6, 2.1],
  calm: [4.0, 3.9, 3.8, 3.3, 3.2, 2.3],
} as const;

export type Pace = keyof typeof PACE;

/** Each scene renders itself, so one can take props the others do not. */
const RENDERERS = [
  (d: number) => <Intro durationInFrames={d} />,
  (d: number) => <EmailScan durationInFrames={d} />,
  (d: number) => <MeetingScan durationInFrames={d} />,
  (d: number) => <Opportunities durationInFrames={d} />,
  (d: number) => <RevenueGrowth durationInFrames={d} />,
  (d: number, p: AbacorPromoProps) => (
    <EndCard durationInFrames={d} lead={p.endCardLead} url={p.endCardUrl} />
  ),
];

const SCENE_IDS = [
  'intro',
  'email',
  'meeting',
  'opportunities',
  'revenue',
  'end',
] as const;

/**
 * Frames by which each scene overlaps the one before it. The system's scene
 * duration is 400ms, which is 12 frames at 30fps.
 *
 * Without the overlap a scene reaches opacity 0 on its own last frame while
 * the next starts at 0, leaving the page empty for the length of both fades.
 */
const OVERLAP = D.scene;

const sceneStart = (pace: Pace, index: number): number =>
  PACE[pace].slice(0, index).reduce((total, s) => total + seconds(s), 0) -
  index * OVERLAP;

/** Total length in frames. Root.tsx registers each cut with this. */
export const promoDuration = (pace: Pace): number =>
  sceneStart(pace, PACE[pace].length - 1) + seconds(PACE[pace][PACE[pace].length - 1]!);

export const makeAbacorPromo =
  (pace: Pace): React.FC<AbacorPromoProps> =>
  (props) => (
    <AbsoluteFill
      style={{
        // The warm paper surface the system reserves for decks and presentation.
        background: PAPER,
        // Exposure grade for the medium. See EXPOSURE in src/design/tokens.ts.
        filter: `brightness(${EXPOSURE})`,
        /**
         * Force GRAYSCALE text antialiasing.
         *
         * Chromium defaults to LCD subpixel antialiasing, which paints orange
         * and blue fringes along every glyph edge. That is correct on a desktop
         * panel and wrong for video: the fringes are real colour data, so 4:2:0
         * chroma subsampling smears them on encode and the type reads soft and
         * chromatic. Grayscale antialiasing removes the fringes entirely.
         */
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'geometricPrecision',
      }}
    >
      {SCENE_IDS.map((id, index) => {
        const durationInFrames = seconds(PACE[pace][index]!);

        return (
          <Sequence
            key={id}
            from={sceneStart(pace, index)}
            durationInFrames={durationInFrames}
            name={id}
          >
            {RENDERERS[index]!(durationInFrames, props)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );

export const AbacorPromo = makeAbacorPromo('tight');
export const AbacorPromoCalm = makeAbacorPromo('calm');
