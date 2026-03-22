import { useEffect, useState } from 'react'
import styles from './TaskList.module.css'

const COLLAPSED_LIMIT = 5

function TaskList({
  tasks,
  activeTaskId,
  labels,
  onAdd,
  onDelete,
  onToggleDone,
  onSetActive,
  onReorder,
}) {
  const [title, setTitle] = useState('')
  const [targetPomos, setTargetPomos] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragTargetTaskId, setDragTargetTaskId] = useState(null)
  const hasOverflow = tasks.length > COLLAPSED_LIMIT
  const visibleTasks =
    hasOverflow && !isExpanded
      ? tasks.slice(0, COLLAPSED_LIMIT)
      : tasks

  useEffect(() => {
    if (!hasOverflow && isExpanded) {
      setIsExpanded(false)
    }
  }, [hasOverflow, isExpanded])

  useEffect(() => {
    if (!visibleTasks.some((task) => task.id === dragTargetTaskId)) {
      setDragTargetTaskId(null)
    }
  }, [dragTargetTaskId, visibleTasks])

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
        <>
          <div className={styles.items}>
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className={`${styles.item} ${
                  activeTaskId === task.id ? styles.itemActive : ''
                } ${draggedTaskId === task.id ? styles.itemDragging : ''} ${
                  dragTargetTaskId === task.id ? styles.itemDropTarget : ''
                }`}
                draggable
                onDragStart={(event) => {
                  setDraggedTaskId(task.id)
                  setDragTargetTaskId(task.id)
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', task.id)
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  if (draggedTaskId && draggedTaskId !== task.id) {
                    event.dataTransfer.dropEffect = 'move'
                    setDragTargetTaskId(task.id)
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  const sourceTaskId = event.dataTransfer.getData('text/plain') || draggedTaskId
                  onReorder(sourceTaskId, task.id)
                  setDraggedTaskId(null)
                  setDragTargetTaskId(null)
                }}
                onDragEnd={() => {
                  setDraggedTaskId(null)
                  setDragTargetTaskId(null)
                }}
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
                <div
                  className={styles.dragHandle}
                  aria-label={labels.drag}
                  title={labels.drag}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  <span />
                  <span />
                  <span />
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
          {hasOverflow && !isExpanded ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => {
                  setIsExpanded(true)
                }}
              >
                {labels.expand(tasks.length - COLLAPSED_LIMIT)}
              </button>
            </div>
          ) : null}
          {hasOverflow && isExpanded ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => {
                  setIsExpanded(false)
                }}
              >
                {labels.collapse}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

export default TaskList
