/**
 * ABACOR BRAND TOKENS
 * -------------------
 * Everything brand-specific for the promo video lives here. Correct a colour
 * once and every scene follows.
 *
 * Colours were sampled by eye from the supplied logo and product screenshot -
 * if you have exact brand hex values, replace them here first.
 */
export const BRAND = {
  /** Primary orange from the logo mark. */
  orange: '#FA6400',
  orangeDeep: '#E25700',
  /** Tinted panel background, as used behind the product's "Recap" block. */
  orangeTint: '#FDF1EA',
  orangeTintEdge: '#F2C4A4',

  /** Dark ink from the logo wordmark. */
  navy: '#0B2029',
  ink: '#122C37',
  inkSoft: '#3A5462',
  muted: '#6B808B',

  /** Surfaces. */
  page: '#DCE6EB',
  card: '#FFFFFF',
  line: '#CBD8DF',
  lineSoft: '#E4EBEF',

  /** Semantic. */
  green: '#0E9F6E',
  greenTint: '#E7F6F0',
  amber: '#F5A524',
} as const;

export const BRAND_URL = 'abacor.com';

/** Font families registered in src/fonts.ts. */
export const FONTS = {
  display: 'Poppins',
  ui: 'Inter',
} as const;
