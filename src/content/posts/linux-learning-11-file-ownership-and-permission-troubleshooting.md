---
title: "第 11 节：文件所有权与权限排障"
published: 2026-08-25T23:48:21+08:00
description: 学习使用 chown、chgrp 和 namei -l 查看及修改文件所有权，并从路径各级定位权限问题。
image: ''
tags: [Linux, 权限, 所有权, chown, chgrp, namei, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 学习目标

- 查看文件所有者和所属组。
- 区分权限问题与所有权问题。
- 使用 `chown`、`chgrp` 修改安全练习文件的所有权。
- 使用 `namei -l` 检查路径各级目录和文件的权限、所有者与所属组。

## 风险说明

`chown` 和 `chgrp` 会改变文件所有权。错误修改系统文件可能导致用户无法访问文件或服务异常。本节仅在 `~/linux-learning/lesson-11` 中操作。

## 核心命令

| 命令 | 作用 |
| --- | --- |
| `ls -l file` | 查看文件权限、所有者和所属组 |
| `ls -ld directory` | 查看目录本身的权限和所有权 |
| `stat file` | 查看完整文件元数据 |
| `chown user file` | 只修改所有者 |
| `chown user:group file` | 同时修改所有者和所属组 |
| `chgrp group file` | 只修改所属组 |
| `namei -l path` | 查看路径每一级的权限、所有者和所属组 |

## 实际操作

练习文件：`~/linux-learning/lesson-11/private/data.txt`

```bash
sudo chown soyo:soyo private/data.txt
chgrp soyo private/data.txt
ls -l private/data.txt
```

结果显示文件所有者和所属组均为 `soyo`：

```text
-rw-r--r-- 1 soyo soyo 19 ... private/data.txt
```

权限练习：

```bash
chmod 600 private/data.txt
chmod 700 private/
ls -ld private/
ls -l private/data.txt
```

结果：

```text
drwx------ 2 soyo soyo ... private/
-rw------- 1 soyo soyo ... data.txt
```

恢复练习权限：

```bash
chmod 700 private/
chmod 640 private/data.txt
```

路径排查：

```bash
namei -l "$PWD/private/data.txt"
```

该命令显示 `/`、`home`、`soyo`、`linux-learning`、`lesson-11`、`private` 和 `data.txt` 每一级的权限、所有者与所属组。

## 概念纠正

- 正确命令是 `chgrp`，不是 `cherp`。
- `chgrp` 只修改所属组。
- `chown soyo file.txt` 只修改所有者。
- `chown soyo:soyo file.txt` 同时修改所有者和所属组。
- `namei -l` 不仅检查所有权，也检查路径各级目录和文件的权限、所有者、所属组。
- 目录要能访问其中的文件，路径上的目录通常需要执行权限 `x`。

## 验收速查

| 问题 | 答案 |
| --- | --- |
| 查看目录自身属性 | `ls -ld directory` |
| 只改所有者 | `chown user file` |
| 同时改所有者和组 | `chown user:group file` |
| 只改所属组 | `chgrp group file` |
| 检查路径各级属性 | `namei -l path` |

## 本节状态

已完成实操验收。重点记忆：`chgrp` 只改组；`chown` 可改用户或用户与组；`namei -l` 同时检查路径各级权限和所有权。
