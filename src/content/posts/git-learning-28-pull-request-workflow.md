---
title: "第28课：Pull Request 流程"
published: 2026-09-16T10:55:40+08:00
description: 学习从功能分支发起 Pull Request、进行代码评审并完成网页合并的标准协作流程。
image: ''
tags: [Git, Pull Request, GitHub, 代码评审, 协作开发, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第28课：Pull Request 流程

## 本课目标

在个人 GitHub fork 中，将已推送的功能分支通过 Pull Request 合并到个人 `main`，理解 PR 与直接本地 merge 的区别。

## PR 是什么

Pull Request（PR）是 GitHub 上的“请求把一个分支的改动合并到另一个分支”的协作记录。

它不是本地 Git 的强制步骤。个人项目可以直接在本地 merge 后 push，但 PR 能在合并前检查文件差异、保留讨论和审核记录，也适合触发自动检查。

## 本次正确的比较关系

```text
个人 fork 的 lesson26-remote-practice
              |
              | 提供一个提交 6312f85
              v
个人 fork 的 main
```

本次必须在个人仓库中创建：

```text
soyo19740-coder/gitignore
```

而不是官方仓库：

```text
github/gitignore
```

练习文件 `GIT_LEARNING_PRACTICE.md` 不应提交到官方项目。

## 页面术语

- `base: main`：接收改动的目标分支。
- `compare: lesson26-remote-practice`：提供改动的来源分支。
- `Able to merge`：GitHub 判断当前没有 Git 文件冲突，可以自动合并；不代表改动一定合理或已经合并。
- `Commits 1`：本次 PR 包含 1 个提交。
- `Files changed 1`：本次 PR 修改 1 个文件。
- `Checks 0`：没有配置或运行自动化检查。
- `Reviewers`：审核人；个人练习可为空。
- `Labels`、`Projects`、`Milestone`：用于分类、项目看板和版本计划；本次可不填。

## 合并前检查

在 `Files changed` 中确认只新增：

```text
GIT_LEARNING_PRACTICE.md
```

并确认内容与本次练习一致。绿色加号和绿色背景表示新增行。

## 本次结果

PR 已创建为个人 fork 的：

```text
第一次PR合并 #1
```

随后已合并，GitHub 创建合并提交：

```text
c168f35 第一次PR合并
```

PR 合并后会进入 `Merged` 状态并自动关闭。

## 合并后的页面操作

- `Revert`：创建新的反向提交撤销 PR，不删除历史；本次不需要点击。
- `Delete branch`：删除 GitHub 上已合并的功能分支，不删除已经进入 main 的内容或 PR 记录。
- `Conversation`：讨论和评论。
- `Add a comment`：新增评论，支持 Markdown。
