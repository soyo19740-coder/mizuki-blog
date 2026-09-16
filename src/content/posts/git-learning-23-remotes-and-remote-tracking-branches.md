---
title: "第23课：远程仓库与远程跟踪分支"
published: 2026-09-14T15:48:10+08:00
description: 学习 Git 远程仓库、远程名称和远程跟踪分支的关系，掌握查看与理解远程状态的方法。
image: ''
tags: [Git, 远程仓库, 远程跟踪分支, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第23课：远程仓库与远程跟踪分支

## 本课目标

理解本地分支、远程仓库别名和远程跟踪分支之间的关系，并能正确判断 ahead/behind 状态。

## 当前仓库的实际关系

```text
origin       -> https://github.com/github/gitignore.git
main         -> 本地分支
origin/main  -> 本地记录的 origin 远程 main 分支状态
```

`origin` 当前指向官方 `github/gitignore` 仓库。它不是个人 fork，因此不能向它推送练习提交。

## 核心概念

- `main`：本地分支指针，指向本地仓库中的一个提交。切换到它时，工作区通常会呈现该分支的文件内容。
- 工作区：磁盘上的实际文件，不是分支指针。
- `origin/main`：远程跟踪分支。它是本地保存的远程状态快照，通常由 `git fetch` 更新，不代表实时网络连接。
- `origin`：远程仓库的本地别名。克隆仓库时默认使用这个名字。

## 本次实际状态

```text
main [origin/main: ahead 20, behind 6]
```

含义：

- 本地 `main` 有 20 个提交不在 `origin/main`。
- `origin/main` 有 6 个提交不在本地 `main`。
- 两边已经分叉，不能把它理解为单纯的“本地落后”。

## 查看远程状态

```powershell
git remote -v
```

- 作用：查看远程仓库名称，以及 fetch/push 地址。
- 改变范围：只读取配置，不改变工作区、暂存区、本地仓库或远程仓库。

```powershell
git branch -r
```

- 作用：查看本地保存的远程跟踪分支，例如 `origin/main`。
- 改变范围：只读取本地仓库。

```powershell
git branch -vv
```

- 作用：查看本地分支、其上游跟踪关系和 ahead/behind 状态。
- 改变范围：只读取本地仓库。

## 推送规则

当前 `origin` 是他人的上游仓库。即使拥有网络访问，也不应向其推送练习提交。

正确协作结构通常是：

```text
origin    -> 自己的 GitHub fork，可以推送
upstream  -> 原始官方仓库，只获取更新
```

后续推送和 Pull Request 练习会先创建或确认个人 fork，再调整远程名称和地址。
