---
title: "第 4 节：文件属性与链接"
published: 2026-07-28T23:05:52+08:00
description: 学习使用 ls 和 stat 查看文件属性与 inode，并创建、识别和对比 Linux 硬链接与符号链接。
image: ''
tags: [Linux, WSL, 文件属性, inode, 链接, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-28

## 学习目标

- 使用 `ls -l` 阅读文件类型、权限、链接数、所有者、大小与修改时间。
- 使用 inode 判断两个名称是否为硬链接。
- 创建并识别硬链接和符号链接。
- 理解两类链接对同一文件内容的访问方式。

## 核心命令

| 命令 | 解决的问题 | 常用参数或写法 |
|---|---|---|
| `ls -l` | 查看文件详细属性 | `-l` 使用详细格式 |
| `ls -li` | 查看文件详细属性和 inode | `-i` 显示 inode 编号 |
| `stat file` | 查看更完整的文件元数据 | `stat original.txt` |
| `ln source link` | 创建硬链接 | `ln original.txt hard-link.txt` |
| `ln -s source link` | 创建符号链接 | `ln -s original.txt symbolic-link.txt` |
| `cat file` | 查看文件文本内容 | 用于验证链接读取结果 |

## `ls -l` 输出阅读

示例：

```text
-rw-r--r-- 1 soyo soyo 0 Jul 28 22:50 original.txt
```

| 字段 | 含义 |
|---|---|
| `-` | 普通文件；目录为 `d`；符号链接为 `l` |
| `rw-r--r--` | 文件权限，后续权限课程会详细学习 |
| `1` 或 `2` | 硬链接数 |
| `soyo soyo` | 所有者与所属组 |
| `0` | 文件大小，单位为字节 |
| `Jul 28 22:50` | 最近修改时间 |
| `original.txt` | 文件名 |

## 实际练习记录

练习目录：

```text
~/linux-learning/lesson-04
```

执行过程：

```bash
mkdir -p ~/linux-learning/lesson-04
cd ~/linux-learning/lesson-04
touch original.txt

ls -li original.txt
stat original.txt

ln original.txt hard-link.txt
ln -s original.txt symbolic-link.txt

ls -li
ls -l symbolic-link.txt
```

实际关键输出：

```text
65541 -rw-r--r-- 2 soyo soyo  0 Jul 28 22:50 hard-link.txt
65541 -rw-r--r-- 2 soyo soyo  0 Jul 28 22:50 original.txt
65548 lrwxrwxrwx 1 soyo soyo 12 Jul 28 22:51 symbolic-link.txt -> original.txt
```

结论：

- `original.txt` 与 `hard-link.txt` 的 inode 都是 `65541`，因此它们是硬链接，指向同一份文件内容。
- 两个硬链接的链接数为 `2`，表示该 inode 有两个名称。
- `symbolic-link.txt` 的类型为 `l`，inode 为 `65548`，其内容是指向 `original.txt` 的路径。

## 链接内容验证

执行：

```bash
echo "Linux link practice" > original.txt
cat hard-link.txt
cat symbolic-link.txt
```

两条 `cat` 命令的实际输出均为：

```text
Linux link practice
```

结论：写入 `original.txt` 后，硬链接和符号链接都能读取到相同的新内容。

## 本节遇到的报错

执行：

```bash
ln -s original.txt hard-link.txt
```

出现：

```text
ln: failed to create symbolic link 'hard-link.txt': File exists
```

原因：`hard-link.txt` 已经是一个存在的硬链接，不能再以相同名称创建符号链接。

正确写法是使用新的名称：

```bash
ln -s original.txt symbolic-link.txt
```

## 硬链接与符号链接对比

| 特性 | 硬链接 | 符号链接 |
|---|---|---|
| 创建命令 | `ln source link` | `ln -s source link` |
| inode | 与原文件相同 | 自己拥有不同 inode |
| `ls -l` 文件类型 | `-`，通常显示为普通文件 | `l`，并显示 `-> 目标路径` |
| 原文件删除后 | 仍可通过硬链接访问内容 | 变成失效链接 |
| 可否链接目录 | 通常不允许普通用户创建 | 可以 |

## 验收速查

| 问题 | 答案 |
|---|---|
| 显示 inode 的选项 | `-i` |
| 普通文件类型字符 | `-` |
| 目录类型字符 | `d` |
| 符号链接类型字符 | `l` |
| 创建硬链接 | `ln original.txt hard-link.txt` |
| 创建符号链接 | `ln -s original.txt symbolic-link.txt` |
| 同一 inode 说明 | 两个名称是同一文件内容的硬链接 |

## 本节状态

已完成实操验收。重点记忆：硬链接共享 inode；符号链接保存目标路径并在 `ls -l` 中显示 `->`。
