---
title: "第 13 课：squash merge"
published: 2026-08-20T21:38:03+08:00
description: 使用 git merge --squash 将功能分支的多条提交汇总为目标分支上的一次普通提交。
image: ''
tags: [Git, squash merge, merge, 提交整理, 分支, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

在真实开源仓库 `github/gitignore` 的本地克隆中，体验如何把一个功能分支的多条提交压缩为目标分支上的一次普通提交。

## 本课分支与提交

从 `main` 创建练习分支 `lsq`，并在 README 上创建两条提交：

```text
280ce12 docs: prepare squash feature change
af97633 docs: refine squash feature change
```

两次修改分别加入：

```text
Squash step 1: prepare the feature change.
Squash step 2: refine the feature change.
```

## 关键命令

### `git merge --squash lsq`

作用：将来源分支 `lsq` 相对于当前分支 `main` 的所有文件改动汇总到当前暂存区。

关键参数：

- `--squash`：压缩来源分支的全部改动，不保留其提交历史关系。
- `lsq`：来源分支名。

影响区域：

- 工作区：更新为合并后的文件内容。
- 暂存区：写入汇总后的改动。
- 本地仓库：此命令本身不创建提交，也不会移动当前 `HEAD`。
- 远程仓库：不受影响。

执行后，`git status` 显示：

```text
Changes to be committed:
        modified:   README.md
```

`git diff --staged -- README.md` 同时显示两条 `Squash step` 内容，说明它们已经被汇总到暂存区。

## 为什么还要执行 commit

`git merge --squash` 只准备文件改动，并不创建提交。因此必须继续执行：

```powershell
git commit -m "docs: squash feature changes"
```

这会把暂存区内容创建为 `main` 上的一条普通本地提交：

```text
934759e docs: squash feature changes
```

## 合并后的提交图

```text
* 934759e (HEAD -> main) docs: squash feature changes
| * af97633 (lsq) docs: refine squash feature change
| * 280ce12 docs: prepare squash feature change
|/
*   74f191e adsad
```

结论：

- `934759e` 只包含两个提交的最终文件改动。
- `934759e` 不是 merge commit，只有一个父提交。
- `280ce12` 和 `af97633` 仍属于 `lsq` 的历史，不会成为 `934759e` 的父提交。
- `lsq` 分支仍存在；合并不会自动删除分支。

## 三种方式对比

| 方式 | 是否新建 merge commit | 是否保留来源分支的提交关系 | 结果 |
| --- | --- | --- | --- |
| fast-forward | 否 | 提交原样进入直线历史 | 当前分支指针前移 |
| `git merge --no-ff` | 是 | 是 | 新增一个有两个父提交的合并节点 |
| `git merge --squash` | 否 | 否 | 汇总改动到暂存区，再手动创建一个普通提交 |

补充：普通 `git merge` 在无法 fast-forward 时也会创建 merge commit；`--no-ff` 的作用是即使可以快进也强制创建。

## 本课状态总结

- 工作区：squash 合并将来源分支的最终文件内容带入当前工作区。
- 暂存区：`git merge --squash` 将汇总改动放入暂存区。
- 本地仓库：后续 `git commit` 创建了 `main` 上的一条普通提交。
- 远程仓库：本课没有执行 `git push`，因此未改变。
