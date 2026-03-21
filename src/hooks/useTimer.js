import { useEffect, useMemo, useRef, useState } from 'react'
import { playNotification, playTick } from '../utils/sound'

const MODE_LABELS = {
  zh: {
    work: '专注中',
    shortBreak: '短休息',
    longBreak: '长休息',
  },
  en: {
    work: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  },
}

function getModeSeconds(settings, mode) {
  const minutesByMode = {
    work: settings.workMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }

  const minutes = Number(minutesByMode[mode] ?? 0)

  if (!Number.isFinite(minutes) || minutes < 0) {
    return 0
  }

  return Math.floor(minutes * 60)
}

function formatTime(value) {
  const wholeSeconds = Math.max(0, Math.ceil(value))
  const minutes = Math.floor(wholeSeconds / 60)
  const seconds = wholeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getNextStage(currentMode, currentCompletedPomos, settings) {
  if (currentMode === 'work') {
    const nextCompletedPomos = currentCompletedPomos + 1
    const shouldUseLongBreak =
      nextCompletedPomos % settings.pomosBeforeLongBreak === 0

    return {
      mode: shouldUseLongBreak ? 'longBreak' : 'shortBreak',
      completedPomos: nextCompletedPomos,
    }
  }

  return {
    mode: 'work',
    completedPomos: currentCompletedPomos,
  }
}

function advanceTimerState(state, elapsedSeconds, settings, onStageComplete) {
  let nextMode = state.mode
  let nextTimeLeft = state.timeLeft
  let nextCompletedPomos = state.completedPomos
  let remainingSeconds = elapsedSeconds

  while (remainingSeconds > 0 && nextTimeLeft > 0) {
    if (remainingSeconds < nextTimeLeft) {
      nextTimeLeft -= remainingSeconds
      remainingSeconds = 0
      break
    }

    remainingSeconds -= nextTimeLeft
    onStageComplete(nextMode)

    const nextStage = getNextStage(nextMode, nextCompletedPomos, settings)
    nextMode = nextStage.mode
    nextCompletedPomos = nextStage.completedPomos
    nextTimeLeft = getModeSeconds(settings, nextMode)

    if (nextTimeLeft <= 0) {
      break
    }
  }

  return {
    mode: nextMode,
    timeLeft: nextTimeLeft,
    completedPomos: nextCompletedPomos,
  }
}

export function useTimer(settings) {
  const locale = settings.locale === 'en' ? 'en' : 'zh'
  const normalizedSettings = useMemo(
    () => ({
      workMinutes: settings.workMinutes,
      shortBreakMinutes: settings.shortBreakMinutes,
      longBreakMinutes: settings.longBreakMinutes,
      pomosBeforeLongBreak: Math.max(1, Number(settings.pomosBeforeLongBreak) || 1),
      volume: Math.max(0, Math.min(100, Number(settings.volume) || 0)),
      onComplete: settings.onComplete,
    }),
    [
      settings.longBreakMinutes,
      settings.onComplete,
      settings.pomosBeforeLongBreak,
      settings.shortBreakMinutes,
      settings.volume,
      settings.workMinutes,
    ],
  )
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(() =>
    getModeSeconds(normalizedSettings, 'work'),
  )
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomos, setCompletedPomos] = useState(0)
  const hasInitializedAudioRef = useRef(false)
  const hiddenAtRef = useRef(null)
  const endTimeRef = useRef(null)
  const stateRef = useRef({
    mode: 'work',
    timeLeft: getModeSeconds(normalizedSettings, 'work'),
    completedPomos: 0,
    isRunning: false,
  })
  const settingsRef = useRef(normalizedSettings)
  const previousSettingsRef = useRef(normalizedSettings)

  useEffect(() => {
    stateRef.current = {
      mode,
      timeLeft,
      completedPomos,
      isRunning,
    }
  }, [completedPomos, isRunning, mode, timeLeft])

  useEffect(() => {
    settingsRef.current = normalizedSettings
  }, [normalizedSettings])

  useEffect(() => {
    const previousSettings = previousSettingsRef.current
    const previousTotal = getModeSeconds(previousSettings, mode)
    const nextTotal = getModeSeconds(normalizedSettings, mode)

    if (previousTotal !== nextTotal) {
      setTimeLeft((current) => {
        const elapsedSeconds = Math.max(0, previousTotal - current)
        return Math.max(0, nextTotal - elapsedSeconds)
      })
    }

    previousSettingsRef.current = normalizedSettings
  }, [mode, normalizedSettings])

  useEffect(() => {
    if (!isRunning) {
      endTimeRef.current = null
      return undefined
    }

    if (!endTimeRef.current) {
      endTimeRef.current = performance.now() + stateRef.current.timeLeft * 1000
    }

    let frameId = 0

    const tick = () => {
      const remainingSeconds = Math.max(
        0,
        (endTimeRef.current - performance.now()) / 1000,
      )

      setTimeLeft(remainingSeconds)

      if (remainingSeconds > 0) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [isRunning])

  useEffect(() => {
    if (!isRunning || timeLeft !== 0) {
      return
    }

    normalizedSettings.onComplete?.(mode)
    playNotification(normalizedSettings.volume)

    if (mode === 'work') {
      const nextCompletedPomos = completedPomos + 1
      const shouldUseLongBreak =
        nextCompletedPomos % normalizedSettings.pomosBeforeLongBreak === 0
      const nextMode = shouldUseLongBreak ? 'longBreak' : 'shortBreak'

      setCompletedPomos(nextCompletedPomos)
      setMode(nextMode)
      setTimeLeft(getModeSeconds(normalizedSettings, nextMode))
      endTimeRef.current = performance.now() + getModeSeconds(normalizedSettings, nextMode) * 1000
      return
    }

    setMode('work')
    setTimeLeft(getModeSeconds(normalizedSettings, 'work'))
    endTimeRef.current = performance.now() + getModeSeconds(normalizedSettings, 'work') * 1000
  }, [completedPomos, isRunning, mode, normalizedSettings, timeLeft])

  useEffect(() => {
    document.title = `[${formatTime(timeLeft)}] ${MODE_LABELS[locale][mode]} — Pomo`
  }, [locale, mode, timeLeft])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (stateRef.current.isRunning) {
          hiddenAtRef.current = Date.now()
        }

        return
      }

      if (!hiddenAtRef.current || !stateRef.current.isRunning) {
        hiddenAtRef.current = null
        return
      }

      const elapsedSeconds = Math.floor((Date.now() - hiddenAtRef.current) / 1000)
      hiddenAtRef.current = null

      if (elapsedSeconds <= 0) {
        return
      }

      const nextState = advanceTimerState(
        stateRef.current,
        elapsedSeconds,
        settingsRef.current,
        (completedMode) => {
          settingsRef.current.onComplete?.(completedMode)
        },
      )

      setMode(nextState.mode)
      setTimeLeft(nextState.timeLeft)
      setCompletedPomos(nextState.completedPomos)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const start = () => {
    if (!hasInitializedAudioRef.current) {
      hasInitializedAudioRef.current = true
      playTick(0)
    }

    endTimeRef.current = performance.now() + stateRef.current.timeLeft * 1000
    setIsRunning(true)
  }

  const pause = () => {
    hiddenAtRef.current = null
    if (endTimeRef.current) {
      setTimeLeft(Math.max(0, (endTimeRef.current - performance.now()) / 1000))
    }
    endTimeRef.current = null
    setIsRunning(false)
  }

  const reset = () => {
    hiddenAtRef.current = null
    endTimeRef.current = null
    setIsRunning(false)
    setTimeLeft(getModeSeconds(normalizedSettings, mode))
  }

  const switchMode = (nextMode) => {
    hiddenAtRef.current = null
    endTimeRef.current = null
    setIsRunning(false)
    setMode(nextMode)
    setTimeLeft(getModeSeconds(normalizedSettings, nextMode))
  }

  return {
    mode,
    timeLeft,
    isRunning,
    completedPomos,
    start,
    pause,
    reset,
    switchMode,
  }
}
