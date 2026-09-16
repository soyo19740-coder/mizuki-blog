---
title: "第25课：git pull 与安全快进"
published: 2026-09-14T16:19:21+08:00
description: 学习 git pull 的工作流程和安全快进策略，理解拉取远程更新时的合并边界。
image: ''
tags: [Git, pull, fast-forward, 远程仓库, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第25课：git pull 与安全快进

## 本课目标

理解 `pull` 会获取并整合远程更新，以及 `--ff-only` 如何阻止意外合并。

## pull 的基本含义

普通 `git pull` 可以理解为：

```text
git fetch
再执行配置的整合方式，通常是 merge，也可能配置为 rebase
```

它不仅获取远程内容，还会尝试改变当前本地分支和工作区。

## 本次安全测试

```powershell
git pull --ff-only origin main
```

- `pull`：获取并尝试整合远程分支。
- `--ff-only`：只允许 fast-forward，不允许创建合并提交，也不执行 rebase。
- `origin main`：获取并整合 `origin` 上的 `main`。

本次结果：

```text
fatal: Not possible to fast-forward, aborting.
```

原因是本地 `main` 与 `origin/main` 都有对方没有的提交，历史已经分叉。Git 无法只移动一个指针完成更新，因此按照 `--ff-only` 的要求停止。

## 对 Git 区域的影响

- 获取阶段可能更新本地仓库中的远程跟踪引用和 `FETCH_HEAD`。
- 因为快进检查失败，本地 `main` 没有移动。
- 没有创建合并提交，也没有执行 rebase。
- 工作区和暂存区没有被整合操作修改。
- 远程仓库没有被修改。

## FETCH_HEAD

`FETCH_HEAD` 临时记录最近一次 fetch 获取到的远程提交，供后续整合使用。它不是普通本地分支。

## 为什么普通 pull 有风险

当历史分叉时，普通 pull 可能根据配置创建合并提交或执行 rebase，也可能出现文件冲突。应先查看分支关系，再明确选择整合策略。

当前仓库包含大量本地练习提交，且 `origin` 是官方仓库，因此不能直接对当前 `main` 做普通 pull 或向 `origin` push。
