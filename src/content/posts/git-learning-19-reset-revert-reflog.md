---
title: "第19课：reset、revert、reflog"
published: 2026-09-02T15:22:10+08:00
description: 学习使用 reset、revert 与 reflog 撤销提交、恢复历史，并理解不同回退方式的适用场景。
image: ''
tags: [Git, reset, revert, reflog, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第19课：reset、revert、reflog

## 本课目标

理解四类恢复操作的边界：`restore` 处理文件内容，`reset` 移动分支指针，`revert` 用新提交抵消旧提交，`reflog` 查找本地指针移动历史。

## 一、git restore

### 放弃工作区修改

```powershell
git restore README.md
```

用暂存区版本覆盖工作区文件。改变工作区，不移动分支，不创建提交，不影响远程。

风险：未暂存且未提交的修改可能丢失。

### 取消暂存

```powershell
git restore --staged README.md
```

用 `HEAD` 版本恢复暂存区，但保留工作区修改。改变暂存区，不改变工作区内容和提交历史。

## 二、git reset

`reset` 的核心是移动当前分支指针，适合个人未推送分支的历史整理。

### soft

```powershell
git reset --soft HEAD~1
```

只移动分支指针；暂存区和工作区都保留原提交的改动。适合撤销最近 commit 但保留所有内容。

### mixed

```powershell
git reset --mixed HEAD~1
```

默认形式：

```powershell
git reset HEAD~1
```

移动分支指针，重置暂存区，但保留工作区修改。适合撤销提交并重新选择需要提交的文件。

### hard

```powershell
git reset --hard HEAD~1
```

同时移动分支指针、重置暂存区、覆盖工作区。

风险很高：未提交的工作区内容可能直接丢失；已回退的提交可能只能依靠 reflog 找回。执行前必须确认目录、分支、远程和提交图。

### merge 和 keep

```powershell
git reset --merge <提交>
git reset --keep <提交>
```

这两种模式尝试在移动分支时保留本地修改；如果修改可能被覆盖，Git 可能拒绝操作。它们仍属于改变本地历史的操作。

### 只取消某个文件的暂存

```powershell
git reset HEAD -- README.md
```

只作用于暂存区，基本等同于 `git restore --staged README.md`。

## 三、git revert

### 撤销普通提交

```powershell
git revert <提交哈希>
```

它不删除原提交，而是创建一条反向提交，抵消目标提交的文件变化：

```text
A -> B -> C -> R
```

`R` 是新的 revert 提交。

影响区域：更新工作区和暂存区，并在本地仓库创建新提交；本地执行不会改变远程，push 后远程才会更新。

### 不打开编辑器

```powershell
git revert --no-edit HEAD
```

`--no-edit` 使用 Git 自动生成的 revert 提交说明。

### 只应用反向修改

```powershell
git revert --no-commit <提交哈希>
```

也可写成 `git revert -n <提交哈希>`。它只把反向修改放入工作区和暂存区，不立即创建提交，检查后可自行执行：

```powershell
git commit -m "revert: undo unwanted change"
```

### 撤销合并提交

```powershell
git revert -m 1 <合并提交哈希>
```

合并提交有两个父提交。`-m 1` 表示以第一个父提交作为主线；`-m 2` 表示以第二个父提交作为主线。

### revert 冲突

在 VS Code 解决冲突后：

```powershell
git add README.md
git revert --continue
```

放弃正在进行的 revert：

```powershell
git revert --abort
```

## 四、git reflog

```powershell
git reflog -n 8
```

作用：查看本地 `HEAD` 和分支指针过去移动的位置。它可以记录 commit、amend、reset、rebase、merge、switch 和 checkout。

它只读取本地记录，不改变工作区、暂存区、提交或远程。

本课曾看到：

```text
e333cb6 HEAD@{0}: commit (amend): 333
37e8c31 HEAD@{1}: commit (amend): 222
93b63c9 HEAD@{2}: commit: ttt
```

虽然当前分支已经指向新提交，旧提交仍可以通过哈希或 reflog 找到。

安全找回方式是先创建恢复分支：

```powershell
git branch recovery-from-reflog 93b63c9
```

确认内容后，再决定是否移动原分支。

## 五、四者对比

| 命令 | 主要对象 | 是否创建新提交 | 典型用途 |
| --- | --- | --- | --- |
| `restore` | 工作区/暂存区文件内容 | 否 | 放弃文件修改或取消暂存 |
| `reset` | 当前分支指针、暂存区、可选工作区 | 否 | 个人未推送历史整理 |
| `revert` | 提交的反向文件变化 | 是 | 撤销已公开的提交 |
| `reflog` | 本地指针移动记录 | 否 | 找回误操作前的位置 |

## 选择原则

```text
只想恢复文件内容        -> git restore
想回退个人本地提交        -> git reset
已推送的公共提交要撤销    -> git revert
误 reset/amend/rebase 后找回 -> git reflog
```

## 本课总结

1. `reset` 是移动指针，可能改写本地历史。
2. `revert` 是新增反向提交，不删除原历史，适合公共分支。
3. `reflog` 是本地恢复线索，不是远程备份。
4. `reset --hard` 风险最高，执行前必须确认目标和状态。
