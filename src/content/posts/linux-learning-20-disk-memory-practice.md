---
title: "第 20 节：磁盘与内存综合实战"
published: 2026-09-01T09:36:02+08:00
description: 将 df、du、free、uptime 和进程排序命令串成一套磁盘与内存快速排障流程。
image: ''
tags: [Linux, 磁盘, 内存, 排障, df, du, free]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 20 节：磁盘与内存综合实战（精简版）

## 目标

把磁盘和内存指标串成一个快速排障流程。

## 排障流程

```bash
df -h
du -h --max-depth=1 目录 | sort -hr | head
free -h
uptime
ps aux --sort=-%mem | head
```

- `df -h`：文件系统整体空间。
- `du`：目录/文件占用；`sort -hr` 倒序找大项。
- `free -h`：内存和 Swap，重点看 `available`。
- `uptime`：1、5、15 分钟负载。
- `ps ... --sort=-%mem`：找内存占用高的进程。

## 最小实战

```bash
cd ~/linux-learning
df -h /
du -h --max-depth=1 . | sort -hr | head
free -h
uptime
```

判断原则：磁盘问题先看 `df` 再用 `du` 定位；内存问题看 `available` 和 Swap；高负载再用 `ps`/`top` 找进程。
