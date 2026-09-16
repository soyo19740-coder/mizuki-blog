---
title: "第30课：删除本地与远程功能分支"
published: 2026-09-16T10:55:40+08:00
description: 学习在功能合并后安全删除本地和远程分支，并清理失效的远程跟踪引用。
image: ''
tags: [Git, 分支管理, 远程分支, prune, 协作开发, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第30课：删除本地与远程功能分支

## 本课目标

安全清理已通过 PR 合并的功能分支，并理解本地分支和远程分支需要分别删除。

## 删除前确认

删除远程分支会修改 GitHub，因此本次先检查：

```powershell
Get-Location
git status
git branch --show-current
git remote -v
git log --oneline --graph --decorate --all -n 10
```

确认结果：

- 当前目录是 `D:\WorkApps\git-learning\gitignore`。
- 当前分支为 `lesson29-pr-merged`，不是待删除分支。
- 工作区干净。
- `origin` 指向个人 fork。
- 合并提交 `c168f35` 已包含功能提交 `6312f85`。

## 删除远程功能分支

```powershell
git push origin --delete lesson26-remote-practice
```

- `origin`：个人 GitHub fork。
- `--delete`：删除指定远程分支。
- 改变范围：只删除 GitHub 远程仓库的分支引用。
- 不改变：本地分支、工作区、暂存区、PR 记录和已进入 `origin/main` 的内容。

本次结果：

```text
[deleted] lesson26-remote-practice
```

## 验证远程已删除

```powershell
git branch --all --list '*lesson26-remote-practice*'
```

删除远程分支后，只显示本地：

```text
lesson26-remote-practice
```

没有 `remotes/origin/lesson26-remote-practice`，说明远程分支已清理。

## 删除本地功能分支

```powershell
git branch -d lesson26-remote-practice
```

- `-d`：安全删除。只有 Git 确认该分支已合并时才允许删除。
- 改变范围：只删除本地仓库中的本地分支引用。
- 不改变：远程仓库、工作区、暂存区、PR 记录和已合并提交。
- 本次结果：`Deleted branch lesson26-remote-practice (was 6312f85).`

## -d 与 -D

```powershell
git branch -d <branch>
```

安全删除，未合并时会拒绝。

```powershell
git branch -D <branch>
```

强制删除，跳过已合并检查。若分支有未合并的独有提交，可能使这些提交失去易于找到的分支名称，因此不应作为默认选择。

## PowerShell 粘贴错误

本次曾把两条命令粘在一起：

```text
git branch -d lesson26-remote-practicegit branch -d lesson26-remote-practice
```

Git 报了两个不存在的分支名，但仍成功删除最后一个正确的 `lesson26-remote-practice`。后续重复执行显示 `not found` 是正常的，因为该分支已经删除。

最终验证再次运行：

```powershell
git branch --all --list '*lesson26-remote-practice*'
```

没有任何输出，表示本地和远程的该功能分支都已清理，而合并结果仍保留在 `origin/main`。
