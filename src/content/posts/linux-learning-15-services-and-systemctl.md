---
title: "第 15 节：服务管理与 systemctl"
published: 2026-08-26T21:11:01+08:00
description: 学习使用 systemctl 查看 systemd 运行状态与服务状态，理解只读检查和改变服务状态的区别。
image: ''
tags: [Linux, systemd, systemctl, 服务管理, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 15 节：服务管理与 `systemctl`

## 学习目标

- 判断 systemd 整体运行状态。
- 查看服务当前是否运行和是否配置为开机启动。
- 列出正在运行的系统服务。
- 理解查看状态与改变服务状态的区别。

## 风险说明

`systemctl start`、`stop`、`restart`、`enable`、`disable` 会改变服务状态，可能中断网络、日志或远程连接。本节仅使用只读查询命令；没有停止、重启或禁用任何真实服务。

## 核心命令

| 命令 | 作用 |
|---|---|
| `systemctl is-system-running` | 查看 systemd 总体状态 |
| `systemctl status service` | 查看服务加载、运行、PID 和最近日志 |
| `systemctl is-active service` | 判断服务当前是否正在运行 |
| `systemctl is-enabled service` | 判断服务是否配置为开机启动 |
| `systemctl list-units --type=service --state=running` | 列出正在运行的服务 |
| `systemctl --failed` | 列出失败的 unit，用于排查 `degraded` 状态 |

## 实际验收结果

执行：

```bash
systemctl is-system-running
systemctl is-active systemd-journald
systemctl is-enabled systemd-journald
systemctl list-units --type=service --state=running
```

实际关键输出：

```text
degraded
active
static
```

结论：

- `systemd-journald` 当前处于 `active`，即正在运行并记录系统日志。
- `systemd-journald` 的 `static` 不代表故障。static unit 通常不能直接 `enable`，因为它由其他 unit 或 systemd 按需要启动。
- systemd 总体状态为 `degraded`，意味着至少存在一个失败的 unit，但不代表当前所有服务都无法使用。

## 运行中的服务观察

列表中观察到以下运行服务：

```text
NetworkManager.service
systemd-journald.service
systemd-resolved.service
rsyslog.service
docker.service
cron.service
```

这说明网络管理、日志记录、名称解析、Docker 和定时任务等服务处于运行状态。

## degraded 的安全排查

遇到 `degraded` 时，先使用只读命令确定失败项：

```bash
systemctl --failed
```

再针对具体服务查看：

```bash
systemctl status 服务名
journalctl -u 服务名 -n 50
```

不要因为看到 `degraded` 就直接执行 `sudo systemctl restart` 或 `stop`。应先确认失败服务、影响范围和日志原因。

## 服务控制命令速查

以下命令会改变系统状态，本节只理解其用途：

| 命令 | 作用 |
|---|---|
| `sudo systemctl start 服务名` | 立即启动服务 |
| `sudo systemctl stop 服务名` | 停止服务 |
| `sudo systemctl restart 服务名` | 重启服务 |
| `sudo systemctl enable 服务名` | 设置开机自动启动 |
| `sudo systemctl disable 服务名` | 取消开机自动启动 |

`start` 是当前立即启动；`enable` 是设置未来开机时自动启动，两者不同。

## 本节状态

已完成只读实操验收。重点记忆：`active` 是当前运行状态；`enabled` 是开机配置；`static` 并非故障；遇到 `degraded` 应先用 `systemctl --failed` 收集证据。
