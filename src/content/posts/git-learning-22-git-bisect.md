---
title: "第22课：git bisect 定位问题提交"
published: 2026-09-09T17:42:20+08:00
description: 学习使用 git bisect 通过二分查找定位引入问题的提交，并完成手动排查与状态恢复。
image: ''
tags: [Git, bisect, 故障定位, 版本控制, GIT学习]
category: 学习记录
learningSection: GIT学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第22课：git bisect 定位问题提交

## 本课结论

`git bisect` 使用二分法，在一段提交历史中定位“哪个提交首次引入问题”。它适合测试结果可以明确判断为好或坏的场景。

## 基本流程

```powershell
git bisect start
git bisect bad
git bisect good <good-commit>
```

- `start`：开始 bisect 状态。
- `bad`：标记当前版本为有问题。
- `good <good-commit>`：标记一个已知正常的提交。
- Git 会自动切换到中间提交，等待测试结果。

测试当前提交后继续标记：

```powershell
git bisect good
git bisect bad
```

不断缩小范围，直到 Git 找到首个坏提交。

结束查找：

```powershell
git bisect reset
```

它会退出 bisect 状态并回到开始前的分支位置。

## 注意事项

- bisect 期间通常处于 detached HEAD，不要在中间测试提交上开发。
- `good` 和 `bad` 必须依据同一个明确测试条件判断。
- bisect 会切换工作区内容，但不会改写已有提交历史。
- 本课只学习用途和流程，未进行实际 bisect 操作。
