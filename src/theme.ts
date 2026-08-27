/**
 * Deliberately plain design tokens - a neutral starting point, not a style.
 * Change these (or delete this file and hard-code your own values)
 * as soon as you know what you want the graphics to look like.
 */

export const COLORS = {
  background: '#101114',
  surface: '#1B1D22',
  text: '#F4F5F7',
  textMuted: '#A0A4AD',
  accent: '#5B8DEF',
} as const;

/**
 * Sizes are authored against a 1080p canvas and scaled at runtime
 * by useScale(), so they stay proportional at 720p or 4K.
 */
export const TYPE = {
  title: 96,
  subtitle: 36,
  name: 52,
  role: 26,
  kinetic: 104,
  badge: 30,
} as const;

/** A single weight-agnostic stack; swap for your own font in src/fonts.ts. */
export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  bold: 700,
} as const;
