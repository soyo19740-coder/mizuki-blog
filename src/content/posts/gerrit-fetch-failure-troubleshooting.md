---
title: Gerrit 仓库拉取失败排查笔记
published: 2026-07-20T09:37:49+08:00
description: 记录 Gerrit SSH 拉取出现 relay 连接超时时，对 SOCKS5 代理、网络环境、connect 工具和 HTTPS 访问方式的排查过程。
image: ''
tags: [Git, Gerrit, SSH, SOCKS5, 故障排查]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-20

## 现象

通过 SSH 拉取仓库失败：

```powershell
git clone "ssh://afeng@d.d-l.io:29418/hcolor/pcb/a302-fpc"
```

报错：

```text
FATAL: Unable to connect to relay host, errno=10060
Connection closed by UNKNOWN port 65535
fatal: Could not read from remote repository.
```

同一命令上周可以正常拉取，本周开始失败。

## 已确认情况

1. `d.d-l.io` 的 SSH 配置使用 SOCKS5 代理：

   ```text
   ProxyCommand connect -S 192.168.1.127:1080 -a none %h %p
   ```

2. `192.168.1.127:1080` 当前不可达：

   ```powershell
   Test-NetConnection 192.168.1.127 -Port 1080
   ```

   结果为 `TcpTestSucceeded : False`，并且 Ping 返回 `DestinationHostUnreachable`。

3. 当前 PowerShell 环境中找不到 `connect` 命令：

   ```text
   CreateProcessW failed error:2
   posix_spawnp: No such file or directory
   ```

4. 直连 `d-l.io:29418` 也会超时，说明当前网络无法直接访问 Gerrit SSH 端口。

5. HTTPS 能够访问 `d-l.io`，但 Git 返回 `Unauthorized`。这属于单独的 HTTP 凭据或项目权限问题，与 SSH relay 超时不是同一个问题。

6. `d.d-l.io` 不可用于 HTTPS 拉取：其 HTTPS 证书不包含该域名，Git 会报证书主机名不匹配。

## 本次 SSH 拉取失败的可能原因

按当前证据，优先怀疑以下原因：

1. 提供 `192.168.1.127:1080` 的 SOCKS5 代理设备未开机、休眠、断网，或代理服务未启动。
2. 该代理设备的局域网 IP 已变更，SSH 配置仍保留旧地址。
3. 当前电脑未连接上周使用的公司网络、VPN 或零信任客户端，导致无法路由到 `192.168.1.127`。
4. 本机代理/SSH 工具环境发生变化，`connect.exe` 被卸载、移动或未加入 `PATH`。
5. `d.d-l.io` 对应的 SSH relay 服务，或 relay 到 Gerrit 后端的网络链路故障。`errno=10060` 表示连接超时，尚未进入 Gerrit 的密钥认证阶段。
6. 公司网络策略、防火墙或代理规则本周调整，拦截了相关 SSH 转发流量。

## 已排除或暂不优先的原因

- 不是仓库路径拼写错误的首要证据：同一命令上周可用，且当前连接在到达 Gerrit 前已失败。
- 不是 SSH 公钥、Gerrit 用户权限或仓库读取权限导致的 SSH 错误：这些问题通常会在连接成功后显示 `Permission denied` 或权限拒绝信息，而当前为 relay 连接超时。
- 不是 `d.d-l.io` 的 HTTPS 凭据问题：该域名的 HTTPS 证书本身不匹配。

## 建议处理

1. 恢复上周使用的公司网络、VPN 或代理客户端。
2. 确认代理端口恢复可达：

   ```powershell
   Test-NetConnection 192.168.1.127 -Port 1080
   ```

   期望结果：`TcpTestSucceeded : True`。

3. 向管理员确认 `192.168.1.127:1080` 的归属、当前 IP、代理服务状态，以及 Windows 上 `connect.exe` 的获取方式。
4. 若 SSH 代理恢复后仍报 `errno=10060`，请管理员检查 SSH relay 到 Gerrit 后端 `29418` 端口的连通性。
5. 若需临时使用 HTTPS，使用 `https://d-l.io/gerrit/a/...`，并在 Gerrit 个人设置中获取 HTTP Password 或 Access Token；同时确认账号 `afeng` 对目标项目具有读取权限。

## 可发给管理员的信息

```text
我本机 SSH 配置通过 SOCKS5 代理 192.168.1.127:1080 访问 d.d-l.io：
ProxyCommand connect -S 192.168.1.127:1080 -a none %h %p

当前 Test-NetConnection 192.168.1.127 -Port 1080 返回 TcpTestSucceeded: False，
Git 拉取 d.d-l.io:29418 返回：
FATAL: Unable to connect to relay host, errno=10060

请确认该代理/跳板机是否在线、IP 和端口是否变化、代理服务是否启动，以及当前应使用的 VPN/代理与 connect 工具配置。
```
