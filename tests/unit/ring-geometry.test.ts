import { describe, it, expect } from 'vitest';
import {
  RING,
  RING_INNER_R,
  RING_TOP,
  RING_BOTTOM,
  ellipsePath,
  ribbonPath,
  surfacePatch,
  surfaceSeam,
  placeDisplay,
  normaliseAngle,
  lightOffset,
  clamp,
} from '@/components/product/ringGeometry';

const NUMERIC = /^[\d.,\-\sMALVHAZ]+$/i;

describe('path construction', () => {
  it('closes the ellipse and emits only finite numbers', () => {
    const d = ellipsePath(100, 50, 25);
    expect(d.endsWith('Z')).toBe(true);
    expect(d).toMatch(NUMERIC);
    expect(d).not.toContain('NaN');
  });

  it('builds a closed ribbon for each visible half of the cylinder', () => {
    for (const half of ['top', 'bottom'] as const) {
      const d = ribbonPath(100, 160, 50, 25, half);
      expect(d.endsWith('Z')).toBe(true);
      expect(d).not.toContain('NaN');
    }
  });

  it('traces the two halves in opposite sweep directions', () => {
    // If both halves used the same sweep flag, one would be inside out.
    expect(ribbonPath(0, 10, 5, 2, 'top')).not.toBe(ribbonPath(0, 10, 5, 2, 'bottom'));
  });

  it('emits one point per step on each edge of a patch', () => {
    const steps = 6;
    const d = surfacePatch(-20, 20, 0.3, 0.7, steps);
    // Two edges of (steps + 1) points, minus the single M.
    expect(d.split('L').length - 1).toBe((steps + 1) * 2 - 1);
    expect(d).not.toContain('NaN');
  });

  it('follows the surface for a seam without closing it', () => {
    const d = surfaceSeam(-90, 90, 0.5, 4);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(false);
  });

  it('keeps the ring inside its cropped viewBox', () => {
    const [x, y, w, h] = RING.crop.split(' ').map(Number) as [number, number, number, number];
    // Outer silhouette, plus the contact shadow beneath it.
    expect(RING.cx - RING.r).toBeGreaterThanOrEqual(x);
    expect(RING.cx + RING.r).toBeLessThanOrEqual(x + w);
    expect(RING_TOP - RING.ry).toBeGreaterThanOrEqual(y);
    expect(RING_BOTTOM + RING.ry + 51).toBeLessThanOrEqual(y + h);
  });

  it('derives a wall that leaves a hole', () => {
    expect(RING_INNER_R).toBeGreaterThan(0);
    expect(RING_INNER_R).toBeLessThan(RING.r);
  });
});

describe('normaliseAngle', () => {
  it.each([
    [0, 0],
    // ±180 is one angle, and the range is half-open, so it lands on -180.
    [180, -180],
    [181, -179],
    [-181, 179],
    [360, 0],
    [540, -180],
    [-720, 0],
  ])('maps %i to %i', (input, expected) => {
    expect(normaliseAngle(input)).toBe(expected);
  });
});

describe('placeDisplay', () => {
  it('faces the camera at rest', () => {
    const placement = placeDisplay(0);
    expect(placement.visible).toBe(true);
    expect(placement.facing).toBeCloseTo(1, 5);
  });

  it('foreshortens as the ring turns', () => {
    expect(placeDisplay(45).facing).toBeLessThan(placeDisplay(0).facing);
    expect(placeDisplay(45).facing).toBeGreaterThan(0);
  });

  it('hides the display before it degenerates into a sliver', () => {
    expect(placeDisplay(90).visible).toBe(false);
    expect(placeDisplay(120).visible).toBe(false);
    expect(placeDisplay(180).visible).toBe(false);
  });

  it('behaves identically in both directions', () => {
    expect(placeDisplay(-40).facing).toBeCloseTo(placeDisplay(40).facing, 10);
  });

  it('never reports negative facing, so opacity cannot invert', () => {
    for (let deg = -360; deg <= 360; deg += 7) {
      expect(placeDisplay(deg).facing).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('lightOffset', () => {
  it('is centred with no pointer input', () => {
    expect(lightOffset(0)).toEqual({ x1: 0, x2: 1 });
  });

  it('shifts with the pointer and clamps beyond the element', () => {
    expect(lightOffset(1).x1).toBeGreaterThan(0);
    expect(lightOffset(-1).x1).toBeLessThan(0);
    expect(lightOffset(9)).toEqual(lightOffset(1));
    expect(lightOffset(-9)).toEqual(lightOffset(-1));
  });
});

describe('clamp', () => {
  it('bounds on both sides and passes values through', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
  });
});
