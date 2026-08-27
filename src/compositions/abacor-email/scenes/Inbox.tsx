import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand';
import {Card, Monogram, Scene, Sfx, SparkIcon} from '../../../components/ui';
import {SFX, SFX_VOLUME} from '../../../sfx';
import {FONT_FAMILY} from '../../../fonts';
import {springEnter} from '../../../lib/animation';
import {useScale} from '../../../lib/layout';

/**
 * BEAT 1 - the ask arrives, and Abacor is already there.
 *
 * The point of this scene is placement, not features: the badge sits inside
 * the mail client's own header rather than in a panel beside it, because the
 * product's claim is that it lives in the inbox you already use. Nothing is
 * clicked and nothing is opened - the assistant starts on its own.
 *
 * The client's question is deliberately one only prior context can answer
 * ("what we agreed", "what we landed on"), which sets up beat 2.
 */

/** The message lands, then the assistant picks it up unprompted. */
const MAIL_AT = 8;
const DRAFTING_AT = 52;

const AlwaysOnBadge: React.FC<{scale: number; progress: number}> = ({
  scale,
  progress,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 9 * scale,
      padding: `${9 * scale}px ${16 * scale}px`,
      background: BRAND.orangeTint,
      border: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
      borderRadius: 999,
      opacity: progress,
    }}
  >
    <SparkIcon size={17 * scale} color={BRAND.orange} />
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        fontSize: 18 * scale,
        color: BRAND.orangeDeep,
        whiteSpace: 'nowrap',
      }}
    >
      Abacor · always on
    </span>
  </div>
);

export const Inbox: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = useScale();

  const cardIn = springEnter({frame, fps, delay: 1, damping: 200, stiffness: 90});
  const badgeIn = springEnter({frame, fps, delay: 10, damping: 200, stiffness: 100});
  const mailIn = springEnter({frame, fps, delay: MAIL_AT, damping: 16, stiffness: 130});
  const draftingIn = springEnter({
    frame,
    fps,
    delay: DRAFTING_AT,
    damping: 15,
    stiffness: 140,
  });

  return (
    <Scene durationInFrames={durationInFrames}>
      <Sfx
        src={SFX.ping}
        at={MAIL_AT}
        durationInFrames={14}
        volume={SFX_VOLUME.ping}
        name="Mail arrives"
      />
      <Sfx
        src={SFX.detect}
        at={DRAFTING_AT}
        durationInFrames={18}
        volume={SFX_VOLUME.detect * 0.8}
        name="Assistant picks it up"
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Card scale={scale} width={1240} progress={cardIn} padding={0}>
          {/* Mail client chrome - the badge belongs to this header, not to a
              separate tool sitting next to it. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${24 * scale}px ${36 * scale}px`,
              borderBottom: `${1.5 * scale}px solid ${BRAND.lineSoft}`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 600,
                fontSize: 27 * scale,
                color: BRAND.navy,
              }}
            >
              Inbox
            </span>
            <AlwaysOnBadge scale={scale} progress={badgeIn} />
          </div>

          {/* The incoming message. */}
          <div
            style={{
              display: 'flex',
              gap: 22 * scale,
              padding: `${34 * scale}px ${36 * scale}px`,
              opacity: mailIn,
              transform: `translateY(${(1 - mailIn) * -22 * scale}px)`,
            }}
          >
            <Monogram
              text="TR"
              size={50 * scale}
              background="#E9EFF2"
              color={BRAND.inkSoft}
            />
            <div style={{flex: 1, minWidth: 0}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 13 * scale,
                  marginBottom: 4 * scale,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 24 * scale,
                    color: BRAND.ink,
                  }}
                >
                  Tomás R.
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 19 * scale,
                    color: BRAND.muted,
                  }}
                >
                  09:14
                </span>
                <span
                  style={{
                    width: 9 * scale,
                    height: 9 * scale,
                    borderRadius: 999,
                    background: BRAND.orange,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 21 * scale,
                  color: BRAND.inkSoft,
                  marginBottom: 14 * scale,
                }}
              >
                Re: Second clinic + payroll
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 25 * scale,
                  lineHeight: 1.65,
                  color: BRAND.inkSoft,
                }}
              >
                Quick one before Thursday — can you send over what we agreed on the second
                clinic? And remind me what we landed on for the 1099 therapists?
              </div>
            </div>
          </div>

          {/* The assistant starts without being asked. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12 * scale,
              padding: `${22 * scale}px ${36 * scale}px`,
              background: BRAND.orangeTint,
              borderTop: `${1.5 * scale}px solid ${BRAND.orangeTintEdge}`,
              opacity: draftingIn,
            }}
          >
            <SparkIcon size={21 * scale} color={BRAND.orange} />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 600,
                fontSize: 23 * scale,
                color: BRAND.orangeDeep,
              }}
            >
              Abacor is drafting a reply…
            </span>
          </div>
        </Card>
      </AbsoluteFill>
    </Scene>
  );
};
