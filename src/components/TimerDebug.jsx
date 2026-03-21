import { useState } from 'react'
import { useTimer } from '../hooks/useTimer'

function TimerDebug() {
  const [lastCompletedMode, setLastCompletedMode] = useState('none')
  const settings = {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    pomosBeforeLongBreak: 4,
    onComplete: (currentMode) => {
      setLastCompletedMode(currentMode)
    },
  }
  const timer = useTimer(settings)

  return (
    <div>
      <h1>Timer Debug</h1>
      <p>mode: {timer.mode}</p>
      <p>timeLeft: {timer.timeLeft}</p>
      <p>isRunning: {String(timer.isRunning)}</p>
      <p>completedPomos: {timer.completedPomos}</p>
      <p>lastCompletedMode: {lastCompletedMode}</p>
      <button type="button" onClick={timer.start}>
        start()
      </button>
      <button type="button" onClick={timer.pause}>
        pause()
      </button>
      <button type="button" onClick={timer.reset}>
        reset()
      </button>
      <button type="button" onClick={() => timer.switchMode('work')}>
        switchMode('work')
      </button>
      <button type="button" onClick={() => timer.switchMode('shortBreak')}>
        switchMode('shortBreak')
      </button>
      <button type="button" onClick={() => timer.switchMode('longBreak')}>
        switchMode('longBreak')
      </button>
    </div>
  )
}

export default TimerDebug
