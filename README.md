# Pomo Timer

Pomo Timer is a lightweight Pomodoro app built with React and Vite. It combines a focus timer, task management, simple statistics, and local persistence in a single small client-side project.

English is the default language in this README. A Chinese version is included below.

## Overview

This project is designed for focused work sessions with a minimal workflow:

- Start a Pomodoro timer for focus sessions and breaks
- Switch automatically between focus, short break, and long break modes
- Manage a task list and mark one task as active
- Reorder tasks with drag and drop
- Collapse long task lists when there are more than 5 items
- Store settings, tasks, theme, and history in `localStorage`
- View simple daily and weekly statistics
- Toggle language and theme in the UI

## Features

### Timer

- Default schedule: `25 / 5 / 15` minutes
- Automatic mode transitions:
  - `work -> short break`
  - `work -> long break` after the configured number of Pomodoros
  - `break -> work`
- Accurate countdown refresh while running
- Notification sound on stage completion
- Document title updates with the current remaining time
- Keyboard shortcuts:
  - `Space`: start / pause
  - `R`: reset

### Tasks

- Add tasks with a target Pomodoro count
- Select the active task for the current focus session
- Increment completed Pomodoros automatically when a focus session finishes
- Drag to reorder tasks
- Latest tasks appear at the top by default
- Auto-collapse when there are more than 5 tasks

### Settings and Persistence

- Change:
  - focus duration
  - short break duration
  - long break duration
  - Pomodoros before long break
  - notification volume
- Persist data locally in the browser:
  - timer settings
  - tasks
  - focus history
  - theme

## Tech Stack

- React 19
- Vite 8
- CSS Modules
- ESLint

## Screenshots

Add your screenshots to `docs/screenshots/` and keep the filenames below, or update the paths in this section.

### Home

![Home screen](docs/screenshots/home-en.png)

### Task List

![Task list and drag sorting](docs/screenshots/tasks-en.png)

### Settings

![Settings panel](docs/screenshots/settings-en.png)

## Getting Started

### Requirements

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    Layout/
    SettingsModal/
    StatsView/
    TaskList/
    Timer/
  hooks/
    useHistory.js
    useSettings.js
    useTasks.js
    useTimer.js
  utils/
    sound.js
```

## Notes

- This app is currently fully client-side.
- There is no backend or cloud sync.
- Data is tied to the current browser via `localStorage`.

## Roadmap Ideas

- Drag-handle-only sorting
- Better mobile drag interactions
- Export / import local data
- Richer focus analytics
- Task scheduling and forecasting

---

# Pomo Timer 中文说明

Pomo Timer 是一个基于 React 和 Vite 构建的轻量级番茄钟应用，集成了专注计时、任务管理、基础统计和本地持久化功能。

## 项目简介

这个项目面向日常专注场景，提供一套简单直接的工作流：

- 使用番茄钟进行专注和休息切换
- 在专注、短休息、长休息之间自动切换
- 管理任务列表，并指定当前专注任务
- 通过拖拽调整任务顺序
- 当任务超过 5 个时自动折叠
- 使用 `localStorage` 保存设置、任务、主题和历史记录
- 查看今日和本周统计数据
- 在界面中切换语言和主题

## 功能特性

### 计时器

- 默认时长为 `25 / 5 / 15` 分钟
- 自动模式切换：
  - `专注 -> 短休息`
  - 达到设定番茄数后 `专注 -> 长休息`
  - `休息 -> 专注`
- 计时运行时持续刷新显示
- 阶段完成后播放提示音
- 浏览器标签标题会显示剩余时间
- 键盘快捷键：
  - `Space`：开始 / 暂停
  - `R`：重置

### 任务

- 添加任务并设置目标番茄数
- 选择当前专注任务
- 专注阶段结束后自动累加该任务的完成番茄数
- 支持拖拽排序
- 默认新任务显示在最上方
- 任务超过 5 个时自动折叠

### 设置与本地存储

- 可配置：
  - 专注时长
  - 短休息时长
  - 长休息时长
  - 长休息前所需番茄数
  - 提示音音量
- 以下数据会保存在浏览器本地：
  - 计时设置
  - 任务列表
  - 专注历史
  - 主题

## 技术栈

- React 19
- Vite 8
- CSS Modules
- ESLint

## 截图

你可以将项目截图放到 `docs/screenshots/` 目录，并沿用下面的文件名；如果文件名不同，修改此处路径即可。

### 首页

![首页截图](docs/screenshots/home-zh.png)

### 任务列表

![任务列表与拖拽排序](docs/screenshots/tasks-zh.png)

### 设置面板

![设置面板](docs/screenshots/settings-zh.png)

## 本地运行

### 环境要求

- 建议 Node.js 18+
- npm

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 目录结构

```text
src/
  components/
    Layout/
    SettingsModal/
    StatsView/
    TaskList/
    Timer/
  hooks/
    useHistory.js
    useSettings.js
    useTasks.js
    useTimer.js
  utils/
    sound.js
```

## 说明

- 当前项目为纯前端应用
- 没有后端服务或云端同步
- 数据通过 `localStorage` 绑定在当前浏览器中
