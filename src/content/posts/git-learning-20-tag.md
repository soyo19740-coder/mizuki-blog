---
title: "第20课：tag 版本标签"
published: 2026-09-09T17:28:43+08:00
description: 学习创建、查看、推送和删除 Git 标签，掌握使用 tag 标记软件版本的方法。
image: ''
tags: [Git, tag, 版本标签, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第20课：tag 版本标签

## 本课目标

理解 Git 标签如何固定标记一个历史提交，并能安全创建和检查注释标签。

## 核心结论

- 标签通常指向一个具体的提交节点，不是整个分支。
- 分支会随着新提交移动；标签创建后通常保持不动。
- `git tag -a` 创建带作者、日期和说明的注释标签。
- 标签默认只在本地仓库中；不会自动推送到 GitHub。

## 本次实际标签

```text
v0.1.0 -> cead0e9（lwt 分支上的历史提交）
v0.1.1 -> b81b21f（创建时 main 的 HEAD）
```

即使 `main` 后续产生新提交，`v0.1.1` 仍会指向 `b81b21f`。

## 常用命令

### 列出指定标签

```powershell
git tag --list v0.1.0
```

- 作用：检查本地是否已有该标签。
- 改变范围：不改变任何区域，只读取本地仓库。
- 常见问题：若创建同名标签，Git 会提示 `tag '...' already exists`。

### 查看标签内容

```powershell
git show v0.1.1
```

- 作用：查看标签说明、创建者、创建时间及其指向的提交。
- 改变范围：不改变任何区域，只读取本地仓库。

### 创建注释标签

```powershell
git tag -a v0.1.1 -m "release: Git practice milestone on main" HEAD
```

- `-a`：创建注释标签，会保存 Tagger、日期和说明。
- `-m`：`--message` 的缩写，后面是标签说明，不决定标签指向位置。
- `HEAD`：当前提交；也可替换为任意已有提交哈希，例如 `cead0e9`。
- 改变范围：只新增本地仓库中的标签对象，不改变工作区、暂存区、分支或远程仓库。
- 风险：不要随意用 `-f` 覆盖发布过的标签，否则别人可能得到不同版本内容。

### 区分标签对象与目标提交

```powershell
git rev-parse v0.1.0
git rev-parse 'v0.1.0^{}'
```

- 第一条：对注释标签，输出标签对象的哈希。
- 第二条：`^{}` 解引用标签，输出其实际指向的提交哈希。
- 改变范围：不改变任何区域，只读取本地仓库。

## 标签与分支

```text
main   -> 当前最新提交，会继续移动
v0.1.1 -> 创建标签时的提交，通常固定不动
```

可以给历史提交打标签：

```powershell
git tag -a v0.0.9 cead0e9 -m "release: mark historical milestone"
```

## 远程发布提示

当远程仓库是自己的 fork 后，才可以推送单个标签：

```powershell
git push origin v0.1.1
```

不要向 `github/gitignore` 上游仓库推送练习标签。
