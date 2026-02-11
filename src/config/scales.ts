/**
 * Scale definitions: array of semitone offsets from root (e.g. C).
 * Keys A–Z map to indices into this array (wrapping by scale length).
 */

export type ScaleId = 'pentatonic' | 'major' | 'minor' | 'chromatic'

export interface Scale {
  id: ScaleId
  name: string
  /** Layman-friendly one-liner for UI */
  description?: string
  /** Semitone offsets from root (e.g. [0, 2, 4, 7, 9] = C pentatonic) */
  intervals: number[]
}

export const SCALES: Record<ScaleId, Scale> = {
  pentatonic: {
    id: 'pentatonic',
    name: 'Pentatonic',
    description: 'Smooth and easy; few wrong notes.',
    intervals: [0, 2, 4, 7, 9],
  },
  major: {
    id: 'major',
    name: 'Major',
    description: 'Bright and happy; familiar.',
    intervals: [0, 2, 4, 5, 7, 9, 11],
  },
  minor: {
    id: 'minor',
    name: 'Minor',
    description: 'Calm, a bit sad.',
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  chromatic: {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'All notes; experimental.',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
}

/** A4 = 440 Hz. Base octave for the board (e.g. 4 = A4's octave). */
const BASE_OCTAVE = 4

/** Get frequency in Hz for a note index (0 = first note in scale, 1 = second, etc.). */
export function noteIndexToFrequency(
  noteIndex: number,
  scale: Scale,
  octaveOffset: number = 0
): number {
  const len = scale.intervals.length
  const octave = Math.floor(noteIndex / len) + BASE_OCTAVE + octaveOffset
  const degree = ((noteIndex % len) + len) % len
  const semitones = scale.intervals[degree] + (octave - 4) * 12
  return 440 * Math.pow(2, (semitones - 9) / 12)
}
