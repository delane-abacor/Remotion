import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * FONT LOADING
 * ------------
 * The promo self-hosts its fonts from public/fonts/ so renders are
 * deterministic and work with no network access (CI, offline, locked-down
 * machines). The .woff2 files are the latin subsets of Inter and Poppins.
 *
 * PREFER GOOGLE FONTS INSTEAD? @remotion/google-fonts fetches at render time
 * and needs no local files:
 *
 *   import {loadFont} from '@remotion/google-fonts/Inter';
 *   const inter = loadFont('normal', {weights: ['400', '700'], subsets: ['latin']});
 *   export const FONT_FAMILY = inter.fontFamily;
 *
 * To self-host a different family, drop its .woff2 into public/fonts/ and add
 * a line below. Weight must match the file, or the browser will synthesise a
 * fake bold and the text will look slightly wrong.
 */

const face = (family: string, file: string, weight: string) =>
  loadFont({
    family,
    url: staticFile(`fonts/${file}`),
    weight,
    style: 'normal',
    format: 'woff2',
  });

/** Kick off every load at module scope, before the first frame is drawn. */
const loading: Promise<unknown>[] = [
  face('Inter', 'Inter-400.woff2', '400'),
  face('Inter', 'Inter-500.woff2', '500'),
  face('Inter', 'Inter-600.woff2', '600'),
  face('Inter', 'Inter-700.woff2', '700'),
  face('Poppins', 'Poppins-500.woff2', '500'),
  face('Poppins', 'Poppins-600.woff2', '600'),
  face('Poppins', 'Poppins-700.woff2', '700'),
];

/** Body / UI face. */
export const FONT_FAMILY = 'Inter, system-ui, sans-serif';

/** Display face for headlines and the wordmark. */
export const DISPLAY_FAMILY = 'Poppins, Inter, system-ui, sans-serif';

/** Await if you ever need to measure text before drawing it. */
export const waitUntilFontsLoaded = () => Promise.all(loading);
