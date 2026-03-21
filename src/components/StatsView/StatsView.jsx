import styles from './StatsView.module.css'

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getRecentDays(history) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))

    const key = getDateKey(date)

    return {
      key,
      label: WEEKDAY_LABELS[date.getDay()],
      count: history[key] ?? 0,
    }
  })
}

function getHighestRecord(history) {
  const entries = Object.entries(history)

  if (entries.length === 0) {
    return {
      date: '-',
      count: 0,
    }
  }

  const [date, count] = entries.reduce((highest, current) =>
    current[1] > highest[1] ? current : highest,
  )

  return {
    date,
    count,
  }
}

function StatsView({ history, todayCount }) {
  const recentDays = getRecentDays(history)
  const maxCount = Math.max(...recentDays.map((day) => day.count), 1)
  const highestRecord = getHighestRecord(history)

  return (
    <section className={styles.stats}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>今日数据</h2>
        <p className={styles.bigNumber}>{todayCount}</p>
        <p className={styles.subText}>{`${todayCount} 个番茄 = ${todayCount * 25} 分钟`}</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>本周</h2>
        <div className={styles.chart}>
          {recentDays.map((day) => (
            <div key={day.key} className={styles.barGroup}>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                  title={`${day.count}`}
                ></div>
              </div>
              <div className={styles.dayLabel}>{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>历史最高记录</h2>
        <p className={styles.recordValue}>{`${highestRecord.count} 个番茄`}</p>
        <p className={styles.subText}>{highestRecord.date}</p>
      </div>
    </section>
  )
}

export default StatsView
