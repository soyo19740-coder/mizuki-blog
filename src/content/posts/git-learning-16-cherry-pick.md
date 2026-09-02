---
title: "第16课：cherry-pick 挑选提交"
published: 2026-09-02T10:14:33+08:00
description: 学习使用 git cherry-pick 将指定提交应用到当前分支，掌握冲突处理与回滚方法。
image: ''
tags: [Git, cherry-pick, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第16课：cherry-pick 挑选提交

## 本课目标

在真实开源仓库 `github/gitignore` 的本地克隆中，在 `lcp` 分支创建一条独立提交，再只把这条提交的改动复制到 `main`。

## 练习过程

在 `lcp` 分支上创建提交：

```text
1b6f522 docs: add cherry-pick practice note
```

随后切回 `main`，执行：

```powershell
git cherry-pick 1b6f522
```

Git 在 `main` 上创建了新的提交：

```text
b81b21f docs: add cherry-pick practice note
```

## `git cherry-pick <commit>`

作用：复制指定提交引入的文件改动，并在当前分支创建一条新的提交。

关键参数：

- `<commit>`：要挑选的提交哈希、分支名或其他提交引用。本课使用 `1b6f522`。

影响区域：

- 工作区：应用被挑选提交的文件改动。
- 暂存区：准备被复制的改动。
- 本地仓库：在当前分支创建新的提交。
- 远程仓库：不受影响；本课没有 push。

预期输出类似：

```text
[main b81b21f] docs: add cherry-pick practice note
 1 file changed, 1 insertion(+)
```

## 为什么会产生新哈希

`cherry-pick` 复制的是某个提交的改动，不是把原提交节点直接搬到当前分支。

因此：

- `lcp` 保留原提交 `1b6f522`。
- `main` 生成新提交 `b81b21f`。
- 两个提交的文件改动和提交说明可以相同，但父提交不同，所以提交哈希不同。

## 与 merge 的区别

### cherry-pick

只挑选一个或一组指定提交的改动，复制到当前分支，并创建新的提交。适合把某个修复单独移植到另一个分支。

### merge

合并两个分支的历史和改动：

- 如果满足 fast-forward，当前分支直接前移，不新建合并提交。
- 如果分支已经分叉，通常会创建 merge commit。
- 使用 `git merge --no-ff` 时，即使可以快进，也会强制创建 merge commit。

所以不能简单认为 merge 永远不新建提交；是否新建取决于分支图和参数。

## 冲突处理

如果目标分支和被挑选提交修改了同一位置，cherry-pick 可能产生冲突。使用 VS Code 修改冲突文件后：

```powershell
git add 冲突文件
git cherry-pick --continue
```

若决定放弃本次挑选：

```powershell
git cherry-pick --abort
```

这两个命令只在 cherry-pick 正处于暂停状态时使用。

## 本课总结

1. `cherry-pick` 复制指定提交的内容和改动。
2. 它会在当前分支重新创建提交，因此通常产生新哈希。
3. 原提交仍保留在来源分支上。
4. `merge` 处理的是分支之间的历史关系，cherry-pick 处理的是指定提交的移植。
5. 本课只改变本地工作区、暂存区和本地仓库，没有改变远程仓库。
