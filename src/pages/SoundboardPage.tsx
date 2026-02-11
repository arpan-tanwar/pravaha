import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { buildKeyMap } from '../config/keyMap'
import { SCALES, type ScaleId } from '../config/scales'
import { KITS, KIT_IDS, type KitId } from '../config/kits'
import { TUNES, type Tune } from '../config/tunes'
import { resumeAudioContext } from '../audio/context'
import { playKey } from '../audio/trigger'
import { useKeyTrigger } from '../hooks/useKeyTrigger'
import Canvas, { type VisualEngineHandle } from '../visuals/Canvas'
import { TouchGrid } from '../components/TouchGrid'
import '../App.css'

interface RecordedEvent {
  t: number
  key: string
}

export function SoundboardPage() {
  const [scaleId, setScaleId] = useState<ScaleId>('pentatonic')
  const [kitId, setKitId] = useState<KitId>('bleeps')
  const [isRecording, setIsRecording] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playLoopEnabled, setPlayLoopEnabled] = useState(false)
  const [optionsExpanded, setOptionsExpanded] = useState(true)
  const playTimeoutsRef = useRef<number[]>([])
  const loopTimeoutRef = useRef<number | null>(null)
  const playLoopEnabledRef = useRef(playLoopEnabled)
  const isPlayingRef = useRef(isPlaying)
  const keyMap = useMemo(() => buildKeyMap(scaleId, kitId), [scaleId, kitId])
  const keyMapRef = useRef(keyMap)
  const contextRef = useRef({ scaleId, kitId })
  useEffect(() => {
    playLoopEnabledRef.current = playLoopEnabled
    isPlayingRef.current = isPlaying
    keyMapRef.current = keyMap
    contextRef.current = { scaleId, kitId }
  })
  const getKeyMap = useCallback(() => keyMapRef.current, [])
  const getVisualContext = useCallback(() => contextRef.current, [])
  const visualRef = useRef<VisualEngineHandle | null>(null)
  const eventsRef = useRef<RecordedEvent[]>([])
  const previousEventsRef = useRef<RecordedEvent[]>([])
  const recordStartRef = useRef(0)

  const triggerKey = useCallback(
    (key: string, fromReplay = false) => {
      const map = keyMapRef.current
      if (!map.has(key.toLowerCase())) return
      if (!fromReplay && isRecording) {
        eventsRef.current.push({
          t: performance.now() - recordStartRef.current,
          key: key.toLowerCase(),
        })
        setEventCount(eventsRef.current.length)
      }
      resumeAudioContext().then(() => {
        setOptionsExpanded(false)
        visualRef.current?.trigger(key)
        const mood = visualRef.current?.getMood?.() ?? 0
        playKey(key, map, mood)
      })
    },
    [isRecording]
  )

  /* Sync recorded events and count when recording toggles: clear on start, restore on stop */
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional: sync event count when recording toggles */
    if (isRecording) {
      previousEventsRef.current = eventsRef.current.slice()
      eventsRef.current = []
      recordStartRef.current = performance.now()
      setEventCount(0)
    } else {
      if (eventsRef.current.length === 0) {
        eventsRef.current = previousEventsRef.current.slice()
        setEventCount(eventsRef.current.length)
      }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isRecording])

  const handleRecordToggle = useCallback(() => {
    if (isPlaying) return
    setIsRecording((r) => !r)
  }, [isPlaying])

  const handleStop = useCallback(() => {
    playTimeoutsRef.current.forEach((id) => clearTimeout(id))
    playTimeoutsRef.current = []
    if (loopTimeoutRef.current != null) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
    }
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const handlePlay = useCallback(() => {
    const events = eventsRef.current.slice()
    if (events.length === 0 || isPlaying || isRecording) return
    isPlayingRef.current = true
    setIsPlaying(true)
    const lastT = events.length ? events[events.length - 1].t : 0
    const gap = 400

    function runPass(): void {
      playTimeoutsRef.current = []
      events.forEach((ev) => {
        const id = window.setTimeout(() => {
          triggerKey(ev.key, true)
        }, ev.t)
        playTimeoutsRef.current.push(id)
      })
      const finalId = window.setTimeout(() => {
        if (!isPlayingRef.current || !playLoopEnabledRef.current) {
          setIsPlaying(false)
          isPlayingRef.current = false
          return
        }
        runPass()
      }, lastT + gap)
      playTimeoutsRef.current.push(finalId)
      loopTimeoutRef.current = finalId
    }

    runPass()
  }, [isPlaying, isRecording, triggerKey])

  const handlePlayTune = useCallback(
    (tune: Tune) => {
      if (isPlaying || isRecording) return
      playTimeoutsRef.current.forEach((id) => clearTimeout(id))
      playTimeoutsRef.current = []
      if (loopTimeoutRef.current != null) {
        clearTimeout(loopTimeoutRef.current)
        loopTimeoutRef.current = null
      }
      isPlayingRef.current = true
      setIsPlaying(true)
      const events = tune.events
      const lastT = events.length ? events[events.length - 1].t : 0
      const gap = 400
      events.forEach((ev) => {
        const id = window.setTimeout(() => triggerKey(ev.key, true), ev.t)
        playTimeoutsRef.current.push(id)
      })
      const finalId = window.setTimeout(() => {
        isPlayingRef.current = false
        setIsPlaying(false)
      }, lastT + gap)
      playTimeoutsRef.current.push(finalId)
    },
    [isPlaying, isRecording, triggerKey]
  )

  useKeyTrigger(triggerKey)

  useEffect(() => {
    if (!showHelp) return
    const closeHelp = () => setShowHelp(false)
    const id = window.setTimeout(() => {
      document.addEventListener('click', closeHelp)
      document.addEventListener('keydown', closeHelp)
    }, 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('click', closeHelp)
      document.removeEventListener('keydown', closeHelp)
    }
  }, [showHelp])

  return (
    <div className="page-fullscreen">
      <div className="app">
        <Canvas ref={visualRef} getKeyMap={getKeyMap} getVisualContext={getVisualContext} />
        <div className="overlay" aria-hidden>
          <div className="top-section">
            <header className="header-bar">
              <Link to="/" className="back-link" aria-label="Back to gallery">
                ← Gallery
              </Link>
              <button
                type="button"
                className="title-btn"
                onClick={() => setOptionsExpanded((e) => !e)}
                aria-expanded={optionsExpanded}
                aria-controls="options-menu"
                aria-label={optionsExpanded ? 'Collapse options' : 'Expand options'}
              >
                <span className="app-title">SoundBoard</span>
                <span className="title-chevron" aria-hidden>
                  {optionsExpanded ? ' −' : ' +'}
                </span>
              </button>
              <div className="header-actions" role="group" aria-label="Actions">
                <button
                  type="button"
                  className={`control-btn control-btn--record ${isRecording ? 'control-btn--active' : ''}`}
                  onClick={handleRecordToggle}
                  disabled={isPlaying}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording && <span className="record-dot" aria-hidden />}
                  {isRecording ? 'Stop' : 'Record'}
                </button>
                {isPlaying ? (
                  <button
                    type="button"
                    className="control-btn control-btn--stop"
                    onClick={handleStop}
                    aria-label="Stop playback"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    className="control-btn control-btn--play"
                    onClick={handlePlay}
                    disabled={eventCount === 0}
                    aria-label="Play back recording"
                  >
                    Play{eventCount > 0 ? ` (${eventCount})` : ''}
                  </button>
                )}
                <button
                  type="button"
                  className={`control-btn control-btn--loop ${playLoopEnabled ? 'control-btn--active' : ''}`}
                  onClick={() => setPlayLoopEnabled((l) => !l)}
                  disabled={eventCount === 0}
                  aria-pressed={playLoopEnabled}
                  aria-label={playLoopEnabled ? 'Loop on' : 'Loop off'}
                  title="Loop playback"
                >
                  Loop
                </button>
                <div className="help-trigger-wrap">
                  <button
                    type="button"
                    className="control-btn control-btn--help"
                    onClick={() => setShowHelp((h) => !h)}
                    aria-label="Help"
                    aria-expanded={showHelp}
                    title="Help"
                  >
                    ?
                  </button>
                  {showHelp && (
                    <div className="help-dropdown" role="dialog" aria-label="Help">
                      <div className="help-content">
                        <p>A–Z keys trigger sounds and visuals. Change scale and kit to change the mood.</p>
                        <p>Record your sequence, then press Play to replay it.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <div
              id="options-menu"
              className={`options-dropdown ${optionsExpanded ? 'options-dropdown--open' : ''}`}
              role="region"
              aria-label="Options"
            >
              <div className="control-panel">
                <p className="app-hint panel-hint">Listen to a tune, then play the keys to copy it.</p>
                <section className="panel-section tune-demos" role="region" aria-label="Try a tune">
                  <h2 className="panel-section-title">Try a tune</h2>
                  <p className="panel-section-subline">Click Play, then try the keys yourself.</p>
                  <div className="tune-demos-list">
                    {TUNES.map((tune) => (
                      <div key={tune.id} className="tune-card">
                        <div className="tune-card-head">
                          <span className="tune-card-name">{tune.name}</span>
                          <button
                            type="button"
                            className="control-btn control-btn--tune-play"
                            onClick={() => handlePlayTune(tune)}
                            disabled={isPlaying || isRecording}
                            aria-label={`Play tune ${tune.name}`}
                          >
                            Play
                          </button>
                        </div>
                        {tune.description && (
                          <p className="tune-card-desc">{tune.description}</p>
                        )}
                        <div
                          className="tune-keys"
                          aria-label={`Keys to play: ${tune.events.map((e) => e.key.toUpperCase()).join(', ')}`}
                        >
                          {tune.events.map((ev, i) => (
                            <span key={`${i}-${ev.t}`} className="tune-key">
                              {ev.key.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="panel-section" role="group" aria-label="Sound">
                  <h2 className="panel-section-title">Sound</h2>
                  <p className="panel-section-subline">What kind of sound do you want?</p>
                  <div className="pill-group">
                    {KIT_IDS.map((id) => (
                      <button
                        key={id}
                        type="button"
                        className={`pill ${kitId === id ? 'pill--selected' : ''}`}
                        onClick={() => setKitId(id)}
                        aria-pressed={kitId === id}
                        aria-label={KITS[id].description ? `${KITS[id].name}: ${KITS[id].description}` : `Sound: ${KITS[id].name}`}
                        title={KITS[id].description}
                      >
                        {KITS[id].name}
                      </button>
                    ))}
                  </div>
                  {KITS[kitId].description && (
                    <p className="panel-option-desc" aria-live="polite">{KITS[kitId].description}</p>
                  )}
                </section>
                <section className="panel-section" role="group" aria-label="Mood">
                  <h2 className="panel-section-title">Mood</h2>
                  <p className="panel-section-subline">Bright or calm?</p>
                  <div className="pill-group">
                    {Object.values(SCALES).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`pill ${scaleId === s.id ? 'pill--selected' : ''}`}
                        onClick={() => setScaleId(s.id)}
                        aria-pressed={scaleId === s.id}
                        aria-label={s.description ? `${s.name}: ${s.description}` : `Mood: ${s.name}`}
                        title={s.description}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  {SCALES[scaleId].description && (
                    <p className="panel-option-desc" aria-live="polite">{SCALES[scaleId].description}</p>
                  )}
                </section>
              </div>
            </div>
          </div>
          <TouchGrid onTriggerKey={(k) => triggerKey(k, false)} />
        </div>
      </div>
    </div>
  )
}
