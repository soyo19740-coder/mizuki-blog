---
title: "第 8 课：branch、switch、checkout"
published: 2026-08-06T11:22:10+08:00
description: 理解 Git 分支的指针本质，掌握 branch、switch、checkout 的职责，并分析一次真实的分支命名空间冲突。
image: ''
tags: [Git, branch, switch, checkout, 分支, Git基础]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-06

## 本课目标

- 理解“分支”本质上是什么
- 理解为什么真实项目开发必须使用分支
- 学会查看当前分支、切回主线、从主线创建新分支
- 理解一次真实的分支命名冲突

## 一、分支本质是什么

分支不是复制一整份项目。

更准确的理解是：

- 分支本质上是一个**指向某个提交的可移动指针**

例如在本课开始前，本地主线可以理解成：

- `main -> 142683a`

当创建新分支时，Git 并不会复制整个仓库，而是新建一个分支名，也先指向这个提交。

## 二、为什么真实项目一定要用分支

真实项目里不应该长期直接在 `main` 上开发，原因包括：

1. `main` 往往代表主线、稳定线
2. 新功能、实验、修复、文档改动应该隔离
3. 出错时不会立刻污染主线
4. 后续 Pull Request、Code Review、合并冲突处理都依赖分支

## 三、本课先遇到的真实问题

### 当时的实际分支状态

开始时运行：

```bash
git status
git branch --show-current
git branch
```

得到的关键结果是：

- 当前分支不是 `main`
- 当前分支是：`123`
- 本地已有分支：
  - `123`
  - `feature`
  - `main`

这说明一个非常重要的实战习惯：

在创建新分支前，必须先确认自己当前站在哪个分支上。

## 四、一次真实的分支命名冲突

本来打算创建：

```bash
git switch -c feature/learning-branch
```

结果报错：

```text
fatal: cannot lock ref 'refs/heads/feature/learning-branch': 'refs/heads/feature' exists; cannot create 'refs/heads/feature/learning-branch'
```

### 为什么失败

因为本地已经存在一个分支：

```text
feature
```

Git 内部把分支名当成路径管理：

- `feature` 对应 `refs/heads/feature`
- `feature/learning-branch` 对应 `refs/heads/feature/learning-branch`

如果已经有了 `feature`，Git 就不能再创建 `feature/learning-branch`。

### 这不是“完整分支名重复”

失败原因不是“`feature/learning-branch` 已存在”，而是：

- 父级名字 `feature` 已被占用
- 命名空间冲突

## 五、本课最终采用的正确做法

### 先切回主线

```bash
git switch main
```

执行后结果：

- 成功切回 `main`
- 当前分支重新变成主线

### 再创建不冲突的新分支

```bash
git switch -c lesson8-learning-branch
```

执行成功后结果：

- 创建了 `lesson8-learning-branch`
- 并立即切换到这个新分支

## 六、本课 3 个命令的职责

### `git branch --show-current`

- 作用：只显示当前所在分支名
- 改哪个区域：不改工作区、暂存区、本地仓库、远程仓库

### `git branch`

- 作用：列出本地分支
- 带 `*` 的分支表示当前所在分支
- 改哪个区域：不改任何区域

### `git switch`

最常见两种用法：

```bash
git switch main
git switch -c lesson8-learning-branch
```

作用分别是：

- 切换到已有分支
- 创建并切换到新分支

它改的是：

- 当前分支位置
- `HEAD` 指向
- 必要时同步工作区到目标分支状态

它不做的事：

- 不直接创建提交
- 不改远程仓库

## 七、为什么切到新分支后文件看起来几乎没变化

因为刚创建出的 `lesson8-learning-branch` 和 `main` 当前指向的是**同一个提交**。

也就是说：

- `main -> 142683a`
- `lesson8-learning-branch -> 142683a`

文件内容之所以看起来一样，是因为两个分支现在还没开始分叉。

真正重要的是：

- 从这一刻开始，你后续的新提交会先落在 `lesson8-learning-branch`
- 不会直接落在 `main`

## 八、`switch` 和 `checkout` 的关系

### `git switch`

推荐用于：

- 切换分支
- 创建并切换分支

语义清晰，适合现在的学习阶段。

### `git checkout`

这是旧命令，功能很多，例如：

- 切分支
- 恢复文件
- 切到某个提交

因为职责太多，所以对初学者容易混淆。

当前学习中更推荐：

- 切分支用 `git switch`
- 恢复文件用 `git restore`

## 九、本课小结

- 分支本质上是提交指针，不是项目拷贝
- 创建分支前必须先确认当前所在分支
- 分支命名会发生命名空间冲突，不是所有带斜杠的名字都能随便建
- `git switch main` 是切换已有分支
- `git switch -c lesson8-learning-branch` 是创建并切换新分支
- 切到新分支后内容看起来没变，不代表分支没变；只是两个分支此时还指向同一个提交
