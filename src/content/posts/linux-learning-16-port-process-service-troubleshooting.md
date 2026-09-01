---
title: "第 16 节：端口、进程与服务排障"
published: 2026-08-26T21:25:27+08:00
description: 学习检查端口监听、定位进程和 PID，并使用本地 HTTP 服务与 systemd 状态信息排查服务问题。
image: ''
tags: [Linux, 端口, 进程, 服务排障, ss, ps, systemctl]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 16 节：端口、进程与服务排障

## 学习目标

- 判断某端口是否正在监听。
- 找到监听端口的进程和 PID。
- 使用 `ps` 核对进程身份和完整命令行。
- 用本地 HTTP 服务验证端口连通性。
- 查看失败的 systemd 服务，而不盲目重启。

## 风险说明

`kill` 只能用于自己启动、且已通过 `ps` 确认的测试进程。不要对 `ss` 输出中的陌生 PID、系统服务或 PID 1 执行 `kill`。

## 核心命令

| 命令 | 作用 |
|---|---|
| `ss -ltnp` | 查看 TCP 监听端口及关联进程 |
| `ss -ltnp \| grep ':8080'` | 筛选监听 8080 的进程 |
| `pgrep -a -f pattern` | 按完整命令行模式查找 PID |
| `ps -p PID -o pid,ppid,user,stat,cmd` | 查看指定 PID 的详细信息 |
| `curl -I URL` | 只请求 HTTP 响应头，验证服务连通性 |
| `systemctl --failed` | 列出失败的 systemd unit |

`ss -ltnp` 参数：`-l` 监听、`-t` TCP、`-n` 数字地址和端口、`-p` 关联进程。

## 实际练习

练习目录：`~/linux-learning/lesson-16`

启动测试 Web 服务：

```bash
python3 -m http.server 8080 > server.log 2>&1 &
echo $!
```

实际后台 PID：`1066`。

进程与端口检查：

```bash
pgrep -a -f "http.server 8080"
ss -ltnp | grep ':8080'
ps -p 1066 -o pid,ppid,user,stat,cmd
```

关键结果：

```text
1066 python3 -m http.server 8080
LISTEN ... 0.0.0.0:8080 ... users:(("python3",pid=1066,fd=3))
1066 ... soyo S python3 -m http.server 8080
```

说明端口 8080 由当前用户 `soyo` 启动的 Python 服务监听。

连通性验证：

```bash
curl -I http://127.0.0.1:8080
```

实际状态行：

```text
HTTP/1.0 200 OK
```

## 服务状态检查

执行：

```bash
systemctl --failed
```

发现：

```text
lightdm.service loaded failed failed Light Display Manager
```

结论：当前 systemd `degraded` 状态由 `lightdm.service` 失败导致。本节只收集了证据，没有直接重启、停止或禁用该服务。

## 安全停止测试服务

确认 PID 是自己启动的 Python 测试服务后：

```bash
kill 1066
pgrep -a -f "http.server 8080"
ss -ltnp | grep ':8080'
```

输出显示测试服务已终止，后两个检查无匹配结果，说明 8080 已释放。

## 排障流程

1. `ss -ltnp | grep ':端口'`：确认端口是否监听。
2. 查看输出中的 PID 和进程名。
3. `ps -p PID -o pid,ppid,user,stat,cmd`：确认进程身份。
4. 用 `curl` 等客户端验证连通性。
5. 仅在确认目标是自己的安全测试进程后，才用 `kill PID` 终止。
6. 服务失败先用 `systemctl --failed` 和 `systemctl status 服务名` 收集证据。

## 本节状态

已完成实操验收。重点记忆：端口问题先查 `ss`，再用 `ps` 核对 PID；服务失败先查状态和日志，不要盲目重启。
