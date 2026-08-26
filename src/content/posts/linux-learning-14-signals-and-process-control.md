---
title: "第 14 节：信号与进程控制"
published: 2026-08-26T10:29:21+08:00
description: 学习 Linux 进程信号，使用 kill 安全控制测试进程，并区分正常终止、强制终止、暂停与继续。
image: ''
tags: [Linux, 进程, 信号, kill, SIGTERM, SIGKILL, SIGSTOP, SIGCONT, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 学习目标

- 理解 PID 和 Linux 进程信号。
- 使用 `kill` 控制自己启动的测试进程。
- 区分正常终止、强制终止、暂停和继续。

## 风险说明

`kill` 会向指定 PID 发送信号，错误 PID 可能终止重要服务。本节只操作自己启动的 `sleep` 测试进程；不要对 PID 1、系统服务或不认识的进程执行 `kill`。

## 信号速查

| 信号 | 编号 | 作用 |
| --- | ---: | --- |
| `SIGTERM` | 15 | 请求程序正常退出，可清理资源 |
| `SIGKILL` | 9 | 强制终止，程序无法捕获，最后手段 |
| `SIGCONT` | 18 | 继续暂停进程 |
| `SIGSTOP` | 19 | 暂停进程 |

`kill PID` 默认发送 `SIGTERM`。

## 核心命令

```bash
kill PID
kill -TERM PID
kill -STOP PID
kill -CONT PID
pgrep -a sleep
ps -p PID -o pid,stat,cmd
kill -l
```

- `pgrep -a sleep` 按名称查找进程并显示 PID 与命令行。
- `ps -p` 指定 PID；`-o` 指定输出字段。
- `kill -l` 列出系统支持的信号。

## 实际练习

练习目录：`~/linux-learning/lesson-14`

启动并正常终止：

```bash
sleep 300 &
pgrep -a sleep
kill -TERM 27775
pgrep -a sleep
```

实际 PID 为 `27775`，`SIGTERM` 成功结束进程。进程结束后再次发送信号会得到 `No such process`，因为 PID 已不存在。

暂停和继续：

```bash
sleep 300 &
kill -STOP 28196
ps -p 28196 -o pid,stat,cmd
kill -CONT 28196
ps -p 28196 -o pid,stat,cmd
kill 28196
```

暂停时输出：

```text
28196 T    sleep 300
```

继续后输出：

```text
28196 S    sleep 300
```

`T` 表示暂停；`S` 表示睡眠/等待状态。最后的 `kill 28196` 使用默认 `SIGTERM` 结束进程。

## 输入问题记录

- `24500`、`228196`、`24600` 是示例 PID 或输入错误，查询无输出或提示 `No such process` 属于正常现象。
- 必须使用 `pgrep -a sleep` 查到当前真实 PID，再发送信号。
- `kill -TERM` 比 `kill -KILL` 更安全，应优先使用前者。

## 实际信号列表验证

`kill -l` 输出确认：

```text
9) SIGKILL
15) SIGTERM
18) SIGCONT
19) SIGSTOP
```

## 验收速查

| 任务 | 命令 |
| --- | --- |
| 正常终止 | `kill -TERM PID` 或 `kill PID` |
| 暂停进程 | `kill -STOP PID` |
| 继续进程 | `kill -CONT PID` |
| 查找进程 PID | `pgrep -a sleep` |
| 查看指定进程状态 | `ps -p PID -o pid,stat,cmd` |
| 列出信号 | `kill -l` |

## 本节状态

已完成实操验收。重点记忆：先确认 PID，再发送 `SIGTERM`；`SIGSTOP` 暂停，`SIGCONT` 继续，`SIGKILL` 仅在必要时使用。
