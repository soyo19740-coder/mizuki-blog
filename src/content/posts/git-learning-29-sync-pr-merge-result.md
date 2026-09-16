---
title: "第29课：同步网页 PR 合并结果"
published: 2026-09-16T10:55:40+08:00
description: 学习在网页合并 Pull Request 后同步本地仓库，更新主分支并检查远程合并结果。
image: ''
tags: [Git, Pull Request, GitHub, 分支同步, 协作开发, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第29课：同步网页 PR 合并结果

## 本课目标

理解在 GitHub 网页合并 PR 后，本地仓库不会自动更新；需要先 fetch，再选择合适本地分支查看远程 main 的最新状态。

## 网页合并后的远程状态

GitHub 合并 PR 后，个人 fork 的 `main` 从：

```text
356fd7b
```

移动到：

```text
c168f35 第一次PR合并
```

该提交包含父提交 `356fd7b` 和功能分支提交 `6312f85`。

## 获取远程更新

```powershell
git fetch origin
```

本次输出：

```text
356fd7b..c168f35  main -> origin/main
```

- 作用：从个人 fork 下载最新提交，更新本地的 `origin/main` 远程跟踪分支。
- 改变范围：只更新本地仓库中的远程跟踪引用。
- 不改变：当前工作区、暂存区、本地分支和远程仓库。

## 为什么不直接 pull

旧的本地 `main` 含有之前的课程练习历史，且与远程 main 分叉。直接对它执行 `git pull` 可能产生不需要的合并或冲突。

因此本课保留旧 `main`，而是从远程 main 创建一个专门观察已合并状态的本地分支。

## 创建并跟踪远程 main

```powershell
git switch -c lesson29-pr-merged --track origin/main
```

- `-c lesson29-pr-merged`：创建并切换到新的本地分支。
- `--track origin/main`：以 `origin/main` 为起点，并建立默认跟踪关系。
- 改变范围：创建本地分支，工作区切换到远程 main 对应的文件状态。
- 不改变：远程仓库、已有提交历史和暂存区。

验证：

```powershell
git log -1 --oneline --decorate
```

本次结果：

```text
c168f35 (HEAD -> lesson29-pr-merged, origin/main) 第一次PR合并
```

这说明本地分支与个人 fork 已合并的 main 指向同一提交。

## worktree 确认

```powershell
git worktree list
```

本次确认：

```text
D:/WorkApps/git-learning/gitignore      [lesson26-remote-practice]
D:/WorkApps/git-learning/gitignore-lwt  [lwt]
```

不同 worktree 可以同时检出不同分支。切换或删除分支前，应确认自己在正确工作目录中。
