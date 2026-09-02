---
title: "第18课：commit --amend 修改最近提交"
published: 2026-09-02T11:29:34+08:00
description: 学习使用 git commit --amend 修正最近一次提交的内容与提交信息，并了解已推送提交的处理边界。
image: ''
tags: [Git, commit-amend, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第18课：commit --amend 修改最近提交

## 本课目标

在真实开源仓库 `github/gitignore` 的 `lwt` worktree 中，修改最近一次提交的文件内容和提交说明。

## 本课背景

`lwt` 原来的最近提交是：

```text
f645f92 docs: add worktree practice note
```

随后把 README 中的：

```text
Worktree note: edit in the lwt workspace.
```

改为：

```text
Worktree note: edit in the lwt workspace for parallel work.
```

## 使用的命令

### `git diff -- README.md`

作用：确认 README 的工作区修改。

影响区域：只读取工作区和暂存区，不修改任何区域。

### `git add README.md`

作用：把修改后的 README 放入暂存区。

影响区域：改变暂存区，不创建提交，不影响远程。

### `git commit --amend -m "docs: document parallel worktree practice"`

作用：用当前暂存区内容替换当前分支的最近一次提交，同时修改提交说明。

关键参数：

- `--amend`：修改最近一次提交，而不是创建一条新的连续提交。
- `-m "..."`：直接指定新的提交说明。

本课执行：

```powershell
git commit --amend -m "docs: document parallel worktree practice"
```

结果：

```text
[lwt cead0e9] docs: document parallel worktree practice
```

## 影响的 Git 区域

- 工作区：包含 amend 后的文件内容，通常回到干净状态。
- 暂存区：作为新提交的输入，提交完成后通常清空。
- 本地仓库：旧的最近提交被新的提交对象替换。
- 分支指针：`lwt` 移动到新提交 `cead0e9`。
- 远程仓库：本课没有 push，因此不受影响。

## 为什么哈希改变

提交哈希由提交内容、父提交、提交说明、作者和提交者信息等内容共同决定。amend 改变了文件内容和提交说明，因此 Git 创建了新的提交对象：

```text
旧提交：f645f92
新提交：cead0e9
```

`--amend` 不是在原提交对象上直接修改，因为 Git 提交对象不可变；它是创建新提交，再让当前分支指向新提交。

## 与普通 commit 的区别

普通提交：

```text
A -> B -> C
```

amend 最近一次提交：

```text
A -> B旧  =>  A -> B新
```

它不会额外保留一个“修正提交”节点，而是替换最近一次提交的分支指针。

## 风险与使用边界

适合：

- 修正最近一次提交说明。
- 补上漏提交的文件。
- 修正最近一次提交中的小错误。
- 提交尚未 push，且只有自己使用的本地分支。

已经 push 的提交技术上仍可在本地 amend，但这会使本地历史与远程历史不一致，后续通常需要 force push。共享分支上这样做可能影响其他人的提交基础，因此不应随意 amend 已公开的提交。

安全替代方案：已推送的错误通常创建新的修正提交，而不是重写公共历史。

## 本课结论

1. `git commit --amend` 只修改当前分支最近一次提交。
2. 它可以同时修改最近提交的文件内容和提交说明。
3. amend 会创建新提交对象，因此提交哈希会改变。
4. 未 push 的个人分支可以放心整理；已 push 的共享历史应避免改写。
