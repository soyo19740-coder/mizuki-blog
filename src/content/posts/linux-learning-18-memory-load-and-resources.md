---
title: "第 18 节：内存、负载与资源排查"
published: 2026-08-26T21:57:33+08:00
description: 学习查看内存、Swap、CPU 和系统负载，按资源占用定位进程，并使用 vmstat 观察系统指标。
image: ''
tags: [Linux, 内存, 负载, CPU, Swap, vmstat, 资源排查]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 18 节：内存、负载与资源排查

## 学习目标

- 查看内存、Swap、CPU 和系统负载。
- 按 CPU 或内存占用排序进程。
- 使用 `vmstat` 观察系统级资源指标。
- 在安全范围内启动并结束测试进程。

## 核心命令

| 命令 | 作用 |
|---|---|
| `free -h` | 以易读单位查看内存和 Swap |
| `free -h -w` | 展开显示 buffers、cache 等字段 |
| `uptime` | 查看运行时间、登录用户和 1/5/15 分钟负载 |
| `top` | 实时查看进程、CPU、内存和负载，按 `q` 退出 |
| `ps aux --sort=-%cpu \| head` | 查看 CPU 占用较高的进程 |
| `ps aux --sort=-%mem \| head` | 查看内存占用较高的进程 |
| `vmstat 1 5` | 每秒采样一次，共 5 次 |

## 实际结果

### 内存

执行 `free -h` 和 `free -h -w` 后，实际约为：

```text
Mem: 15Gi total, 737Mi used, 14Gi free, 14Gi available
Swap: 4.0Gi total, 0B used
```

`available` 比单独的 `free` 更适合判断程序当前还能使用多少内存，因为 Linux 会将空闲内存用于缓存。

### 负载

```bash
uptime
```

实际负载约为：

```text
load average: 0.03, 0.03, 0.00
```

三项分别是最近 1 分钟、5 分钟和 15 分钟的平均负载，不是 CPU 百分比。

### 进程排序

```bash
ps aux --sort=-%cpu | head
ps aux --sort=-%mem | head
```

成功按 CPU 和内存占用排序，观察到 `containerd`、`dockerd` 等系统进程位于列表前部。`head` 只显示前几行，避免完整列表刷屏。

### `top`

`top` 显示了进程数量、运行/睡眠状态、CPU 空闲率、内存、Swap 和各进程资源占用；按 `q` 退出。实际 CPU 空闲约 100%，Swap 未使用。

### `vmstat`

```bash
vmstat 1 5
```

实际观察到 `si`、`so` 均为 0，CPU `id` 约 100%，`r`、`b` 均为 0，未见明显 Swap、运行队列或阻塞堆积。

## 安全测试进程

启动 `sleep 120` 后记录真实 PID `1260`，用 `ps` 和 `top` 观察，最后执行：

```bash
kill -TERM 1260
```

进程正常结束。

`kill -TERM 你的PID` 中的“你的PID”只是课程占位符，不能直接输入；必须替换为已核对的真实 PID。输出中的 `-: command not found` 是多输入了一个短横线，不影响本节结果。

## 资源排查思路

1. `free -h` 看可用内存和 Swap。
2. `uptime` 看近期负载趋势。
3. `ps` 找 CPU 或内存占用较高的进程。
4. `top` 实时观察变化。
5. `vmstat` 判断交换、IO、运行队列和 CPU 是否异常。
6. 只对自己启动并确认 PID 的测试进程执行 `kill`。

## 验收速查

| 任务 | 命令 |
|---|---|
| 查看内存和 Swap | `free -h` |
| 查看负载 | `uptime` |
| 按 CPU 排序 | `ps aux --sort=-%cpu \| head` |
| 按内存排序 | `ps aux --sort=-%mem \| head` |
| 资源采样 | `vmstat 1 5` |
| 实时观察 | `top`，按 `q` 退出 |

## 本节状态

已完成实操验收。重点记忆：判断内存优先看 `available`，判断负载看 `uptime` 的三个平均值，判断具体进程用 `ps`/`top`，判断 Swap 和 IO 活动用 `vmstat`。
