---
title: "第 1 课：环境检查与练习目录准备"
published: 2026-08-03T22:42:01+08:00
description: 检查 Git、PowerShell 与 GitHub 访问环境，并选择独立、安全的 Git 实操练习目录。
image: ''
tags: [Git, GitHub, PowerShell, 开发环境, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 确认 Git、PowerShell、GitHub 访问环境是否可用
- 确认当前目录是否适合做 Git 实操练习
- 选定独立练习目录，避免和已有仓库混在一起

## 本课实际结论

- Git 可用：`git version 2.47.1.windows.2`
- PowerShell 可用：`5.1.22621.6060`
- 全局身份已配置：
  - `user.name = afeng`
  - `user.email = soyo19740@gmail.com`
- GitHub HTTPS 访问正常
- GitHub SSH 认证未打通：`Permission denied (publickey).`
- 原目录 `C:\Users\010\Documents\git命令` 不适合继续练习真实项目，因为它已经是一个 Git 仓库
- 练习目录最终确定为：`D:\WorkApps\git-learning`

## 关键命令

### `git --version`

- 作用：检查 Git 是否安装并可用
- 关键参数：`--version` 只显示版本
- 影响区域：不改工作区、暂存区、本地仓库、远程仓库
- 预期输出：类似 `git version 2.47.1.windows.2`

### `git config --global --get user.name`

- 作用：读取全局用户名
- 关键参数：
  - `--global` 读取全局配置
  - `--get` 读取某个键的值
- 影响区域：不改任何区域
- 预期输出：用户名，例如 `afeng`

### `git config --global --get user.email`

- 作用：读取全局邮箱
- 关键参数同上
- 影响区域：不改任何区域
- 预期输出：邮箱地址

### `git ls-remote https://github.com/cli/cli.git HEAD`

- 作用：检查是否能通过 HTTPS 访问 GitHub 远程仓库
- 关键参数：
  - `ls-remote` 查看远程引用
  - `HEAD` 只看默认分支头指针
- 影响区域：不改任何区域
- 预期输出：一行提交哈希和 `HEAD`

### `git status`

- 作用：检查当前目录是否是 Git 仓库，以及仓库当前状态
- 关键参数：无
- 影响区域：不改任何区域
- 在非 Git 仓库目录中的典型结果：

```text
fatal: not a git repository (or any of the parent directories): .git
```

## 本课重点理解

### 为什么要换练习目录

原来的 `C:\Users\010\Documents\git命令` 已经存在 `.git`，而且还有未提交内容。如果继续在这里练习真实开源项目，后面做 `clone`、分支、冲突、恢复时容易把自己的笔记仓库和练习仓库混在一起。

### 为什么 `D:\WorkApps\git-learning` 更合适

- 目录是空的
- 没有 `.git`
- `git status` 明确说明它不是 Git 仓库
- 适合作为真实项目克隆和后续课节的统一练习根目录

### HTTPS 和 SSH 的区别

- HTTPS 已经可用，所以可以克隆公开仓库
- SSH 还没配置好，所以如果以后想用 SSH 地址推送到自己的 GitHub fork，会失败
- 这不影响前几课，但会影响后面的 `push` 和 PR 实操

## 本课小结

- 这一课主要是环境确认，不是 Git 数据操作
- 真正改动 Git 四个区域的命令还没有开始
- 练习前先确认目录是否干净，是后面所有安全操作的前提
