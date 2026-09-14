---
title: "Git 协作中 merge 与 rebase 选择指南"
published: 2026-09-11T15:50:19+08:00
description: 对比 Git 协作中 merge 与 rebase 的使用场景、历史影响和操作建议，帮助选择合适的分支整合方式。
image: ''
tags: [Git, merge, rebase, 协作开发, 版本控制, Gerrit]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

# Git 协作中 merge 与 rebase 选择指南

## 1. 先理解分支状态

设共同基础提交为 A：

```text
本地：A---B        你的提交
远程：A---C        同事的提交
```

这表示本地和远程已经分叉。此时直接 `git push` 会被拒绝，因为 Git 不允许无提示地覆盖远程历史。

常用检查命令：

```powershell
git status
git fetch origin
git log --oneline --graph --decorate --all -10
```

`git fetch` 只下载远程信息，不修改当前工作文件。

## 2. merge 和 rebase 的核心区别

### merge：保留分叉和合并过程

```powershell
git fetch origin
git merge origin/master
```

结果通常会产生一个合并提交 M，不改写已有提交的 ID，保留真实协作历史，但历史可能出现分叉线。

### rebase：把自己的提交接到最新基线上

```powershell
git pull --rebase origin master
# 等价思路：git fetch origin，然后 git rebase origin/master
```

Git 会暂时取下本地提交，先放上远程提交，再重新应用本地修改，生成新的本地提交。新提交内容可能相同，但提交 ID 会改变，历史通常保持直线。

## 3. 决策表

| 情况 | 推荐做法 |
|---|---|
| 只有远程新增提交，本地没有提交 | `git pull --ff-only origin master` |
| 本地有提交，但从未推送、没有被别人使用 | `git pull --rebase origin master` |
| 本地和远程都各有提交，且本地提交已推送或可能被同事拉取 | `git fetch origin` + `git merge origin/master` |
| 公共 master/main 分支 | 默认优先 merge，按团队规范执行 |
| 个人功能分支，准备提交合并请求前 | 未被他人依赖时可 rebase 整理历史 |
| 拿不准是否能改写历史 | 先 fetch、查看 log，优先 merge |

最重要的判断不是“提交是否在本地”，而是：**提交是否已经进入共享范围**。尚未 push 的提交一般可以 rebase；已经 push 且可能被别人拉取的提交不要随意 rebase。

## 4. 推荐流程

### 工作树干净，开始前同步远程

```powershell
git status
git pull --rebase origin master
```

### 本地和远程都已有提交

保留历史的安全方式：

```powershell
git fetch origin
git merge origin/master
git push origin master
```

本地提交未共享、希望直线历史：

```powershell
git pull --rebase origin master
git push origin master
```

### 本地有未提交修改

```powershell
git stash
git pull --rebase origin master
git stash pop
```

也可以先提交，再进行 merge 或 rebase。

## 5. 冲突处理

```powershell
git status
# 手工编辑冲突文件，删除冲突标记
git add <已解决的文件>
```

merge 冲突完成：

```powershell
git commit
# 取消：git merge --abort
```

rebase 冲突完成：

```powershell
git rebase --continue
# 取消：git rebase --abort
```

## 6. 安全规则

- 同步前先看 `git status`；
- `git fetch` 适合先观察远程变化；
- 不要用 `git push --force` 解决普通 push 被拒绝；
- 确需覆盖自己维护的远程分支时，优先 `git push --force-with-lease`，并先确认远程状态；
- 公共分支尽量少做历史改写，多人协作最好使用功能分支和合并请求。

## 7. HK14 本次例子

你执行：

```powershell
git fetch origin
git merge origin/master
git push
```

这是 **merge 方案**：保留了你的提交和同事的提交，并生成合并提交，最终安全推送。处理正确；已经推送后，不需要再为了“变直线”而改写历史。

## 一句话记忆

```text
未共享的个人提交：可以 rebase；
已经共享的公共历史：优先 merge；
拿不准时：先 fetch、看 log，再决定。
```
