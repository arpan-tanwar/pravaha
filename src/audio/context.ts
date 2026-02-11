/**
 * AudioContext lifecycle: create once, resume on first user gesture.
 */

let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  return ctx
}

export function resumeAudioContext(): Promise<void> {
  const context = getAudioContext()
  if (context.state === 'suspended') {
    return context.resume()
  }
  return Promise.resolve()
}

export function isSuspended(): boolean {
  return ctx?.state === 'suspended'
}
