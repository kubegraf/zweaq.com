'use client';

import { useId } from 'react';
import {
  RING,
  RING_INNER_R,
  RING_INNER_RY,
  RING_TOP,
  RING_BOTTOM,
  ellipsePath,
  ribbonPath,
  surfacePatch,
  surfaceSeam,
  placeDisplay,
  lightOffset,
  clamp,
} from './ringGeometry';

/**
 * ProductViewer — the ZWEAQ ONE hero render.
 *
 * This is a **procedural concept render**, not a photograph of manufactured
 * hardware, and the UI says so wherever it appears at size. It is vector, so it
 * costs no image bytes, stays sharp on any display, and can be driven by state
 * — the display text and the ring's rotation are props, not baked pixels.
 *
 * The `model` prop is the seam for replacing it. When production hardware
 * exists, add a `{ kind: 'gltf', src }` model and branch here; every caller
 * already passes its intent through this interface and none of them change.
 */

export type RingModel =
  | { kind: 'procedural' }
  /** Reserved. Not implemented — there is no production model to load yet. */
  | { kind: 'gltf'; src: string };

export interface ProductViewerProps {
  /** Text on the micro-display. Kept short — it is a 0.28in screen. */
  displayText: string;
  /** Rotation about the ring axis, in degrees. Carries the display round. */
  rotation?: number;
  /** Key-light position, -1 to 1 on each axis. Drives specular placement. */
  light?: { x: number; y: number };
  model?: RingModel;
  /** Accessible description. Required — this is meaningful content. */
  title: string;
  className?: string;
  /** Renders the finer hardware detail. Off for small or decorative instances. */
  detail?: boolean;
  priority?: boolean;
}

