import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../brand';
import {Scene} from '../../components/ui';
import {DISPLAY_FAMILY, FONT_FAMILY} from '../../fonts';
import {useScale} from '../../lib/layout';

/**
 * SCENE 0 - the title types itself in.
 *
 * Two lines typed one after the other, with a caret that follows whichever
 * line is being written and blinks once there is nothing left to type.
 */

const LINE_1 = 'Introducing';
const LINE_2 = 'Abacor’s revenue assistant';

/** Frames per character. Lower = faster typing. */
const SPEED_1 = 2;
const SPEED_2 = 1.4;

const LINE_1_START = 4;
const LINE_1_END = LINE_1_START + LINE_1.length * SPEED_1;
/** Beat between the two lines. */
const LINE_2_START = LINE_1_END + 6;
const LINE_2_END = LINE_2_START + LINE_2.length * SPEED_2;

/** Frames per caret blink once typing has finished. */
const BLINK = 15;

/** How much of `text` has been typed by `frame`. */
const typed = (frame: number, start: number, speed: number, text: string): string =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor((frame - start) / speed))));

/**
 * One typed line.
 *
 * The full string is rendered invisibly to reserve its final width, and the
 * typed portion is laid over it. Without that the line re-centres on every
 * keystroke, which reads as a wobble rather than as typing.
 */
const TypeLine: React.FC<{
  text: string;
  visible: string;
  showCaret: boolean;
  caretVisible: boolean;
  caretWidth: number;
  caretHeight: number;
  style: React.CSSProperties;
}> = ({text, visible, showCaret, caretVisible, caretWidth, caretHeight, style}) => (
  <div style={{position: 'relative', display: 'inline-block', ...style}}>
    <span style={{visibility: 'hidden', whiteSpace: 'pre'}}>{text}</span>
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        whiteSpace: 'pre',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {visible}
      {showCaret ? (
        <span
          style={{
            display: 'inline-block',
            width: caretWidth,
            height: caretHeight,
            marginLeft: caretWidth * 1.4,
            background: BRAND.orange,
            borderRadius: caretWidth * 0.4,
            opacity: caretVisible ? 1 : 0,
          }}
        />
      ) : null}
    </span>
  </div>
);

export const Intro: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const scale = useScale();

  const line1 = typed(frame, LINE_1_START, SPEED_1, LINE_1);
  const line2 = typed(frame, LINE_2_START, SPEED_2, LINE_2);

  const caretOnLine2 = frame >= LINE_2_START;
  const stillTyping = frame < LINE_2_END;
  // Solid while typing, blinking once there is nothing left to write.
  const caretVisible = stillTyping || Math.floor((frame - LINE_2_END) / BLINK) % 2 === 0;

  // Line 2 settles up very slightly as it is written.
  const settle = interpolate(frame, [LINE_2_START, LINE_2_END], [7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Scene durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <TypeLine
          text={LINE_1}
          visible={line1}
          showCaret={!caretOnLine2}
          caretVisible={caretVisible}
          caretWidth={4 * scale}
          caretHeight={38 * scale}
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 44 * scale,
            letterSpacing: 0.5 * scale,
            color: BRAND.inkSoft,
            marginBottom: 30 * scale,
          }}
        />

        <TypeLine
          text={LINE_2}
          visible={line2}
          showCaret={caretOnLine2}
          caretVisible={caretVisible}
          caretWidth={6 * scale}
          caretHeight={72 * scale}
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontWeight: 700,
            fontSize: 86 * scale,
            lineHeight: 1.15,
            letterSpacing: -0.015 * 86 * scale,
            color: BRAND.navy,
            transform: `translateY(${settle * scale}px)`,
          }}
        />
      </AbsoluteFill>
    </Scene>
  );
};
