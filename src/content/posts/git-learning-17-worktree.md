---
title: "第17课：worktree 多工作区"
published: 2026-09-02T11:08:02+08:00
description: 学习使用 git worktree 管理多个工作区，在不同分支之间并行开发并减少频繁切换。
image: ''
tags: [Git, worktree, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第17课：worktree 多工作区

## 本课目标

在真实开源仓库 `github/gitignore` 的本地克隆中，为同一个 Git 仓库创建两个工作目录，分别检出 `main` 和 `lwt`，体验并行开发和测试。

## 为什么需要 worktree

普通切换只有一个工作目录：

```text
同一个目录：main <-> lwt
```

使用 worktree 后可以同时保留多个工作现场：

```text
gitignore       -> main
gitignore-lwt   -> lwt
```

适用场景：

- 一边在功能分支开发，一边在 main 上运行测试。
- 不提交或 stash 当前工作，也能查看另一个分支。
- 同时打开两个 VS Code 窗口操作不同分支。
- 一个目录构建 main，另一个目录构建功能分支，避免文件互相覆盖。

如果项目小、工作区干净、只需偶尔切换，普通 `git switch` 已经足够；worktree 不是强制要求，而是并行工作的工具。

## 创建 worktree

```powershell
git worktree add -b lwt 'D:\WorkApps\git-learning\gitignore-lwt' main
```

参数：

- `add`：新增一个工作区。
- `-b lwt`：创建并检出本地分支 `lwt`。
- 路径：第二个工作区所在目录。
- `main`：新分支的起点。

影响区域：

- 本地仓库：新增 `lwt` 分支和 worktree 元数据。
- 新工作区：创建并检出 `lwt` 的文件。
- 主工作区：不变。
- 远程仓库：不变。

## 查看 worktree

```powershell
git worktree list
```

作用：列出每个工作区的路径、当前提交和当前分支。

本课创建后的输出：

```text
D:/WorkApps/git-learning/gitignore      b81b21f [main]
D:/WorkApps/git-learning/gitignore-lwt  b81b21f [lwt]
```

## 在第二个 worktree 中工作

进入 `gitignore-lwt` 后，直接使用普通 Git 命令：

```powershell
git add README.md
git diff --staged -- README.md
git commit -m "docs: add worktree practice note"
```

本课在 `lwt` 中生成提交：

```text
f645f92 docs: add worktree practice note
```

主 worktree 的 `main` 仍指向 `b81b21f`，没有因为 `lwt` 提交而移动。

## 两种独立性

两个 worktree 各自拥有：

- 独立的工作区文件。
- 独立的暂存区状态。
- 独立的当前分支。
- 独立的分支提交进度。

但它们共享同一个本地仓库的提交对象和引用信息。因此 `lwt` 创建的提交可以在主 worktree 的提交图中看到。

## 为什么同一分支不能同时检出

`lwt` 已经在第二个 worktree 中检出，所以主 worktree 不能再次执行 `git switch lwt`。这样可以防止两个目录同时移动同一个分支指针，造成提交状态混乱。

注意：worktree 的意义不是“提交不会影响 main”，而是提交会更新当前 worktree 检出的分支。lwt worktree 中提交更新 `lwt`；主 worktree 中检出 main 时提交则会更新 `main`。

## 删除 worktree

删除 worktree 属于破坏性操作，必须先确认目录和状态。常用命令是：

```powershell
git worktree remove 'D:\WorkApps\git-learning\gitignore-lwt'
```

它会移除指定工作目录，但不会自动删除 `lwt` 分支。当前练习暂不删除，以便继续使用该 worktree。

## 本课总结

1. 普通切换适合一个目录内来回切换分支。
2. `worktree` 让同一仓库同时拥有多个目录和多个分支现场。
3. 每个 worktree 有独立工作区、暂存区和当前分支，但共享本地提交对象。
4. 同一个分支通常不能同时被两个 worktree 检出。
5. worktree 只影响本地，不会自动推送到远程。
