/**
 * Preset tune demos: name, description, and events (t in ms, key).
 * Same event shape as recording so playback logic can be reused.
 */

export interface TuneEvent {
  t: number
  key: string
}

export interface Tune {
  id: string
  name: string
  description?: string
  events: TuneEvent[]
}

export const TUNES: Tune[] = [
  {
    id: 'stairway',
    name: 'Stairway',
    description: 'Scale up and back. Play the keys below to copy it.',
    events: [
      { t: 0, key: 'a' },
      { t: 280, key: 's' },
      { t: 560, key: 'd' },
      { t: 840, key: 'f' },
      { t: 1120, key: 'g' },
      { t: 1400, key: 'a' },
      { t: 1680, key: 'g' },
      { t: 1960, key: 'f' },
      { t: 2240, key: 'd' },
      { t: 2520, key: 's' },
      { t: 2800, key: 'a' },
    ],
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Short and bouncy. Follow the keys and play along.',
    events: [
      { t: 0, key: 'd' },
      { t: 180, key: 'f' },
      { t: 420, key: 'g' },
      { t: 720, key: 'g' },
      { t: 1100, key: 'f' },
      { t: 1400, key: 'd' },
      { t: 1700, key: 's' },
      { t: 2100, key: 'a' },
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'High phrase, then low answer. Try the keys yourself.',
    events: [
      { t: 0, key: 'g' },
      { t: 220, key: 'a' },
      { t: 440, key: 'g' },
      { t: 700, key: 'd' },
      { t: 920, key: 'f' },
      { t: 1140, key: 'd' },
      { t: 1400, key: 's' },
      { t: 1680, key: 'a' },
    ],
  },
  {
    id: 'chime',
    name: 'Chime',
    description: 'Slow and calm. Click Play, then play the keys below.',
    events: [
      { t: 0, key: 'd' },
      { t: 80, key: 'f' },
      { t: 160, key: 'a' },
      { t: 800, key: 'g' },
      { t: 1500, key: 'd' },
    ],
  },
]