export function ProductViewer({
  displayText,
  rotation = 0,
  light = { x: 0, y: 0 },
  model = { kind: 'procedural' },
  title,
  className,
  detail = true,
}: ProductViewerProps) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  if (model.kind === 'gltf') {
    // Deliberate: shipping a broken 3D path would be worse than not having one.
    throw new Error(
      'ProductViewer: the gltf model path is reserved and not implemented. ' +
        'No production ring model exists yet.',
    );
  }

  const display = placeDisplay(rotation);
  const { x1, x2 } = lightOffset(light.x);
  const keyY = 50 + clamp(light.y, -1, 1) * 12;

  const midY = (RING_TOP + RING_BOTTOM) / 2;
  const d0 = display.phi - display.halfWidth;
  const d1 = display.phi + display.halfWidth;
  const textY = RING_TOP + RING.ry * Math.cos((display.phi * Math.PI) / 180) + RING.h * 0.5;
  const textX = RING.cx + RING.r * Math.sin((display.phi * Math.PI) / 180);

  return (
    <svg
      // Cropped to the object plus its shadow. The full 800×640 drawing space
      // leaves ~30% empty padding, which wastes the most valuable area on a
      // phone.
      viewBox={RING.crop}
      className={className}
      role="img"
      aria-label={title}
      // The render is decorative geometry around a meaningful label; the label
      // above carries the content, so the internals are hidden from AT.
    >
      <title>{title}</title>
      <defs>
        {/* Titanium. Low contrast and neutral — chrome is high-contrast and blue. */}
        <linearGradient id={id('ti')} x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor="#33373d" />
          <stop offset="0.07" stopColor="#5e646d" />
          <stop offset="0.18" stopColor="#a7adb6" />
          <stop offset="0.28" stopColor="#868d97" />
          <stop offset="0.42" stopColor="#6b7179" />
          <stop offset="0.55" stopColor="#767d86" />
          <stop offset="0.68" stopColor="#9aa1aa" />
          <stop offset="0.8" stopColor="#6e747c" />
          <stop offset="0.92" stopColor="#4a4f56" />
          <stop offset="1" stopColor="#2e3239" />
        </linearGradient>

        <linearGradient id={id('shade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="0.38" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.42" />
        </linearGradient>

        <linearGradient id={id('rim')} x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor="#3f444b" />
          <stop offset="0.17" stopColor="#b7bec7" />
          <stop offset="0.37" stopColor="#8d949d" />
          <stop offset="0.55" stopColor="#b4bbc4" />
          <stop offset="0.76" stopColor="#787f88" />
          <stop offset="1" stopColor="#3c4047" />
        </linearGradient>

        <linearGradient id={id('inner')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#080a0d" />
          <stop offset="0.52" stopColor="#1a1e24" />
          <stop offset="1" stopColor="#333941" />
        </linearGradient>

        <radialGradient id={id('hole')} cx="0.5" cy="0.62" r="0.72">
          <stop offset="0" stopColor="#08090b" />
          <stop offset="0.78" stopColor="#08090b" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.85" />
        </radialGradient>

        <radialGradient id={id('key')} cx="0.5" cy={`${keyY}%`} r="0.5">
          <stop offset="0" stopColor="#c4cbd4" stopOpacity="0.15" />
          <stop offset="1" stopColor="#c4cbd4" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={id('glow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dff3ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#dff3ff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id('refl')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dff3ff" stopOpacity="0.14" />
          <stop offset="0.65" stopColor="#dff3ff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#dff3ff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={id('glass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0f16" />
          <stop offset="0.5" stopColor="#070b10" />
          <stop offset="1" stopColor="#111820" />
        </linearGradient>

        <clipPath id={id('dw')}>
          <path d={surfacePatch(d0, d1, 0.28, 0.72)} />
        </clipPath>
      </defs>

      {/* Single soft key light. Elliptical and clipped — not a glowing blob. */}
      <ellipse cx={RING.cx} cy="320" rx="340" ry="240" fill={url('key')} />
      <ellipse
        cx={RING.cx}
        cy={RING_BOTTOM + RING.ry + 34}
        rx={RING.r * 0.8}
        ry="17"
        fill="#000000"
        opacity="0.6"
      />

      {/* Through the hole: background, then the far inner wall. */}
      <path d={ellipsePath(midY, RING_INNER_R, RING_INNER_RY)} fill={url('hole')} />
      <path
        d={ribbonPath(RING_TOP, RING_BOTTOM, RING_INNER_R, RING_INNER_RY, 'top')}
        fill={url('inner')}
      />

      {/* Near outer wall. */}
      <path d={ribbonPath(RING_TOP, RING_BOTTOM, RING.r, RING.ry, 'bottom')} fill={url('ti')} />

      {detail && (
        <g>
          {/* Parting lines, as on real turned hardware. */}
          <path d={surfaceSeam(-90, 90, 0.17)} fill="none" stroke="#0b0d11" strokeOpacity="0.3" strokeWidth="1.1" />
          <path d={surfaceSeam(-90, 90, 0.19)} fill="none" stroke="#d6dce4" strokeOpacity="0.1" strokeWidth="0.9" />
          <path d={surfaceSeam(-90, 90, 0.83)} fill="none" stroke="#0b0d11" strokeOpacity="0.3" strokeWidth="1.1" />
          <path d={surfaceSeam(-90, 90, 0.81)} fill="none" stroke="#d6dce4" strokeOpacity="0.08" strokeWidth="0.9" />
        </g>
      )}

      {/* Display. Flush, with a chamfer rather than a black bezel — a recessed
          black rectangle reads as a watch face glued onto a band. */}
      {display.visible && (
        <g opacity={clamp(display.facing * 1.4, 0, 1)}>
          <path d={surfacePatch(d0, d1, 0.28, 0.72)} fill={url('glass')} />
          <g clipPath={url('dw')}>
            <ellipse cx={textX} cy={textY} rx={74 * display.facing} ry="24" fill={url('glow')} />
            <text
              x={textX}
              y={textY + 9}
              fill="#dff3ff"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="27"
              fontWeight="500"
              letterSpacing="1.5"
              textAnchor="middle"
              // Foreshorten with the surface instead of letting glyphs smear.
              transform={`translate(${textX} ${textY}) scale(${Math.max(0.05, display.facing)} 1) translate(${-textX} ${-textY})`}
            >
              {displayText}
            </text>
            <path d={surfacePatch(d0, d0 + display.halfWidth * 0.6, 0.28, 0.72)} fill={url('refl')} />
          </g>
          <path d={surfacePatch(d0, d1, 0.28, 0.34)} fill="#000000" opacity="0.34" />
          <path d={surfaceSeam(d0, d1, 0.28)} fill="none" stroke="#c4cbd4" strokeOpacity="0.2" strokeWidth="0.9" />
          <path d={surfaceSeam(d0, d1, 0.72)} fill="none" stroke="#e8edf3" strokeOpacity="0.13" strokeWidth="0.9" />
        </g>
      )}

      <path d={ribbonPath(RING_TOP, RING_BOTTOM, RING.r, RING.ry, 'bottom')} fill={url('shade')} />

      {/* Top rim annulus, last — it frames everything. */}
      <path
        d={`${ellipsePath(RING_TOP, RING.r, RING.ry)} ${ellipsePath(RING_TOP, RING_INNER_R, RING_INNER_RY)}`}
        fill={url('rim')}
        fillRule="evenodd"
      />
      <path
        d={ellipsePath(RING_TOP, RING_INNER_R, RING_INNER_RY)}
        fill="none"
        stroke="#05070a"
        strokeOpacity="0.7"
        strokeWidth="1.6"
      />
    </svg>
  );
}
