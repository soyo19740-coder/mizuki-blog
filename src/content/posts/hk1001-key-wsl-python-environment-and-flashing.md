---
title: 在WSL配置python3环境与密钥烧录记录
published: 2026-08-13T10:28:03+08:00
description: 记录在 WSL2 Ubuntu 24.04 中配置 Python 3.12、映射 USB 串口并运行 HK1001 Key 烧录工具的完整流程与故障排查方法。
image: ''
tags: [Linux, WSL, Python, usbipd, 串口, 密钥烧录, HK1001]
category: LINUX开发
draft: false
pinned: false
comment: true
lang: zh-CN
---

日期：2026-08-12 至 2026-08-13

项目目录：`~/work/hk_fw/hk_fw/hk24/tools/key`

启动命令：`python3 main_freq.py`

## 最终环境

- WSL：Ubuntu-24.04，WSL 2，mirrored 网络。
- Python：3.12.3。
- 串口：Windows COM16 映射为 WSL `/dev/ttyACM0`。
- 用户权限：`soyo` 必须在 `dialout` 组。
- 默认波特率：20000000。
- CDBUS 目标地址：00:00:10。
- 网页：`http://localhost:8080`。
- Windows USB 映射工具：usbipd-win 5.3.0。

网页可打开或串口存在，只代表环境通路正常，不代表目标板已经烧录成功。

## 首次配置

复制项目到 WSL：

```bash
cd ~/work
cp -a /mnt/d/project_afeng/hk_fw .
```

`cp` 必须有源和目标；Windows D 盘路径以 `/mnt/d` 开头。

安装 pip：

```bash
sudo apt update
sudo apt install -y python3-pip
```

Ubuntu 24.04 若报 `externally-managed-environment`，本次使用用户级单次安装：

```bash
python3 -m pip install --user --break-system-packages 包名
```

不要使用 `sudo pip`。

本机 WSL 的 127.0.0.1:7897 代理不可用时，pip 会超时。临时绕过代理：

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY python3 -m pip install --user --break-system-packages 包名
```

## 依赖

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY python3 -m pip install --user --break-system-packages pythoncrc
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY python3 -m pip install --user --break-system-packages aiohttp
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY python3 -m pip install --user --break-system-packages "websockets==10.4"
sudo apt install -y python3-u-msgpack
```

项目导入 `from PyCRC.CRC16 import CRC16`，正确包名是 `pythoncrc`。直接安装 `PyCRC` 或 `pycrc` 得到的是另一个 CRC 工具。`websockets` 必须固定为 10.4，因为项目使用旧 API。

验证：

```bash
python3 -c "from PyCRC.CRC16 import CRC16; print(hex(CRC16(modbus_flag=True).calculate(b'123456789')))"
python3 -c "import aiohttp, websockets, umsgpack; print(websockets.__version__)"
```

应分别输出 `0x4b37` 和 `10.4`。

## Python 3.12 兼容修改

本次已修改项目源码。以后覆盖项目目录或恢复版本时，需要保留以下处理。

1. `cd_ws.py`：在导入 `umsgpack` 前补 `collections.Hashable = collections.abc.Hashable`，解决 `module 'collections' has no attribute 'Hashable'`。
2. `main_freq.py`：`update_ui()` 使用 `try/finally` 清理 socket，防止网页断线后重复创建通道报 `AssertionError`。
3. `web_serve.py`：网页断开时不再 `exit(0)`，只清理连接状态。
4. `src/app.js`：WebSocket 断开后每秒自动重连，连接成功清除灰色背景。
5. `main_freq.py`：取消自动调用不存在的 `chromium`；只在 Windows 浏览器手动打开网页，避免多个客户端争用连接。

## COM16 映射到 WSL

安装 usbipd-win，在管理员 PowerShell 执行一次：

```powershell
winget install --exact --id dorssel.usbipd-win
```

查看当前设备：

```powershell
usbipd list
```

BUSID 会随拔插变化，不能固定记为 4-2。确认 USB 串行设备 (COM16) 的当前 BUSID 后，首次共享需管理员 PowerShell：

```powershell
usbipd bind --busid <当前BUSID>
```

Windows 占用时曾用强制共享：

```powershell
usbipd bind --busid <当前BUSID> --force
```

保持 Ubuntu 终端打开，在普通 PowerShell 附加到 WSL：

```powershell
usbipd attach --wsl --busid <当前BUSID>
```

Ubuntu 中检查：

```bash
groups
ls -l /dev/ttyACM0
```

若 `groups` 没有 `dialout`，执行一次：

```bash
sudo usermod -aG dialout soyo
```

随后在 Windows 执行 `wsl --shutdown`，重新打开 Ubuntu 后再附加 USB。

## 交还给 Windows

先停止 `main_freq.py`，然后在 PowerShell 执行：

```powershell
usbipd detach --busid <当前BUSID>
```

如果状态仍是 `Shared (forced)`，Windows 程序可能不能读取 COM16。请在管理员 PowerShell 完全取消共享：

```powershell
usbipd unbind --busid <当前BUSID>
```

最终应显示 `Not shared`。`detach` 只结束 WSL 附加，`unbind` 才解除强制共享。

## 每次开机后的步骤

1. 插入目标设备，打开 Ubuntu 终端。
2. Windows PowerShell 运行 `usbipd list`，记录 COM16 当前 BUSID。
3. Windows PowerShell 运行 `usbipd attach --wsl --busid <当前BUSID>`。
4. Ubuntu 运行：

```bash
groups
ls -l /dev/ttyACM0
cd ~/work/hk_fw/hk_fw/hk24/tools/key
python3 main_freq.py
```

5. Windows 浏览器只打开一个页面：`http://localhost:8080`。

`main_freq.py` 是常驻服务，启动后不返回提示符是正常现象；按 Ctrl+C 停止。

## 常见问题

| 现象 | 原因与处理 |
| --- | --- |
| `python: command not found` | 使用 `python3`。 |
| pip 连 127.0.0.1 超时 | 使用 `env -u http_proxy ...` 临时绕过代理。 |
| `/dev/ttyACM0` 不存在 | 检查 `usbipd list` 的实际 BUSID，重新 attach。 |
| `/dev/ttyACM0` 时有时无 | USB/IP 枚举、线材、扩展坞或供电问题；重新 detach/attach 并检查线材。 |
| `chromium: not found` | 使用 Windows 浏览器打开网页。 |
| 页面灰色 | WebSocket 断开；确认服务仍运行、只开一个网页后刷新。 |
| `favicon.ico 404` | 与烧录无关，可忽略。 |
| `dev_get_info` 后 `other error` | 串口打开但目标没有返回可解析响应；检查目标板、波特率、地址和线材。本次曾是 USB 线未插好。 |
| `dev_get_info` 持续输出 | 服务在轮询当前或下一块设备，不代表重复烧录。 |

## 烧录完成判断

本轮应看到设备 ID、成功的状态读写、终端 `dev_set_ip done`、网页“烧录：已烧录”，并按目标板实际功能复核。程序完成一块后不会退出，会继续等待下一块；换板时断开上一块、接入下一块即可。

## 验证边界

本次已验证 WSL USB 映射、dialout 权限、Python 依赖、网页服务和 Python 3.12 兼容处理。实际目标板的烧录和硬件功能仍需由本轮设备响应与硬件行为确认。项目工作树已有大量用户或生成文件变更，本次未清理、重置或提交。
