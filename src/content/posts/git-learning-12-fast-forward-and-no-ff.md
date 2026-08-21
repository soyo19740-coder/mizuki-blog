---
title: "第 12 课：fast-forward 与 --no-ff 合并"
published: 2026-08-18T15:26:16+08:00
description: 在真实仓库中比较默认 fast-forward 合并与 git merge --no-ff 强制合并提交的历史结构差异。
image: ''
tags: [Git, fast-forward, no-ff, merge, 分支合并, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

在真实开源仓库 `github/gitignore` 的本地克隆中，实际比较两种合并结果：

1. 默认 fast-forward 合并。
2. 强制创建合并提交的 `git merge --no-ff`。

本课所有提交都只保存在本地；没有执行 `git push`，因此远程仓库未改变。

## 合并前的已有历史

`main` 先前已经有过一次普通合并提交 `d051a26`。本课从这个本地历史继续创建练习分支。

已有 stash 记录仍保存在本地，但本课未应用或删除它们。

## 一、fast-forward 合并

### 创建练习分支

```powershell
git switch -c lff
```

作用：从当前 `main` 创建并切换到本地分支 `lff`。

关键参数：`-c` 是 create，表示“创建并切换”。

影响区域：本地仓库新增 `lff` 分支指针，`HEAD` 切换到该分支，工作区对应当前提交更新；不创建提交，不影响远程。

### 在 lff 上提交修改

README 新增：

```text
Fast-forward note: created on lff.
```

提交命令：

```powershell
git add README.md
git commit -m "docs: add fast-forward merge practice note"
```

生成提交：`24904ab docs: add fast-forward merge practice note`。

### 合并到 main

```powershell
git switch main
git merge lff
```

输出：

```text
Updating d051a26..24904ab
Fast-forward
```

合并后的关键图：

```text
* 24904ab (HEAD -> main, lff) docs: add fast-forward merge practice note
* d051a26 合并后第一次提交
```

### fast-forward 的含义

`lff` 的提交直接建立在旧 `main` 的末端，而 `main` 在创建 `lff` 后没有新的独立提交。因此 Git 只需把 `main` 的分支指针从 `d051a26` 前移到现有的 `24904ab`。

fast-forward 不会创建新的合并提交，提交图保持一条直线。它不是“只剩一个提交”，而是“没有新增合并节点”。

## 二、--no-ff 合并

### 创建练习分支并提交

```powershell
git switch -c lnf
```

README 新增：

```text
No-ff note: preserve the branch merge point.
```

提交命令：

```powershell
git add README.md
git commit -m "docs: add no-ff merge practice note"
```

生成提交：`1344a28 docs: add no-ff merge practice note`。

此时普通 `git merge lnf` 仍然可以 fast-forward，因为 `main` 在创建 `lnf` 后没有新提交。

### 强制保留合并节点

```powershell
git switch main
git merge --no-ff -m "adsad" lnf
```

关键参数：

- `--no-ff`：即使可以 fast-forward，也强制创建合并提交。
- `-m "adsad"`：指定本次合并提交的提交信息，避免 Git 打开编辑器。`adsad` 仅为练习；真实项目应使用能说明合并原因的消息。

影响区域：

- 工作区：更新为合并后的文件内容。
- 暂存区：Git 完成合并时使用并更新暂存区，完成后无待提交内容。
- 本地仓库：`main` 新增合并提交。
- 远程仓库：不受影响；`git merge` 不会自动执行 `git push`。

输出：

```text
Merge made by the 'ort' strategy.
```

合并后关键图：

```text
*   74f191e (HEAD -> main) adsad
|\
| * 1344a28 (lnf) docs: add no-ff merge practice note
|/
* 24904ab (lff) docs: add fast-forward merge practice note
```

`74f191e` 是新的合并提交，有两个父提交：合并前的 `main` 和 `lnf` 的末端提交。它保留了“这项工作来自一个分支并在此处合入”的历史结构。

## 对比表

| 项目 | fast-forward | `--no-ff` |
| --- | --- | --- |
| 可 fast-forward 时的默认行为 | 直接移动当前分支指针 | 强制创建合并提交 |
| 是否新增合并提交 | 否 | 是 |
| 提交图 | 直线 | 出现有两个父提交的分叉/汇合节点 |
| 是否保留明确合并节点 | 否 | 是 |
| 是否自动修改远程 | 否 | 否 |

## 分支是否自动删除

无论 fast-forward 还是 `--no-ff`，合并都不会自动删除来源分支。本课结束后 `lff` 和 `lnf` 仍存在，这是正常的；删除本地分支需要另行执行 `git branch -d 分支名`。

## 本课总结

1. fast-forward 表示当前分支直接前移到已有提交，不新增合并提交。
2. `git merge --no-ff 来源分支` 强制创建一个本地合并提交，保留分支合并点。
3. `git merge` 会更新当前工作区、暂存区和本地历史，但不会自动影响远程仓库。
4. 应使用 `git log --oneline --graph --decorate --all` 验证合并结果，而不是只看 Git 的成功提示。
