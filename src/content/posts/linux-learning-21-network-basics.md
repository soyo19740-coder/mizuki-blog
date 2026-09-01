---
title: "第 21 节：网络基础"
published: 2026-09-01T09:36:02+08:00
description: 认识 Linux 网卡、IP 地址、默认路由和 DNS 配置，掌握基础网络信息查询命令。
image: ''
tags: [Linux, 网络, IP, 路由, DNS, ip]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 21 节：网络基础（精简版）

## 目标

认识网卡、IP、默认路由和 DNS 配置。

## 核心命令

```bash
ip addr
ip route
cat /etc/resolv.conf
hostname -I
```

- `ip addr`：查看网卡和 IP 地址。
- `ip route`：查看路由，`default via` 是默认网关。
- `/etc/resolv.conf`：查看 DNS 配置。
- `hostname -I`：快速显示本机 IP。

## 最小实战

```bash
ip addr show
ip route
hostname -I
```

排障顺序：先确认本机是否有 IP，再确认默认路由，最后检查 DNS。
