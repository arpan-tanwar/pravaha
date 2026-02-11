import { useEffect, useCallback } from 'react'

const MAPPED_KEYS = new Set(
  'abcdefghijklmnopqrstuvwxyz'.split('')
)

export function useKeyTrigger(triggerKey: (key: string) => void): void {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!MAPPED_KEYS.has(key)) return
      e.preventDefault()
      triggerKey(key)
    },
    [triggerKey]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
