---
title: "第 4 课：git add 与首次 commit"
published: 2026-08-03T22:42:04+08:00
description: 使用 git add 将修改加入暂存区，区分 git diff 与 git diff --staged，并完成第一次本地提交。
image: ''
tags: [Git, add, commit, 暂存区, 本地仓库, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 把工作区修改放进暂存区
- 区分 `git diff` 和 `git diff --staged`
- 完成第一次本地提交

## 关键命令

### `git add README.md`

- 作用：把 `README.md` 当前修改加入暂存区
- 关键参数：`README.md` 表示只暂存这一个文件
- 影响区域：
  - 修改暂存区
  - 不改本地仓库历史
  - 不改远程仓库

### `git status`

- 作用：看暂存前后状态变化
- 暂存后的典型输出：

```text
Changes to be committed:
        modified:   README.md
```

### `git diff`

- 作用：看工作区相对暂存区的差异
- 暂存后如果没有再改文件，通常无输出

### `git diff --staged`

- 作用：看暂存区相对当前提交 `HEAD` 的差异
- 暂存后会看到准备提交的内容

### `git commit -m "docs: add git diff practice note to README"`

- 作用：把暂存区内容提交到本地仓库
- 关键参数：
  - `commit` 创建提交
  - `-m` 直接给提交说明
- 影响区域：
  - 修改本地仓库历史
  - 不改远程仓库

## 本课状态变化顺序

### 第一步：只改工作区

- `git status` 显示 `Changes not staged for commit`
- 说明修改只在工作区

### 第二步：`git add` 后进入暂存区

- `git status` 显示 `Changes to be committed`
- `git diff` 无输出
- `git diff --staged` 有输出

这说明：

- 工作区和暂存区一致
- 暂存区和本地当前提交 `HEAD` 不一致

### 第三步：`git commit` 后进入本地仓库历史

提交成功示例：

```text
[main 142683a] docs: add git diff practice note to README
 1 file changed, 1 insertion(+)
```

含义：

- `main`：当前本地分支
- `142683a`：新提交的短哈希
- `1 insertion(+)`：新增了 1 行

## 提交后的仓库状态

提交后再次查看：

- `git status` 显示 `working tree clean`
- 同时显示：

```text
Your branch is ahead of 'origin/main' by 1 commit.
```

这说明：

- 本地仓库已经多了一个提交
- 远程仓库还没有这个提交
- 还没有执行 `git push`

## 本课需要记住的三个对应关系

- `git add` 改的是：暂存区
- `git commit` 改的是：本地仓库历史
- `git diff --staged` 看的是：暂存区相对 `HEAD` 的差异

## 本课小结

- 已完成第一次完整的小闭环：
  - 改文件
  - 看 diff
  - add
  - commit
- 已完成“修改文件并暂存提交”的核心基础
