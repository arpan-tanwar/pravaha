/**
 * Shape preset types for the canvas engine.
 */

export type ShapeType =
  | 'circle'
  | 'polygon'
  | 'burst'
  | 'spiral'
  | 'blob'
  | 'ring'
  | 'particles'
  | 'superellipse'
  | 'roundedRect'
  | 'star'
  | 'pulseRing'

export interface BaseShape {
  id: number
  type: ShapeType
  x: number
  y: number
  createdAt: number
  /** 0–1, used for alpha and culling */
  life: number
  /** Duration in ms */
  duration: number
  color: string
  /** Scale factor */
  scale: number
  rotation: number
  /** Multiplier for rotation speed (scale/kit dependent), default 1 */
  rotationSpeedMult?: number
  /** Off-screen start for entry animation */
  fromX?: number
  fromY?: number
  /** Current draw position (lerped from fromX/fromY to x/y) */
  drawX?: number
  drawY?: number
  /** Max scale at end of animation (e.g. 1.8–3.2) */
  maxScale?: number
}

export interface CircleShape extends BaseShape {
  type: 'circle'
  radius: number
}

export interface PolygonShape extends BaseShape {
  type: 'polygon'
  radius: number
  sides: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

export interface BurstShape extends BaseShape {
  type: 'burst'
  particles: Particle[]
}

export interface SpiralShape extends BaseShape {
  type: 'spiral'
  radius: number
  arms: number
}

export interface BlobShape extends BaseShape {
  type: 'blob'
  radius: number
  wobble: number
}

export interface RingShape extends BaseShape {
  type: 'ring'
  innerRadius: number
  outerRadius: number
}

export interface SuperellipseShape extends BaseShape {
  type: 'superellipse'
  radiusX: number
  radiusY: number
  /** Power (2 = ellipse, 4 = squircle) */
  n: number
}

export interface RoundedRectShape extends BaseShape {
  type: 'roundedRect'
  width: number
  height: number
  radius: number
}

export interface ParticlesShape extends BaseShape {
  type: 'particles'
  particles: Particle[]
}

export interface StarShape extends BaseShape {
  type: 'star'
  points: number
  innerRadius: number
  outerRadius: number
}

export interface PulseRingShape extends BaseShape {
  type: 'pulseRing'
  radius: number
}

export type Shape =
  | CircleShape
  | PolygonShape
  | BurstShape
  | SpiralShape
  | BlobShape
  | RingShape
  | ParticlesShape
  | SuperellipseShape
  | RoundedRectShape
  | StarShape
  | PulseRingShape

export const PALETTE = [
  '#00f5d4', // cyan
  '#f72585', // magenta
  '#b5f44a', // lime
  '#ff9f1c', // orange
  '#9b5de5', // violet
  '#4361ee', // blue
] as const

export const MAX_SHAPES = 250
