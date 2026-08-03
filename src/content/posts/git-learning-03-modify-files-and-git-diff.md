---
title: "第 3 课：修改文件与 git diff"
published: 2026-08-03T22:42:03+08:00
description: 修改已跟踪文件并使用 git diff 查看工作区变化，理解工作区已修改但暂存区尚未改变的状态。
image: ''
tags: [Git, diff, 工作区, 暂存区, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 修改一个已跟踪文件
- 用 `git diff` 观察工作区变化
- 理解“工作区已改，暂存区未改”的状态

## 本课练习文件

- 文件：`README.md`
- 修改内容：新增一行练习说明

```text
Learning note: practice git diff on 2026-07-30.
```

## 关键命令

### `git status`

- 作用：查看当前仓库状态
- 影响区域：不改任何区域
- 修改前的典型输出：`working tree clean`
- 修改后的典型输出：

```text
Changes not staged for commit:
        modified:   README.md
```

### `git ls-files README.md`

- 作用：确认 `README.md` 是 Git 已跟踪文件
- 关键参数：`ls-files` 列出已跟踪文件
- 影响区域：不改任何区域

### `git show HEAD:README.md`

- 作用：查看当前提交里的 `README.md` 内容
- 关键参数：`HEAD:README.md` 表示查看当前提交中的该文件
- 影响区域：不改任何区域

### `git diff -- README.md`

- 作用：只看 `README.md` 这个文件在工作区里的差异
- 关键参数：`--` 后面跟文件路径
- 影响区域：不改任何区域

### `git diff`

- 作用：看整个工作区相对暂存区的差异
- 影响区域：不改任何区域

## 本课最重要的状态理解

### `Changes not staged for commit` 说明什么

说明：

- 工作区已经变了
- 暂存区还没有这些变化

也就是说，文件被改了，但 Git 还没有把这些改动放进“待提交清单”。

### 为什么 `git diff -- README.md` 和 `git diff` 结果几乎一样

因为这次只改了一个文件：`README.md`。

- `git diff -- README.md`：只看这个文件
- `git diff`：看整个工作区

当整个工作区里只改了一个文件时，它们看到的内容自然接近一致。

### diff 里前缀符号的意思

- `+` 表示新增行
- `-` 表示删除行

例如：

```diff
+Learning note: practice git diff on 2026-07-30.
```

表示这是新增的一行。

## 本课出现的一个细节

diff 输出里出现了：

```text
\ No newline at end of file
```

这表示文件末尾没有换行符。它不是报错，但说明这次修改顺带改变了文件结尾格式。后面学习换行符问题时会再次遇到。

## 本课小结

- 第一次真正修改了工作区文件
- 用 `git diff` 看清了“改了什么”
- 此时还没有进入暂存区，更没有写入本地仓库历史
