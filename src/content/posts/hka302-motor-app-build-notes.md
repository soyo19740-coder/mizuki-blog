---
title: hka302_motor_app 编译笔记（Windows）
published: 2026-07-20T18:05:15+08:00
description: 记录 hka302_motor_app 在 Windows PowerShell 下使用 mingw32-make 和 arm-none-eabi-gcc 编译 AT32F405RCT7 固件的流程、产物与常见提示。
image: ''
tags: [嵌入式, AT32, GNU Make, 编译, 固件]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-20

## 工程信息

- 工程目录：`D:\project_afeng\a302motor\motor\fw_app`
- 工程类型：GNU Make / Makefile 工程，不是 CMake 工程。
- 目标芯片：`AT32F405RCT7`
- 构建工具：`mingw32-make`
- 交叉编译器：`arm-none-eabi-gcc`

## 正常编译

在 PowerShell 中进入包含 `Makefile` 的目录：

```powershell
cd D:\project_afeng\a302motor\motor\fw_app
mingw32-make
```

编译成功的标志是最后出现类似输出：

```text
arm-none-eabi-size build/hka302_motor_app.elf
arm-none-eabi-objcopy -O ihex build/hka302_motor_app.elf build/hka302_motor_app.hex
arm-none-eabi-objcopy -O binary -S build/hka302_motor_app.elf build/hka302_motor_app.bin
```

## 检查工具链

首次配置电脑或命令失败时，先检查：

```powershell
mingw32-make --version
arm-none-eabi-gcc --version
```

两个命令都应显示版本信息。当前环境使用的是 `mingw32-make`，不是 `make`。

## 编译产物

编译后在 `build` 目录中生成：

- `hka302_motor_app.elf`：带调试信息，适合 AT32 IDE / 调试器下载。
- `hka302_motor_app.hex`：带地址信息，适合多数烧录工具。
- `hka302_motor_app.bin`：纯二进制；烧录工具要求填写地址时，程序 Flash 起始地址通常为 `0x08000000`。
- `hka302_motor_app.map`：链接映射和内存占用分析文件，不用于烧录。

烧录时只选择一种固件格式，不要将 `.elf`、`.hex`、`.bin` 依次都写入芯片。

## 当前已知提示

构建开始时可能出现：

```text
'sed' 不是内部或外部命令，也不是可运行的程序
此时不应有 |。
```

这是 Makefile 中调用 Unix `sed` 命令导致的 Windows 兼容性提示。本次构建仍已完成并生成全部固件文件；它目前主要影响版本信息生成。若要消除该提示，可使用 MSYS2/UCRT64 终端执行构建，或后续调整 Makefile 的版本号生成命令。

以下也在本次构建中出现，但属于警告而非编译失败：

```text
section does not have enough alignment to ensure safe PC-relative loads
has a LOAD segment with RWX permissions
```

## 清理后重编译

先查看 Makefile 是否定义了 `clean` 目标：

```powershell
mingw32-make clean
mingw32-make
```

若 `clean` 提示没有规则，不要手动删除未知文件；直接执行 `mingw32-make` 即可进行增量编译。

## 烧录说明

当前 Makefile 不包含 `flash`、`download` 或 OpenOCD 等烧录目标，因此 `mingw32-make` 只负责编译。

烧录需要独立下载器和工具：

- AT-Link / CMSIS-DAP / J-Link：通过 SWD 烧录，优先使用 `.elf`。
- 串口 ISP：需要将芯片进入系统 Bootloader 模式，通常烧录 `.bin`，并设置地址 `0x08000000`。

SWD 下载器至少需要正确连接 `SWDIO`、`SWCLK`、`GND`，并确保目标板供电。电脑必须先识别下载器，才能执行下载。
