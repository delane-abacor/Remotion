import React from 'react';
import {Composition, Folder} from 'remotion';
import {
  AbacorPromo,
  abacorPromoDefaultProps,
  abacorPromoSchema,
  promoDuration,
} from './compositions/AbacorPromo';
import {
  KineticText,
  kineticTextDefaultProps,
  kineticTextSchema,
} from './compositions/KineticText';
import {
  LowerThird,
  lowerThirdDefaultProps,
  lowerThirdSchema,
} from './compositions/LowerThird';
import {
  OverlayBadge,
  overlayBadgeDefaultProps,
  overlayBadgeSchema,
} from './compositions/OverlayBadge';
import {
  TitleCard,
  titleCardDefaultProps,
  titleCardSchema,
} from './compositions/TitleCard';
import {CANVAS, seconds} from './video';

/**
 * COMPOSITION REGISTRY
 * --------------------
 * Every graphic that should show up in the Studio sidebar - and every `id`
 * you can pass to `npx remotion render <id>` - is listed here.
 *
 * To add a new graphic:
 *   1. Create src/compositions/MyGraphic.tsx exporting the component,
 *      a zod schema, and a matching defaultProps object.
 *   2. Import all three here.
 *   3. Add a <Composition /> below with a unique `id`.
 *
 * `{...CANVAS}` applies the shared width/height/fps from src/video.ts.
 * Override per composition only when a graphic genuinely needs its own size,
 * e.g. width={1080} height={1920} for a vertical cut.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* The Abacor product promo. */}
      <Composition
        id="AbacorPromo"
        component={AbacorPromo}
        durationInFrames={promoDuration()}
        {...CANVAS}
        schema={abacorPromoSchema}
        defaultProps={abacorPromoDefaultProps}
      />

      {/* Full-frame graphics - rendered on an opaque background. */}
      <Folder name="Full-Frame">
        <Composition
          id="TitleCard"
          component={TitleCard}
          durationInFrames={seconds(5)}
          {...CANVAS}
          schema={titleCardSchema}
          defaultProps={titleCardDefaultProps}
        />

        <Composition
          id="KineticText"
          component={KineticText}
          durationInFrames={seconds(6)}
          {...CANVAS}
          schema={kineticTextSchema}
          defaultProps={kineticTextDefaultProps}
        />
      </Folder>

      {/*
        Overlays - no background fill, so they export with a real alpha
        channel using the ProRes 4444 command in the README.
      */}
      <Folder name="Overlays">
        <Composition
          id="LowerThird"
          component={LowerThird}
          durationInFrames={seconds(5)}
          {...CANVAS}
          schema={lowerThirdSchema}
          defaultProps={lowerThirdDefaultProps}
        />

        <Composition
          id="OverlayBadge"
          component={OverlayBadge}
          durationInFrames={seconds(4)}
          {...CANVAS}
          schema={overlayBadgeSchema}
          defaultProps={overlayBadgeDefaultProps}
        />
      </Folder>
    </>
  );
};
