/**
 * Builds key -> note index and key -> sound/visual from scale + kit.
 * Used by audio trigger and canvas engine.
 */

import type { ScaleId } from './scales'
import type { KitId } from './kits'
import { SCALES, noteIndexToFrequency } from './scales'
import { KITS } from './kits'
import type { SoundParams } from './kits'

const KEY_ORDER = 'abcdefghijklmnopqrstuvwxyz'

export interface KeyMapEntry {
  key: string
  noteIndex: number
  frequency: number
  sound: SoundParams
  visualPresetId: string
}

/** Get note index for a key (0–25 maps into scale repeatedly). */
export function getNoteIndexForKey(key: string): number {
  const i = KEY_ORDER.indexOf(key.toLowerCase())
  return i >= 0 ? i : 0
}

/** Full key map for current scale + kit (for playKey and canvas). */
export function buildKeyMap(scaleId: ScaleId, kitId: KitId): Map<string, KeyMapEntry> {
  const scale = SCALES[scaleId]
  const kit = KITS[kitId]
  const map = new Map<string, KeyMapEntry>()

  KEY_ORDER.split('').forEach((key, index) => {
    const def = kit.keys[key]
    if (!def) return
    const noteIndex = index
    const frequency = noteIndexToFrequency(noteIndex, scale)
    map.set(key, {
      key,
      noteIndex,
      frequency,
      sound: def.sound,
      visualPresetId: def.visualPresetId,
    })
  })

  return map
}
