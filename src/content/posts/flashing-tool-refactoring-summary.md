---
title: 烧录程序重构总结笔记
published: 2026-08-31T17:46:14+08:00
description: 总结 hk_fw 公共烧录框架、项目入口、profile 配置、设备检测、失败重试和自动回归的重构成果，并记录硬件验收风险与后续工作。
image: ''
tags: [烧录, 重构, Python, Shell, 固件, 自动化测试, hk_fw]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 烧录程序重构总结笔记

时间范围：2026-08-26 至 2026-08-31

仓库：`D:/project_afeng/hk_fw`

Linux 镜像：`/home/soyo/work/hk_fw`
项目：hk24、hk14、mb2、hk1001

## 1. 最终结论

在不考虑生产硬件测试的前提下，本轮软件重构已经完成。公共烧录框架、项目入口、profile 配置、菜单行为、设备检测、失败重试和自动回归均已建立并通过主机侧验证。

尚未完成的是硬件验收，不是框架代码缺失。真实硬件仍可能暴露供电、Flash 保护、复位时序、DFP pack、芯片 target、串口权限或固件版本对应关系问题。

## 2. 原程序问题

重构前每个项目或变体维护独立 shell 脚本，主要问题如下：

1. AT32 和 ESP 的命令、错误处理、退出码和提示文字重复分散。
2. ESP 脚本固定使用 `/dev/ttyACM0` 或自定义固定路径，设备更换后容易烧错或直接失败。
3. AT32 probe 依赖手工输入，多个设备时没有统一选择逻辑。
4. 测试烧录命令在部分旧脚本中被注释，但脚本通过 `echo 1` 返回成功，形成伪成功。
5. 固件使用通配符或旧目录，实际烧录文件与脚本引用可能不一致。
6. 生产流程和返修流程的失败重试语义不统一，容易只重跑正式阶段。
7. hk1001 原流程把 main、driver、cam 多块板卡步骤混在一起，菜单编号和文件引用也不稳定。
8. MB2 的 AT32、ESP 顺序和中间 reset 要求无法通过普通项目脚本表达。

## 3. 新架构

### 3.1 公共执行层

根目录 `flashctl.sh` 现在统一负责：

- 参数解析和帮助信息；
- profile 加载与字段默认值；
- 固件路径拼接、存在检查和通配符拒绝；
- AT32 pyOCD 命令构造和阶段选择；
- ESP esptool 命令构造、测试/正式镜像和 Flash 参数；
- probe/串口自动检测及显式覆盖；
- retry、dry-run、错误码和统一日志；
- 交互菜单、成功钩、失败叉、Enter/m/q 行为；
- MB2 等特殊生产流程的 profile 开关。

### 3.2 项目入口层

项目入口只选择变体或板卡，然后将项目根目录和 profile 传给公共程序：

- hk24：选择六个产品变体。
- hk14：加载单一 ESP profile。
- mb2：加载包含 AT32 前置和 reset 开关的 profile。
- hk1001：先选择 main、driver、cam，再进入对应 profile。

这样新增变体时主要增加 profile 和入口映射，不再复制烧录实现。

### 3.3 配置层

profile 保存项目差异，包括：

- `PROJECT_NAME`、`PROFILE_ID`、`BOARD_FLOW`；
- AT32 芯片 target、DFP pack、BL/APP 镜像和阶段；
- ESP 芯片、波特率、Flash 容量、擦除策略；
- 测试和正式镜像的地址及文件；
- `PRODUCTION_AT32_FIRST`、`PRODUCTION_AT32_RESET_AFTER_TEST` 等特殊流程开关。

公共程序只接受相对且明确的固件路径，固件文件必须在仓库中存在。

## 4. 各项目完成内容

### 4.1 hk24

已接入六个 profile：

```text
at32-main
at32-main-v1
bt-ai
bt-fp
bt-ik
bt-pj
```

AT32 main/main_v1 使用 BL + APP 阶段；蓝牙变体使用 ESP 测试/正式镜像。入口菜单、自动检测、成功/失败重试和命令行模式统一由公共程序处理。

### 4.2 hk14

统一为 ESP-only 项目，支持返修正式、返修测试和生产测试后正式。串口自动检测、显式 `--port`、失败重试和设备断开后重新扫描已经接入。Linux 真机测试曾验证通过，但完整正式版本记录仍需补录。

### 4.3 MB2

已确认 AT32 使用 `at32f402rct7`，并配置 `ArteryTek.AT32F402_405_DFP` 组合 pack。生产顺序明确为：

```text
AT32 BL + APP -> ESP 测试（2 MB）-> AT32 reset -> ESP 正式（4 MB）
```

新仓库中 `mb2/tools/bt_mb2/` 是唯一烧录来源，旧 `mb2/fw/` 已删除；原始版本保存在 `D:/project_afeng/原hk_fw/mb2/`。MB2 生产成功顺序、各阶段失败短路和 Enter 从头重跑均已用 fake 工具验证。

### 4.4 hk1001

按三块独立板卡拆分：

