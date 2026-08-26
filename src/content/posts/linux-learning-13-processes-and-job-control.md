---
title: "第 13 节：进程查看与前后台任务"
published: 2026-08-26T10:15:01+08:00
description: 学习使用 ps、pgrep 和 top 查看进程，并通过 jobs、Ctrl+Z、bg 与 fg 管理前后台任务。
image: ''
tags: [Linux, 进程, PID, ps, pgrep, top, jobs, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 学习目标

- 使用 `ps`、`pgrep` 和 `top` 查看进程。
- 理解 PID、PPID、前台任务与后台任务。
- 使用 `jobs`、`Ctrl+Z`、`bg` 和 `fg` 管理当前 Shell 的任务。

## 核心命令

| 命令或操作 | 作用 |
| --- | --- |
| `ps` | 查看当前 Shell 相关进程 |
| `ps -f` | 显示更完整的进程信息 |
| `ps aux` | 查看系统中更全面的进程列表 |
| `ps aux \| head` | 查看进程列表前几行 |
| `pgrep -a name` | 按名称查找进程并显示命令行 |
| `command &` | 在后台启动命令 |
| `jobs -l` | 查看当前 Shell 任务及 PID |
| `Ctrl+Z` | 暂停前台任务 |
| `bg` | 让暂停任务在后台继续 |
| `fg` | 把后台任务恢复到前台 |
| `top` | 实时查看进程和资源 |

## 核心概念

- 进程是正在运行的程序实例。
- PID 是进程 ID；PPID 是父进程 ID。
- 前台任务占用当前终端；后台任务允许继续输入命令。
- `$!` 表示最近一个后台任务的 PID。

## 实际练习

练习目录：`~/linux-learning/lesson-13`

查看进程：

```bash
ps
ps -f
ps aux | head
```

后台任务：

```bash
sleep 120 &
jobs -l
echo $!
pgrep -a sleep
```

实际得到过后台任务 PID `23274`，`jobs -l` 显示其状态为 `Running`。

前后台切换：运行 `sleep 120`，按 `Ctrl+Z` 后任务变为 `Stopped`，再执行：

```bash
jobs -l
bg
jobs -l
fg
```

恢复到前台后按 `Ctrl+C` 结束测试进程。

最终执行：

```bash
jobs
pgrep -a sleep
```

两者均无输出，说明测试任务已结束。

实时查看：执行 `top`，观察进程、CPU、内存和负载，按 `q` 退出。

## 练习中的观察

- `pgrep -a sleep` 没有输出可能是因为 `sleep 120` 已结束。
- `ps aux | head` 通过管道只显示进程列表开头部分。
- 本节没有使用 `kill`；后续会先说明信号和风险，再控制安全测试进程。

## 验收速查

| 任务 | 命令或操作 |
| --- | --- |
| 查看当前 Shell 进程 | `ps` |
| 查看详细进程信息 | `ps -f` |
| 查看系统进程 | `ps aux` |
| 启动后台任务 | `sleep 120 &` |
| 查看任务和 PID | `jobs -l` |
| 查看最近后台 PID | `echo $!` |
| 暂停前台任务 | `Ctrl+Z` |
| 后台继续 | `bg` |
| 恢复前台 | `fg` |
| 实时监控进程 | `top`，按 `q` 退出 |

## 本节状态

已完成实操验收。重点记忆：先用 `ps`/`pgrep` 定位进程，再用 `jobs`、`bg`、`fg` 管理当前 Shell 任务。
