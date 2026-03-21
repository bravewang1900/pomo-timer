import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pomo_settings'

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomosBeforeLongBreak: 4,
  volume: 80,
}

function readSettings() {
  const storedSettings = window.localStorage.getItem(STORAGE_KEY)

  if (!storedSettings) {
    return DEFAULT_SETTINGS
  }

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(storedSettings),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(() => readSettings())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings((current) => ({
      ...current,
      ...newSettings,
    }))
  }

  return {
    settings,
    updateSettings,
  }
}
