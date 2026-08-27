import React from 'react';
import {BRAND, FONTS} from '../brand';

/**
 * ABACOR LOGO
 * -----------
 * The mark here is a geometric RECONSTRUCTION drawn from the supplied logo
 * image, and the wordmark is set in Poppins - close to, but not identical to,
 * the real lettering.
 *
 * TO USE THE REAL ASSET: drop the official file into public/images/ and swap
 * the <Mark /> body (and the wordmark <span />) for:
 *
 *   <Img src={staticFile('images/abacor-logo.svg')} style={{height: size}} />
 *
 * ...importing Img and staticFile from 'remotion'. Everything else - the
 * entrance animation, sizing, layout - keeps working unchanged.
 */

type MarkProps = {
  /** Height of the mark in px. */
  size: number;
  color?: string;
  /** 0 -> 1. Scales the white cut-outs open, so the mark "assembles". */
  reveal?: number;
};

export const AbacorMark: React.FC<MarkProps> = ({
  size,
  color = BRAND.orange,
  reveal = 1,
}) => {
  // The notches and hexagon open up from nothing as `reveal` goes 0 -> 1.
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
          <g transform={`translate(50 50) scale(${cut}) translate(-50 -50)`}>
            {/* Centre hexagon */}
            <path d="M50 22 L74 36 L74 64 L50 78 L26 64 L26 36 Z" fill="black" />
            {/* Vertical channels to the top and bottom edges */}
            <rect x="41" y="-4" width="18" height="34" fill="black" />
            <rect x="41" y="70" width="18" height="34" fill="black" />
          </g>
        </mask>
      </defs>

      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="15"
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
