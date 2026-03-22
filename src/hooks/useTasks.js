import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pomo_tasks'

function createTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readStoredTasks() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return {
      tasks: [],
      activeTaskId: null,
    }
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    const storedTasks = Array.isArray(parsedValue.tasks) ? parsedValue.tasks : []
    const normalizedTasks = storedTasks.map((task, index) => ({
      ...task,
      createdAt:
        Number.isFinite(task?.createdAt) && task.createdAt > 0
          ? task.createdAt
          : index,
    }))

    return {
      tasks: normalizedTasks.sort(
        (left, right) => (right.createdAt ?? 0) - (left.createdAt ?? 0),
      ),
      activeTaskId: parsedValue.activeTaskId ?? null,
    }
  } catch {
    return {
      tasks: [],
      activeTaskId: null,
    }
  }
}

export function useTasks() {
  const [{ tasks, activeTaskId }, setTaskState] = useState(() => readStoredTasks())

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, activeTaskId }),
    )
  }, [activeTaskId, tasks])

  const addTask = (title, targetPomos) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const nextTask = {
      id: createTaskId(),
      createdAt: Date.now(),
      title: trimmedTitle,
      targetPomos: Number(targetPomos),
      completedPomos: 0,
      done: false,
    }

    setTaskState((current) => ({
      tasks: [nextTask, ...current.tasks],
      activeTaskId: current.activeTaskId ?? nextTask.id,
    }))
  }

  const deleteTask = (id) => {
    setTaskState((current) => ({
      tasks: current.tasks.filter((task) => task.id !== id),
      activeTaskId: current.activeTaskId === id ? null : current.activeTaskId,
    }))
  }

  const toggleDone = (id) => {
    setTaskState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }))
  }

  const incrementPomo = (id) => {
    if (!id) {
      return
    }

    setTaskState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id
          ? { ...task, completedPomos: task.completedPomos + 1 }
          : task,
      ),
    }))
  }

  const setActiveTask = (id) => {
    setTaskState((current) => ({
      ...current,
      activeTaskId: id,
    }))
  }

  const reorderTasks = (draggedTaskId, targetTaskId) => {
    if (!draggedTaskId || !targetTaskId || draggedTaskId === targetTaskId) {
      return
    }

    setTaskState((current) => {
      const draggedIndex = current.tasks.findIndex((task) => task.id === draggedTaskId)
      const targetIndex = current.tasks.findIndex((task) => task.id === targetTaskId)

      if (draggedIndex < 0 || targetIndex < 0) {
        return current
      }

      const nextTasks = [...current.tasks]
      const [draggedTask] = nextTasks.splice(draggedIndex, 1)
      nextTasks.splice(targetIndex, 0, draggedTask)

      return {
        ...current,
        tasks: nextTasks,
      }
    })
  }

  return {
    tasks,
    activeTaskId,
    addTask,
    deleteTask,
    toggleDone,
    incrementPomo,
    setActiveTask,
    reorderTasks,
  }
}
