import { useState } from 'react'
import styles from './TaskList.module.css'

function TaskList({
  tasks,
  activeTaskId,
  onAdd,
  onDelete,
  onToggleDone,
  onSetActive,
}) {
  const [title, setTitle] = useState('')
  const [targetPomos, setTargetPomos] = useState(1)

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
      <div className={styles.composer}>
        <input
          className={styles.input}
          type="text"
          placeholder="添加任务..."
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
          添加
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className={styles.empty}>还没有任务，添加一个开始吧。</p>
      ) : (
        <div className={styles.items}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.item} ${
                activeTaskId === task.id ? styles.itemActive : ''
              }`}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleDone(task.id)}
              />
              <div className={styles.content}>
                <button
                  type="button"
                  className={`${styles.titleButton} ${
                    task.done ? styles.titleDone : ''
                  }`}
                  onClick={() => onSetActive(task.id)}
                >
                  {task.title}
                </button>
                <div className={styles.progress}>
                  {`🍅 ${task.completedPomos}/${task.targetPomos}`}
                </div>
              </div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onDelete(task.id)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TaskList
