import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'pomo_history'

function getTodayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function readHistory() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : {}
  } catch {
    return {}
  }
}

export function useHistory() {
  const [history, setHistory] = useState(() => readHistory())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const todayCount = useMemo(() => history[getTodayKey()] ?? 0, [history])

  const recordPomo = () => {
    const todayKey = getTodayKey()

    setHistory((current) => ({
      ...current,
      [todayKey]: (current[todayKey] ?? 0) + 1,
    }))
  }

  return {
    history,
    todayCount,
    recordPomo,
  }
}
