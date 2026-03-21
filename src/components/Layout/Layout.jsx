import { useState } from 'react'
import styles from './Layout.module.css'

function Layout({
  children,
  labels,
  onGoHome,
  onOpenSettings,
  onToggleStats,
  onToggleTheme,
  onToggleLanguage,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAction = (callback) => {
    callback()
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button type="button" className={styles.logoButton} onClick={onGoHome}>
          <span className={styles.logo}>Pomo 🍅</span>
        </button>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => {
            setIsMenuOpen((current) => !current)
          }}
        >
          {isMenuOpen ? labels.closeMenu : labels.menu}
        </button>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => handleAction(onOpenSettings)}
          >
            {labels.settings}
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => handleAction(onToggleStats)}
          >
            {labels.stats}
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => handleAction(onToggleTheme)}
          >
            {labels.theme}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.languageButton}`}
            onClick={() => handleAction(onToggleLanguage)}
          >
            {labels.language}
          </button>
        </div>
        {isMenuOpen ? (
          <div className={styles.mobileMenu}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => handleAction(onOpenSettings)}
            >
              {labels.settings}
            </button>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => handleAction(onToggleStats)}
            >
              {labels.stats}
            </button>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => handleAction(onToggleTheme)}
            >
              {labels.theme}
            </button>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => handleAction(onToggleLanguage)}
            >
              {labels.language}
            </button>
          </div>
        ) : null}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Layout
