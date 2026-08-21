---
title: "第 14 课：rebase 更新功能分支"
published: 2026-08-20T22:12:36+08:00
description: 模拟主线更新后的协作场景，使用 git rebase main 将功能分支更新到最新主线并形成直线历史。
image: ''
tags: [Git, rebase, 功能分支, main, 提交历史, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

模拟真实协作：功能分支开发期间，`main` 已经产生新提交；使用 `git rebase main` 将功能分支重新接到最新 `main` 后面，形成直线历史。

练习仓库：`D:\WorkApps\git-learning\gitignore`。

## Rebase 前的分叉

在 `lrb` 分支上创建了功能提交：

```text
341aaa5 docs: add rebase feature work
```

随后切换到 `main`，创建了独立更新：

```text
2a590fa docs: update main before rebase
```

此时关系大致是：

```text
main: ...--- 2a590fa
                 \
lrb:  ...--- 341aaa5
```

两条分支从共同基线分叉。

## 使用的命令

### `git switch -c lrb`

作用：从当前分支创建并切换到 `lrb`。

关键参数：`-c` 表示 create，创建分支后立即切换。

影响区域：本地仓库新增分支指针，`HEAD` 切换；不创建提交，不影响远程。

### `git add README.md`

作用：将 README 的工作区修改放入暂存区。

影响区域：改变暂存区，不改变提交历史和远程仓库。

### `git commit -m "..."`

作用：把暂存区内容写入本地仓库，创建一条提交。

关键参数：`-m` 直接指定提交说明。

影响区域：新增本地提交；不改变远程仓库。

## `git rebase main`

作用：以当前分支 `lrb` 的共同祖先为起点，暂时取下 lrb 的独有提交，把 lrb 的基线移动到 `main` 最新提交，再逐个重新应用 lrb 的独有提交。

本课执行时当前分支是 `lrb`：

```powershell
git rebase main
```

影响区域：

- 工作区：随着提交重新应用而更新。
- 暂存区：rebase 过程中用于记录冲突解决结果。
- 本地仓库：重写当前分支的提交对象和历史关系。
- 远程仓库：不改变；本课没有 push。

## 冲突处理

由于 `main` 和 `lrb` 都修改了 README 相同位置，rebase 在重新应用 `341aaa5` 时发生冲突：

```text
CONFLICT (content): Merge conflict in README.md
error: could not apply 341aaa5...
```

使用 VS Code 处理冲突，最终同时保留：

```text
Main note: update main before rebase.
Rebase note: feature work before main update.
```

并删除冲突标记：

```text
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&#61;&#61;&#61;&#61;&#61;&#61;&#61;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; 341aaa5
```

处理完成后执行：

```powershell
git add README.md
git rebase --continue
```

`git add` 告诉 Git 冲突已经解决；`git rebase --continue` 继续重新应用提交。rebase 过程中不要用普通 `git commit` 代替 `--continue`。

## 为什么提交哈希改变

rebase 完成后，原来的：

```text
341aaa5 docs: add rebase feature work
```

变成了：

```text
0fdfd29 docs: add rebase feature work
```

这是正常现象。提交对象的哈希取决于提交内容、父提交、作者/提交者信息和时间等元数据。rebase 改变了该提交的父提交，所以即使文件改动和提交说明相同，也必须生成新的提交对象和新的哈希。

## Rebase 后的历史

```text
* 0fdfd29 (HEAD -> lrb) docs: add rebase feature work
* 2a590fa (main) docs: update main before rebase
* 934759e docs: squash feature changes
```

`lrb` 的新提交位于最新 `main` 提交之后，历史变成一条直线。

## 与 merge 的区别

| 操作 | 历史结果 | 是否可能创建新的合并节点 |
| --- | --- | --- |
| `git merge main` | 保留分叉和汇合关系 | 可能，会创建 merge commit |
| `git rebase main` | 将功能提交重新接到 main 后面 | 不创建 merge commit，但会重写功能分支提交 |

## 风险与使用边界

rebase 会改写当前分支的提交历史。适合尚未推送、只由自己使用的功能分支；不要随意对已经被他人基于其开发的共享分支 rebase。若该分支已经推送，后续同步通常需要强制推送，可能影响他人。

本课的 `lrb` 只在本地练习，未推送，因此适合练习。

## 本课总结

1. `git rebase main` 将当前功能分支重新接到最新 main 后面。
2. rebase 通过重新创建提交实现历史移动，因此提交哈希可能改变。
3. 冲突解决后用 `git add` 标记解决，再用 `git rebase --continue` 继续。
4. rebase 不会自动改变远程仓库。
