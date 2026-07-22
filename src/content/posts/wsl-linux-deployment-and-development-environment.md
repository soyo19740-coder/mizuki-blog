---
title: WSL Linux 部署与开发环境笔记
published: 2026-07-22T16:16:15+08:00
description: 记录在 Windows 上部署 WSL 2、Ubuntu 24.04 和 Arm GNU Toolchain 14.2.Rel1，并配置嵌入式项目开发环境的完整过程。
image: ''
tags: [WSL, Linux, Ubuntu, ARM GCC, 开发环境]
category: LINUX开发
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-22

## 1. 当前环境

| 项目 | 当前配置 |
| --- | --- |
| WSL | WSL 2 |
| Linux 发行版 | Ubuntu 24.04.4 LTS (Noble Numbat) |
| WSL 发行版名称 | `Ubuntu-24.04` |
| WSL 数据位置 | `D:\WSL\Ubuntu-24.04` |
| Linux 用户 | `soyo` |
| Linux 家目录 | `/home/soyo` |
| 项目工作目录 | `/home/soyo/work` |
| 工具链目录 | `/home/soyo/toolchains` |
| GNU Make | 4.3 |
| Python | 3.12.3 |
| ARM GCC | Arm GNU Toolchain 14.2.Rel1，GCC 14.2.1，Build 20241119 |
| 编译目标 | `arm-none-eabi` |

## 2. 首次安装 WSL2

以管理员身份打开 PowerShell，启用所需组件：

```powershell
Enable-WindowsOptionalFeature -Online `
  -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart

Enable-WindowsOptionalFeature -Online `
  -FeatureName VirtualMachinePlatform -NoRestart
```

如果显示 `RestartNeeded : True`，重启 Windows。重启后执行：

```powershell
wsl --update
wsl --set-default-version 2
wsl --install -d Ubuntu-24.04 --location D:\WSL\Ubuntu-24.04
```

首次启动时创建 Linux 用户。用户名必须以小写字母或下划线开头；本机使用 `soyo`。

检查安装结果：

```powershell
wsl --status
wsl --list --verbose
```

`Ubuntu-24.04` 的 WSL 版本应为 `2`。

## 3. 安装基础开发工具

在 Ubuntu 终端中执行：

```bash
sudo apt update
sudo apt install -y make git python3 xz-utils ca-certificates curl file build-essential
mkdir -p ~/work ~/toolchains
git config --global core.autocrlf input
```

检查版本：

```bash
cat /etc/os-release
make --version
python3 --version
```

预期为 Ubuntu 24.04.4 LTS、GNU Make 4.3、Python 3.12.3。

## 4. 安装 ARM 交叉编译器

项目使用的不是 Ubuntu 软件源中的 GCC 13.2，而是与同事一致的独立工具链：

```text
arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi.tar.xz
```

包名含义：

- `14.2.rel1`：Arm GNU Toolchain 发布版本。
- `x86_64`：工具链运行在 x86_64 Linux 主机上。
- `arm-none-eabi`：目标为裸机 ARM 单片机。

官方下载地址：

```text
https://developer.arm.com/-/media/Files/downloads/gnu/14.2.rel1/binrel/arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi.tar.xz
```

本机下载文件位于：

```text
C:\Users\010\Downloads\arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi.tar.xz
```

官方 SHA-256：

```text
62a63b981fe391a9cbad7ef51b17e49aeaa3e7b0d029b36ca1e9c3b2a9b78823
```

在 WSL 中校验时，应先进入两个下载文件所在目录：

```bash
cd /mnt/c/Users/010/Downloads
sha256sum --check arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi.tar.xz.sha256asc
```

显示 `OK` 后解压到 Linux 文件系统：

```bash
tar -xJf /mnt/c/Users/010/Downloads/arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi.tar.xz \
  -C ~/toolchains
```

配置环境变量：

```bash
echo 'export ARM_GNU_TOOLCHAIN="$HOME/toolchains/arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi"' >> ~/.bashrc
echo 'export PATH="$ARM_GNU_TOOLCHAIN/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

验证：

```bash
command -v arm-none-eabi-gcc
arm-none-eabi-gcc --version
arm-none-eabi-gcc -dumpmachine
arm-none-eabi-gcc -dumpfullversion -dumpversion
```

预期关键输出：

```text
/home/soyo/toolchains/arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi/bin/arm-none-eabi-gcc
Arm GNU Toolchain 14.2.Rel1 (Build arm-14.52)
arm-none-eabi
14.2.1
```

不要执行以下命令作为本项目的主工具链安装方式：

```bash
sudo apt install gcc-arm-none-eabi
```

Ubuntu 24.04 软件源提供的是另一版本，可能导致固件与同事不一致。

## 5. 将 Windows 项目复制到 WSL

Windows 项目原位置：

```text
D:\project_afeng\a302motor
```

复制整个项目，以保留 Makefile 可能引用的上级目录：

```bash
source ~/.bashrc
cd ~/work
cp -a /mnt/d/project_afeng/a302motor .
```

Linux 项目位置：

```text
/home/soyo/work/a302motor
```

固件工程目录：

```bash
cd ~/work/a302motor/motor/fw_app
```

不要长期直接在 `/mnt/c` 或 `/mnt/d` 中编译。项目复制到 `~/work` 后，文件系统行为与性能更接近原生 Linux。

## 6. 日常启动和退出

在开始菜单打开 `Ubuntu 24.04 LTS`，或者在 PowerShell 中执行：

```powershell
wsl -d Ubuntu-24.04
```

设置为默认发行版，只需执行一次：

```powershell
wsl --set-default Ubuntu-24.04
```

以后可从 Linux 家目录启动：

```powershell
wsl ~
```

进入项目：

```bash
source ~/.bashrc
cd ~/work/a302motor/motor/fw_app
```

退出当前 Linux 终端：

```bash
exit
```

完全停止所有 WSL 实例时，在 PowerShell 中执行：

```powershell
wsl --shutdown
```

通常关闭终端即可，不需要每次运行 `wsl --shutdown`。

## 7. 常见注意事项

- Windows 的 `/mnt/c`、`/mnt/d` 适合交换压缩包和最终固件，不适合长期作为 Linux 构建目录。
- `.sha256asc` 是校验文本，不需要解压，也不参与编译。
- 如果新终端找不到 `arm-none-eabi-gcc`，先执行 `source ~/.bashrc`。
- WSL 启动时出现 localhost 代理未镜像警告，但 `apt update` 能成功时无需处理。
- 编译环境是否真正对齐，应同时比较发行版、工具链版本、源码提交、子模块、Makefile 参数和最终固件 Hash。
