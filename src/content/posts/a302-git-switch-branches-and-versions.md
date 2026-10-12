---
title: "A302 Git 分支与版本切换笔记"
published: 2026-10-12T17:55:41+08:00
description: 整理 A302 仓库中 Git 分支、标签与远程跟踪分支的区别，以及版本切换、合并处理和提交推送流程。
image: ''
tags: [Git, switch, 分支管理, 标签, 版本控制, A302]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

# A302 Git 分支与版本切换笔记

整理日期：2026-10-12

## 1. 仓库与检查结果

仓库：`D:\project_afeng\a302\a302_code\a302motor\motor`

本次检查时：

- 当前本地分支为 `a302-motor`。
- 本地比 `origin/a302-motor` 多 1 个提交，远程比本地多 7 个提交。
- 合并尚未结束，`app_task.c` 和 `config.c` 显示 `UU`，表示仍有未解决的冲突。
- 工作区存在已修改文件和大量未跟踪文件。
- 本地分支列表中没有 `a302_v2.0`。

这些是本次检查时的状态，后续操作前应重新执行 `git status` 确认。

## 2. 图片中的名称含义

| 名称 | 类型 | 含义 |
| --- | --- | --- |
| `a302_v2.0` | 标签 | 固定标记一个版本提交 |
| `origin/a302-motor` | 远程跟踪分支 | 本地记录的远程分支状态 |
| `hk1001_v2.0` | 标签 | 另一个版本标记 |
| `origin/master` | 远程跟踪分支 | 本地记录的远程 master 状态 |

本次检查确认，标签 `a302_v2.0` 与 `origin/a302-motor` 都指向：

```text
ce1496b Keep the first line clear of the Y home stop
```

更正：此前将图片黄色标签解释为本地分支并不准确；本仓库中这两个版本名称实际是 Git 标签。

标签通常固定不动，分支会随着新提交向前移动。标签与分支允许同名，但容易产生歧义。

## 3. 三种创建分支命令

| 命令 | 创建分支的起点 |
| --- | --- |
| `git switch -c a302_v2.0` | 当前 HEAD 所在提交 |
| `git switch -c a302_v2.0 origin/a302-motor` | 本地记录的远程 a302-motor 提交 |
| `git switch -c a302_v2.0 refs/tags/a302_v2.0` | 标签 a302_v2.0 对应的固定提交 |

以上命令都会创建并切换到普通本地分支，可以继续提交，不会进入分离头指针状态。

如果希望使用远程分支最新代码，先执行 `git fetch origin`，再从 `origin/a302-motor` 创建分支。如果希望准确使用 2.0 版本，明确从标签创建。

远程分支以后可能继续更新，因此“远程最新节点”和“2.0 标签节点”不一定始终相同。

## 4. 命令逐项解释

```powershell
git switch -c a302_v2.0 origin/a302-motor
```

- `switch`：切换分支。
- `-c`：创建新分支。
- `a302_v2.0`：要创建的本地分支名称。
- `origin/a302-motor`：新分支的起点。

`origin/a302-motor` 是本地保存的远程状态，并非实时读取服务器；通过 `git fetch origin` 更新。

```powershell
git switch -c a302_v2.0 refs/tags/a302_v2.0
```

其中 `refs/tags/a302_v2.0` 是标签的完整引用名：

| 引用路径 | 类型 |
| --- | --- |
| `refs/heads/a302_v2.0` | 本地分支 |
| `refs/tags/a302_v2.0` | 标签 |
| `refs/remotes/origin/a302-motor` | 远程跟踪分支 |

这里使用已有标签作为起点，不会创建或上传标签。

## 5. 查看本地是否已有同名分支

```powershell
git branch --list
git branch --list a302_v2.0
```

第二条有输出表示存在，没有输出表示不存在。`*` 表示当前分支。

若分支存在，执行：

```powershell
git switch a302_v2.0
```

