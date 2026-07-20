---
title: 删除 Git 数据并重新推送到新仓库
published: 2026-07-20T12:08:38+08:00
description: 记录在 Windows PowerShell 中删除旧项目的 .git 数据、重新初始化仓库、创建首次提交并推送到全新 GitHub 仓库的完整流程。
image: ''
tags: [Git, GitHub, 仓库迁移, 版本控制]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-20

## 适用场景

需要保留当前项目源码，但不保留原仓库的提交历史、分支、标签和远程地址；随后将代码作为全新项目推送到自己新建的 GitHub 仓库。

本文使用 PowerShell 命令，适用于 Windows。

## 操作前提

1. 已经通过 `git clone` 获得项目源码，或当前目录本身就是需要处理的 Git 项目。
2. GitHub 上已创建一个空仓库。创建时不要勾选 `Add a README file`、`.gitignore` 或 License，以免首次推送发生历史冲突。
3. 已确认当前目录就是目标项目的根目录。删除 `.git` 后，旧提交历史无法从本地仓库恢复。

## 核心命令

```powershell
Remove-Item -LiteralPath .git -Recurse -Force
```

命令含义：

- `Remove-Item`：删除文件或目录。
- `-LiteralPath .git`：精确指定当前目录中的 `.git` 目录，不将其当作通配符解释。
- `-Recurse`：递归删除 `.git` 内全部文件和子目录。
- `-Force`：处理隐藏文件、只读文件等普通删除可能跳过的内容。

`.git` 保存 Git 的提交对象、分支、标签、暂存区和远程地址配置。删除它不会删除项目源码，但会使当前目录不再是 Git 仓库。

## 完整操作流程

以下以 FastLED 项目为例。`<你的用户名>` 和 `<新仓库名>` 必须替换为自己的 GitHub 信息。

```powershell
# 1. 进入项目根目录，并确认位置
cd "D:\WorkApps\github project\FastLED"
Get-Location

# 2. 可选：查看删除前的旧历史
git log --oneline -5
git remote -v

# 3. 删除旧 Git 数据，不删除源码
Remove-Item -LiteralPath .git -Recurse -Force

# 4. 创建一个全新的 Git 仓库，初始分支名为 main
git init -b main

# 5. 将现有源码作为新仓库的第一次提交
git add -A
git commit -m "Initial commit: import FastLED source"

# 6. 关联新建的 GitHub 空仓库
git remote add origin https://github.com/<你的用户名>/<新仓库名>.git

# 7. 推送并建立上游跟踪关系
git push -u origin main
```

## 验证结果

```powershell
git status
git branch -vv
git log --oneline --graph --decorate --all
git remote -v
```

预期结果：

- 当前分支是 `main`。
- `git log` 只有自己创建的一条首次提交。
- `origin` 指向自己的新仓库。
- `git status` 显示工作区干净。

## 常见问题

### `error: No such remote 'origin'`

删除 `.git` 会同时删除原有远程配置。使用以下命令添加新远程：

```powershell
git remote add origin https://github.com/<你的用户名>/<新仓库名>.git
```

### `error: src refspec main does not match any`

通常表示 `main` 尚未有提交，或当前分支不是 `main`。执行：

```powershell
git branch --show-current
git add -A
git commit -m "Initial commit"
```

确认已有提交后，再执行：

```powershell
git push -u origin main
```

### `On branch master; nothing to commit, working tree clean`

这通常说明旧 `.git` 没有被删除，或者在错误目录中执行了命令。先运行：

```powershell
Get-Location
Test-Path .git
git log --oneline -5
```

确认路径无误后，重新从删除 `.git` 开始执行完整流程。

### GitHub 拒绝推送

若新 GitHub 仓库已包含 README、License 或其他首次提交，首次 `git push` 可能被拒绝。练习时最简单的解决方式是重新创建一个真正空的仓库；不要对不确定内容使用强制推送。

## 注意事项

- 执行 `Remove-Item -LiteralPath .git -Recurse -Force` 前必须使用 `Get-Location` 确认目录。
- 不要在 `D:\WorkApps\github project` 这类包含多个项目的上级目录执行该命令。
- 开源项目的源码历史可以清除，但原项目的 `LICENSE`、版权声明和署名要求仍应保留并遵守。
