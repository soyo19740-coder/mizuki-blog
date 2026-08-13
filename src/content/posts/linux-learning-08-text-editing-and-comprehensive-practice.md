---
title: "第 8 节：文本编辑与综合练习"
published: 2026-08-13T17:27:23+08:00
description: 使用 nano 编辑文本，区分覆盖与追加重定向，并综合运用 grep、管道和 wc 进行日志筛选与统计。
image: ''
tags: [Linux, nano, grep, 管道, 重定向, 文本编辑, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-13

## 学习目标

- 使用 `nano` 创建、编辑、保存和退出文本文件。
- 区分 `>` 覆盖写入与 `>>` 追加写入。
- 综合使用 `grep`、管道 `|` 和 `wc -l` 筛选并统计日志。

## 核心命令

| 命令或符号 | 解决的问题 | 用法 |
|---|---|---|
| `nano file` | 在终端编辑文本 | `nano notes.txt` |
| `cat -n file` | 查看文本并显示行号 | `cat -n notes.txt` |
| `>` | 覆盖写入文件 | `command > file` |
| `>>` | 追加写入文件 | `command >> file` |
| `grep` | 搜索或筛选文本行 | `grep ERROR backup.log` |
| `grep -E` | 进行多个条件匹配 | `grep -E "ERROR|WARNING" backup.log` |
| `wc -l` | 统计行数 | `... | wc -l` |

## `nano` 快捷键

| 快捷键 | 作用 |
|---|---|
| `Ctrl+O` | 保存文件 |
| `Enter` | 确认保存的文件名 |
| `Ctrl+X` | 退出编辑器 |
| `Ctrl+W` | 搜索文本 |
| `Ctrl+K` | 剪切当前行 |
| `Ctrl+U` | 粘贴剪切内容 |

在 `nano` 底部的 `^O` 表示 `Ctrl+O`，`^X` 表示 `Ctrl+X`。

## 实际练习记录

练习目录：

```text
~/linux-learning/lesson-08
```

### 使用 `nano` 创建笔记

执行：

```bash
nano notes.txt
```

保存后的实际内容：

```bash
cat -n notes.txt
```

输出：

```text
     1  Linux practice
     2  grep searches text
     3  backup needs verification
```

说明：`nano` 编辑、保存与退出操作已完成。

### 生成并追加日志

执行：

```bash
printf '%s\n' \
'INFO backup started' \
'ERROR source missing' \
'INFO backup finished' \
'WARNING disk nearly full' \
'ERROR permission denied' > backup.log

echo "INFO report generated" >> backup.log
```

`>` 首先创建或覆盖 `backup.log`；`>>` 再将新日志追加到最后一行。

实际日志内容：

```text
     1  INFO backup started
     2  ERROR source missing
     3  INFO backup finished
     4  WARNING disk nearly full
     5  ERROR permission denied
     6  INFO report generated
```

### 综合筛选结果

```bash
grep ERROR backup.log
```

输出两条 `ERROR`：

```text
ERROR source missing
ERROR permission denied
```

```bash
grep -in warning backup.log
```

输出：

```text
4:WARNING disk nearly full
```

`-i` 忽略大小写，`-n` 显示行号。

```bash
grep -v INFO backup.log
```

输出不包含 `INFO` 的三行：两条 `ERROR` 和一条 `WARNING`。

```bash
grep -E "ERROR|WARNING" backup.log | wc -l
```

实际输出：

```text
3
```

说明：`grep -E` 先匹配 `ERROR` 或 `WARNING`，管道将三行匹配结果传给 `wc -l` 统计。

## 本节遇到的问题

### `cat -n 5 notes.txt` 为什么提示 `5` 不存在？

`cat -n` 的作用仅是给**全部输出行**加行号，后面接的是一个或多个文件名。输入：

```bash
cat -n 5 notes.txt
```

Shell 会把 `5` 当成第一个文件名，因此提示：

```text
cat: 5: No such file or directory
```

正确查看带行号内容：

```bash
cat -n notes.txt
```

`cat` 不能按行号只显示指定行；后续可用 `sed` 或 `awk` 完成此类任务。

## 验收速查

| 任务 | 命令或答案 |
|---|---|
| 编辑文件 | `nano notes.txt` |
| 保存 `nano` 文件 | `Ctrl+O`，再按 `Enter` |
| 退出 `nano` | `Ctrl+X` |
| 覆盖写入 | `>` |
| 追加写入 | `>>` |
| 显示日志行号 | `cat -n backup.log` |
| 筛选 `ERROR` 或 `WARNING` | `grep -E "ERROR|WARNING" backup.log` |
| 统计上述行数 | `grep -E "ERROR|WARNING" backup.log \| wc -l` |

## 本节状态

已完成实操验收。重点记忆：`>` 覆盖、`>>` 追加；`cat -n` 只负责行号显示；复杂筛选可以用 `grep` 加管道组合完成。
