import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, INK, LH, ORANGE, S, T_VIDEO, W} from '../../design/tokens';
import {abacorSpring, riseIn, useDesignScale} from '../../design/motion';
import {Scene} from '../../components/ui';

/**
 * FINAL SCENE - the call to action.
 *
 * Orange budget: the address, which is the one thing the viewer is meant to
 * act on. Everything else is ink. Holds through the last frame so an editor
 * has something to cut on.
 */
export const EndCard: React.FC<{
  durationInFrames: number;
  lead: string;
  url: string;
}> = ({durationInFrames, lead, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useDesignScale();

  const leadIn = abacorSpring({frame, fps, delay: 3});
  const urlIn = abacorSpring({frame, fps, delay: 10});

  return (
    <Scene durationInFrames={durationInFrames} hold>
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: W.buch,
            fontSize: T_VIDEO.lead * s,
            lineHeight: LH.tight,
            color: INK.a55,
            marginBottom: S.s4 * s,
            ...riseIn(leadIn, 8 * s),
          }}
        >
          {lead}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: W.kraftig,
            fontSize: T_VIDEO.display * s,
            lineHeight: LH.tight,
            color: ORANGE.base,
            ...riseIn(urlIn, 8 * s),
          }}
        >
          {url}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
