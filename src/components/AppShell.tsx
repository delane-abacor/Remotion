import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, LAYOUT, R, S, WHITE} from '../design/tokens';
import {useDesignScale} from '../design/motion';

/**
 * THE ABACOR APP SHELL
 *
 * The rail is NOT a separate element. The outer frame is #1A1A1A at radius 16,
 * and the white container sits on top at x=60, leaving a 60px dark strip.
 * Building the rail as its own dark panel gets the corner radii wrong.
 *
 *   frame      1440 x 900 · radius 16 · #1A1A1A
 *   container  1372 x 884 at (60, 8) · radius 12 · white
 *
 * Scaled 1.24 into the 1920x1080 frame, which leaves a 67px margin either side
 * and lets the shell bleed a little off the top and bottom.
 */

/** Rail glyph. White at 20%, or full white when active. */
const RailGlyph: React.FC<{active?: boolean; scale: number}> = ({
  active = false,
  scale,
}) => (
  <div
    style={{
      width: 36 * scale,
      height: 36 * scale,
      borderRadius: R.r8 * scale,
      background: active ? WHITE.a08 : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 18 * scale,
        height: 18 * scale,
        borderRadius: R.r4 * scale,
        border: `${1.5 * scale}px solid ${active ? WHITE.base : WHITE.a20}`,
      }}
    />
  </div>
);

export const AppShell: React.FC<{
  /** Which rail row reads as the current destination. */
  activeRail?: number;
  children: React.ReactNode;
}> = ({activeRail = 2, children}) => {
  const s = useDesignScale();

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          width: LAYOUT.shellW * s,
          height: LAYOUT.shellH * s,
          borderRadius: LAYOUT.shellRadius * s,
          background: INK.base,
          flexShrink: 0,
        }}
      >
        {/* Rail contents sit in the 60px strip the container leaves exposed. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: LAYOUT.railW * s,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: S.s3 * s,
            gap: S.s2 * s,
          }}
        >
          {/*
            The Abacor mark belongs at the top of the rail. It is omitted
            because the real asset is not in the repo; drop it into
            public/images/ and it goes here at 44x48.
          */}
          <div style={{height: 48 * s}} />
          {[0, 1, 2, 3, 4].map((i) => (
            <RailGlyph key={i} active={i === activeRail} scale={s} />
          ))}
        </div>

        {/* White container, offset to reveal the rail. */}
        <div
          style={{
            position: 'absolute',
            left: LAYOUT.contentX * s,
            top: LAYOUT.contentY * s,
            width: LAYOUT.contentW * s,
            height: LAYOUT.contentH * s,
            borderRadius: LAYOUT.contentRadius * s,
            background: WHITE.base,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
