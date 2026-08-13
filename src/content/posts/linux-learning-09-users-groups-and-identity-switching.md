---
title: "第 9 节：用户、组与身份切换"
published: 2026-08-13T17:44:10+08:00
description: 学习 Linux 用户、UID、组、root 与 sudo，使用 whoami、id、groups、getent 和 sudo -l 检查身份与权限。
image: ''
tags: [Linux, 用户, 用户组, UID, GID, sudo, 权限, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-08-13

## 学习目标

- 确认当前 Linux 用户、UID、主组和附加组。
- 理解用户、组、`root` 与 `sudo` 的角色。
- 使用系统数据库查询用户和组信息。
- 安全查看当前用户的 `sudo` 权限。

## 核心概念

| 名称 | 含义 |
|---|---|
| 用户 | 登录 Linux 时使用的身份，例如 `soyo` |
| 组 | 用于统一管理一组用户权限的集合 |
| UID | 用户的数字 ID |
| GID | 用户主组的数字 ID |
| `root` | 系统最高权限用户，UID 通常为 `0` |
| `sudo` | 临时以管理员权限执行一条完整命令 |

Linux 内部主要根据 UID 和 GID 识别用户及其组，而不只是用户名。

## 核心命令

| 命令 | 解决的问题 | 常用参数 |
|---|---|---|
| `whoami` | 当前以哪个用户身份操作 | 无 |
| `id` | 查看 UID、GID 与全部组 | `-u` 只看 UID；`-g` 只看主组 GID；`-nG` 显示组名称 |
| `groups` | 查看所属组 | `groups soyo` 查询指定用户 |
| `getent passwd user` | 查询用户数据库条目 | `getent passwd soyo` |
| `getent group group` | 查询组数据库条目 | `getent group sudo` |
| `sudo -l` | 查看当前用户可通过 sudo 执行的命令 | 可能要求输入 Linux 密码 |

## 实际验收结果

### 当前用户与身份

执行：

```bash
whoami
id
id -u
id -nG
groups
groups soyo
```

实际结果：

```text
soyo
uid=1000(soyo) gid=1000(soyo) groups=1000(soyo),4(adm),20(dialout),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),989(docker)
1000
soyo adm dialout cdrom sudo dip plugdev users docker
```

结论：

- 当前登录用户是 `soyo`。
- UID 是 `1000`。
- 主组 GID 是 `1000`，主组名是 `soyo`。
- 当前用户属于 `sudo` 组，也属于 `docker`、`adm` 等附加组。

### 查询用户信息

执行：

```bash
getent passwd soyo
```

实际输出：

```text
soyo:x:1000:1000:,,,:/home/soyo:/bin/bash
```

字段的关键含义：

| 字段位置 | 实际值 | 含义 |
|---|---|---|
| 1 | `soyo` | 用户名 |
| 3 | `1000` | UID |
| 4 | `1000` | 主组 GID |
| 6 | `/home/soyo` | 家目录 |
| 7 | `/bin/bash` | 默认登录 Shell |

### 查询 sudo 组

执行：

```bash
getent group sudo
```

实际输出：

```text
sudo:x:27:soyo
```

结论：`soyo` 是 `sudo` 组成员，`sudo` 组 GID 为 `27`。

### 查看 sudo 权限

执行：

```bash
sudo -l
```

实际关键输出：

```text
User soyo may run the following commands on DESKTOP-7F3O4EJ:
    (ALL : ALL) ALL
```

结论：`soyo` 能通过 `sudo` 以任意用户、任意组执行任意命令。管理员权限很高，执行前必须确认命令和目标正确。

## 重要操作提醒

### sudo 密码输入

`sudo` 要求输入 Linux 密码时，终端不会显示星号或任何字符。这是正常的安全设计，输入后直接按 Enter 即可。

若密码被错误输入或出现在共享记录中，应立即在 WSL 中执行：

```bash
passwd
```

按照提示更换当前 Linux 用户密码。

### 只输入 `sudo` 会发生什么

单独执行：

```bash
sudo
```

只会显示用法说明，因为 `sudo` 后需要提供要以管理员权限运行的完整命令。

示例：

```bash
sudo -l
```

以后如需执行系统管理命令，需先理解命令风险、确认目标路径或服务名称，并优先在安全练习环境中操作。

### 验收题文字不是终端命令

将中文题目、答案 `0` 或示意写法 `sudo 命令` 直接粘贴到终端，会被 Shell 当作命令处理并报：

```text
command not found
```

例如：

- `0` 是“root 的 UID 通常是多少”的答案，不是命令。
- `sudo 命令` 是语法示意；实际应写完整命令，例如 `sudo -l`。

## 验收速查

| 任务 | 命令或答案 |
|---|---|
| 显示当前用户名 | `whoami` |
| 显示 UID | `id -u` |
| 显示主组 GID | `id -g` |
| 显示全部组名称 | `id -nG` |
| 查询当前用户信息 | `getent passwd "$(whoami)"` |
| 查询 sudo 组 | `getent group sudo` |
| 查看 sudo 权限 | `sudo -l` |
| root 的 UID | `0` |

## 本节状态

已完成实操验收。重点记忆：`whoami` 看身份，`id` 看数字 ID 和组，`getent` 查系统数据库，`sudo -l` 看权限；不要将管理员权限示例或题目答案直接当作命令执行。
