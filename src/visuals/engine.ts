/**
 * Animation loop: add shape on trigger, update/draw all, cull dead.
 * Single requestAnimationFrame loop; all state in JS.
 */

import type {
  Shape,
  CircleShape,
  PolygonShape,
  BurstShape,
  RingShape,
  SpiralShape,
  BlobShape,
  ParticlesShape,
  Particle,
  SuperellipseShape,
  RoundedRectShape,
  StarShape,
  PulseRingShape,
} from './types'
import { PALETTE, MAX_SHAPES } from './types'
import {
  easeOutCubic,
  easeOutQuart,
  easeOutBounce,
  easeOutBack,
  easeOutElastic,
} from './easing'

let shapeId = 0

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

function pickColor(keyIndex: number): string {
  return PALETTE[keyIndex % PALETTE.length]
}

interface HSL {
  h: number
  s: number
  l: number
}

function hexToHSL(hex: string): HSL {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) / 255
  const g = ((n >> 8) & 0xff) / 255
  const b = (n & 0xff) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function lerpHSL(a: HSL, b: HSL, t: number): HSL {
  let dh = b.h - a.h
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  return {
    h: a.h + dh * t,
    s: a.s + (b.s - a.s) * t,
    l: a.l + (b.l - a.l) * t,
  }
}

function hslToCss(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

function pickColorWithVariation(keyIndex: number): string {
  const base = hexToHSL(PALETTE[keyIndex % PALETTE.length])
  const h = (base.h + (Math.random() - 0.5) * 24 + 360) % 360
  return hslToCss({ ...base, h })
}

const DURATION_BASE = 800
const DURATION_VARY = 150

function durationMultiplier(): number {
  if (typeof window === 'undefined') return 1
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.25 : 1
}

function createCircle(
  x: number,
  y: number,
  keyIndex: number
): CircleShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  return {
    id: ++shapeId,
    type: 'circle',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radius: 35 + (keyIndex % 6) * 11,
  }
}

function createPolygon(
  x: number,
  y: number,
  keyIndex: number
): PolygonShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  return {
    id: ++shapeId,
    type: 'polygon',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radius: 40 + (keyIndex % 4) * 18,
    sides: 3 + (keyIndex % 5),
  }
}

function createParticle(_x: number, _y: number, keyIndex: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = 80 + Math.random() * 120
  return {
    x: 0,
    y: 0,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 1,
    color: pickColorWithVariation(keyIndex),
    size: 3 + (keyIndex % 4),
  }
}

function createBurst(
  x: number,
  y: number,
  keyIndex: number
): BurstShape {
  const duration = (600 + (keyIndex % 4) * 100) * durationMultiplier()
  const count = 12 + (keyIndex % 10)
  const particles: Particle[] = Array.from({ length: count }, () =>
    createParticle(x, y, keyIndex)
  )
  return {
    id: ++shapeId,
    type: 'burst',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    particles,
  }
}

function createRing(
  x: number,
  y: number,
  keyIndex: number
): RingShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  const r = 28 + (keyIndex % 5) * 12
  return {
    id: ++shapeId,
    type: 'ring',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    innerRadius: r,
    outerRadius: r + 18 + (keyIndex % 8),
  }
}

function createSpiral(
  x: number,
  y: number,
  keyIndex: number
): SpiralShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  return {
    id: ++shapeId,
    type: 'spiral',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radius: 50 + (keyIndex % 4) * 18,
    arms: 2 + (keyIndex % 4),
  }
}

function createBlob(
  x: number,
  y: number,
  keyIndex: number
): BlobShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  return {
    id: ++shapeId,
    type: 'blob',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radius: 42 + (keyIndex % 4) * 16,
    wobble: 0.15 + (keyIndex % 3) * 0.05,
  }
}

function createSuperellipse(
  x: number,
  y: number,
  keyIndex: number
): SuperellipseShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  const rx = 48 + (keyIndex % 3) * 16
  const ry = 38 + (keyIndex % 4) * 14
  return {
    id: ++shapeId,
    type: 'superellipse',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radiusX: rx,
    radiusY: ry,
    n: 2.5 + (keyIndex % 3) * 0.5,
  }
}

function createRoundedRect(
  x: number,
  y: number,
  keyIndex: number
): RoundedRectShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  const w = 55 + (keyIndex % 4) * 20
  const h = 44 + (keyIndex % 3) * 16
  return {
    id: ++shapeId,
    type: 'roundedRect',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    width: w,
    height: h,
    radius: 6 + (keyIndex % 4) * 2,
  }
}