| profile | 板卡 | 固件 |
|---|---|---|
| `main.conf` | 主控板 | AT32 APP、ESP 测试、ESP 正式 |
| `driver.conf` | 驱动板 | AT32F402 APP |
| `cam.conf` | 摄像头板 | ESP32-P4 固件 |

固件统一移动到 `hk1001/tools/`，旧的同级 `main/`、`driver/`、`cam/` 固件目录已删除。main 支持完整流程，也支持 AT32、ESP 测试、ESP 正式分步执行。

## 5. 交互和设备行为

### 5.1 返修和生产重试

返修成功或失败后 Enter 都重跑当前场景。生产流程无论在哪一阶段失败，Enter 都从测试固件重新开始；生产成功后下一块板也从测试阶段开始。`m` 返回上级菜单，`q` 退出。

### 5.2 AT32 probe

未指定 `--probe` 时执行 `pyocd list -p --no-header`：

- 0 个 probe：错误并阻止烧录；
- 1 个 probe：自动使用唯一序列号；
- 多个 probe：显示列表并要求用户选择；
- `--probe ID`：跳过扫描并固定设备。

失败或设备消失后清除缓存，下一次 Enter 重新检测。

### 5.3 ESP 串口

Linux 扫描顺序为：

```text
/dev/serial/by-id/*
/dev/ttyACM*
/dev/ttyUSB*
```

优先使用稳定的 `by-id` 路径；多个候选要求用户选择；`--port PATH` 覆盖自动选择。ESP 工具优先使用项目 `.venv` 中的 Python/esptool。

## 6. 自动化验证记录

### 6.1 静态验证

- 所有 shell 脚本通过 `bash -n`。
- `git diff --check` 通过。
- profile 必填字段、入口帮助、detect dry-run 和无效参数均有覆盖。
- 固件路径拒绝绝对路径和通配符。

### 6.2 回归脚本

| 脚本 | 验证内容 |
|---|---|
| `at32-probe-regression.sh` | 无 probe、单 probe、多 probe、显式序列号 |
| `esp-port-regression.sh` | 无串口、单串口、多串口、显式端口 |
| `interactive-menu-regression.sh` | Enter 重试、m 返回、q 退出 |
| `device-reconnect-regression.sh` | 设备断开后重新检测 |
| `hk24-hk14-menu-regression.sh` | hk24 六变体和 hk14 完整菜单 |
| `mb2-production-regression.sh` | MB2 生产顺序和失败短路 |
| `mb2-firmware-duplicate-check.sh` | MB2 唯一固件目录和旧目录清理 |
| `firmware-checksum-regression.sh` | 60 个固件清单条目存在且校验一致 |
| `profile-contract-regression.sh` | 11 个 profile 的接口合约 |
| `broad-dryrun-regression.sh` | 34 个场景连续 100 次，共 3400 次 |

已知结果：上述主机侧回归均通过；hk24/hk14 菜单专项连续 10 轮通过。fake 工具只验证命令构造和控制流，不验证芯片实际响应。

## 7. 重要问题记录

### 7.1 hk24 main_v1 二次烧录失败

现象：同一块板第一次 BL + APP 成功，随后再次从 BL 开始时，在 `0x08000000` 报 `flash erase sector failure`，同时出现 `Invalid coresight component` 和 `T bit in XPSR is invalid`。

处理：没有把解保护、全擦除或首扇区擦除自动加入普通重试。当前仅能确认现象，不能确认根因；需要硬件环境下检查 Flash 保护状态、复位/供电、probe 连接、target 和 DFP pack。

### 7.2 历史固件路径问题

hk24 PJ 旧测试脚本曾引用仓库不存在的 `color7-982-2.bin`；当前 profile 使用仓库中明确存在的版本，但版本对应关系仍待产品确认。hk1001 旧 camera 脚本使用通配符，已改为明确文件名。MB2 和 hk1001 的新固件来源已统一到 `tools/`。

### 7.3 依赖错误

`python is not installed` 或 `No module named esptool` 是环境/虚拟环境问题，不应通过修改烧录流程隐藏。先检查项目 `.venv`、Python 路径和 esptool 安装。

## 8. 仍待完成的工作

1. 在真实 Linux 生产环境验证 hk24 各变体、hk14、MB2、hk1001 三块板卡。
2. 逐项确认 target、DFP pack、Flash 地址、容量、固件版本对应关系。
3. 记录真实设备 ID、固件版本、完整命令、日志和最终功能结果。
4. 针对 hk24 main_v1 的二次擦除失败完成硬件专项定位。
5. 全部硬件验收完成后，再决定是否清理 CLI、dry-run 和旧兼容入口。

## 9. 后续 AI 的推荐工作方式

接手后先读取 AI 交接文档，运行 `git status --short`，确认当前工作树。任何修改都应先定位具体 profile/公共函数，再做最小范围编辑；改完执行对应回归，不要为了代码简洁提前删除测试、命令行或备份。涉及真实硬件的结论必须明确写成“待验证”，直到有实际设备日志支持。
