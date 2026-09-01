import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, INK, LH, ORANGE, S, T_VIDEO, W} from '../../design/tokens';
import {useDesignScale} from '../../design/motion';
import {Scene, Sfx} from '../../components/ui';
import {SFX, SFX_VOLUME} from '../../sfx';

/**
 * SCENE 0 - the title types itself in.
 *
 * Both lines are one ink at one weight; only the caret is orange, which spends
 * the scene's single orange element. Sentence case, per voice.md.
 */

const LINE_1 = 'Introducing';
const LINE_2 = 'Abacor’s revenue assistant';

/** Frames per character. */
const SPEED_1 = 1.6;
const SPEED_2 = 1;

const LINE_1_START = 4;
const LINE_1_END = LINE_1_START + LINE_1.length * SPEED_1;
const LINE_2_START = LINE_1_END + 3;
const LINE_2_END = LINE_2_START + LINE_2.length * SPEED_2;

/** Frames per caret blink once typing has finished. */
const BLINK = 15;

const typed = (frame: number, start: number, speed: number, text: string): string =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor((frame - start) / speed))));

const keystrokeFrames = (start: number, speed: number, length: number): number[] =>
  Array.from({length}, (_, i) => Math.round(start + i * speed));

/**
 * One typed line. The full string is rendered invisibly to reserve its final
 * width and the typed portion is laid over it, so the line does not re-centre
 * on every keystroke.
 */
const TypeLine: React.FC<{
  text: string;
  visible: string;
  size: number;
  showCaret: boolean;
  caretVisible: boolean;
  style?: React.CSSProperties;
}> = ({text, visible, size, showCaret, caretVisible, style}) => {
  const s = useDesignScale();

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: FONT,
        fontWeight: W.buch,
        fontSize: size * s,
        lineHeight: LH.tight,
        color: INK.base,
        ...style,
      }}
    >
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
              width: S.s1 * s,
              height: size * 0.86 * s,
              marginLeft: 4 * s,
              background: ORANGE.base,
              opacity: caretVisible ? 1 : 0,
            }}
          />
        ) : null}
      </span>
    </div>
  );
};

export const Intro: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const s = useDesignScale();

  const line1 = typed(frame, LINE_1_START, SPEED_1, LINE_1);
  const line2 = typed(frame, LINE_2_START, SPEED_2, LINE_2);

  const caretOnLine2 = frame >= LINE_2_START;
  const stillTyping = frame < LINE_2_END;
  const caretVisible = stillTyping || Math.floor((frame - LINE_2_END) / BLINK) % 2 === 0;

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
          // Nudge each click so a run of keys does not sound looped.
          volume={SFX_VOLUME.key * (0.85 + ((i * 37) % 7) / 24)}
        />
      ))}

      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
      >
        <TypeLine
          text={LINE_1}
          visible={line1}
          size={T_VIDEO.lead}
          showCaret={!caretOnLine2}
          caretVisible={caretVisible}
          style={{color: INK.a55, marginBottom: S.s4 * s}}
        />
        <TypeLine
          text={LINE_2}
          visible={line2}
          size={T_VIDEO.display}
          showCaret={caretOnLine2}
          caretVisible={caretVisible}
        />
      </AbsoluteFill>
    </Scene>
  );
};
