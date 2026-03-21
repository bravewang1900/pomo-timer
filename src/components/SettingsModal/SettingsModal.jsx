import { useEffect, useState } from 'react'
import { playNotification } from '../../utils/sound'
import styles from './SettingsModal.module.css'

function SettingsModal({ isOpen, labels, onClose, settings, onSave }) {
  const [formState, setFormState] = useState(settings)

  useEffect(() => {
    setFormState(settings)
  }, [settings, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleChange = (key, value) => {
    setFormState((current) => ({
      ...current,
      [key]: Number(value),
    }))
  }

  const handleSave = () => {
    onSave(formState)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <h2 className={styles.title}>{labels.title}</h2>
        <div className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>{labels.workMinutes}</span>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="60"
              value={formState.workMinutes}
              onChange={(event) => handleChange('workMinutes', event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.shortBreakMinutes}</span>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="30"
              value={formState.shortBreakMinutes}
              onChange={(event) =>
                handleChange('shortBreakMinutes', event.target.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.longBreakMinutes}</span>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="60"
              value={formState.longBreakMinutes}
              onChange={(event) => handleChange('longBreakMinutes', event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.pomosBeforeLongBreak}</span>
            <input
              className={styles.input}
              type="number"
              min="2"
              max="8"
              value={formState.pomosBeforeLongBreak}
              onChange={(event) =>
                handleChange('pomosBeforeLongBreak', event.target.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.volume}</span>
            <div className={styles.rangeRow}>
              <input
                className={styles.range}
                type="range"
                min="0"
                max="100"
                value={formState.volume}
                onChange={(event) => handleChange('volume', event.target.value)}
              />
              <button
                type="button"
                className={styles.previewButton}
                onClick={() => {
                  playNotification(formState.volume)
                }}
              >
                {labels.preview}
              </button>
              <span className={styles.value}>{formState.volume}</span>
            </div>
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              {labels.cancel}
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSave}
            >
              {labels.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
