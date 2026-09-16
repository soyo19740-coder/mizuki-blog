---
title: "第27课：推送个人功能分支"
published: 2026-09-16T09:30:06+08:00
description: 学习创建并推送个人功能分支，设置上游跟踪关系，为团队协作和代码评审做好准备。
image: ''
tags: [Git, 功能分支, push, 远程分支, 协作开发, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第27课：推送个人功能分支

## 本课目标

在真实 GitHub fork 上完成一条安全协作链路：创建本地功能提交，然后只推送到个人 fork。

## 本次练习内容

在本地分支 `lesson26-remote-practice` 中新增：

```text
GIT_LEARNING_PRACTICE.md
```

该文件只用于个人 fork 的 Git 工作流练习，不应向官方仓库发起贡献。

## 文件状态流转

```text
未跟踪文件
  -> git add
暂存区
  -> git commit
本地提交
  -> git push
个人 fork 的远程分支
```

## 实际命令

```powershell
git add -- GIT_LEARNING_PRACTICE.md
git diff --staged -- GIT_LEARNING_PRACTICE.md
```

- `git add`：将指定新文件放入暂存区。
- `--`：分隔 Git 参数与文件路径。
- `git diff --staged`：检查暂存区和 `HEAD` 的差异。
- 改变范围：`git add` 改暂存区；`git diff` 只读取。

```powershell
git commit -m "docs: add remote practice note"
```

- 作用：将暂存区内容保存为本地提交。
- `-m`：指定提交说明。
- 本次提交：`6312f85 docs: add remote practice note`。
- 改变范围：创建本地仓库提交，并移动当前本地分支。
- 不改变：远程仓库。

## 推送前检查

推送会修改远程仓库，因此本次先确认：

```powershell
Get-Location
git status
git branch --show-current
git remote -v
git log --oneline --graph --decorate --all -n 10
```

确认当前目录、分支、工作区状态和推送目标。关键结论：

```text
当前分支：lesson26-remote-practice
origin：soyo19740-coder/gitignore（个人 fork）
upstream：github/gitignore（官方仓库）
```

## 推送命令

```powershell
git push -u origin lesson26-remote-practice
```

- `origin`：个人 GitHub fork。
- `lesson26-remote-practice`：要发布的本地功能分支。
- `-u`：建立上游跟踪关系。
- 改变范围：在个人 GitHub fork 创建远程分支，并在本地保存该跟踪关系。
- 不改变：官方 `upstream` 仓库、工作区和暂存区。

## 实际结果

```text
[new branch] lesson26-remote-practice -> lesson26-remote-practice
branch 'lesson26-remote-practice' set up to track 'origin/lesson26-remote-practice'.
```

推送后关系：

```text
本地 lesson26-remote-practice
          -> origin/lesson26-remote-practice
          -> 个人 GitHub fork
```

GitHub 给出了创建 Pull Request 的链接。该远程分支属于个人 fork，未向官方仓库写入内容。
