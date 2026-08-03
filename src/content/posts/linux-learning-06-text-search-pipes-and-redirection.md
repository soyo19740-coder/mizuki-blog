---
title: "第 6 节：文本搜索、管道与重定向"
published: 2026-07-30T23:06:46+08:00
description: 学习使用 grep 搜索和筛选文本，通过管道串联命令，并使用重定向覆盖或追加保存结果。
image: ''
tags: [Linux, WSL, grep, 管道, 重定向, 文本处理, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-30

## 学习目标

- 使用 `grep` 按关键词搜索文本行。
- 按行号、大小写、匹配与不匹配条件筛选结果。
- 用管道 `|` 串联命令。
- 使用 `>` 覆盖写入文件，用 `>>` 追加写入文件。

## 核心命令

| 命令或符号 | 解决的问题 | 常用参数或写法 |
|---|---|---|
| `grep` | 筛选包含关键词的行 | `-n` 显示行号；`-i` 忽略大小写；`-v` 显示不匹配行 |
| `grep -E` | 用多个条件匹配文本 | `ERROR|WARNING` 表示匹配其一 |
| `|` | 将左侧输出交给右侧命令处理 | `grep ... | wc -l` |
| `>` | 将输出写入文件并覆盖旧内容 | `grep ... > result.txt` |
| `>>` | 将输出追加到文件末尾 | `grep ... >> result.txt` |
| `wc -l` | 统计输入或文件的行数 | `-l` 只统计行数 |

## 练习文件

练习目录：

```text
~/linux-learning/lesson-06
```

创建的日志文件内容：

```text
INFO service started
WARNING disk usage 80%
ERROR database connection failed
INFO request completed
error cache read failed
DEBUG cache refresh
WARNING certificate expires soon
INFO service stopped
```

## 已完成的实际操作

### 查看文件与行号

```bash
cat -n app.log
```

确认 `app.log` 共 8 行，`ERROR` 在第 3 行，小写 `error` 在第 5 行。

### 精确搜索

```bash
grep ERROR app.log
```

输出：

```text
ERROR database connection failed
```

默认情况下 `grep` 区分大小写，因此不会匹配第 5 行的小写 `error`。

### 忽略大小写并显示行号

```bash
grep -in error app.log
```

输出：

```text
3:ERROR database connection failed
5:error cache read failed
```

`-i` 忽略大小写，`-n` 显示原始行号。

### 反向筛选

```bash
grep -v INFO app.log
```

输出了不含 `INFO` 的 5 行：两条 `WARNING`、两条 error 和一条 `DEBUG`。

### 单字符搜索的观察

```bash
grep -n D app.log
grep d app.log
grep -i w app.log
```

- `grep -n D app.log` 匹配第 6 行的 `DEBUG`。
- `grep d app.log` 区分大小写，匹配所有含小写 `d` 的行。
- `grep -i w app.log` 忽略大小写，匹配两条 `WARNING`。

### 多条件匹配

```bash
grep -E "ERROR|WARNING" app.log
```

输出：

```text
WARNING disk usage 80%
ERROR database connection failed
WARNING certificate expires soon
```

`-E` 启用扩展匹配；`|` 在引号中表示“匹配左侧或右侧内容”。

### 管道统计

```bash
grep -v INFO app.log | wc -l
```

输出：

```text
5
```

执行顺序：先筛选不含 `INFO` 的行，再把结果交给 `wc -l` 统计数量。

### 覆盖与追加写入

执行：

```bash
grep -in error app.log > errors.txt
grep WARNING app.log >> errors.txt
cat -n errors.txt
```

最终输出：

```text
     1  3:ERROR database connection failed
     2  5:error cache read failed
     3  WARNING disk usage 80%
     4  WARNING certificate expires soon
```

结论：

- `>` 先覆盖 `errors.txt` 的旧内容，写入两条忽略大小写的 error 结果。
- `>>` 保留原内容，在末尾追加两条 `WARNING` 结果。

## 本节遇到的问题

### `grep -i w app.log \` 后命令没有立即执行

反斜杠 `\` 表示当前命令还要在下一行继续输入，因此 Shell 出现续行提示符 `>`。本节单行命令不需要反斜杠；按 `Ctrl+C` 可以取消未完成的命令。

正确写法：

```bash
grep -i w app.log
```

### `greo: command not found`

原因：`greo` 是拼写错误。

正确命令：

```bash
grep WARNING app.log >> errors.txt
```

## 验收速查

| 任务 | 命令 |
|---|---|
| 搜索大写 `ERROR` | `grep ERROR app.log` |
| 忽略大小写搜索并显示行号 | `grep -in error app.log` |
| 显示不含 `INFO` 的行 | `grep -v INFO app.log` |
| 匹配 `ERROR` 或 `WARNING` | `grep -E "ERROR|WARNING" app.log` |
| 统计不含 `INFO` 的行数 | `grep -v INFO app.log \| wc -l` |
| 覆盖写入搜索结果 | `grep -in error app.log > errors.txt` |
| 追加搜索结果 | `grep WARNING app.log >> errors.txt` |

## 本节状态

已完成实操验收。重点记忆：`grep` 默认区分大小写；删除条件用 `-v`；管道 `|` 传递输出；`>` 覆盖而 `>>` 追加。
