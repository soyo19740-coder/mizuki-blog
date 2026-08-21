---
title: "第 15 课：rebase -i 整理本地提交"
published: 2026-08-20T22:27:49+08:00
description: 在未推送的本地分支上使用交互式 rebase，将连续的小提交整理为一条清晰提交并理解历史改写风险。
image: ''
tags: [Git, rebase -i, interactive rebase, squash, 提交整理, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

在尚未推送的真实项目本地分支上，使用交互式 rebase 将两条连续的小提交整理为一条提交。

练习仓库：`D:\WorkApps\git-learning\gitignore`。

## 风险说明

`git rebase -i` 会改写当前分支的本地提交历史，并可能改变提交哈希。不要随意对已经推送、或其他人正在基于其开发的共享分支执行。执行前确认目标分支、工作区和远程信息；本课使用只在本地存在的 `lrb` 分支，没有推送到远程。

## Rebase 前的提交

`lrb` 相对于 `main` 有三条本地提交：

```text
0fdfd29 docs: add rebase feature work
b32d8da docs: add interactive rebase first note
64f8feb docs: add interactive rebase second note
```

执行：

```powershell
git rebase -i main
```

`-i` 表示 interactive，打开交互式提交列表。Git 按从旧到新的顺序列出待整理提交。

## 交互式操作

原始列表类似：

```text
pick 0fdfd29 docs: add rebase feature work
pick b32d8da docs: add interactive rebase first note
pick 64f8feb docs: add interactive rebase second note
```

将最后一行改为：

```text
pick 0fdfd29 docs: add rebase feature work
pick b32d8da docs: add interactive rebase first note
squash 64f8feb docs: add interactive rebase second note
```

### `pick`

保留并重新应用这条提交。

### `squash`

把当前提交合并进上一条提交，并打开提交信息编辑界面。它会生成新的提交对象。

本课完成后，`b32d8da` 和 `64f8feb` 被整理为：

```text
df8c479 docs: add interactive rebase first note
```

本次保留了第一条提交信息，没有改成预先计划的统一标题；这不影响 squash 操作本身成功。

## Rebase 后的提交图

```text
* df8c479 (HEAD -> lrb) docs: add interactive rebase first note
* 0fdfd29 docs: add rebase feature work
* 2a590fa (main) docs: update main before rebase
```

`lrb` 仍在 `main` 后面，但原来的两条交互式练习提交已经变成一条。`main` 没有移动。

## 影响的 Git 区域

- 工作区：rebase 过程中会随提交重新应用而更新。
- 暂存区：用于记录冲突解决或重新应用的内容。
- 本地仓库：改写当前分支历史，旧提交哈希不再由 `lrb` 直接指向。
- 远程仓库：本课没有 push，因此没有变化。

## 本课总结

1. `git rebase -i main` 整理当前分支相对于 main 的本地提交。
2. `pick` 保留提交，`squash` 将当前提交合并进上一条。
3. 交互式 rebase 会产生新的提交哈希，适合整理尚未共享的本地历史。
4. 完成后用 `git log --oneline --graph --decorate --all` 检查结果。
