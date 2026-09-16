---
title: "第24课：git fetch 获取远程更新"
published: 2026-09-14T16:19:21+08:00
description: 学习使用 git fetch 获取远程更新，并在不修改当前工作分支的前提下检查远程变化。
image: ''
tags: [Git, fetch, 远程仓库, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第24课：git fetch 获取远程更新

## 本课目标

理解 `fetch` 只获取远程信息，不会自动把远程修改合并进当前本地分支。

## 实际命令

```powershell
git fetch origin
```

- `fetch`：下载远程新增的提交、分支和标签信息。
- `origin`：要访问的远程仓库别名。
- 改变范围：更新本地仓库中的 `origin/*` 远程跟踪引用。
- 不改变：当前本地分支、工作区和暂存区。
- 不会向远程写入任何内容。

## 本次实际输出

```text
52f5a2b..356fd7b  main -> origin/main
```

这表示本地记录的 `origin/main` 从 `52f5a2b` 更新到了 `356fd7b`。本地 `main` 没有随之移动。

更新后观察到：

```text
main [origin/main: ahead 20, behind 31]
```

- `ahead 20`：本地 `main` 有 20 个提交不在 `origin/main`。
- `behind 31`：`origin/main` 有 31 个提交不在本地 `main`。
- 两条历史已经分叉。

## 查看结果

```powershell
git branch -vv
git log --oneline --graph --decorate --all -n 12
```

这两条命令只读取本地仓库，用于查看本地分支与远程跟踪分支的位置。

## 常见问题

- 没有输出：远程可能没有新内容，这不一定是错误。
- HTTPS 网络错误：检查网络、代理及远程地址。
- SSH 公钥错误：确认当前远程是否使用 SSH 地址。
- 获取成功不等于已经合并：必须根据项目策略另行执行 merge、rebase 或 pull。
