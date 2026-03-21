import styles from './Layout.module.css'

function Layout({ children, onGoHome, onOpenSettings, onToggleStats }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button type="button" className={styles.logoButton} onClick={onGoHome}>
          <span className={styles.logo}>Pomo 🍅</span>
        </button>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onOpenSettings}
          >
            ⚙️ 设置
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onToggleStats}
          >
            📊 统计
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Layout
