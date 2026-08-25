---
title: switch 后切换到分支上提交
published: 2026-08-25T17:23:01+08:00
description: 记录从 detached HEAD 返回正常分支、在指定提交之后继续开发和推送，以及保存或清理分离头指针提交的方法。
image: ''
tags: [Git, 分支, switch, detached HEAD, commit, push]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

本文记录在 Git Graph 中查看历史提交后，如何回到正常分支，并将代码提交到指定提交节点之后。

## 一、理解当前状态

`git switch -d <提交号>`（`-d` 是 `--detach` 的缩写）会将 HEAD 直接指向某一个提交。例如：

```powershell
git switch -d d9cb6bd
```

此时会进入 **detached HEAD（分离头指针）** 状态：

```text
HEAD detached at d9cb6bd
```

这适合查看旧版本或理解提交树，但当前并不在任何分支上。此时虽然可以提交代码，提交也没有分支名承载；直接执行 `git push` 会报错：

```text
fatal: You are not currently on a branch.
```

> Git Graph 中线条的颜色和左右位置只是显示方式，不代表主线或分支的真实含义。分支本质上是指向某个提交的名称，例如 `a302-motor`、`master`。

## 二、查看本地分支与当前位置

```powershell
git branch -vv
```

示例：

```text
* (HEAD detached at d9cb6bd) d9cb6bd Speed up print sweep and line turnaround
  a302-motor                 d9cb6bd [origin/a302-motor] Speed up print sweep and line turnaround
```

这表示 `a302-motor` 已经指向 `d9cb6bd`，因此可以安全地切换到该分支。带 `*` 的一行是当前所在位置。

## 三、在 d9cb6bd 后直接提交到 a302-motor

如果确认团队允许直接向 `a302-motor` 推送，且该分支正好指向目标节点 `d9cb6bd`，执行：

```powershell
git switch a302-motor
git status
git diff -- fw_app/usr/app_task.c
git add fw_app/usr/app_task.c
git commit -m "Turn off UV light on lid close"
git push origin a302-motor
```

提交关系会变为：

```text
origin/a302-motor
  └─ d9cb6bd  Speed up print sweep and line turnaround
       └─ 新提交  Turn off UV light on lid close
```

`git add` 应只加入本次修改的文件；不要在存在大量未跟踪文件时直接使用 `git add .`。

## 四、不直接改动 a302-motor：从 d9cb6bd 新建功能分支

如果项目要求通过合并请求（Merge Request / Pull Request）合入，或不确定能否直接推送共享分支，创建功能分支：

```powershell
git switch -c feature/uv-lid-close d9cb6bd
git add fw_app/usr/app_task.c
git commit -m "Turn off UV light on lid close"
git push -u origin feature/uv-lid-close
```

提交关系：

```text
origin/a302-motor
  └─ d9cb6bd
       └─ feature/uv-lid-close
            └─ 新提交
```

之后在代码平台创建合并请求，目标分支选择 `a302-motor`。

## 五、从 detached HEAD 中保存提交

若已经在 detached HEAD 下创建了提交，例如：

```text
97122a9 Add feature to turn off UV light on lid close
```

先为它建立分支，避免后续切换时难以定位：

```powershell
git switch -c feature/uv-lid-close 97122a9
```

如果只是想回到正常开发分支，不继续使用该提交：

```powershell
git switch a302-motor
```

## 六、删除不需要的 detached HEAD 提交

先离开该提交：

```powershell
git switch a302-motor
```

确认没有分支或标签引用它：

```powershell
git branch --contains 97122a9
git tag --contains 97122a9
```

没有输出时，该提交已不再被分支或标签引用。Git 通常会在一段时间后自动清理它，且在清理前仍可能通过 reflog 找回。

若确定要立即清理所有悬空提交：

```powershell
git reflog expire --expire=now --all
git gc --prune=now
```

> 警告：这两条命令会清理仓库中**所有**未被分支或标签引用的提交，而不只一个指定提交；执行前应确认没有需要保留的 detached HEAD 提交。

## 七、常用检查命令

```powershell
# 当前分支、工作区状态、远程跟踪状态
git status
git branch -vv

# 显示全部分支的提交图
git log --oneline --decorate --graph --all --date-order

# 查看某个分支比远程多出的提交
git log --oneline origin/master..master

# 查看最近 HEAD 的移动与提交记录
git reflog -n 15
```
