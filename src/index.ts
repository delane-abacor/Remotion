import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';

/**
 * Entry point. Referenced by remotion.config.ts so the CLI can find the
 * compositions registered in Root.tsx.
 */
registerRoot(RemotionRoot);
