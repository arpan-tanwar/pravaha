import { useEffect, useRef, useImperativeHandle, forwardRef, useRef as useRefReact } from 'react'
import { createVisualEngine, type VisualEngine, type VisualContext } from './engine'
import type { KeyMapEntry } from '../config/keyMap'

export type { VisualContext }

export interface VisualEngineHandle {
  trigger(key: string): void
  getMood(): number
}

interface CanvasProps {
  getKeyMap: () => Map<string, KeyMapEntry>
  getVisualContext: () => VisualContext
}

const Canvas = forwardRef<VisualEngineHandle, CanvasProps>(function Canvas(
  { getKeyMap, getVisualContext },
  ref
) {
  const canvasRef = useRefReact<HTMLCanvasElement>(null)
  const engineRef = useRef<VisualEngine | null>(null)

  useImperativeHandle(ref, () => ({
    trigger(key: string) {
      engineRef.current?.trigger(key)
    },
    getMood() {
      return engineRef.current?.getMood?.() ?? 0
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getMap = () => {
      const map = getKeyMap()
      const out = new Map<string, { visualPresetId: string }>()
      map.forEach((entry, k) => out.set(k, { visualPresetId: entry.visualPresetId }))
      return out
    }

    engineRef.current = createVisualEngine(canvas, getMap, getVisualContext)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [canvasRef, getKeyMap, getVisualContext])

  return (
    <canvas
      ref={canvasRef}
      width={typeof window !== 'undefined' ? window.innerWidth : 800}
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden
    />
  )
})

export default Canvas
