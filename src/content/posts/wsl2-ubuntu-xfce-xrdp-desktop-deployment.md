---
title: WSL2 Ubuntu 图形化桌面部署笔记
published: 2026-07-29T14:00:08+08:00
description: 记录在 WSL2 Ubuntu 24.04 中部署 XFCE 与 xrdp，通过 Windows App 连接桌面，并配置 Clash 代理和 Linux 图形浏览器的完整流程。
image: ''
tags: [WSL, Linux, Ubuntu, XFCE, xrdp, Clash, 图形桌面]
category: LINUX开发
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-29

## 1. 目标与当前状态

在 Windows 中运行 WSL2 的 `Ubuntu-24.04`，部署 XFCE 图形桌面，通过 xrdp 连接，并让 Linux 图形浏览器可使用 Clash 代理。

当前已验证：

- WSL2 发行版：`Ubuntu-24.04`
- Linux 用户：`soyo`
- 图形桌面：XFCE
- 远程桌面服务：xrdp 与 xrdp-sesman 都是 `active`
- RDP 端口：`localhost:3390`
- XFCE 会话文件：`~/.xsession` 已配置
- WSL 可以通过 `http://127.0.0.1:7897` 使用 Clash 访问 HTTPS

当前尚待验证：

- Windows App 中的剪贴板双向复制粘贴
- Google Chrome 的图形窗口能否正常打开并浏览网页

> 注意：`wsl --shutdown` 会立即结束 Ubuntu、xrdp 和已打开的 Linux 图形程序。执行前先关闭或保存桌面中的工作。

## 2. 架构

```text
Windows
  ├─ Clash Verge: 127.0.0.1:7897
  ├─ Windows App: 连接 localhost:3390
  └─ WSL2 / Ubuntu-24.04
       ├─ xrdp: 提供 RDP 服务
       ├─ XFCE: 完整 Linux 桌面
       └─ Chrome 等 Linux 图形程序
```

## 3. WSL 网络与代理配置

Windows 的本地代理默认不能直接被 NAT 模式的 WSL 使用。当前已在 `C:\Users\010\.wslconfig` 配置镜像网络：

```ini
[wsl2]
networkingMode=mirrored
autoProxy=true
```

配置修改后需要在 PowerShell 执行一次：

```powershell
wsl --shutdown
```

然后重新进入 Ubuntu：

```powershell
wsl -d Ubuntu-24.04
```

验证代理是否可用：

```bash
curl -I --max-time 15 https://www.microsoft.com
```

正常时会看到 `HTTP/2 200`。当前 Clash HTTP/mixed 代理地址是：

```text
http://127.0.0.1:7897
```

## 4. 安装 XFCE 与 xrdp

以下命令在 Ubuntu 终端执行：

```bash
sudo apt update
sudo apt install xfce4 xfce4-goodies xrdp xorgxrdp dbus-x11 -y
```

配置 xrdp 登录后启动 XFCE：

```bash
printf '%s\n' \
'unset DBUS_SESSION_BUS_ADDRESS' \
'unset XDG_RUNTIME_DIR' \
'exec startxfce4' > ~/.xsession

chmod +x ~/.xsession
cat ~/.xsession
```

预期内容：

```bash
unset DBUS_SESSION_BUS_ADDRESS
unset XDG_RUNTIME_DIR
exec startxfce4
```

将 xrdp 从默认 `3389` 端口改为 `3390`，避免与 Windows 远程桌面常用端口冲突：

```bash
sudo sed -i 's/^port=3389$/port=3390/' /etc/xrdp/xrdp.ini
grep -m1 '^port=' /etc/xrdp/xrdp.ini
```

预期输出：

```text
port=3390
```

授予证书权限并启用服务：

```bash
sudo adduser xrdp ssl-cert
sudo systemctl enable --now xrdp xrdp-sesman
sudo systemctl restart xrdp
systemctl is-active xrdp xrdp-sesman
```

预期输出为两行 `active`。

## 5. 启动与连接桌面

Windows 重启后，先在 PowerShell 启动 Ubuntu：

```powershell
wsl -d Ubuntu-24.04
```

然后使用 **Windows App** 连接已保存的电脑：

```text
地址：localhost:3390
会话：Xorg
用户名：soyo
密码：Ubuntu 用户密码
```

当前系统的 `C:\Windows\System32\mstsc.exe` 不存在，因此 PowerShell 中直接运行 `mstsc` 会提示“无法识别”。优先使用 Windows App，不要依赖 `WinSxS` 中的组件路径。

RDP 窗口全屏/窗口切换：

```text
Ctrl + Alt + Break
```

## 6. 剪贴板配置与使用

Linux 服务端已允许剪贴板：

```text
/etc/xrdp/xrdp.ini: cliprdr=true
/etc/xrdp/sesman.ini: RestrictInboundClipboard=none
/etc/xrdp/sesman.ini: RestrictOutboundClipboard=none
```

如果 Windows 与 Linux 之间无法复制粘贴：

1. 在 Windows App 中断开 `localhost:3390`。
2. 编辑该连接的本地设备/资源设置。
3. 启用 `Clipboard`。
4. 重新连接。
5. 在 Linux 终端粘贴时使用 `Ctrl + Shift + V`。

## 7. Linux 浏览器与 Clash

图形程序命令必须在 **XRDP Linux 桌面中的终端** 执行，不能在 Windows PowerShell 执行。

### Google Chrome

Chrome 已通过官方 Debian 包安装。推荐以下方式启动，避免 GPU 渲染问题并显式使用代理：

```bash
google-chrome --disable-gpu --proxy-server="http://127.0.0.1:7897" &
```

启动后访问：

```text
https://www.google.com
```

若能显示网页，说明 XFCE、RDP、Chrome 和 Clash 代理链路全部成功。

### 已知不建议继续尝试的浏览器路径

- `sudo apt install firefox`：Ubuntu 24.04 会转向 Firefox Snap；此前在 WSL/XRDP 中出现 mount namespace 错误。
- `epiphany-browser`：虽然可安装，但曾出现 Web 进程崩溃和空白页面。这是 XRDP/WebKit Portal 问题，不是 Clash 网络问题。

## 8. 常用检查与故障处理

检查 xrdp 服务：

```bash
systemctl status xrdp xrdp-sesman --no-pager
```

检查 xrdp 监听端口：

```bash
ss -ltn | grep 3390
```

登录后黑屏时，先查看日志，不要重复安装：

```bash
sudo journalctl -u xrdp -u xrdp-sesman -n 50 --no-pager
```

服务未运行时：

```bash
sudo systemctl restart xrdp xrdp-sesman
systemctl is-active xrdp xrdp-sesman
```

## 9. 每次使用的最短流程

```powershell
wsl -d Ubuntu-24.04
```

随后在 Windows App 连接：

```text
localhost:3390
```

进入 XFCE 后，如需浏览网页，在桌面终端执行：

```bash
google-chrome --disable-gpu --proxy-server="http://127.0.0.1:7897" &
```
