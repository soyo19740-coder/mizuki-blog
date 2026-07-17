---
title: 复制旧项目代码，清除原有 Git 提交历史，并将其推送到新仓库
published: 2026-07-17T10:48:20+08:00
description: 记录通过 Git 孤儿分支保留项目文件、清除原有提交历史、创建全新根提交并迁移到新远程仓库的完整流程。
image: ''
tags: [Git, 孤儿分支, 仓库迁移, 版本控制]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-17

## 操作目标

本次操作的目标是：

1. 克隆原始 `a302-fpc` 仓库。
2. 保留当前工作区文件，但不保留原仓库的提交历史。
3. 创建一个只有全新首次提交的 `master` 分支。
4. 将远端地址从 `a302-fpc` 修改为 `a303-fpc`。

> 日志中部分路径和 SSH 地址的反斜杠、冒号或斜杠可能因复制显示而丢失。下文按命令的实际含义说明。

## 命令执行过程

### 1. 克隆仓库

```powershell
git clone <a302-fpc远端地址>
```

从远端服务器下载仓库，创建本地目录 `a302-fpc`。默认会建立远端别名 `origin`，并创建或检出远端默认分支（日志中为 `master`）。

日志中的以下信息表示克隆成功：

```text
Receiving objects: 100%
Resolving deltas: 100%
```

### 2. 进入仓库目录

```powershell
cd .
cd .\a302-fpc
```

`cd .` 表示进入当前目录，实际上不会改变当前所在位置。

`cd .\a302-fpc` 进入刚克隆的 Git 仓库目录。

### 3. 创建孤儿分支

```powershell
git checkout --orphan 123
```

创建并切换到名为 `123` 的孤儿分支。

孤儿分支没有父提交，不继承原 `master` 的提交历史；但当前工作区的文件通常会保留。因此可以把现有文件作为一段全新历史的起点重新提交。

### 4. 删除旧的本地 master 分支

```powershell
git branch -D master
```

强制删除原先的本地 `master` 分支引用。该分支原本指向从 `a302-fpc` 克隆下来的旧提交历史。

此时当前分支为 `123`，所以允许删除 `master`。

### 5. 创建新的 master 分支

```powershell
git checkout -b master
```

创建并切换到一个新的 `master` 分支。它建立在当前孤儿分支的无历史状态上，因此后续首次提交会成为新的根提交。

### 6. 尝试删除临时分支

```powershell
git branch -D 123
```

该命令意图删除临时使用的 `123` 分支，但日志显示：

```text
error: branch '123' not found
```

按通常的 Git 行为，创建 `master` 后 `123` 应仍然存在，因此这个结果可能说明实际输入的分支名称、命令执行顺序或当时仓库状态与日志记录不完全一致。

这个报错不影响后续在新 `master` 分支上提交文件。

### 7. 打开提交历史图形界面

```powershell
gitk
```

打开 Git 的图形化提交历史浏览器。由于新的孤儿分支尚未产生提交，此时不会看到新的有效提交历史。

### 8. 创建首次提交

```powershell
git commit -m "first commit, copy from a302"
```

在新的 `master` 分支上创建第一次提交。日志显示：

```text
[master (root-commit) 5d9df5b] first commit, copy from a302
```

`root-commit` 的含义是“根提交”：该提交没有父提交，是这段新历史的起点。

日志中的：

```text
create mode 160000 pcb-lib
create mode 160000 pcb-script
```

表示 `pcb-lib` 与 `pcb-script` 是 Git 子模块。主仓库保存的是它们所指向的提交 ID，而不是将子模块目录中的文件直接纳入主仓库。

### 9. 查询远端地址时缺少参数

```powershell
git remote get-url
```

该命令缺少远端名称，因此 Git 输出帮助信息。正确用法是：

```powershell
git remote get-url origin
```

### 10. 查询 origin 的远端地址

```powershell
git remote get-url origin
```

显示远端别名 `origin` 对应的拉取地址。此时它仍是原始 `a302-fpc` 仓库地址。

### 11. 修改 origin 的远端地址

```powershell
git remote set-url origin <a303-fpc远端地址>
```

将本地仓库的 `origin` 地址从 `a302-fpc` 改为 `a303-fpc`。

这一步只修改本地 `.git/config` 中的远端配置，并不会自动上传提交。

## 孤儿分支与普通分支的区别

| 项目 | 普通分支 | 孤儿分支 |
| --- | --- | --- |
| 创建命令 | `git switch -c feature` | `git switch --orphan new-main` |
| 起点 | 当前提交 | 无提交历史 |
| 是否继承历史 | 继承 | 不继承 |
| 第一次提交 | 原历史上的新节点 | 新历史的根提交（`root commit`） |
| 常见用途 | 功能开发、修复、发布 | 清空历史重新建仓库、维护独立内容、准备干净交付版本 |

原仓库历史：

```text
A -- B -- C  (master)
```

普通分支从 `C` 创建后：

```text
A -- B -- C  (master)
           \
            D  (feature)
```

孤儿分支产生首次提交后：

```text
A -- B -- C  (master)

X  (new-main)
```

`X` 与 `A`、`B`、`C` 没有提交历史关系。

## 后续推送

修改远端地址后，需要显式推送新的 `master` 分支：

```powershell
git push -u origin master
```

`-u` 会建立本地 `master` 与 `origin/master` 的跟踪关系。之后可直接使用：

```powershell
git push
git pull
```

## 建议的验证命令

```powershell
git branch -a
git log --oneline --graph --decorate --all
git remote -v
git status
```

- `git branch -a`：查看本地和远端分支。
- `git log --oneline --graph --decorate --all`：确认新 `master` 只有新的根提交。
- `git remote -v`：确认拉取和推送远端地址均为 `a303-fpc`。
- `git status`：确认工作区没有未提交修改。
