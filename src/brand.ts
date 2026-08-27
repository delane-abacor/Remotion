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
  orangeTintEdge: '#F7D9C4',

  /** Dark ink from the logo wordmark. */
  navy: '#0F2A33',
  ink: '#16333F',
  inkSoft: '#4A6470',
  muted: '#8296A0',

  /** Surfaces. */
  page: '#F4F7F8',
  card: '#FFFFFF',
  line: '#E3EAED',
  lineSoft: '#EFF3F5',

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
