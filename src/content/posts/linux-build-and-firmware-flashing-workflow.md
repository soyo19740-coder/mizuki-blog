---
title: Linux 编译与固件烧录流程笔记
published: 2026-07-22T16:16:16+08:00
description: 记录将 Windows 项目复制到 WSL、使用 ARM GCC 编译 hka302_motor_app、校验并导出 HEX 后在 Windows 烧录的完整流程。
image: ''
tags: [Linux, WSL, 嵌入式, 固件编译, 固件烧录]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-22

## 1. 当前采用的流程

本项目采用：

```text
Windows 项目 -> 复制到 WSL -> WSL 编译 -> 导出 HEX 到 D 盘 -> Windows 工具烧录
```

WSL 只负责编译，不直接连接烧录器。这样不需要 USB 透传，也不会发生 Windows 与 WSL 同时占用烧录器的问题。

## 2. 相关路径

| 内容 | 路径 |
| --- | --- |
| Windows 原项目 | `D:\project_afeng\a302motor` |
| WSL 项目 | `/home/soyo/work/a302motor` |
| Makefile 目录 | `/home/soyo/work/a302motor/motor/fw_app` |
| Linux 构建目录 | `/home/soyo/work/a302motor/motor/fw_app/build` |
| Windows 固件导出目录 | `D:\FirmwareOut` |

## 3. 首次复制项目

复制整个项目到 WSL：

```bash
source ~/.bashrc
cd ~/work
cp -a /mnt/d/project_afeng/a302motor .
```

该命令只复制，不会移动或删除 Windows 原项目。

如果 Windows 原项目后续有更新，需要通过 Git 同步，或重新将明确变更的文件复制到 WSL。不要在两个目录中同时修改同一文件而不做版本管理。

## 4. 编译前检查

进入工程：

```bash
source ~/.bashrc
cd ~/work/a302motor/motor/fw_app
```

确认编译器和 Makefile：

```bash
command -v arm-none-eabi-gcc
arm-none-eabi-gcc --version
test -f Makefile
```

编译器应为：

```text
/home/soyo/toolchains/arm-gnu-toolchain-14.2.rel1-x86_64-arm-none-eabi/bin/arm-none-eabi-gcc
```

可先执行干运行查看 Makefile 将调用的命令，不会真正编译：

```bash
make -n > /tmp/fw_app-make-dry-run.txt 2>&1
grep -E 'arm-none-eabi-gcc|arm-none-eabi-objcopy|arm-none-eabi-size' \
  /tmp/fw_app-make-dry-run.txt
```

## 5. 正式编译

完整干净构建：

```bash
make clean
make -j"$(nproc)"
```

`make clean` 会删除旧的构建产物；`make -j"$(nproc)"` 会按 WSL 可用 CPU 核心并行编译。

如果只想增量编译改动部分：

```bash
make -j"$(nproc)"
```

Make 结束时不能出现 `Error`。当前项目应生成：

```text
build/hka302_motor_app.elf
build/hka302_motor_app.bin
build/hka302_motor_app.hex
```

## 6. 检查编译产物

列出固件：

```bash
find build -type f \( -name "*.hex" -o -name "*.bin" -o -name "*.elf" \)
```

检查 ELF 类型和空间占用：

```bash
file build/hka302_motor_app.elf
arm-none-eabi-size build/hka302_motor_app.elf
```

计算固件校验值：

```bash
sha256sum build/hka302_motor_app.hex
```

2026-07-22 当前构建得到的 SHA-256 为：

```text
68a93864cbb044ec2df394d3e26a9986ff23299100696e5aa51156eaf670a625
```

源码、配置或编译器改变后，Hash 可能变化。只有双方使用相同源码提交、子模块、工具链和构建参数时，Hash 才适合直接比较。

## 7. 导出 HEX 到 Windows

创建 Windows 固件目录：

```bash
mkdir -p /mnt/d/FirmwareOut
```

`/mnt/d/FirmwareOut` 对应 Windows 的 `D:\FirmwareOut`。目录已存在时，`-p` 不会报错。

复制新固件：

```bash
cp build/hka302_motor_app.hex /mnt/d/FirmwareOut/
```

这是复制操作，不会删除 Linux 中的原文件。验证复制结果：

```bash
ls -l /mnt/d/FirmwareOut/hka302_motor_app.hex
sha256sum /mnt/d/FirmwareOut/hka302_motor_app.hex
```

也可在 Windows PowerShell 中验证：

```powershell
Get-FileHash D:\FirmwareOut\hka302_motor_app.hex -Algorithm SHA256
```

## 8. 在 Windows 中烧录

在兼容 AT32F405 目标芯片和当前硬件烧录器的 Windows 烧录工具中选择：

```text
D:\FirmwareOut\hka302_motor_app.hex
```

烧录前确认：

1. 目标芯片型号和开发板配置正确。
2. 烧录器驱动正常，USB 连接和目标板供电稳定。
3. 烧录文件是本次构建后重新复制的 `.hex`。
4. 擦除、地址和校验选项符合项目要求。

具体烧录按钮和参数由实际使用的 Windows 烧录工具决定。

## 9. 项目中 flash.sh 的状态

当前项目包含 `flash.sh`，内容为：

```bash
pyocd flash -t at32f405rct7 build/6702_motor_app.hex --pack=$AT32F405_DFP_PACK_FILE
```

目前不要直接运行该脚本，原因是：

- 脚本引用 `build/6702_motor_app.hex`，但当前实际产物是 `build/hka302_motor_app.hex`。
- 脚本依赖 `pyocd`，当前环境未确认安装。
- 脚本依赖环境变量 `AT32F405_DFP_PACK_FILE`，当前未配置对应 DFP Pack 文件。
- 在 WSL 中使用烧录器还需要额外配置 USB 透传和设备权限。

如果以后需要改为 Linux/WSL 直接烧录，应先确认正确的固件名称、pyOCD 版本、AT32F405 DFP Pack 路径、烧录器兼容性和 USB 透传，再单独配置。当前可靠方案仍是 Windows 烧录。

## 10. 日常最短流程

启动 WSL 后：

```bash
source ~/.bashrc
cd ~/work/a302motor/motor/fw_app
make -j"$(nproc)"
sha256sum build/hka302_motor_app.hex
cp build/hka302_motor_app.hex /mnt/d/FirmwareOut/
```

然后在 Windows 烧录工具中打开：

```text
D:\FirmwareOut\hka302_motor_app.hex
```
