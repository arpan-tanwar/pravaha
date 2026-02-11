/**
 * Easing functions for smooth animation (snappy start, smooth settle).
 * t is typically 0..1 (progress).
 */

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

/** Bounce out: multiple bounces then settle at 1. */
export function easeOutBounce(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) {
    t -= 1.5 / d1
    return n1 * t * t + 0.75
  }
  if (t < 2.5 / d1) {
    t -= 2.25 / d1
    return n1 * t * t + 0.9375
  }
  t -= 2.625 / d1
  return n1 * t * t + 0.984375
}

/** Back out: overshoot then settle at 1. */
export function easeOutBack(t: number): number {
  const c = 1.70158
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}

/** Elastic out: damped oscillation then settle at 1. */
export function easeOutElastic(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const p = 0.3
  const s = p / 4
  return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
}
