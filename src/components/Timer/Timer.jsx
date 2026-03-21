import styles from './Timer.module.css'

const MODE_LABELS = {
  work: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
}

function getTotalSeconds(settings, mode) {
  const minutesByMode = {
    work: settings.workMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }

  return Math.max(0, Math.floor((minutesByMode[mode] ?? 0) * 60))
}

function formatTime(timeLeft) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function Timer({
  settings,
  selectedTask,
  mode,
  timeLeft,
  isRunning,
  completedPomos,
  start,
  pause,
  reset,
  switchMode,
}) {
  const totalSeconds = getTotalSeconds(settings, mode)
  const radius = 100
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)

  return (
    <section className={styles.timer}>
      <div className={styles.tabs}>
        {Object.entries(MODE_LABELS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`${styles.tab} ${mode === value ? styles.tabActive : ''}`}
            onClick={() => switchMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.progress}>
        <svg
          className={styles.progressSvg}
          width="240"
          height="240"
          viewBox="0 0 240 240"
          aria-label={`当前剩余时间 ${formatTime(timeLeft)}`}
          role="img"
        >
          <circle className={styles.track} cx="120" cy="120" r={radius} />
          <circle
            className={styles.indicator}
            cx="120"
            cy="120"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className={styles.time}>{formatTime(timeLeft)}</div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={isRunning ? pause : start}
        >
          {isRunning ? '暂停' : '开始'}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={reset}>
          重置
        </button>
      </div>

      <p className={styles.taskHint}>
        {selectedTask
          ? `正在专注：${selectedTask}`
          : '选择一个任务开始专注'}
      </p>
    </section>
  )
}

export default Timer
