---
title: "第 6 课：git restore 撤销修改"
published: 2026-08-03T22:42:06+08:00
description: 区分撤销未暂存修改和取消已暂存修改，理解 git restore 与 git restore --staged 分别影响工作区和暂存区。
image: ''
tags: [Git, restore, 撤销修改, 工作区, 暂存区, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 区分两种撤销场景：
  - 撤销未暂存修改
  - 撤销已暂存但未提交的修改
- 明确 `git restore` 和 `git restore --staged` 分别影响哪个区域

## 第一部分：撤销未暂存修改

### 练习做法

先把 `README.md` 里的这一行：

```text
Learning note: practice git diff on 2026-07-30.
```

改成：

```text
Learning note: practice git restore on 2026-08-03.
```

然后查看状态：

- `git status` 显示：

```text
Changes not staged for commit:
        modified:   README.md
```

- `git diff -- README.md` 显示工作区差异

### 使用的命令

#### `git restore README.md`

- 作用：丢弃 `README.md` 的未暂存修改
- 关键参数：`README.md` 表示只恢复这个文件
- 影响区域：
  - 修改工作区
  - 不改暂存区
  - 不改本地仓库历史
  - 不改远程仓库

### 如何验证撤销成功

- `git diff -- README.md` 没有输出
- `git status` 恢复成：

```text
nothing to commit, working tree clean
```

### 这一部分的结论

`git restore README.md` 撤销的是**未暂存修改**，本质上是在恢复工作区文件。

## 第二部分：撤销已暂存但未提交的修改

### 练习做法

再次把 `README.md` 中那一行改成：

```text
Learning note: practice unstage on 2026-08-03.
```

然后执行：

```bash
git add README.md
```

此时：

- `git status` 显示 `Changes to be committed`
- `git diff --staged -- README.md` 可以看到准备提交的差异

### 使用的命令

#### `git restore --staged README.md`

- 作用：把 `README.md` 的修改从暂存区移出
- 关键参数：
  - `--staged` 表示操作暂存区
  - `README.md` 表示只处理这个文件
- 影响区域：
  - 修改暂存区
  - 不直接改本地仓库历史
  - 不改远程仓库

### 如何验证执行结果

执行后：

- `git status` 从 `Changes to be committed` 变回 `Changes not staged for commit`
- `git diff --staged` 没有输出
- `git diff -- README.md` 仍然有输出

这说明：

- 暂存区已经没有这次修改
- 工作区里的修改还保留着

## 第6课最核心的区别

### `git restore README.md`

- 撤销：未暂存修改
- 改的是：工作区

### `git restore --staged README.md`

- 撤销：已暂存但未提交的修改
- 改的是：暂存区
- 不会自动丢掉工作区内容

## 第6课中各命令影响区域总结

- 改工作区的命令：
  - `git restore README.md`
- 改暂存区的命令：
  - `git add README.md`
  - `git restore --staged README.md`

## 本课小结

- 已掌握 `restore` 的两个常用入口
- 已能区分工作区撤销和暂存区撤销
- 这是后面学习 `reset`、`revert`、`reflog` 前非常重要的基础
