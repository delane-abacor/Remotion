import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * FONTS
 * -----
 * The design system specifies Sohne and nothing else, in two weights:
 * Buch (400) and Kraftig (500).
 *
 * SOHNE IS NOT IN THIS REPO. It is a licensed face from Klim Type Foundry and
 * cannot be fetched. Inter is loaded as a stand-in and the family string in
 * src/design/tokens.ts lists Sohne FIRST, so the moment the real files land the
 * video picks them up with no code change:
 *
 *   1. put SohneBuch.woff2 and SohneKraftig.woff2 in public/fonts/
 *   2. uncomment the two lines below
 *
 * Inter is a neo-grotesque like Sohne, so proportions and rhythm are close,
 * but it is not the real face. Anything type-critical should be signed off
 * against Sohne, not against this render.
 */

const face = (family: string, file: string, weight: string) =>
  loadFont({
    family,
    url: staticFile(`fonts/${file}`),
    weight,
    style: 'normal',
    format: 'woff2',
  });

const loading: Promise<unknown>[] = [
  // face('Sohne', 'SohneBuch.woff2', '400'),
  // face('Sohne', 'SohneKraftig.woff2', '500'),
  face('Inter', 'Inter-400.woff2', '400'),
  face('Inter', 'Inter-500.woff2', '500'),
];

/**
 * Kept for the four neutral starter graphics in src/compositions/, which are
 * not Abacor work. Abacor scenes read FONT from src/design/tokens.ts.
 */
export const FONT_FAMILY = 'Inter, system-ui, sans-serif';

/** Await if you ever need to measure text before drawing it. */
export const waitUntilFontsLoaded = () => Promise.all(loading);
