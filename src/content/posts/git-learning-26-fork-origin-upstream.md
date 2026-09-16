---
title: "第26课：Fork、origin 与 upstream"
published: 2026-09-14T18:27:02+08:00
description: 学习 Fork 协作模型，理解 origin 与 upstream 的职责，并掌握个人仓库与上游仓库的同步关系。
image: ''
tags: [Git, Fork, origin, upstream, GitHub, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第26课：Fork、origin 与 upstream

## 本课目标

建立真实开源协作的标准远程结构：官方仓库用于获取更新，个人 fork 用于推送自己的分支和发起 Pull Request。

## 本次实际远程结构

```text
upstream -> https://github.com/github/gitignore.git
origin   -> https://github.com/soyo19740-coder/gitignore.git
```

```text
官方 GitHub 仓库                 个人 GitHub fork
github/gitignore                 soyo19740-coder/gitignore
       ^                                  ^
       | upstream                         | origin
       |                                  |
       +----------- 本地 Git 仓库 --------+
```

## 核心概念

- `upstream`：原始官方仓库的本地别名。用于 `fetch` 获取官方更新。
- `origin`：个人 fork 的本地别名。用于推送个人功能分支。
- `upstream/main`：本地记录的官方 main 状态。
- `origin/main`：本地记录的个人 fork main 状态。
- 远程跟踪分支是本地快照，执行 `git fetch` 才会更新。

## 实际执行的配置命令

```powershell
git remote rename origin upstream
```

- 作用：将原来指向官方仓库的 `origin` 改名为 `upstream`。
- 改变范围：本地仓库远程配置和远程跟踪引用名称。
- 不改变：工作区、暂存区、提交内容和任何 GitHub 仓库。

```powershell
git remote add origin https://github.com/soyo19740-coder/gitignore.git
```

- 作用：把个人 fork 添加为新的 `origin`。
- 改变范围：只修改本地仓库远程配置。

```powershell
git fetch origin
```

- 作用：获取个人 fork 的 `origin/main`。
- 改变范围：更新本地远程跟踪引用，不改变工作区、本地分支或远程仓库。

## 同步验证

本次 `origin/main` 与 `upstream/main` 都指向：

```text
356fd7b
```

因此个人 fork 在当时与官方 main 同步。

## 从官方最新代码创建功能分支

```powershell
git switch -c lesson26-remote-practice upstream/main
```

- `-c`：创建并切换到新本地分支。
- `upstream/main`：以官方最新代码作为分支起点。
- 创建结果：`lesson26-remote-practice` 初始跟踪 `upstream/main`。
- 这不代表官方 GitHub 已经有同名分支，也不代表向官方推送了任何代码。

## 标准协作流程

```text
1. git fetch upstream
2. 从 upstream/main 创建本地功能分支
3. 在本地修改并提交
4. git push -u origin <功能分支>
5. 从个人 fork 的分支创建 Pull Request
6. PR 的目标可以是个人 fork 的 main，或在真实贡献时指向官方 upstream/main
```

## 最重要的边界

“从 `upstream/main` 创建分支”表示使用官方代码作为开发起点。

“推送到 `upstream`”表示尝试写入官方仓库。两者不同。本课程只向个人 `origin` 推送练习提交。
