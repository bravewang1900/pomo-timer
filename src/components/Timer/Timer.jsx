import { useEffect, useMemo, useRef } from 'react'
import styles from './Timer.module.css'

function getTotalSeconds(settings, mode) {
  const minutesByMode = {
    work: settings.workMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }

  return Math.max(0, Math.floor((minutesByMode[mode] ?? 0) * 60))
}

function formatTime(timeLeft) {
  const wholeSeconds = Math.max(0, Math.ceil(timeLeft))
  const minutes = Math.floor(wholeSeconds / 60)
  const seconds = wholeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function Timer({
  settings,
  selectedTask,
  labels,
  mode,
  timeLeft,
  isRunning,
  start,
  pause,
  reset,
  switchMode,
}) {
  const haloRef = useRef(null)
  const innerPulseRef = useRef(null)
  const indicatorRef = useRef(null)
  const indicatorGhostRef = useRef(null)
  const visualFrameRef = useRef(0)
  const visualEndTimeRef = useRef(null)
  const lastModeRef = useRef(mode)
  const modeLabels = useMemo(() => labels?.modes ?? {}, [labels])
  const totalSeconds = getTotalSeconds(settings, mode)
  const radius = 100
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)
  const progressClassName = [
    styles.progress,
    styles[`progress${mode.charAt(0).toUpperCase()}${mode.slice(1)}`],
    isRunning ? styles.progressRunning : styles.progressIdle,
  ].join(' ')
  const accentColor = mode === 'work' ? '#E05252' : '#4CAF50'
  const pulseStateClass = isRunning ? styles.running : styles.paused
  const accentRgb = mode === 'work' ? '224, 82, 82' : '76, 175, 80'
  const pulseDuration = mode === 'work' ? '4s' : '6s'
  const haloClassName = [styles.halo, isRunning ? styles.haloRunning : styles.haloPaused].join(' ')

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const resetAnimationPhase = (element, runningClassName) => {
      if (!element) {
        return
      }

      element.classList.remove(runningClassName)
      window.requestAnimationFrame(() => {
        element.classList.add(runningClassName)
      })
    }

    resetAnimationPhase(haloRef.current, styles.haloRunning)
    resetAnimationPhase(innerPulseRef.current, styles.running)

    return undefined
  }, [isRunning, mode])

  useEffect(() => {
    const applyDashOffset = (nextDashOffset) => {
      if (indicatorRef.current) {
        indicatorRef.current.style.strokeDashoffset = `${nextDashOffset}`
      }

      if (indicatorGhostRef.current) {
        indicatorGhostRef.current.style.strokeDashoffset = `${nextDashOffset}`
      }
    }

    const stopVisualAnimation = () => {
      if (visualFrameRef.current) {
        window.cancelAnimationFrame(visualFrameRef.current)
        visualFrameRef.current = 0
      }
    }

    if (lastModeRef.current !== mode) {
      visualEndTimeRef.current = null
      lastModeRef.current = mode
    }

    if (!isRunning || totalSeconds <= 0) {
      stopVisualAnimation()
      applyDashOffset(dashOffset)
      visualEndTimeRef.current = null
      return undefined
    }

    visualEndTimeRef.current = performance.now() + timeLeft * 1000

    const animate = () => {
      const remainingSeconds = Math.max(
        0,
        (visualEndTimeRef.current - performance.now()) / 1000,
      )
      const nextProgress = remainingSeconds / totalSeconds
      const nextDashOffset = circumference * (1 - nextProgress)

      applyDashOffset(nextDashOffset)

      if (remainingSeconds > 0) {
        visualFrameRef.current = window.requestAnimationFrame(animate)
      }
    }

    visualFrameRef.current = window.requestAnimationFrame(animate)

    return () => {
      stopVisualAnimation()
    }
  }, [circumference, dashOffset, isRunning, mode, timeLeft, totalSeconds])

  return (
    <section className={styles.timer}>
      <div className={styles.tabs}>
        {Object.entries(modeLabels).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`${styles.tab} ${mode === value ? styles.tabActive : ''}`}
            style={mode === value ? { '--tab-accent': accentColor } : undefined}
            onClick={() => switchMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.progressFrame}>
        <div
          ref={haloRef}
          className={haloClassName}
          style={{
            '--timer-accent': accentColor,
            '--timer-accent-rgb': accentRgb,
            '--timer-pulse-duration': pulseDuration,
          }}
          aria-hidden="true"
        />
        <div
          className={progressClassName}
          style={{
            '--timer-accent': accentColor,
            '--timer-accent-rgb': accentRgb,
            '--timer-pulse-duration': pulseDuration,
          }}
        >
          <div className={styles.shell} aria-hidden="true" />
          <div
            ref={innerPulseRef}
            className={`${styles.innerPulse} ${pulseStateClass}`}
            aria-hidden="true"
          />
          <div className={styles.innerGlow} aria-hidden="true" />
          <div className={styles.centerDisk} aria-hidden="true" />
          <svg
            className={styles.progressSvg}
            width="240"
            height="240"
            viewBox="0 0 240 240"
            aria-label={`${labels.ariaTime} ${formatTime(timeLeft)}`}
            role="img"
          >
            <circle
              className={styles.track}
              cx="120"
              cy="120"
              r={radius}
            />
            <circle className={styles.trackInner} cx="120" cy="120" r="88" />
            <circle
              ref={indicatorRef}
              className={styles.indicator}
              cx="120"
              cy="120"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
            <circle
              ref={indicatorGhostRef}
              className={styles.indicatorGhost}
              cx="120"
              cy="120"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className={styles.timeBlock}>
            <div className={styles.time}>{formatTime(timeLeft)}</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          style={{ '--color': accentColor }}
          onClick={isRunning ? pause : start}
        >
          {isRunning ? labels.pause : labels.start}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          style={{ '--color': accentColor }}
          onClick={reset}
        >
          {labels.reset}
        </button>
      </div>

      {mode === 'work' ? (
        <p className={styles.taskHint}>
          {selectedTask
            ? `${labels.currentTask} ${selectedTask}`
            : labels.selectTask}
        </p>
      ) : null}
    </section>
  )
}

export default Timer
