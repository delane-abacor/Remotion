/**
 * SOUND EFFECTS
 * -------------
 * Filenames in one place so a scene never hard-codes a path. All of these are
 * generated placeholders in public/audio/ - replace the files to change the
 * sound without touching any scene.
 *
 * Every one starts at sample 0 with no leading silence, so a <Sequence from={n}>
 * fires it exactly on frame n.
 */
export const SFX = {
  /** One per typed character on the title card. */
  key: 'audio/keypress.wav',
  /** Low sweep under the scan beam. */
  scan: 'audio/scan.wav',
  /** A phrase lighting up as the beam passes it. */
  ping: 'audio/ping.wav',
  /** A pipeline row or a revenue bar landing. */
  tick: 'audio/tick.wav',
  /** Two ascending tones - an opportunity confirmed. */
  detect: 'audio/detect.wav',
} as const;

/** Default levels, so the mix is balanced in one place rather than per scene. */
export const SFX_VOLUME = {
  key: 0.7,
  scan: 0.5,
  ping: 0.42,
  tick: 0.5,
  detect: 0.6,
} as const;
