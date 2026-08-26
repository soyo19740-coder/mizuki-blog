---
title: "第 12 节：用户与权限综合实战"
published: 2026-08-26T09:56:15+08:00
description: 综合使用 chmod、chown、chgrp 和 namei -l，理解文件与目录权限差异并排查路径访问问题。
image: ''
tags: [Linux, 权限, 用户, chmod, chown, chgrp, namei, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 学习目标

- 综合检查文件所有者、所属组和权限。
- 理解文件权限与目录权限的区别。
- 使用 `chmod`、`chown`、`chgrp` 和 `namei -l` 排查访问问题。

## 风险说明

`chmod` 和 `chown` 会改变访问控制和所有权。本节操作限定在 `~/linux-learning/lesson-12`，不要对 `/etc`、`/usr` 或真实项目目录执行。

## 实际练习

练习文件：`~/linux-learning/lesson-12/shared/report.txt`

```bash
chmod 750 shared/
chmod 640 shared/report.txt
```

结果：

```text
drwxr-x--- shared/
-rw-r----- shared/report.txt
```

含义：目录所有者可读、写、进入；所属组可读、进入；其他用户无权限。文件所有者可读写；所属组只读；其他用户无权限。

设置所有权：

```bash
sudo chown soyo:soyo shared/report.txt
chgrp soyo shared
```

`chown user:group` 同时设置用户和组；`chgrp group` 只设置组。

## 权限故障模拟

```bash
chmod 640 shared/
ls -ld shared/
cd shared/
```

目录显示：`drw-r-----`。随后 `cd shared/` 返回 `Permission denied`，原因是目录没有 `x`（执行/进入）权限。目录即使有 `r`，没有 `x` 也不能进入或通过路径访问其中内容。

恢复：

```bash
chmod 750 shared/
cat shared/report.txt
```

恢复后成功读取：

```text
Monthly report
Status: complete
```

## 路径权限检查

```bash
namei -l "$PWD/shared/report.txt"
```

实际输出确认了 `lesson-12`、`shared` 和 `report.txt` 每一级的权限、所有者和所属组。`namei -l` 不只是查看所有权，还能定位路径中任一级目录缺少 `x` 等权限问题。

## 其他操作与纠正

```bash
chmod 000 lesson-12
chmod 777 lesson-12
```

这组操作验证了权限全部关闭时目录无法正常访问，恢复后可以进入。但 `777` 会给所有用户读、写、进入权限，不适合长期保留。练习结束应执行：

```bash
chmod 750 ~/linux-learning/lesson-12
```

`cd...` 是错误写法；命令与路径必须用空格分开：`cd ..`。

## 命令速查

| 任务 | 命令 |
| --- | --- |
| 查看目录自身属性 | `ls -ld shared` |
| 设置目录权限 | `chmod 750 shared` |
| 设置文件权限 | `chmod 640 shared/report.txt` |
| 同时设置用户和组 | `sudo chown soyo:soyo shared/report.txt` |
| 只设置所属组 | `chgrp soyo shared` |
| 检查路径各级权限 | `namei -l "$PWD/shared/report.txt"` |

## 本节状态

已完成实操验收。重点记忆：文件的 `r/w/x` 与目录的 `r/w/x` 含义不同；目录访问通常必须具备 `x`；排障时应从路径每一级检查权限。
