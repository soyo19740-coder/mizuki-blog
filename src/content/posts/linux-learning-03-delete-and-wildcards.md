---
title: "第 3 节：删除操作与通配符"
published: 2026-07-28T00:30:43+08:00
description: 学习在安全练习目录中使用 rm、rmdir 删除文件和目录，并掌握 Linux 通配符及删除前预览规则。
image: ''
tags: [Linux, WSL, 文件操作, 通配符, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-27

## 学习目标

- 在安全练习目录中删除文件、空目录和非空目录。
- 了解 `rm`、`rmdir` 的适用范围。
- 使用 `*`、`?`、`[ ]` 匹配文件名。
- 删除前先通过 `ls` 预览通配符匹配结果。

## 风险规则

`rm` 删除的文件通常不会进入回收站；`rm -r` 会递归删除目录内容。路径或通配符写错可能造成严重数据丢失。

本节的删除操作仅在下列安全练习目录中进行：

```text
~/linux-learning/lesson-03
```

练习时使用 `-i` 要求确认。不要使用 `rm -rf`。

## 核心命令

| 命令 | 解决的问题 | 参数与限制 |
|---|---|---|
| `rm -i file` | 确认后删除文件 | `-i` 表示每次询问 |
| `rmdir dir` | 删除空目录 | 仅能删除空目录；不支持 `-r`、`-i` |
| `rm -ri dir` | 确认后递归删除非空目录 | `-r` 递归处理；`-i` 逐项确认 |
| `ls pattern` | 删除前预览匹配文件 | 先预览，再使用相同模式删除 |

## 通配符速记

| 模式 | 含义 | 本次实际结果 |
|---|---|---|
| `*.txt` | 任意长度字符后接 `.txt` | 匹配全部 `.txt` 文件 |
| `report?.txt` | `report` 后恰好一个字符 | 匹配 `report1.txt`、`report2.txt`，不匹配 `report10.txt` |
| `repor??.txt` | `repor` 后恰好两个字符 | 匹配 `report1.txt`、`report2.txt` |
| `report[12].txt` | 方括号内的一个字符 | 匹配 `report1.txt`、`report2.txt` |
| `report[123].txt` | 匹配 1、2、3 中任一字符 | 匹配 `report1.txt`、`report2.txt`、`report3.txt` |

## 实际练习与结果

创建的练习内容：

```bash
mkdir empty-dir old-project
touch draft.txt notes.txt report1.txt report2.txt report10.txt
touch app.log error.log
touch old-project/old.txt
touch report3.txt
```

已验证的匹配：

```bash
ls *.txt
ls report?.txt
ls repor??.txt
ls report[12].txt
ls report[123].txt
```

已完成的安全删除：

```bash
rm -i draft.txt
rmdir empty-dir/

ls *.log
rm -i *.log

ls -la old-project/
rm -ri old-project/
```

最终目录中保留：

```text
notes.txt
report1.txt
report2.txt
report10.txt
report3.txt
```

说明 `draft.txt`、两个 `.log` 文件、空目录和非空目录均已按预期删除。

## 本节提问与答案

### 为什么 `rm -i draft.txt` 提示 “Is a directory”？

该错误表示当时的 `draft.txt` 是目录，而不是普通文件。`rm -i` 默认不能删除目录。

先确认类型：

```bash
ls -ld draft.txt
```

输出首字符为 `d` 表示目录。空目录使用：

```bash
rmdir draft.txt
```

非空目录先检查内容，再在安全练习目录中使用：

```bash
ls -la draft.txt
rm -ri draft.txt
```

### 为什么 `rmdir -ri 123` 无法执行？

`rmdir` 只用于删除空目录，且不支持 `-r` 或 `-i`，所以会报：

```text
rmdir: invalid option -- 'r'
```

空目录：

```bash
rmdir 123
```

非空目录：先检查，再使用：

```bash
ls -la 123
rm -ri 123
```

### 为什么输入 `ls` 没有确认删除 `error.log`？

当 `rm -i` 出现确认提示时，只应输入 `y`（删除）或 `n`（不删除）。输入 `ls` 不表示确认，因此该文件没有在当次操作中删除。

### 为什么出现 `y: command not found`？

`y` 只能在 `rm -i` 的确认提示出现时输入。若已经回到普通终端提示符，再输入 `y`，Shell 会把它当作一条名为 `y` 的命令，因此报找不到命令。

### 为什么 `ls-la` 报找不到命令？

命令和选项之间必须有空格：

```bash
ls -la
```

`ls-la` 会被 Shell 视为一个完整命令名。

### 输入 `rm -ri` 后为什么出现文件列表？

`rm -ri` 必须在后面带删除目标，例如：

```bash
rm -ri old-project/
```

若按下 Tab，Shell 可能显示当前目录可补全的文件或目录列表；这不是删除操作。

## 验收速查

| 任务 | 命令 |
|---|---|
| 确认后删除文件 | `rm -i draft.txt` |
| 删除空目录 | `rmdir empty-dir` |
| 确认后删除非空目录 | `rm -ri old-project` |
| 删除前预览所有日志文件 | `ls *.log` |
| 确认后删除所有日志文件 | `rm -i *.log` |

## 本节状态

动手练习已完成。重点记忆：删除前先 `ls` 预览；`rmdir` 只删空目录；非空目录仅在确认路径正确且处于安全练习目录时使用 `rm -ri`。
