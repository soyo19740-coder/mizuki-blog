---
title: "第 5 课：.gitignore 与 git log 基础"
published: 2026-08-03T22:42:05+08:00
description: 理解 .gitignore 对未跟踪文件的作用，区分已跟踪和被忽略文件，并学习查看整体及单文件提交历史。
image: ''
tags: [Git, gitignore, log, 文件跟踪, 提交历史, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 理解 `.gitignore` 的本质作用
- 区分“已跟踪文件”和“被忽略文件”
- 开始按文件查看提交历史

## 本课关键观察

### 根目录没有 `.gitignore`

通过这些结果可以确认：

- `git ls-files .gitignore` 没输出
- `git show HEAD:.gitignore` 报错：

```text
fatal: path '.gitignore' does not exist in 'HEAD'
```

这说明：当前仓库根目录没有 `.gitignore` 这个已提交文件。

### 仓库里却有大量 `*.gitignore` 文件

使用：

```bash
git --no-pager ls-files "*ignore*"
```

可以看到大量文件，例如：

- `Python.gitignore`
- `Node.gitignore`
- `Global/VisualStudioCode.gitignore`
- `community/Tauri.gitignore`

这些文件是这个项目收集和维护的**模板文件**，不是当前仓库根目录正在控制工作区忽略行为的那个 `.gitignore`。

## 关键命令

### `git check-ignore -v -- README.md`

- 作用：检查 `README.md` 是否被忽略规则命中
- 关键参数：
  - `check-ignore` 检查忽略规则
  - `-v` 显示命中的规则来源
  - `--` 后面跟路径
- 影响区域：不改任何区域
- 本课结果：没有输出

这说明 `README.md` 没有被忽略规则命中。

### `git log --oneline -n 5`

- 作用：看最近 5 条提交
- 关键参数：
  - `--oneline` 单行显示
  - `-n 5` 只看 5 条
- 影响区域：不改任何区域

### `git --no-pager log --oneline -n 5 -- README.md`

- 作用：只看 `README.md` 这个文件的最近 5 条历史
- 关键参数：
  - `--no-pager` 禁止分页
  - `--oneline` 单行显示
  - `-n 5` 只看 5 条
  - `-- README.md` 限制到这个文件
- 影响区域：不改任何区域

## 这节课最重要的结论

### `.gitignore` 是什么

`.gitignore` 是“忽略规则文件”，它的核心作用是告诉 Git：

- 哪些未跟踪文件不要出现在待跟踪候选里
- 哪些生成文件、缓存文件、临时文件不应加入版本控制

### `.gitignore` 不是什么

`.gitignore` 不是“取消跟踪文件”的魔法开关。

也就是说：

- 一个文件已经被 Git 跟踪以后
- 你再把它写进 `.gitignore`
- 它也不会自动从版本控制里消失

### 为什么 `README.md` 不会自动消失

因为 `README.md` 是已跟踪文件，而且它有真实提交历史。

例如使用：

```bash
git --no-pager log --oneline -n 5 -- README.md
```

可以看到最近历史里有：

- `142683a docs: add git diff practice note to README`
- `b0202f3 Fix grammar and improve clarity in README`

这说明它一直被 Git 管理。

## 关于分页器的问题

本课里 `git log` 一度进入分页器，导致输出被拉长。之后如果只想快速看几行，可以使用：

```bash
git --no-pager log --oneline -n 5 -- README.md
```

这样可以避免进入分页界面。

## 本课小结

- 已理解 `.gitignore` 管的是“忽略未跟踪文件”
- 已理解它不会自动取消已跟踪文件
- 已学会用 `git log` 查看整体历史和单文件历史
