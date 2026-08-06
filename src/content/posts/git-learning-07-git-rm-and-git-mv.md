---
title: "第 7 课：git rm 与 git mv"
published: 2026-08-06T11:22:09+08:00
description: 通过实际重命名、停止跟踪和恢复练习，理解 git mv、git rm --cached 对工作区与暂存区的影响。
image: ''
tags: [Git, git rm, git mv, git clean, 暂存区, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-06

## 本课目标

- 理解 Git 管理下的“重命名”和普通改名的区别
- 理解 `git rm --cached` 的真实作用
- 学会区分工作区、暂存区、已跟踪文件、未跟踪文件之间的关系

## 第一部分：`git mv`

### 练习命令

```bash
git mv README.md README-learning.md
git status
git diff --staged
git ls-files README-learning.md
```

### 关键现象

`git status` 显示：

```text
Changes to be committed:
        renamed:    README.md -> README-learning.md
```

`git diff --staged` 显示：

```text
similarity index 100%
rename from README.md
rename to README-learning.md
```

### 这说明什么

- `git mv` 不只是改文件名
- 它同时做了：
  - 工作区改名
  - 把这次重命名放入暂存区

### `similarity index 100%` 的意思

表示 Git 认为文件内容完全一样，只是路径名变了，所以把它识别为“重命名”，而不是“一个删除 + 一个新增”。

### `git mv` 改了哪些区域

- 修改了工作区
- 修改了暂存区
- 没有改本地仓库历史
- 没有改远程仓库

## 第二部分：撤销一次重命名练习时学到的现象

在撤回 `git mv` 练习时，出现过这种状态：

```text
Changes to be committed:
        deleted:    README.md

Untracked files:
        README-learning.md
```

这说明原来的“重命名”被拆成了两部分：

- 一个已暂存的删除：`README.md`
- 一个工作区里的未跟踪新文件：`README-learning.md`

这也是 Git 中很典型的状态转换现象。

## 第三部分：`git clean` 只清未跟踪文件

为了清理 `README-learning.md` 这个未跟踪文件，先做了预演：

```bash
git clean -n
```

输出：

```text
Would remove README-learning.md
```

然后再执行：

```bash
git clean -f README-learning.md
```

输出：

```text
Removing README-learning.md
```

### 这一步为什么危险

`git clean` 会删除未跟踪文件，而且删除后通常不能像 Git 已跟踪文件那样直接恢复，所以必须：

- 先 `git status`
- 先 `git clean -n`
- 再精确指定删除目标

## 第四部分：`git rm --cached`

### 危险操作前检查

因为 `git rm` 属于危险命令，练习前先检查了：

- `Get-Location`
- `git status`
- `git branch --show-current`
- `git remote -v`
- `git log --oneline --graph --decorate --all -n 10`

这是为了确认：

- 当前路径正确
- 仓库状态干净
- 当前分支明确
- 远程指向明确
- 最近历史位置明确

### 本课实际使用的命令

```bash
git ls-files AL.gitignore
git rm --cached AL.gitignore
git status
```

### 命令作用

`git rm --cached AL.gitignore`

- 作用：把 `AL.gitignore` 从 Git 跟踪中移出
- 但保留工作区磁盘文件

### 执行后的典型状态

`git status` 显示：

```text
Changes to be committed:
        deleted:    AL.gitignore

Untracked files:
        AL.gitignore
```

### 为什么会同时出现 `deleted` 和 `untracked`

这是本课最重要的点之一。

从 Git 跟踪关系看：

- 原来它是已跟踪文件
- 现在你准备把它移出版本控制
- 所以 Git 把这视为一个“删除已跟踪文件”的提交候选
- 因此显示 `deleted`

从工作区文件本体看：

- 因为使用了 `--cached`
- 文件本体没有从磁盘删除
- 只是 Git 不再跟踪它
- 所以它又以一个普通文件的身份出现在工作区里
- 因此显示 `untracked`

### `git rm --cached` 改了哪些区域

- 修改了暂存区
- 不删除工作区文件
- 不改本地仓库历史
- 不改远程仓库

## 第五部分：恢复现场

练习后通过以下命令把状态恢复干净：

```bash
git restore --staged AL.gitignore
git status
git ls-files AL.gitignore
git diff --staged
```

恢复后的结果：

- 仓库重新变为 `working tree clean`
- `AL.gitignore` 重新回到已跟踪列表
- 暂存区没有待提交内容

## 本课小结

- `git mv` 是“工作区改名 + 暂存区记录重命名”
- `git rm --cached` 是“停止跟踪，但保留磁盘文件”
- `deleted` 和 `untracked` 同时出现并不矛盾，而是 Git 从两个角度显示同一个文件
- 危险命令必须先做状态检查，再做最小范围练习
