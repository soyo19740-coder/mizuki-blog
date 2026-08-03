---
title: "第 5 节：查看文本文件"
published: 2026-07-29T21:10:03+08:00
description: 学习使用 cat、less、head、tail 和 wc 查看、分页阅读、持续追踪及统计 Linux 文本文件。
image: ''
tags: [Linux, WSL, 文本处理, cat, less, tail, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-29

## 学习目标

- 查看短文本、较长文本的指定部分和文件末尾内容。
- 为输出添加行号。
- 使用 `less` 分页阅读文本。
- 使用 `tail -f` 实时观察文件新增内容。
- 使用 `wc -l` 统计文本行数。

## 核心命令

| 命令 | 解决的问题 | 常用参数或用法 |
|---|---|---|
| `cat` | 一次显示短文本的全部内容 | `cat -n file` 显示行号 |
| `less` | 分页查看较长文本 | `/关键词` 搜索；`q` 退出 |
| `head` | 查看开头内容 | `-n 数字` 指定前几行 |
| `tail` | 查看末尾内容 | `-n 数字` 指定最后几行；`-f` 持续追踪 |
| `wc` | 统计文本信息 | `-l` 只统计行数 |

## 实际练习文件

练习目录：

```text
~/linux-learning/lesson-05
```

创建文件：

```bash
mkdir -p ~/linux-learning/lesson-05
cd ~/linux-learning/lesson-05

seq 1 30 > sample.txt
echo "Linux text practice" >> sample.txt
echo "Log entry complete" >> sample.txt
```

说明：

- `seq 1 30` 生成 1 到 30，每行一个数字。
- `>` 将命令输出写入文件；若文件原有内容，会覆盖。
- `>>` 在文件末尾追加内容，不覆盖原有内容。

## 实际操作与结果

### 查看完整内容

```bash
cat sample.txt
```

输出包含 1 到 30，以及：

```text
Linux text practice
Log entry complete
```

### 显示行号

```bash
cat -n sample.txt
```

实际结果显示：

```text
31  Linux text practice
32  Log entry complete
```

因此，初始 `sample.txt` 共 32 行。

### 查看开头

```bash
head -n 5 sample.txt
```

实际输出：

```text
1
2
3
4
5
```

`head` 默认显示前 10 行；`-n 5` 指定只显示前 5 行。

### 查看末尾

```bash
tail -n 4 sample.txt
```

实际输出：

```text
29
30
Linux text practice
Log entry complete
```

### 统计行数

```bash
wc -l sample.txt
```

实际输出：

```text
32 sample.txt
```

`-l` 表示只统计行数。

### 分页查看

```bash
less sample.txt
```

在 `less` 中：

| 按键 | 作用 |
|---|---|
| `Space` | 下一页 |
| `b` | 上一页 |
| `g` | 跳到第一行 |
| `G` | 跳到最后一行 |
| `/Linux` | 搜索 `Linux` |
| `n` | 下一个搜索结果 |
| `q` | 退出 |

### 持续追踪文件末尾

```bash
tail -f sample.txt
```

实际输出中出现：

```text
New log entry
```

说明 `tail -f` 已成功显示追加到文件末尾的新内容。使用 `Ctrl+C` 停止持续追踪。

## 本节遇到的问题

### `ws: command not found`

输入了：

```bash
ws -l sample.txt
```

原因：`ws` 不是 Linux 默认命令。

正确命令是：

```bash
wc -l sample.txt
```

### `head -n cat-see.txt` 报错

`-n` 后必须提供行数，而不是文件名。

错误写法：

```bash
head -n cat-see.txt
```

正确写法：

```bash
head -n 6 cat-see.txt
```

## 验收速查

| 任务 | 命令 |
|---|---|
| 查看全部内容 | `cat sample.txt` |
| 查看内容并加行号 | `cat -n sample.txt` |
| 查看前 5 行 | `head -n 5 sample.txt` |
| 查看最后 4 行 | `tail -n 4 sample.txt` |
| 持续查看新增内容 | `tail -f sample.txt` |
| 统计总行数 | `wc -l sample.txt` |
| 分页查看 | `less sample.txt` |

## 本节状态

已完成实操验收。重点记忆：短文件用 `cat`，长文件用 `less`，查看开头用 `head`，查看末尾和日志新增内容用 `tail`，统计行数用 `wc -l`。
