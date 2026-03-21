import { useState } from 'react'
import Layout from './components/Layout/Layout'
import SettingsModal from './components/SettingsModal/SettingsModal'
import StatsView from './components/StatsView/StatsView'
import TaskList from './components/TaskList/TaskList'
import Timer from './components/Timer/Timer'
import { useHistory } from './hooks/useHistory'
import { useSettings } from './hooks/useSettings'
import { useTasks } from './hooks/useTasks'
import { useTimer } from './hooks/useTimer'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isStatsView, setIsStatsView] = useState(false)
  const { settings, updateSettings } = useSettings()
  const { history, todayCount, recordPomo } = useHistory()
  const {
    tasks,
    activeTaskId,
    addTask,
    deleteTask,
    toggleDone,
    incrementPomo,
    setActiveTask,
  } = useTasks()
  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? null
  const timer = useTimer({
    ...settings,
    onComplete: (currentMode) => {
      if (currentMode === 'work' && activeTaskId) {
        incrementPomo(activeTaskId)
      }

      if (currentMode === 'work') {
        recordPomo()
      }
    },
  })

  return (
    <Layout
      onGoHome={() => {
        setIsStatsView(false)
        setIsSettingsOpen(false)
      }}
      onOpenSettings={() => {
        setIsSettingsOpen(true)
      }}
      onToggleStats={() => {
        setIsStatsView((current) => !current)
      }}
    >
      {isStatsView ? (
        <StatsView history={history} todayCount={todayCount} />
      ) : (
        <>
          <Timer
            settings={settings}
            selectedTask={activeTask?.title ?? ''}
            {...timer}
          />
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onAdd={addTask}
            onDelete={deleteTask}
            onToggleDone={toggleDone}
            onSetActive={setActiveTask}
          />
        </>
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false)
        }}
        settings={settings}
        onSave={updateSettings}
      />
    </Layout>
  )
}

export default App
