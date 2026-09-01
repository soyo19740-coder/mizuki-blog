---
title: "第 22 节：网络连通性与端口检查"
published: 2026-09-01T09:36:02+08:00
description: 使用 ping、getent、ss 和 curl 区分本机网络、DNS、远端端口与 HTTP 服务问题。
image: ''
tags: [Linux, 网络, 连通性, 端口, DNS, ping, curl]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 22 节：网络连通性与端口检查（精简版）

## 目标

区分本机网络、DNS、远端端口和 HTTP 服务问题。

## 核心命令

```bash
ping -c 3 127.0.0.1
getent hosts example.com
ss -ltn
curl -I http://127.0.0.1:端口
```

- `ping -c 3`：发送 3 次 ICMP 连通性测试。
- `getent hosts`：通过系统名称解析配置查询 DNS。
- `ss -ltn`：查看 TCP 监听端口。
- `curl -I`：只获取 HTTP 响应头。

## 最小实战

```bash
ping -c 3 127.0.0.1
getent hosts example.com
ss -ltn
```

判断原则：本机回环失败是本机栈问题；域名解析失败优先查 DNS；端口未监听则检查服务进程。
