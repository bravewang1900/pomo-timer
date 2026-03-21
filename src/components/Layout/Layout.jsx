import styles from './Layout.module.css'

function Layout({
  children,
  labels,
  onGoHome,
  onOpenSettings,
  onToggleStats,
  onToggleLanguage,
}) {
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
            {labels.settings}
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onToggleStats}
          >
            {labels.stats}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.languageButton}`}
            onClick={onToggleLanguage}
          >
            {labels.language}
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Layout
