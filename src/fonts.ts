import {loadFont} from '@remotion/google-fonts/Inter';

/**
 * GOOGLE FONT LOADING
 * -------------------
 * @remotion/google-fonts downloads the font and registers an @font-face for
 * you. Because this runs at module scope it is loaded before the first frame
 * renders, so text never flashes in an fallback face mid-render.
 *
 * To use a different family, change BOTH the import path and nothing else:
 *   import {loadFont} from '@remotion/google-fonts/Roboto';
 *   import {loadFont} from '@remotion/google-fonts/DMSans';
 * The subpath is the font name with spaces removed.
 *
 * Only request the weights and subsets you actually use - every extra one is
 * another file to download on every render.
 *
 * Prefer a local font? Drop the .woff2 into public/fonts/ and use
 * @remotion/fonts' loadFont({family, url: staticFile('fonts/My.woff2')}).
 */
const inter = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
});

/** Pass this to a `fontFamily` style prop. */
export const FONT_FAMILY = inter.fontFamily;

/**
 * Resolves once the font files are actually parsed. Await it inside a
 * `delayRender()` block if you ever measure text width before drawing.
 */
export const waitUntilFontsLoaded = inter.waitUntilDone;
