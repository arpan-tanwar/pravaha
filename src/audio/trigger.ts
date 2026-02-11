/**
 * playKey(key) → lookup note + sample/synth, play sound.
 * Uses pre-built key map from config (scale + kit).
 */

import { getAudioContext } from './context'
import type { KeyMapEntry } from '../config/keyMap'
import type { SynthParams } from '../config/kits'

export function playKey(
  key: string,
  keyMap: Map<string, KeyMapEntry>,
  mood?: number
): void {
  const entry = keyMap.get(key.toLowerCase())
  if (!entry) return

  const ac = getAudioContext()

  if (entry.sound.type === 'synth') {
    playSynth(ac, entry.frequency, entry.sound, mood ?? 0)
  }
  // Future: entry.sound.type === 'sample' -> playSample(ac, entry.sound)
}

const minFadeIn = 0.003
const releaseTail = 0.01

function playSynth(
  ac: AudioContext,
  frequency: number,
  params: SynthParams,
  mood: number
): void {
  const osc = ac.createOscillator()
  const gain = ac.createGain()

  const attack = params.attack != null && params.attack > 0 ? params.attack : 0
  const effectiveAttack = Math.max(attack, minFadeIn)
  const t0 = ac.currentTime
  const decayStart = t0 + effectiveAttack
  const endTime = decayStart + params.decay
  const stopTime = endTime + releaseTail

  osc.type = params.waveform
  osc.frequency.setValueAtTime(frequency, t0)
  if (params.detuneCents != null) {
    osc.detune.setValueAtTime(params.detuneCents, t0)
  }
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(params.volume, decayStart)
  gain.gain.exponentialRampToValueAtTime(0.001, endTime)

  osc.connect(gain)
  gain.connect(ac.destination)

  osc.start(t0)
  osc.stop(stopTime)

  if (mood > 0) {
    const subOsc = ac.createOscillator()
    const subGain = ac.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(frequency / 2, t0)
    subGain.gain.setValueAtTime(0, t0)
    subGain.gain.linearRampToValueAtTime(mood * 0.2, decayStart)
    subGain.gain.exponentialRampToValueAtTime(0.001, endTime)
    subOsc.connect(subGain)
    subGain.connect(ac.destination)
    subOsc.start(t0)
    subOsc.stop(stopTime)
  }
}
