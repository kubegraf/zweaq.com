/**
 * Ring geometry — pure path construction for the procedural ZWEAQ ONE render.
 *
 * The ring is a cylinder seen from above and in front. Three surfaces are
 * visible, and drawing them separately is what makes it read as an object
 * rather than as a flat donut:
 *
 *   1. the outer cylinder wall, on the near (lower) side
 *   2. the inner cylinder wall, on the far (upper) side, seen through the hole
 *   3. the top rim annulus, all the way round
 *
 * A circle of radius R tilted by α from the viewing axis projects to an ellipse
 * of (R, R·cos α). A band of height H along the ring axis projects to a
 * vertical offset of H·sin α. Both fall straight out of the constants below.
 *
 * No React, no DOM — so it is directly unit-testable.
 */

/** cos α, where α is the camera angle from the ring's axis. */
const K = 0.5;
const SIN = Math.sqrt(1 - K * K);

export const RING = {
  /** Drawing surface. */
  viewBox: { w: 800, h: 640 },
  /**
   * Rendered viewBox, cropped to the object and its shadow. The ring spans
   * x 150–650 and y 145–550 in drawing space; the rest is empty padding that
   * would otherwise eat a third of the hero on a phone.
   */
  crop: '120 118 560 462',
  cx: 400,
  /** Outer radius, projected. */
  r: 250,
  ry: 250 * K,
  k: K,
  /** Radial wall thickness, as a fraction of R. Matches real smart-ring stock. */
  wall: Math.round(0.15 * 250),
  /** Band height on screen. */
  h: Math.round(0.48 * 250 * SIN),
} as const;

export const RING_INNER_R = RING.r - RING.wall;
export const RING_INNER_RY = RING_INNER_R * K;
/** y of the top rim; the bottom rim sits `h` below it. */
export const RING_TOP = Math.round(322 - RING.h / 2);
export const RING_BOTTOM = RING_TOP + RING.h;

/** A full ellipse as a closed path. Two arcs, because one arc cannot close. */
export function ellipsePath(cy: number, rx: number, ry: number, cx = RING.cx): string {
  return (
    `M${cx - rx},${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} ` +
    `A${rx},${ry} 0 1 0 ${cx - rx},${cy} Z`
  );
}

/**
 * The band between two half-ellipses of equal size at different heights —
 * i.e. one visible half of a cylinder wall.
 */
export function ribbonPath(
  y1: number,
  y2: number,
  rx: number,
  ry: number,
  half: 'top' | 'bottom',
  cx = RING.cx,
): string {
  const sweep = half === 'top' ? 1 : 0;
  return (
    `M${cx - rx},${y1} A${rx},${ry} 0 0 ${sweep} ${cx + rx},${y1} ` +
    `L${cx + rx},${y2} A${rx},${ry} 0 0 ${1 - sweep} ${cx - rx},${y2} Z`
  );
}

/** A point on the outer surface, in ring-surface coordinates. */
function surfacePoint(phiDeg: number, t: number): [number, number] {
  const a = (phiDeg * Math.PI) / 180;
  return [
    RING.cx + RING.r * Math.sin(a),
    RING_TOP + RING.ry * Math.cos(a) + t * RING.h,
  ];
}

/**
 * A quad patch on the near cylinder wall.
 *
 * `phi` is degrees around the circumference from dead-centre-front; `t` runs 0
 * (top edge of the band) to 1 (bottom edge). Because it follows the real
 * surface, a patch naturally foreshortens as it rotates towards the silhouette
 * — which is what sells the rotation.
 */
export function surfacePatch(
  phi0: number,
  phi1: number,
  t0: number,
  t1: number,
  steps = 18,
): string {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const phi = phi0 + ((phi1 - phi0) * i) / steps;
    const [ax, ay] = surfacePoint(phi, t0);
    const [bx, by] = surfacePoint(phi, t1);
    top.push(`${ax.toFixed(1)},${ay.toFixed(1)}`);
    bottom.push(`${bx.toFixed(1)},${by.toFixed(1)}`);
  }
  return `M${top.join(' L')} L${bottom.reverse().join(' L')} Z`;
}

/** A line following the near cylinder wall at a constant height. */
export function surfaceSeam(phi0: number, phi1: number, t: number, steps = 26): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const phi = phi0 + ((phi1 - phi0) * i) / steps;
    const [x, y] = surfacePoint(phi, t);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

/** Where the display sits, and whether any of it is facing the camera. */
export interface DisplayPlacement {
  /** Centre angle, normalised to [-180, 180). */
  phi: number;
  /** Half-width in degrees. */
  halfWidth: number;
  /** 0 at the silhouette, 1 face-on. Drives opacity and text scale. */
  facing: number;
  visible: boolean;
}

export const DISPLAY_HALF_WIDTH = 20;

/**
 * Places the display for a given ring rotation.
 *
 * Rotating the ring carries the display around the circumference. Past ~72° it
 * is too oblique to read and is on its way behind the silhouette, so it fades
 * rather than smearing into a sliver.
 */
export function placeDisplay(rotationDeg: number): DisplayPlacement {
  const phi = normaliseAngle(rotationDeg);
  const facing = Math.cos((phi * Math.PI) / 180);
  return {
    phi,
    halfWidth: DISPLAY_HALF_WIDTH,
    facing: Math.max(0, facing),
    visible: Math.abs(phi) < 72,
  };
}

/** Wraps an angle into [-180, 180). ±180 both land on -180; they are the same angle. */
export function normaliseAngle(deg: number): number {
  const wrapped = ((deg + 180) % 360 + 360) % 360 - 180;
  return wrapped;
}

/**
 * Shifts a horizontal linear-gradient's stops to follow a light source.
 * `x` is -1 (light from the left) to 1 (light from the right).
 */
export function lightOffset(x: number): { x1: number; x2: number } {
  const shift = clamp(x, -1, 1) * 0.22;
  return { x1: 0 + shift, x2: 1 + shift };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
