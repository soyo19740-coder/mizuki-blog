---
title: "第 2 课：clone 与仓库四个区域"
published: 2026-08-03T22:42:02+08:00
description: 克隆真实 GitHub 开源项目，理解 origin、main、origin/main，以及 Git 工作区、暂存区、本地仓库和远程仓库。
image: ''
tags: [Git, GitHub, clone, 远程仓库, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-03

## 本课目标

- 克隆一个真实 GitHub 开源项目
- 认识 `origin`、`main`、`origin/main`
- 初步理解工作区、暂存区、本地仓库、远程仓库

## 本课实际使用的项目

- 仓库：`https://github.com/github/gitignore.git`
- 选择原因：
  - 真实开源项目
  - GitHub 官方维护
  - 仓库小，下载快
  - 适合后续练习 `diff`、分支、合并、PR、`.gitignore`

## 关键命令

### `git clone https://github.com/github/gitignore.git`

- 作用：把远程仓库复制到本地
- 关键参数：
  - `clone` 表示克隆
  - 后面的 URL 是远程仓库地址
- 影响区域：
  - 新建本地仓库
  - 生成工作区文件
  - 自动配置远程 `origin`
  - 不改远程仓库内容

### `git status`

- 作用：检查克隆后的本地仓库状态
- 影响区域：不改任何区域
- 典型结果：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### `git remote -v`

- 作用：查看本地配置了哪些远程仓库
- 关键参数：`-v` 显示 fetch 和 push 地址
- 影响区域：不改任何区域

### `git branch -vv`

- 作用：查看当前分支及其跟踪关系
- 关键参数：`-vv` 显示更详细的跟踪信息
- 影响区域：不改任何区域

### `git log --oneline --graph --decorate -n 5`

- 作用：看最近提交和分支位置
- 关键参数：
  - `--oneline` 单行显示
  - `--graph` 画分支图
  - `--decorate` 显示分支/标签
  - `-n 5` 只看 5 条
- 影响区域：不改任何区域

## 这节课学到的三个核心概念

### `origin` 是什么

`origin` 是本地给远程仓库起的默认别名。它通常在 `clone` 时自动创建，方便后续使用 `git fetch origin`、`git push origin main` 这样的写法。

### `main` 和 `origin/main` 的区别

- `main`：当前本地分支
- `origin/main`：本地记录的远程跟踪分支状态

`origin/main` 不是你当前正在编辑的分支，而是你本地保存的一份“远程参考位置”。

### `working tree clean` 说明什么

- 工作区没有未提交修改
- 暂存区也没有待提交内容

## `clone` 一次做了什么

`git clone` 一次性完成了这些事：

- 下载远程仓库历史到本地
- 创建本地 Git 仓库
- 检出默认分支，生成工作区文件
- 配置默认远程 `origin`
- 建立本地分支和远程跟踪分支关系

## 本课小结

- 第一个真实 GitHub 项目已完成克隆
- 已开始接触 Git 四个区域，但还没有修改文件
- 下一步就是在工作区动手改文件，并用 `git diff` 看变化