function createParticlesShape(
  x: number,
  y: number,
  keyIndex: number
): ParticlesShape {
  const duration = (700 + (keyIndex % 4) * 80) * durationMultiplier()
  const count = 8 + (keyIndex % 8)
  const particles: Particle[] = Array.from({ length: count }, () =>
    createParticle(x, y, keyIndex)
  )
  return {
    id: ++shapeId,
    type: 'particles',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    particles,
  }
}

function createStar(x: number, y: number, keyIndex: number): StarShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  const outerRadius = 40 + (keyIndex % 4) * 18
  const innerRadius = outerRadius * 0.4
  return {
    id: ++shapeId,
    type: 'star',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    points: 4 + (keyIndex % 5),
    innerRadius,
    outerRadius,
  }
}

function createPulseRing(x: number, y: number, keyIndex: number): PulseRingShape {
  const duration = (DURATION_BASE + (keyIndex % 5) * DURATION_VARY) * durationMultiplier()
  return {
    id: ++shapeId,
    type: 'pulseRing',
    x,
    y,
    createdAt: now(),
    life: 1,
    duration,
    color: pickColorWithVariation(keyIndex),
    scale: 1,
    rotation: 0,
    radius: 40 + (keyIndex % 5) * 14,
  }
}

function createShape(
  x: number,
  y: number,
  keyIndex: number,
  presetId: string,
  scaleId: string,
  kitId: string,
  _w: number,
  _h: number,
  fromX: number,
  fromY: number
): Shape {
  let shape: Shape
  switch (presetId) {
    case 'polygon':
      shape = createPolygon(x, y, keyIndex)
      break
    case 'burst':
      shape = createBurst(x, y, keyIndex)
      break
    case 'ring':
      shape = createRing(x, y, keyIndex)
      break
    case 'spiral':
      shape = createSpiral(x, y, keyIndex)
      break
    case 'blob':
      shape = createBlob(x, y, keyIndex)
      break
    case 'particles':
      shape = createParticlesShape(x, y, keyIndex)
      break
    case 'squircle':
      shape = createSuperellipse(x, y, keyIndex)
      break
    case 'roundedRect':
      shape = createRoundedRect(x, y, keyIndex)
      break
    case 'star':
      shape = createStar(x, y, keyIndex)
      break
    case 'pulseRing':
      shape = createPulseRing(x, y, keyIndex)
      break
    default:
      shape = createCircle(x, y, keyIndex)
  }
  const durationMult =
    (scaleId === 'pentatonic' ? 1.2 : scaleId === 'chromatic' ? 0.85 : scaleId === 'minor' ? 1.05 : 1) *
    (kitId === 'drums' ? 0.7 : kitId === 'pads' ? 1.4 : 1)
  shape.duration *= durationMult
  shape.fromX = fromX
  shape.fromY = fromY
  shape.maxScale = 1.8 + Math.random() * 1.4
  let rotMult = (Math.random() - 0.5) * 3
  if (presetId === 'spiral') rotMult *= 1.5
  if (presetId === 'ring') rotMult *= 0.5
  shape.rotationSpeedMult = rotMult
  return shape
}

export interface VisualEngine {
  trigger(key: string): void
  destroy(): void
  getMood(): number
}

const KEY_ORDER = 'abcdefghijklmnopqrstuvwxyz'

const BG_LERP = 0.045
const DEFAULT_BG: HSL = { h: 270, s: 20, l: 6 }
const BG_IDLE_RESET_MS = 4000
const ENTRY_MARGIN = 120

function getEntryStart(
  entrySide: number,
  w: number,
  h: number
): { fromX: number; fromY: number } {
  const m = ENTRY_MARGIN
  const r = Math.random()
  switch (entrySide) {
    case 0:
      return { fromX: w + m, fromY: h + m }
    case 1:
      return { fromX: -m, fromY: h + m }
    case 2:
      return { fromX: w + m, fromY: -m }
    case 3:
      return { fromX: -m, fromY: -m }
    case 4:
      return { fromX: -m, fromY: h * (0.2 + 0.6 * r) }
    case 5:
      return { fromX: w + m, fromY: h * (0.2 + 0.6 * r) }
    case 6:
      return { fromX: w * (0.2 + 0.6 * r), fromY: h + m }
    default:
      return { fromX: w * (0.2 + 0.6 * r), fromY: -m }
  }
}

export interface VisualContext {
  scaleId: string
  kitId: string
}

