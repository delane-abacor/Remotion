import {Config} from '@remotion/cli/config';

/**
 * Project-wide render defaults.
 * Anything set here can still be overridden per-render with a CLI flag,
 * which is exactly what the transparent-export command does
 * (`--image-format=png` beats the `jpeg` default below).
 *
 * Docs: https://www.remotion.dev/docs/config
 */

// Where `npx remotion render <id>` looks for registered compositions.
Config.setEntryPoint('./src/index.ts');

// JPEG frames are faster and smaller for opaque videos.
// Transparent renders MUST use PNG frames - see the README.
Config.setVideoImageFormat('jpeg');

// Don't fail a re-render just because out/<name>.mp4 already exists.
Config.setOverwriteOutput(true);

// Files in public/ are addressable in code via staticFile('...').
Config.setPublicDir('./public');
