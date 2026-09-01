---
title: "第 17 节：磁盘使用率、目录大小与挂载点"
published: 2026-08-26T21:46:44+08:00
description: 学习使用 df、du 和 findmnt 检查磁盘空间、目录占用与挂载关系，并理解稀疏文件的逻辑大小和实际占用。
image: ''
tags: [Linux, 磁盘, df, du, findmnt, 挂载点, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 17 节：磁盘使用率、目录大小与挂载点

## 学习目标

- 使用 `df` 查看文件系统整体空间。
- 使用 `du` 查找目录和文件占用。
- 使用 `findmnt` 查看挂载关系。
- 理解 WSL、Windows 盘和 Snap 挂载的输出。
- 区分稀疏文件的逻辑大小与实际磁盘占用。

## 核心命令

| 命令 | 作用 |
|---|---|
| `df -h` | 以易读单位查看文件系统空间 |
| `df -hT` | 同时显示文件系统类型 |
| `du -sh .` | 汇总当前目录实际占用 |
| `du -h --max-depth=1 .` | 查看当前目录及第一层子目录大小 |
| `du -h --max-depth=1 . \| sort -h` | 按大小排序，末尾通常是最大目录 |
| `findmnt` | 查看挂载点、来源、类型和选项 |
| `ls -lh file` | 查看文件逻辑大小 |

## 实际结果

### 文件系统空间

```bash
df -h
```

关键结果：

```text
/dev/sdd  1007G  14G  943G   2% /
C:\       130G   111G 20G   85% /mnt/c
D:\       347G   106G 242G  31% /mnt/d
```

WSL 根文件系统 `/` 使用率约 2%；Windows C 盘通过 `/mnt/c` 挂载，使用率 85%，更值得关注。

### 文件系统类型

```bash
df -hT
```

根目录为 `ext4`；Windows C/D 盘通过 `9p` 挂载；多个 WSL 系统目录使用 `tmpfs`、`overlay` 等类型。

曾输入 `df -ht`，报错原因是小写 `-t` 需要额外指定文件系统类型。查看类型应使用大写 `-T`。

### 课程目录大小

```bash
du -sh .
```

课程目录总占用为 `176K`。

```bash
du -h --max-depth=1 . | sort -h
```

排序后最大的课节目录为 `lesson-01`，占用 `36K`。

### 挂载关系

```bash
findmnt
```

确认 `/dev/sdd` 挂载到 `/`，Windows 盘挂载到 `/mnt/c`、`/mnt/d`，Snap 镜像挂载到 `/snap/...`。

`/snap/...` 的 `100%` 通常是只读 Snap 镜像本身已用满，不代表根文件系统或 Windows 磁盘已满。

## 稀疏文件实验

```bash
mkdir -p ~/linux-learning/lesson-17
cd ~/linux-learning/lesson-17
truncate -s 20M demo-large.bin
du -h demo-large.bin
ls -lh demo-large.bin
```

实际结果：`ls -lh` 显示逻辑大小 `20M`，而 `du -h` 显示 `0`。这是因为稀疏文件尚未写入数据，逻辑大小和实际占用不同。

## 输入问题

- 多次输入 `cd lesson-1` 后，Shell 显示 `lesson-10/` 等补全候选，是因为前缀匹配多个目录；应输入完整目录名 `cd lesson-17`。
- `cd 。。` 使用了中文全角句号，不是 Linux 的父目录符号；正确写法是 `cd ..`。

## 验收速查

| 任务 | 命令 |
|---|---|
| 查看文件系统空间 | `df -h` |
| 查看文件系统类型 | `df -hT` |
| 查看目录总占用 | `du -sh .` |
| 查看一级目录大小 | `du -h --max-depth=1 .` |
| 排序找大目录 | `du -h --max-depth=1 . \| sort -h` |
| 查看挂载关系 | `findmnt` |
| 查看逻辑文件大小 | `ls -lh demo-large.bin` |

## 本节状态

已完成实操验收。重点记忆：`df` 看文件系统整体空间，`du` 看目录/文件占用，`findmnt` 看挂载关系；稀疏文件的逻辑大小和实际占用可能不同。
