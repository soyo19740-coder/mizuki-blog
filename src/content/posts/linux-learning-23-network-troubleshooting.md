---
title: "第 23 节：网络故障综合实战"
published: 2026-09-01T09:36:02+08:00
description: 按 IP、路由、DNS、端口和应用响应的固定顺序，快速定位服务访问失败问题。
image: ''
tags: [Linux, 网络故障, 排障, IP, 路由, DNS, 端口]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第 23 节：网络故障综合实战（精简版）

## 目标

用固定顺序定位“服务访问失败”：IP、路由、DNS、端口、应用响应。

## 五步流程

```bash
ip addr
ip route
getent hosts example.com
ss -ltnp
curl -I http://127.0.0.1:端口
```

1. `ip addr`：确认网卡有地址。
2. `ip route`：确认默认路由。
3. `getent hosts`：确认域名能解析。
4. `ss -ltnp`：确认目标端口是否监听及关联 PID。
5. `curl -I`：确认应用层是否返回响应。

## 与第 16 节的联系

第 16 节已经用 Python 服务验证过 `8080` 端口、PID 和 `HTTP/1.0 200 OK`。本节把同样思路扩展为通用网络排障流程。

## 最小实战

```bash
ip addr
ip route
getent hosts example.com
ss -ltnp
```

不要随意修改网络配置；本节只做只读检查。
