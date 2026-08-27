import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BRAND, TITLE} from '../../brand';
import {Scene, Sfx} from '../../components/ui';
import {SFX, SFX_VOLUME} from '../../sfx';
import {FONT_FAMILY} from '../../fonts';
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

/**
 * Both lines are set identically - same face, size and weight - so the pair
 * reads as one typed sentence. Only the colour separates them. The values live
 * in src/brand.ts because the end card uses the same treatment.
 */
const CARET_HEIGHT = 38;
const CARET_WIDTH = 4;

/**
 * Frames at which each character lands. `from` on a <Sequence> must be a whole
 * frame, and SPEED_2 is fractional, so these are rounded.
 */
const keystrokeFrames = (start: number, speed: number, length: number): number[] =>
  Array.from({length}, (_, i) => Math.round(start + i * speed));

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
  const settle = interpolate(frame, [LINE_2_START, LINE_2_END], [4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const keystrokes = [
    ...keystrokeFrames(LINE_1_START, SPEED_1, LINE_1.length),
    ...keystrokeFrames(LINE_2_START, SPEED_2, LINE_2.length),
  ];

  return (
    <Scene durationInFrames={durationInFrames}>
      {keystrokes.map((at, i) => (
        <Sfx
          key={`key-${i}`}
          src={SFX.key}
          at={at}
          durationInFrames={4}
          name={`Key ${i + 1}`}
          // Nudge each click's level so a run of keys does not sound looped.
          volume={SFX_VOLUME.key * (0.85 + ((i * 37) % 7) / 24)}
        />
      ))}

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
          caretWidth={CARET_WIDTH * scale}
          caretHeight={CARET_HEIGHT * scale}
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: TITLE.weight,
            fontSize: TITLE.size * scale,
            letterSpacing: TITLE.tracking * scale,
            color: TITLE.color,
            marginBottom: 18 * scale,
          }}
        />

        <TypeLine
          text={LINE_2}
          visible={line2}
          showCaret={caretOnLine2}
          caretVisible={caretVisible}
          caretWidth={CARET_WIDTH * scale}
          caretHeight={CARET_HEIGHT * scale}
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: TITLE.weight,
            fontSize: TITLE.size * scale,
            letterSpacing: TITLE.tracking * scale,
            color: TITLE.color,
            transform: `translateY(${settle * scale}px)`,
          }}
        />
      </AbsoluteFill>
    </Scene>
  );
};
