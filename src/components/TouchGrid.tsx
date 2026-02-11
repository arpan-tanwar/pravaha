import { useCallback } from 'react'

const KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('')

interface TouchGridProps {
  onTriggerKey: (key: string) => void
  /** Show compact grid on small screens only when true */
  showAlways?: boolean
}

export function TouchGrid({ onTriggerKey, showAlways = false }: TouchGridProps) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const key = (e.currentTarget as HTMLButtonElement).dataset.key
      if (key) onTriggerKey(key)
    },
    [onTriggerKey]
  )

  return (
    <div
      className={`touch-grid ${showAlways ? 'touch-grid--always' : ''}`}
      role="group"
      aria-label="On-screen keys"
    >
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="touch-grid-key"
          data-key={key}
          onPointerDown={handlePointerDown}
          aria-label={`Key ${key.toUpperCase()}`}
        >
          {key.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
