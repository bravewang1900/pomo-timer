import { useState } from 'react'
import styles from './TaskList.module.css'

function TaskList({
  tasks,
  activeTaskId,
  labels,
  onAdd,
  onDelete,
  onToggleDone,
  onSetActive,
}) {
  const [title, setTitle] = useState('')
  const [targetPomos, setTargetPomos] = useState(1)
  const sortedTasks = [...tasks].sort(
    (left, right) => (right.createdAt ?? 0) - (left.createdAt ?? 0),
  )

  const handleSubmit = () => {
    if (!title.trim()) {
      return
    }

    onAdd(title, targetPomos)
    setTitle('')
    setTargetPomos(1)
  }

  return (
    <section className={styles.taskList}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          {labels.title ? <h2 className={styles.title}>{labels.title}</h2> : null}
        </div>
        <div className={styles.countBadge}>{labels.count(tasks.length)}</div>
      </div>

      <div className={styles.composer}>
        <input
          className={styles.input}
          type="text"
          placeholder={labels.placeholder}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
        <input
          className={styles.numberInput}
          type="number"
          min="1"
          max="10"
          value={targetPomos}
          onChange={(event) => {
            setTargetPomos(Number(event.target.value))
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
        <button type="button" className={styles.addButton} onClick={handleSubmit}>
          {labels.add}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className={styles.empty}>{labels.empty}</p>
      ) : (
        <div className={styles.items}>
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.item} ${
                activeTaskId === task.id ? styles.itemActive : ''
              }`}
              onPointerDown={() => onSetActive(task.id)}
              onClick={() => onSetActive(task.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSetActive(task.id)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleDone(task.id)}
                onClick={(event) => {
                  event.stopPropagation()
                }}
              />
              <div className={styles.content}>
                <button
                  type="button"
                  className={`${styles.titleButton} ${
                    task.done ? styles.titleDone : ''
                  }`}
                  onClick={(event) => {
                    event.stopPropagation()
                    onSetActive(task.id)
                  }}
                >
                  {task.title}
                </button>
                <div className={styles.progress}>
                  {labels.progress(task.completedPomos, task.targetPomos)}
                </div>
              </div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(task.id)
                }}
              >
                {labels.delete}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TaskList
