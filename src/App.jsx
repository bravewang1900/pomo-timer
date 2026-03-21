import { useEffect, useState } from 'react'
import './App.css'
import Layout from './components/Layout/Layout'
import SettingsModal from './components/SettingsModal/SettingsModal'
import StatsView from './components/StatsView/StatsView'
import TaskList from './components/TaskList/TaskList'
import Timer from './components/Timer/Timer'
import { useHistory } from './hooks/useHistory'
import { useSettings } from './hooks/useSettings'
import { useTasks } from './hooks/useTasks'
import { useTimer } from './hooks/useTimer'

const COPY = {
  zh: {
    layout: {
      settings: '⚙️ 设置',
      stats: '📊 统计',
      themeDark: '🌙 深色',
      themeLight: '☀️ 浅色',
      menu: '☰ 菜单',
      closeMenu: '✕ 关闭',
      language: 'EN',
    },
    timer: {
      modes: {
        work: '专注',
        shortBreak: '短休息',
        longBreak: '长休息',
      },
      start: '开始',
      pause: '暂停',
      reset: '重置',
      currentTask: '正在专注：',
      selectTask: '选择一个任务开始专注',
      ariaTime: '当前剩余时间',
    },
    tasks: {
      eyebrow: 'Focus Tasks',
      title: '',
      toggle: '任务',
      count: (count) => `${count} 项`,
      placeholder: '添加任务...',
      add: '添加',
      empty: '还没有任务，添加一个开始吧。',
      progress: (completed, target) => `🍅 ${completed}/${target}`,
      delete: '删除',
    },
    settings: {
      title: '设置',
      workMinutes: '专注时长（分钟）',
      shortBreakMinutes: '短休息时长（分钟）',
      longBreakMinutes: '长休息时长（分钟）',
      pomosBeforeLongBreak: '几个番茄后长休息',
      volume: '音量',
      preview: '试听',
      cancel: '取消',
      save: '保存',
    },
    stats: {
      today: '今日数据',
      week: '本周',
      record: '历史最高记录',
      todaySummary: (count) => `${count} 个番茄 = ${count * 25} 分钟`,
      pomos: (count) => `${count} 个番茄`,
      weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    },
  },
  en: {
    layout: {
      settings: '⚙️ Settings',
      stats: '📊 Stats',
      themeDark: '🌙 Dark',
      themeLight: '☀️ Light',
      menu: '☰ Menu',
      closeMenu: '✕ Close',
      language: '中文',
    },
    timer: {
      modes: {
        work: 'Focus',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
      },
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      currentTask: 'Focusing:',
      selectTask: 'Choose a task to start focusing',
      ariaTime: 'Time remaining',
    },
    tasks: {
      eyebrow: 'Focus Tasks',
      title: '',
      toggle: 'Tasks',
      count: (count) => `${count} items`,
      placeholder: 'Add a task...',
      add: 'Add',
      empty: 'No tasks yet. Add one to begin.',
      progress: (completed, target) => `🍅 ${completed}/${target}`,
      delete: 'Delete',
    },
    settings: {
      title: 'Settings',
      workMinutes: 'Focus duration (min)',
      shortBreakMinutes: 'Short break (min)',
      longBreakMinutes: 'Long break (min)',
      pomosBeforeLongBreak: 'Pomodoros before long break',
      volume: 'Volume',
      preview: 'Preview',
      cancel: 'Cancel',
      save: 'Save',
    },
    stats: {
      today: 'Today',
      week: 'This Week',
      record: 'Best Record',
      todaySummary: (count) => `${count} pomodoros = ${count * 25} min`,
      pomos: (count) => `${count} pomodoros`,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  },
}

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isStatsView, setIsStatsView] = useState(false)
  const [locale, setLocale] = useState('zh')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'dark')
  const [isTaskListExpanded, setIsTaskListExpanded] = useState(false)
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
  const copy = COPY[locale]
  const layoutLabels = {
    ...copy.layout,
    theme: theme === 'dark' ? copy.layout.themeLight : copy.layout.themeDark,
  }
  const timer = useTimer({
    ...settings,
    locale,
    onComplete: (currentMode) => {
      if (currentMode === 'work' && activeTaskId) {
        incrementPomo(activeTaskId)
      }

      if (currentMode === 'work') {
        recordPomo()
      }
    },
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 481px)')

    const handleViewportChange = (event) => {
      if (event.matches) {
        setIsTaskListExpanded(true)
      } else {
        setIsTaskListExpanded(false)
      }
    }

    handleViewportChange(mediaQuery)

    mediaQuery.addEventListener('change', handleViewportChange)

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isFormField =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (isFormField) {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()

        if (timer.isRunning) {
          timer.pause()
          return
        }

        timer.start()
        return
      }

      if (event.key.toLowerCase() === 'r') {
        timer.reset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [timer])

  return (
    <Layout
      labels={layoutLabels}
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
      onToggleTheme={() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
      }}
      onToggleLanguage={() => {
        setLocale((current) => (current === 'zh' ? 'en' : 'zh'))
      }}
    >
      {isStatsView ? (
        <StatsView history={history} todayCount={todayCount} labels={copy.stats} />
      ) : (
        <>
          <Timer
            settings={settings}
            selectedTask={activeTask?.title ?? ''}
            labels={copy.timer}
            {...timer}
          />
          {timer.mode === 'work' ? (
            <button
              type="button"
              className="taskListToggle"
              onClick={() => {
                setIsTaskListExpanded((current) => !current)
              }}
            >
              {copy.tasks.toggle}
            </button>
          ) : null}
          <div
            className={`taskListShell ${
              timer.mode === 'work' ? 'taskListShellVisible' : 'taskListShellHidden'
            } ${isTaskListExpanded ? 'taskListShellExpanded' : 'taskListShellCollapsed'}`}
          >
            <TaskList
              tasks={tasks}
              activeTaskId={activeTaskId}
              labels={copy.tasks}
              onAdd={addTask}
              onDelete={deleteTask}
              onToggleDone={toggleDone}
              onSetActive={setActiveTask}
            />
          </div>
        </>
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        labels={copy.settings}
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
