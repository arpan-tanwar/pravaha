/**
 * Sound kit definitions: key -> synth params + visual preset id.
 * Keys are lowercase a-z. Visual preset id is used by the canvas engine.
 */


export type KitId = 'bleeps' | 'drums' | 'pads'

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle'

export interface SynthParams {
  type: 'synth'
  waveform: Waveform
  /** Decay time in seconds */
  decay: number
  /** 0–1 */
  volume: number
  /** Optional attack time in seconds (gain ramp 0 → volume) */
  attack?: number
  /** Optional detune in cents */
  detuneCents?: number
}

/** Placeholder for future sample-based keys */
export interface SampleParams {
  type: 'sample'
  url: string
  volume: number
}

export type SoundParams = SynthParams | SampleParams

export interface KeyDef {
  sound: SoundParams
  /** Visual preset id for canvas engine (e.g. 'circle', 'burst', 'spiral') */
  visualPresetId: string
}

export interface Kit {
  id: KitId
  name: string
  /** Layman-friendly one-liner for UI */
  description?: string
  keys: Record<string, KeyDef>
}

const VISUAL_PRESETS = [
  'circle',
  'polygon',
  'burst',
  'spiral',
  'blob',
  'ring',
  'particles',
  'squircle',
  'roundedRect',
  'star',
  'pulseRing',
  'circle',
] as const

/** Get a consistent visual preset for a key index (0–25 for a–z). */
function presetForKey(keyIndex: number): string {
  return VISUAL_PRESETS[keyIndex % VISUAL_PRESETS.length]
}

function makeBleepsKit(): Kit {
  const keys: Record<string, KeyDef> = {}
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const waveforms: Waveform[] = ['sine', 'triangle']
  letters.split('').forEach((key, i) => {
    const decay = 0.2 + (i % 7) * 0.045
    const volume = 0.3 + (i % 4) * 0.025
    keys[key] = {
      sound: {
        type: 'synth',
        waveform: waveforms[i % waveforms.length],
        decay,
        volume: Math.min(0.4, volume),
        attack: 0.01,
        detuneCents: i % 3 === 0 ? 5 : undefined,
      },
      visualPresetId: presetForKey(i),
    }
  })
  return { id: 'bleeps', name: 'Bleeps', description: 'Soft beeps and blips.', keys }
}

function makeDrumsKit(): Kit {
  const keys: Record<string, KeyDef> = {}
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const waveforms: Waveform[] = ['square', 'sawtooth']
  letters.split('').forEach((key, i) => {
    const decay = 0.04 + (i % 5) * 0.025
    const volume = 0.35 + (i % 3) * 0.035
    keys[key] = {
      sound: {
        type: 'synth',
        waveform: waveforms[i % waveforms.length],
        decay: Math.min(0.14, decay),
        volume: Math.min(0.45, volume),
        attack: 0.005,
      },
      visualPresetId: presetForKey(i),
    }
  })
  return { id: 'drums', name: 'Drums', description: 'Punchy, short beats.', keys }
}

function makePadsKit(): Kit {
  const keys: Record<string, KeyDef> = {}
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  letters.split('').forEach((key, i) => {
    const decay = 0.5 + (i % 6) * 0.1
    const volume = 0.22 + (i % 4) * 0.02
    const waveform: Waveform = i % 10 < 7 ? 'sine' : 'triangle'
    keys[key] = {
      sound: {
        type: 'synth',
        waveform,
        decay: Math.min(1, decay),
        volume: Math.min(0.28, volume),
        attack: 0.06,
      },
      visualPresetId: presetForKey(i),
    }
  })
  return { id: 'pads', name: 'Pads', description: 'Long, dreamy tones.', keys }
}

export const KITS: Record<KitId, Kit> = {
  bleeps: makeBleepsKit(),
  drums: makeDrumsKit(),
  pads: makePadsKit(),
}

export const KIT_IDS: KitId[] = ['bleeps', 'drums', 'pads']
