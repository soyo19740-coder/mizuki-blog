---
title: "第 9 课：合并冲突与 VS Code 解决冲突"
published: 2026-08-21T09:44:22+08:00
description: 在真实 Git 仓库中制造并解决文本合并冲突，理解冲突标记、VS Code 冲突界面和合并提交的完整流程。
image: ''
tags: [Git, 合并冲突, VS Code, merge, 分支, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

在真实 GitHub 开源项目 `github/gitignore` 的本地克隆中，合并 `lesson8-learning-branch` 到 `main` 时处理 README 的真实文本冲突，并理解 VS Code 冲突编辑界面的含义。

## 冲突是如何产生的

`main` 与 `lesson8-learning-branch` 都从相同的较早提交出发，并且修改了 README 的相同位置。Git 无法自动判断最终应保留哪一边内容，于是停止合并，等待人工决定。

执行合并时的典型输出：

```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

此时合并没有完成，也没有自动生成最终合并提交。

## 冲突标记的含义

Git 会在冲突文件中写入如下标记：

```text
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
当前分支 main 的内容
&#61;&#61;&#61;&#61;&#61;&#61;&#61;
正在合并进来的分支 lesson8-learning-branch 的内容
&gt;&gt;&gt;&gt;&gt;&gt;&gt; lesson8-learning-branch
```

含义：

- `<<<<<<< HEAD` 到 `=======`：当前分支的版本。此处当前分支是 `main`。
- `=======` 到 `>>>>>>> lesson8-learning-branch`：传入分支的版本。
- 三种标记本身不是正常文件内容，解决后必须删除。

## VS Code 冲突 UI 怎么看

VS Code 在冲突区域中用两个区块展示内容：

- `Current Change`：当前检出的分支内容，即本课的 `main`。
- `Incoming Change`：正在被合并进来的来源分支内容，即 `lesson8-learning-branch`。

常见按钮：

- `Accept Current Change`：只保留当前分支内容。
- `Accept Incoming Change`：只保留传入分支内容。
- `Accept Both Changes`：先保留两边内容，再手动调整顺序或删除重复内容。
- `Compare Changes`：并排查看两边差异。

这些按钮只是帮你编辑工作区文件；它们不会自动完成 Git 合并，也不会自动创建提交。

## 本课的解决原则

这次冲突区域中有练习过程中留下的无意义行，例如 `1`、`123`、`2222`。最终内容应只保留有意义的学习记录，例如：

```text
Learning note: practice git diff on 2026-07-30.
Branch note: this commit belongs to lesson8-learning-branch.
```

处理过程：

1. 在 VS Code 中选择或手动编辑最终需要保留的内容。
2. 删除所有 `<<<<<<<`、`=======`、`>>>>>>>` 冲突标记。
3. 保存 README。
4. 用 Git 将解决结果加入暂存区并完成合并提交。

## 合并完成命令

冲突编辑完成后使用：

```powershell
git add README.md
git commit -m "merge: resolve README conflict"
```

### `git add README.md`

作用：将已经解决冲突的 README 加入暂存区，告诉 Git 此文件的冲突已处理完毕。

影响区域：更新暂存区；不创建提交，不影响远程。

### `git commit -m "..."`

作用：完成当前进行中的合并，创建合并提交。

关键参数：`-m` 指定合并提交说明。

影响区域：创建本地仓库中的合并提交，并使工作区和暂存区回到干净状态；不影响远程仓库。

本次练习的历史中出现过合并提交 `93ffd0d 合并代码冲突后提交`，它代表该次冲突解决后的合并结果。

## 如何确认冲突已完成

```powershell
git status
git log --oneline --graph --decorate --all -n 10
```

预期：

- `git status` 不再显示 `unmerged paths` 或 `You have unmerged paths`。
- 工作区干净时显示 `nothing to commit, working tree clean`。
- `git log --graph` 显示一个有两个父提交的合并节点。

## 三个容易混淆的命令

### `git merge --continue`

在有些合并流程中可用于继续已解决的合并。对于普通 merge，解决后直接 `git commit` 也很常见。

### `git merge --abort`

取消尚未完成的合并，尝试恢复到执行 `git merge` 前的状态。

风险：会丢弃本次合并过程中尚未提交的冲突解决编辑。因此只有明确决定放弃本次合并时使用。

### `git merge --skip`

普通 merge 通常不使用它；它主要出现在 rebase/cherry-pick 等“逐条应用提交”的流程。不要在普通合并冲突中凭感觉执行。

## 本课总结

1. 冲突不是 Git 出错，而是 Git 无法替人决定同一位置的最终内容。
2. VS Code 的 Current 是当前分支，Incoming 是正在合并进来的来源分支。
3. 解决冲突的本质是编辑出正确最终文件，并删除所有冲突标记。
4. `git add` 标记文件已解决，`git commit` 完成本地合并提交。
5. 合并、解决冲突和提交只改变本地工作区、暂存区与本地仓库；执行 `git push` 才会影响远程仓库。
