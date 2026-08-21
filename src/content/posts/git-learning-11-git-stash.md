---
title: "第 11 课：git stash 临时保存工作"
published: 2026-08-18T14:36:54+08:00
description: 使用 git stash 临时收起未提交修改、恢复干净工作区，并学习查看、应用和管理 stash 记录。
image: ''
tags: [Git, stash, 工作区, 暂存修改, 分支切换, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 本课目标

学会在真实项目中临时收起未提交修改，使工作区恢复干净，从而安全切换分支或处理其他任务；之后再恢复这份修改。

练习仓库：`D:\WorkApps\git-learning\gitignore`，即 GitHub 开源项目 `github/gitignore` 的本地克隆。

## stash 是什么

stash 是本地仓库中的“临时修改栈”。它保存尚未提交的工作，并通常把工作区恢复成当前 `HEAD` 的干净版本。

```text
执行前：
工作区 README.md = 有未提交修改
stash 栈 = 无新记录

执行 git stash push 后：
工作区 README.md = 恢复为 HEAD 对应版本
stash@{0} = 保存刚才的未提交修改
```

因此 stash 不是“复制一份后让修改继续留在工作区”，而是“保存后暂时收起”。它的用途是腾出干净工作区。

## 练习过程

在 `main` 的 README 末尾添加了：

```text
Stash note: temporary README work.
```

随后用 `git diff -- README.md` 确认该修改尚未暂存。

## 使用的命令

### `git stash push -m "说明" -- README.md`

作用：将 README 的当前未提交修改保存到 stash，并恢复该文件的工作区版本。

关键参数：

- `push`：新增一条 stash 记录。
- `-m "说明"`：为 stash 写说明，便于后续识别。
- `-- README.md`：只处理指定路径。`--` 表示前面的选项结束，后面是文件路径。

示例：

```powershell
git stash push -m "lesson11: temporary README work" -- README.md
```

影响区域：

- 工作区：指定文件的未提交修改会被收起，工作区通常恢复干净。
- 暂存区：stash 会记录当前暂存区状态；本课暂存区为空。
- 本地仓库：新增 stash 记录，保存在本地。
- 远程仓库：不受影响。

预期输出包含：

```text
Saved working directory and index state On main: lesson11: temporary README work
```

若输出 `No local changes to save`，表示指定路径没有可保存的修改。

### `git stash list`

作用：按从新到旧的顺序列出本地 stash 记录。

示例输出：

```text
stash@{0}: On main: lesson11: temporary README work
```

`On main` 仅说明这条记录是在 main 分支创建的，不表示它只能在 main 使用。

影响区域：只读取本地仓库；不改变任何区域。

每次执行 `git stash push` 都会新增一条记录：新记录成为 `stash@{0}`，旧的 `stash@{0}` 依次变为 `stash@{1}`、`stash@{2}` 等。因此不要因为不确定而反复执行 `push`。

### `git stash show -p 'stash@{0}' -- README.md`

作用：查看某一条 stash 保存的具体差异。

关键参数：

- `show`：查看 stash 内容。
- `-p`：输出逐行补丁差异。
- `'stash@{0}'`：指定最新 stash。PowerShell 中单引号可避免特殊字符被误解析。
- `-- README.md`：只查看 README 的内容。

影响区域：只读取本地仓库；不改变任何区域。

### `git stash apply 'stash@{0}'`

作用：把指定 stash 的内容尝试恢复到当前分支的工作区，但保留 stash 记录。

影响区域：改变工作区，必要时也可能恢复暂存区状态；不改提交历史和远程仓库；stash 记录保留。

适用场景：第一次恢复、跨分支恢复、或不确定恢复结果时优先使用。确认正确前不要急于删除 stash。

### `git stash pop 'stash@{0}'`

作用：应用指定 stash；如果应用成功，再删除这条 stash。

影响区域：改变工作区；成功后删除本地 stash 记录；不改远程仓库。

风险：如果恢复后发现内容不符合预期，原 stash 已被删除，恢复路径更麻烦。因此初次恢复优先使用 `apply`。

若 `pop` 产生冲突，Git 通常会保留 stash 记录；应停止后续操作，在 VS Code 处理冲突。

## 跨分支恢复

stash 属于整个本地仓库，不属于某条分支。可以这样在另一分支上恢复：

```powershell
git switch 目标分支
git status
git stash apply 'stash@{0}'
```

但跨分支恢复是否无冲突取决于目标分支的文件版本：

- 同一文件内容相近且改动不重叠，通常可直接恢复。
- 同一位置被目标分支修改，可能产生冲突，需要在 VS Code 解决。
- 文件不存在或结构变化很大，也可能无法自动应用。

恢复前应先确认目标分支工作区干净。

## 本课状态总结

- 工作区：`stash push` 会将未提交修改收起；`apply` 或 `pop` 会恢复它。
- 暂存区：stash 可以一并保存当前暂存状态；本课练习时暂存区为空。
- 本地仓库：stash 记录保存在本地仓库中，并按 `stash@{0}`、`stash@{1}` 编号。
- 远程仓库：本课未执行任何远程操作；stash 不会自动推送。

## 本课结论

1. 需要临时离开未完成工作时，用 `git stash push` 收起修改。
2. 先用 `git stash list` 和 `git stash show -p` 确认要恢复的记录。
3. 不确定或跨分支恢复时优先 `git stash apply`。
4. 确认恢复正确且不再需要备份时，才使用 `git stash pop` 或后续的删除命令。