export function createVisualEngine(
  canvas: HTMLCanvasElement,
  getKeyMap: () => Map<string, { visualPresetId: string }>,
  getVisualContext: () => VisualContext
): VisualEngine {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2d context')

  let shapes: Shape[] = []
  let rafId: number | null = null
  let destroyed = false
  let backgroundColor: HSL = { ...DEFAULT_BG }
  let targetBackgroundColor: HSL = { ...DEFAULT_BG }
  let lastTriggerTime = 0

  function trigger(key: string): void {
    if (destroyed || !ctx) return
    const keyMap = getKeyMap()
    const entry = keyMap.get(key.toLowerCase())
    if (!entry) return
    const { scaleId, kitId } = getVisualContext()
    if (shapes.length >= MAX_SHAPES) {
      shapes = shapes.slice(-Math.floor(MAX_SHAPES * 0.7))
    }
    const keyIndex = KEY_ORDER.indexOf(key.toLowerCase())
    if (keyIndex < 0) return
    const keyColor = pickColor(keyIndex)
    const keyHSL = hexToHSL(keyColor)
    targetBackgroundColor = {
      h: keyHSL.h,
      s: 40,
      l: 18,
    }
    lastTriggerTime = now()
    const w = canvas.clientWidth || canvas.width
    const h = canvas.clientHeight || canvas.height
    const x = w * (0.2 + 0.6 * Math.random())
    const y = h * (0.2 + 0.6 * Math.random())
    const entrySide = Math.floor(Math.random() * 8)
    const { fromX, fromY } = getEntryStart(entrySide, w, h)
    const shape = createShape(x, y, keyIndex, entry.visualPresetId, scaleId, kitId, w, h, fromX, fromY)
    shapes.push(shape)
  }

  function getMood(): number {
    const h = backgroundColor.h / 360
    const l = backgroundColor.l / 100
    return Math.max(0, Math.min(1, (h + (1 - l)) / 2))
  }

  function getScaleEased(type: Shape['type'], t: number): number {
    switch (type) {
      case 'circle':
        return easeOutCubic(t)
      case 'polygon':
      case 'roundedRect':
      case 'star':
        return easeOutBounce(t)
      case 'ring':
      case 'blob':
        return easeOutBack(t)
      case 'spiral':
        return easeOutQuart(t)
      case 'superellipse':
        return easeOutElastic(t)
      default:
        return easeOutCubic(t)
    }
  }

  function updateShape(s: Shape, dt: number): void {
    const age = now() - s.createdAt
    const life = Math.max(0, 1 - age / s.duration)
    s.life = life
    const t = 1 - life
    const easedT = easeOutCubic(t)
    const rotMult = s.rotationSpeedMult ?? 1
    if (s.fromX != null && s.fromY != null) {
      s.drawX = s.fromX + (s.x - s.fromX) * easedT
      s.drawY = s.fromY + (s.y - s.fromY) * easedT
    }
    const maxScale = s.maxScale ?? 1.8
    if (
      s.type === 'circle' ||
      s.type === 'polygon' ||
      s.type === 'ring' ||
      s.type === 'spiral' ||
      s.type === 'blob' ||
      s.type === 'superellipse' ||
      s.type === 'roundedRect' ||
      s.type === 'star'
    ) {
      const scaleEased = getScaleEased(s.type, t)
      s.scale = 0.15 + (maxScale - 0.15) * scaleEased
      s.rotation += dt * 0.004 * rotMult
    } else if (s.type === 'pulseRing') {
      s.rotation += dt * 0.004 * rotMult
    } else if (s.type === 'burst' || s.type === 'particles') {
      const ms = dt
      s.particles.forEach((p) => {
        p.x += (p.vx * ms) / 1000
        p.y += (p.vy * ms) / 1000
        p.life = easeOutCubic(life)
      })
    }
  }

  function drawShape(s: Shape): void {
    if (!ctx || s.life <= 0) return
    const alpha = easeOutCubic(s.life)
    const dx = s.drawX ?? s.x
    const dy = s.drawY ?? s.y
    ctx.save()
    ctx.translate(dx, dy)
    if (s.type === 'burst' || s.type === 'particles') {
      s.particles.forEach((p) => {
        if (p.life <= 0) return
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
      return
    }
    ctx.globalAlpha = alpha
    ctx.rotate(s.rotation)
    ctx.scale(s.scale, s.scale)
    ctx.fillStyle = s.color
    if (s.type === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = s.color
      ctx.globalAlpha = alpha * 0.85
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.globalAlpha = alpha
    } else if (s.type === 'polygon') {
      ctx.beginPath()
      for (let i = 0; i <= s.sides; i++) {
        const a = (i / s.sides) * Math.PI * 2 - Math.PI / 2
        const px = Math.cos(a) * s.radius
        const py = Math.sin(a) * s.radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = s.color
      ctx.globalAlpha = alpha * 0.8
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.globalAlpha = alpha
    } else if (s.type === 'ring') {
      const midR = (s.innerRadius + s.outerRadius) / 2
      const lineW = s.outerRadius - s.innerRadius
      ctx.beginPath()
      ctx.arc(0, 0, midR, 0, Math.PI * 2)
      ctx.strokeStyle = s.color
      ctx.lineWidth = lineW
      ctx.stroke()
    } else if (s.type === 'spiral') {
      const lineW = 2 + 4 * s.life
      for (let arm = 0; arm < s.arms; arm++) {
        const baseAngle = (arm / s.arms) * Math.PI * 2 + s.rotation
        ctx.beginPath()
        for (let i = 0; i <= 24; i++) {
          const t = i / 24
          const r = t * s.radius
          const a = baseAngle + t * Math.PI * 3
          const px = Math.cos(a) * r
          const py = Math.sin(a) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = s.color
        ctx.lineWidth = lineW
        ctx.stroke()
      }
    } else if (s.type === 'star') {
      ctx.beginPath()
      for (let i = 0; i <= s.points * 2; i++) {
        const a = (i / (s.points * 2)) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 === 0 ? s.outerRadius : s.innerRadius
        const px = Math.cos(a) * r
        const py = Math.sin(a) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    } else if (s.type === 'pulseRing') {
      const progress = easeOutCubic(1 - s.life)
      const drawRadius = s.radius * progress
      ctx.beginPath()
      ctx.arc(0, 0, drawRadius, 0, Math.PI * 2)
      ctx.strokeStyle = s.color
      ctx.lineWidth = 6
      ctx.stroke()
    } else if (s.type === 'blob') {
      const segments = 12
      const phase = now() * 0.003
      const points: { x: number; y: number }[] = []
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2
        const wobble =
          1 +
          s.wobble * Math.sin(phase + i) +
          s.wobble * 0.5 * Math.sin(phase * 1.3 + i * 2)
        const r = s.radius * wobble
        points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
      }
      ctx.beginPath()
      for (let i = 0; i < segments; i++) {
        const p0 = points[(i - 1 + segments) % segments]
        const p1 = points[i]
        const p2 = points[(i + 1) % segments]
        const p3 = points[(i + 2) % segments]
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        if (i === 0) ctx.moveTo(p1.x, p1.y)
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
      }
      ctx.closePath()
      ctx.fill()
    } else if (s.type === 'superellipse') {
      const pow = Math.max(0.25, s.n)
      const steps = 64
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2
        const cx = Math.cos(t)
        const cy = Math.sin(t)
        const sx = cx >= 0 ? 1 : -1
        const sy = cy >= 0 ? 1 : -1
        const px = s.radiusX * sx * Math.pow(Math.abs(cx), 2 / pow)
        const py = s.radiusY * sy * Math.pow(Math.abs(cy), 2 / pow)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    } else if (s.type === 'roundedRect') {
      const hw = s.width / 2
      const hh = s.height / 2
      const r = Math.min(s.radius, hw, hh)
      ctx.beginPath()
      ctx.moveTo(-hw + r, -hh)
      ctx.lineTo(hw - r, -hh)
      ctx.arcTo(hw, -hh, hw, -hh + r, r)
      ctx.lineTo(hw, hh - r)
      ctx.arcTo(hw, hh, hw - r, hh, r)
      ctx.lineTo(-hw + r, hh)
      ctx.arcTo(-hw, hh, -hw, hh - r, r)
      ctx.lineTo(-hw, -hh + r)
      ctx.arcTo(-hw, -hh, -hw + r, -hh, r)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  function loop(): void {
    if (destroyed || !ctx) return
    const dt = 16
    const t = now()
    if (lastTriggerTime > 0 && t - lastTriggerTime > BG_IDLE_RESET_MS) {
      targetBackgroundColor = { ...DEFAULT_BG }
    }
    backgroundColor = lerpHSL(backgroundColor, targetBackgroundColor, BG_LERP)

    shapes = shapes.filter((s) => {
      updateShape(s, dt)
      return s.life > 0.01
    })

    const lw = canvas.clientWidth || canvas.width
    const lh = canvas.clientHeight || canvas.height
    ctx.fillStyle = hslToCss(backgroundColor)
    ctx.fillRect(0, 0, lw, lh)
    shapes.forEach(drawShape)

    rafId = requestAnimationFrame(loop)
  }

  function destroy(): void {
    destroyed = true
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
    shapes = []
  }

  rafId = requestAnimationFrame(loop)

  return {
    trigger,
    destroy,
    getMood,
  }
}