此命令只切换到已有分支，不会把它自动更新到远程最新提交。

## 6. 当前仓库有未完成合并时如何处理

先检查：

```powershell
git status
git diff --name-only --diff-filter=U
```

由于当前有冲突，不能直接 stash 后切换分支。先将整个仓库目录（包括隐藏的 .git 目录和未跟踪文件）复制到另一个备份目录，再处理合并。

如果决定取消本次合并：

```powershell
git merge --abort
```

该操作会撤销本次合并及冲突解决进度。合并前已有未提交修改时，Git 不一定能完整恢复它们，因此需要先做目录备份。如果命令失败，停止后续操作并查看错误，不要直接使用强制重置。

取消合并成功后，保存剩余本地修改：

```powershell
git stash push -u -m "backup before switching to a302_v2.0"
git status
```

`-u` 包括未跟踪文件，但不包括被 .gitignore 忽略的文件。目录备份用于覆盖这些内容。已有本地提交仍保留在原分支上。

如果要保留合并结果，则应先解决冲突、暂存经过确认的文件并完成合并提交，再处理剩余修改和分支切换。

## 7. 从远程最新节点创建分支

确认合并已结束、工作区修改已妥善保存，且本地分支不存在后：

```powershell
git fetch origin
git switch -c a302_v2.0 --no-track origin/a302-motor
```

这里添加 `--no-track`，让新分支暂时不关联远程上游。普通写法可能自动跟踪 `origin/a302-motor`；若打算以后创建独立远程分支，这种写法更明确。

如希望精确使用标签版本，改用：

```powershell
git switch -c a302_v2.0 refs/tags/a302_v2.0
```

以上两条创建命令按目标选择一条执行。

## 8. 检查是否处于普通分支

```powershell
git status
git branch -vv
git log -1 --oneline --decorate
```

看到以下信息说明当前是普通分支：

```text
On branch a302_v2.0
HEAD -> a302_v2.0
```

如果从标签直接执行 `git switch --detach refs/tags/a302_v2.0`，则会进入分离头指针状态。本次目标是后续继续提交，因此使用 `switch -c`。

## 9. 后续提交与推送

先检查修改，只暂存需要提交的文件：

```powershell
git status
git add fw_app/usr/app_task.c
git diff --cached
git commit -m "说明本次修改"
```

文件名仅为示例。仓库存在压缩包、文档和其他未跟踪目录时，不宜直接使用 `git add .`。

如需把新分支上传到远程，并且本地标签与分支同名，使用完整引用避免歧义：

```powershell
git -c push.followTags=false push -u origin refs/heads/a302_v2.0:refs/heads/a302_v2.0
```

这会上传分支并设置上游；`push.followTags=false` 明确关闭自动附带标签。远程服务器仍可能根据权限或仓库规则拒绝创建分支。

更正：标签与分支同名时，简写 `git push -u origin a302_v2.0` 可能报告引用匹配多个对象，应使用上面的完整引用。

如果只在本地工作，无需执行 push。

## 10. 恢复 stash

```powershell
git stash list
git stash apply 'stash@{0}'
```

先核对记录，再应用对应的 stash。`apply` 会保留备份记录，方便确认恢复结果。旧修改应用到新版本可能产生冲突。

确认恢复完成且备份不再需要后，才执行：

```powershell
git stash drop 'stash@{0}'
```

## 11. 常用命令速查

```powershell
git fetch origin                 # 更新远程跟踪分支
git fetch origin --tags          # 更新远程分支并获取标签
git branch -a                    # 查看本地和远程跟踪分支
git tag --list                   # 查看标签
git show --no-patch refs/tags/a302_v2.0
git log -1 --oneline --decorate  # 查看当前提交及引用
git status                       # 查看工作区与合并状态
```

fetch 获取数据；switch 切换本地分支；commit 创建本地提交；push 才会向远程发送更新。
