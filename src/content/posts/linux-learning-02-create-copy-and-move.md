---
title: "第 2 节：创建、复制与移动文件和目录"
published: 2026-07-28T00:30:42+08:00
description: 学习使用 mkdir、touch、cp、mv 创建、复制、重命名和移动 Linux 文件及目录，并通过 ls 验证结果。
image: ''
tags: [Linux, WSL, 文件操作, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-27

## 学习目标

- 创建目录和空文件。
- 复制文件及目录。
- 重命名或移动文件。
- 使用 `ls` 验证文件系统操作结果。

## 核心命令

| 命令 | 解决的问题 | 常用参数或写法 |
|---|---|---|
| `mkdir` | 创建目录 | `mkdir -p a/b` 同时创建父目录 |
| `touch` | 创建空文件；更新已有文件时间 | `touch note.txt` |
| `cp` | 复制文件或目录 | `cp source target`；`cp -r source-dir target-dir` |
| `mv` | 移动或重命名 | `mv old.txt new.txt`；`mv file.txt dir/` |
| `ls` | 验证结果 | `ls -la`；`ls -la dir1 dir2` |

## 关键规则

- `cp 来源 目标`：来源在前，目标在后。
- 复制目录必须使用 `cp -r`；`-r` 表示递归复制目录中的内容。
- `mv old.txt new.txt` 是重命名。
- `mv file.txt directory/` 是将文件移动到目录中。
- 若 `mv` 的目标文件已存在，默认可能覆盖它；操作前应先用 `ls` 检查。

## 实际练习过程

练习位置：

```text
~/linux-learning/lesson-02
```

已完成的核心操作：

```bash
mkdir reports backup
touch note.txt
cp note.txt notes-copy.txt
mv notes-copy.txt archive.txt
mv archive.txt backup/
cp -r backup backup-copy
ls -la
ls -la backup backup-copy
```

最终验证结果表明：

```text
backup/archive.txt
backup-copy/archive.txt
note.txt
reports/
```

这证明文件复制、重命名、移动和目录递归复制均已成功。

## 本节提问与答案

### `cp 02.txt lesson-01` 正确吗？

若目标是复制到同级目录 `~/linux-learning/lesson-01/`，则不正确。

当前位于：

```text
~/linux-learning/lesson-02
```

此时 `lesson-01` 表示当前目录内的路径 `~/linux-learning/lesson-02/lesson-01`。当该路径不存在时，`cp` 会创建一个普通文件副本，而不是进入同级目录。

正确写法：

```bash
cp 02.txt ../lesson-01/
```

`..` 表示上一级目录，因此目标是同级的 `lesson-01` 目录。

### 怎样复制 `.txt` 文件到目录？

通用格式：

```bash
cp 文件名 目录名/
```

示例：

```bash
cp 02.txt backup/
cp 02.txt ../lesson-01/
cp 02.txt backup/lesson-02-notes.txt
```

最后一条在复制时同时改名。

### 怎样确认目标是目录？

```bash
ls -ld backup
```

输出第一个字符为 `d`，例如 `drwxr-xr-x`，说明它是目录；若为 `-`，例如 `-rw-r--r--`，则它是普通文件。

## 出现过的输入问题

| 输入 | 原因 | 正确用法 |
|---|---|---|
| `mkdir lesson-02` 报 `File exists` | 目录已经存在 | 直接 `cd lesson-02`；或使用 `mkdir -p lesson-02` |
| `ls la` | `la` 被当成文件名 | `ls -la` |
| `lls` | Linux 默认没有该命令 | `ls` 或 `ls -la` |
| `lesson-01` 显示为 `-rw-r--r--` | 它是误创建的普通文件 | 同级目录应写为 `../lesson-01/` |

## 验收速查

| 任务 | 命令 |
|---|---|
| 创建多层目录 | `mkdir -p work/linux/logs` |
| 创建空文件 | `touch todo.txt` |
| 复制文件 | `cp a.txt b.txt` |
| 复制目录 | `cp -r source backup` |
| 重命名文件 | `mv old.txt new.txt` |
| 移动文件到目录 | `mv archive.txt backup/` |

## 本节状态

动手练习已完成。应继续记忆：`cp` 的来源在前、目标在后；相对路径中的 `..` 指向上一级目录。
