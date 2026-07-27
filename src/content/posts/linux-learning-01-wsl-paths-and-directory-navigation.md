---
title: "第 1 节：进入 WSL、路径与目录浏览"
published: 2026-07-28T00:30:41+08:00
description: 学习从 Windows 进入 WSL，使用 pwd、ls、cd 浏览目录，并理解绝对路径、相对路径及常见路径符号。
image: ''
tags: [Linux, WSL, 命令行, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-27

## 学习目标

- 从 Windows 进入 WSL 的 Linux 终端。
- 确认当前工作目录并浏览目录内容。
- 理解绝对路径、相对路径和常见路径符号。
- 使用 `--help` 与 `man` 查询命令帮助。

## 核心命令

| 命令 | 解决的问题 | 常用写法 |
|---|---|---|
| `wsl` | 从 Windows 进入默认 Linux 发行版 | `wsl -d Ubuntu` 进入指定发行版 |
| `pwd` | 确认当前所在目录 | 无常用参数 |
| `ls` | 查看目录内容 | `ls -l` 详细显示；`ls -a` 显示隐藏项；`ls -la` 组合使用 |
| `cd` | 切换目录 | `cd ~`、`cd /`、`cd /tmp`、`cd ..` |
| `man` | 查看完整命令手册 | `man ls`；按 `q` 退出 |
| `--help` | 快速查看命令选项 | `ls --help` |

## 路径速记

| 写法 | 含义 |
|---|---|
| `/` | 根目录 |
| `~` | 当前用户家目录，例如 `/home/soyo` |
| `.` | 当前目录 |
| `..` | 上一级目录 |
| `/tmp` | 系统临时目录；不应用于保存重要文件 |
| `/home/soyo/file` | 绝对路径，从根目录开始 |
| `Documents/file` | 相对路径，基于当前目录 |

## 关键示例

```bash
cd ~
pwd

cd /
pwd

cd /tmp
pwd

cd ..
pwd

ls -la
```

从 `/tmp` 执行 `cd ..` 会进入根目录 `/`，因为 `/tmp` 的上一级就是 `/`。

## 本节提问与答案

### 怎样进入 WSL？

在 Windows PowerShell 或命令提示符中执行：

```powershell
wsl
```

查看已安装发行版：

```powershell
wsl -l -v
```

进入指定 Ubuntu：

```powershell
wsl -d Ubuntu
```

使用 `exit` 从 WSL 返回 Windows。

### 什么是系统临时目录？

通常指 `/tmp`。它用于保存程序运行产生的临时文件，系统可能在重启或定期清理时删除其中内容，因此不应存放重要资料。课程中的风险操作会限制在专用练习目录内。

## 验收速查

| 问题 | 答案 |
|---|---|
| 进入默认 WSL 的命令 | `wsl` |
| 显示当前工作目录 | `pwd` |
| 显示隐藏项和详细信息 | `ls -la` |
| 进入家目录 | `cd ~` |
| 进入根目录 | `cd /` |
| 退出 `man` | 按 `q` |

## 本节状态

已完成命令认识和路径概念学习；后续应继续在终端中反复使用 `pwd`、`ls -la` 与 `cd` 来巩固记忆。
