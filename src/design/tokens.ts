/**
 * ABACOR DESIGN TOKENS
 * --------------------
 * Transcribed from the design system's `references/tokens.css`, which was
 * measured from the production Figma files. These are the only values allowed
 * in Abacor work.
 *
 * THE ONE RULE: no value that is not here belongs in a scene. If something is
 * missing, that is a system gap to raise, not a licence to improvise. The two
 * gaps this video hits are marked GAP below.
 */

/* ---------- BRAND ---------- */
export const ORANGE = {
  base: '#FF6903',
  hover: '#EB4600',
  deep: '#B34A02',
  mid: '#FA9031',
  soft: '#FF853E',
  pale: '#FFCC99',
  wash: '#FFDFC7',
  a25: 'rgba(255,105,3,.25)',
  a16: 'rgba(255,105,3,.16)',
  a14: 'rgba(255,105,3,.14)',
  a12: 'rgba(255,105,3,.12)',
  a10: 'rgba(255,105,3,.10)',
  a07: 'rgba(255,105,3,.07)',
  a05: 'rgba(255,105,3,.05)',
} as const;

/* ---------- SEMANTIC ---------- */
export const SUCCESS = {
  base: '#00AC47',
  a30: 'rgba(0,172,71,.30)',
  a12: 'rgba(0,172,71,.12)',
  a08: 'rgba(0,172,71,.08)',
} as const;

export const DANGER = {base: '#FF2E2E', a12: 'rgba(255,46,46,.12)'} as const;
export const AVATAR_PURPLE = '#7763DD';

/**
 * INK
 * #1A1A1A at varying alpha IS the entire grey scale. There is no second grey.
 * Adding a cool or warm grey makes it read as a different product instantly.
 */
export const INK = {
  base: '#1A1A1A',
  a90: 'rgba(26,26,26,.90)',
  a75: 'rgba(26,26,26,.75)',
  a70: 'rgba(26,26,26,.70)',
  a62: 'rgba(26,26,26,.62)',
  a60: 'rgba(26,26,26,.60)',
  a55: 'rgba(26,26,26,.55)',
  a45: 'rgba(26,26,26,.45)',
  a40: 'rgba(26,26,26,.40)',
  a12: 'rgba(26,26,26,.12)',
  a10: 'rgba(26,26,26,.10)',
  a08: 'rgba(26,26,26,.08)',
  a06: 'rgba(26,26,26,.06)',
  a05: 'rgba(26,26,26,.05)',
  a04: 'rgba(26,26,26,.04)',
  a03: 'rgba(26,26,26,.03)',
} as const;

export const WHITE = {
  base: '#FFFFFF',
  a96: 'rgba(255,255,255,.96)',
  a70: 'rgba(255,255,255,.70)',
  a30: 'rgba(255,255,255,.30)',
  a20: 'rgba(255,255,255,.20)',
  a16: 'rgba(255,255,255,.16)',
  a08: 'rgba(255,255,255,.08)',
} as const;

export const HAIRLINE = 'rgba(0,0,0,.08)';

/**
 * OUTLINE WEIGHT
 * foundations.md lists ink-08 for hairlines and card borders, and ink-12 for
 * strong borders on interactive elements. This video uses ink-12 everywhere
 * structural: at 1080p through h264 an 8% line all but disappears, and the
 * layout stops reading as a set of contained objects.
 *
 * Both values are system tokens. Switching this one constant back to INK.a08
 * returns the video to the letter of the foundations doc.
 */
export const OUTLINE = 'rgba(26,26,26,.12)';

/**
 * Structural outline WIDTH, in design units.
 *
 * A 1px border scaled by 1.24 lands on roughly 1.2 device pixels at 1080p, and
 * h264 smears a sub-pixel line into the white beside it, so the card edges
 * disappear on playback even though they are correct in a still. 2 design
 * units renders near 2.5px and survives the encode.
 *
 * This is a video legibility decision about stroke weight, not a colour change:
 * the border colour is still the ink-12 token.
 */
export const OUTLINE_W = 2;
export const HAIRLINE_STRONG = 'rgba(0,0,0,.12)';
export const NEUTRAL_TRACK = '#D9D9D9';
/** Warm surface, used for decks. This video sits on it. */
export const PAPER = '#E8E6DE';

/* ---------- TYPEFACE ----------
   Sohne only, two weights. Kraftig is a MEDIUM (500); at 700 every label
   shouts. See src/fonts.ts for why Inter is currently standing in. */
export const FONT = '"Sohne", "Inter", -apple-system, sans-serif';
export const W = {buch: 400, kraftig: 500} as const;

/* ---------- TYPE RAMP ----------
   Authored in 1440x900 design units. 14 and 12 carry the product. */
export const T = {
  t28: 28,
  t26: 26,
  t24: 24,
  t20: 20,
  t19: 19,
  t18: 18,
  t16: 16,
  t15: 15,
  t14: 14,
  t13: 13,
  t12: 12,
  t11: 11,
  t10: 10,
} as const;

/**
 * GAP: the ramp tops out at 28px, which is right for dense product UI but far
 * too small for a full-frame title or end card. These two steps extend the
 * ramp for video only and are flagged to the design system owner. Every other
 * size in this project comes from T above.
 */
export const T_VIDEO = {display: 56, lead: 28} as const;

export const LH = {default: 1.35, tight: 1.2} as const;
export const LS = {label: 0.04, tag: 0.01, stat: -0.02} as const;

/* ---------- RADIUS ---------- */
export const R = {
  r4: 4,
  r6: 6,
  r8: 8,
  r10: 10,
  r12: 12,
  r16: 16,
  r30: 30,
  r40: 40,
  pill: 9999,
} as const;

/* ---------- SPACING. Multiples of 4 only. ---------- */
export const S = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
} as const;

/* ---------- ELEVATION ----------
   Two shadows carry the whole product. Do not invent intermediate ones. */
export const SHADOW = {
  control: '0 1px 2px 0 rgba(0,0,0,.12)',
  primary: '0 1px 2px 0 rgba(255,105,3,.12), 0 4px 8px 0 rgba(255,105,3,.16)',
  success: '0 0 0 2px rgba(0,172,71,.12), 0 1px 8px 1px rgba(0,172,71,.30)',
  menu: '0 8px 24px 0 rgba(0,0,0,.14)',
  modal: '0 24px 64px 0 rgba(0,0,0,.24)',
} as const;

/* ---------- METER ----------
   Three stops, not two. The washed midpoint is the most recognisable detail
   in the product; a plain two-stop fade loses it. */
export const METER = {
  orange: 'linear-gradient(90deg,#FF6903 0%,#FFCBA8 47.5%,#FF6903 70%)',
  track: 'rgba(26,26,26,.10)',
  glowOrange: '0 0 8px rgba(255,105,3,.25)',
} as const;

/* ---------- LAYOUT ---------- */
export const LAYOUT = {
  shellW: 1440,
  shellH: 900,
  shellRadius: R.r16,
  shellBg: INK.base,
  contentX: 60,
  contentY: 8,
  contentW: 1372,
  contentH: 884,
  contentRadius: R.r12,
  railW: 60,
  controlH: 36,
  rowH: 32,
} as const;
