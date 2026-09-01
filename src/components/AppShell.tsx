import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, LAYOUT, OUTLINE, OUTLINE_W, R, WHITE} from '../design/tokens';
import {useDesignScale} from '../design/motion';

/**
 * THE SURFACE THE SCENES SIT ON
 *
 * The design system's app shell puts a #1A1A1A frame behind the white
 * container so a 60px dark rail shows down the left. That rail is deliberately
 * NOT drawn here: in a promo the navigation carries no information, and a black
 * bar down one side of every frame pulls the eye away from the content the
 * video is about. Removing it is a video decision, not a change to the shell
 * pattern - product screens should still be built with the rail.
 *
 * What remains is the container itself, at the full 1440x900 shell footprint,
 * scaled 1.24 into the frame.
 */
export const AppShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const s = useDesignScale();

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          width: LAYOUT.shellW * s,
          height: LAYOUT.shellH * s,
          borderRadius: R.r16 * s,
          background: WHITE.base,
          // Without the dark frame behind it, the container needs its own edge
          // to separate from the paper surface.
          border: `${OUTLINE_W * s}px solid ${OUTLINE}`,
          boxShadow: `0 ${8 * s}px ${32 * s}px rgba(26,26,26,.08)`,
          overflow: 'hidden',
          flexShrink: 0,
          color: INK.base,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
