import React from 'react';
import {BRAND, FONTS} from '../brand';

/**
 * ABACOR LOGO
 * -----------
 * The mark is drawn as SVG to match the supplied artwork: a rounded orange
 * square with a single continuous white cut-out running through it - a narrow
 * slot down from the top edge, flaring into a hexagon with points at left and
 * right, narrowing again, then splaying out into two legs at the bottom.
 *
 * It is still a REDRAW, not the original vector. For pixel-exact output, add
 * the official file to public/images/ and replace <AbacorMark /> with:
 *
 *   <Img src={staticFile('images/abacor-mark.svg')} style={{height: size}} />
 *
 * ...importing Img and staticFile from 'remotion'. The `reveal` animation is
 * the only thing that depends on the inline path; everything else - sizing,
 * layout, the wordmark - keeps working unchanged.
 *
 * The wordmark is set in Poppins, which is close to but not identical to the
 * real lettering.
 */

/** Half-width of the narrow vertical slot, in the 0-100 viewBox. */
const SLOT = 6.5;
/** Y positions where the cut-out changes shape. */
const HEX_TOP = 20;
const HEX_MID = 41;
const HEX_BOTTOM = 62;
const LEG_TOP = 71;
/** How far the hexagon's left/right points reach in from the edge. */
const HEX_REACH = 27;
/** Half-width of the hexagon's flat top and bottom edges. */
const HEX_EDGE = 12;
/** Half-width of the splayed opening at the bottom edge. */
const LEG_SPREAD = 22;

/**
 * One continuous polygon, traced clockwise from the top slot. Drawn slightly
 * past the top and bottom edges so the cut meets the rounded rect cleanly.
 */
const CUTOUT =
  [
    [50 - SLOT, -3],
    [50 + SLOT, -3],
    [50 + SLOT, HEX_TOP],
    [50 + HEX_EDGE, HEX_TOP],
    [100 - HEX_REACH, HEX_MID],
    [50 + HEX_EDGE, HEX_BOTTOM],
    [50 + SLOT, HEX_BOTTOM],
    [50 + SLOT, LEG_TOP],
    [50 + LEG_SPREAD, 103],
    [50 - LEG_SPREAD, 103],
    [50 - SLOT, LEG_TOP],
    [50 - SLOT, HEX_BOTTOM],
    [50 - HEX_EDGE, HEX_BOTTOM],
    [HEX_REACH, HEX_MID],
    [50 - HEX_EDGE, HEX_TOP],
    [50 - SLOT, HEX_TOP],
  ]
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`)
    .join(' ') + ' Z';

type MarkProps = {
  /** Height of the mark in px. */
  size: number;
  color?: string;
  /** 0 -> 1. Opens the cut-out from nothing, so the mark "assembles". */
  reveal?: number;
};

export const AbacorMark: React.FC<MarkProps> = ({
  size,
  color = BRAND.orange,
  reveal = 1,
}) => {
  const cut = Math.max(reveal, 0.001);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <mask id="abacor-mark-cutout">
          {/* White = keep, black = cut away. */}
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <path
            d={CUTOUT}
            fill="black"
            transform={`translate(50 50) scale(${cut}) translate(-50 -50)`}
          />
        </mask>
      </defs>

      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="13"
        fill={color}
        mask="url(#abacor-mark-cutout)"
      />
    </svg>
  );
};

type LogoProps = {
  /** Height of the mark; the wordmark is sized relative to it. */
  size: number;
  markColor?: string;
  textColor?: string;
  /** 0 -> 1 for the mark's cut-outs opening. */
  reveal?: number;
  /** 0 -> 1 left-to-right wipe on the wordmark. */
  wordmarkReveal?: number;
  showWordmark?: boolean;
};

export const AbacorLogo: React.FC<LogoProps> = ({
  size,
  markColor = BRAND.orange,
  textColor = BRAND.navy,
  reveal = 1,
  wordmarkReveal = 1,
  showWordmark = true,
}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.34}}>
      <AbacorMark size={size} color={markColor} reveal={reveal} />
      {showWordmark ? (
        <span
          style={{
            fontFamily: FONTS.display + ', sans-serif',
            fontWeight: 600,
            fontSize: size * 0.92,
            lineHeight: 1,
            letterSpacing: size * -0.015,
            color: textColor,
            // Wipe, so the wordmark reveals rather than simply fading.
            clipPath: `inset(0 ${(1 - wordmarkReveal) * 100}% 0 0)`,
            paddingRight: size * 0.06,
          }}
        >
          abacor
        </span>
      ) : null}
    </div>
  );
};
