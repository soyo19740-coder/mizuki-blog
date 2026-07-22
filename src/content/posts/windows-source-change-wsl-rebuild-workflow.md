---
title: Windows 修改源码后 WSL 重新编译操作
published: 2026-07-22T17:37:16+08:00
description: 记录 Windows 修改 hka302_motor_app 源码后，通过 rsync 同步至 WSL、重新编译、校验并导出 HEX 固件的完整操作流程。
image: ''
tags: [WSL, Linux, rsync, 嵌入式, 固件编译]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

原始记录日期：2026-07-22

## 1. 固定目录

Windows 源码目录：

```text
D:\project_afeng\a302motor\motor\fw_app
```

WSL 编译目录：

```text
/home/soyo/work/a302motor/motor/fw_app
```

Windows 固件输出目录：

```text
D:\FirmwareOut
```

## 2. 启动 WSL

在 Windows PowerShell 或 Windows Terminal 中执行：

```powershell
wsl -d Ubuntu-24.04
```

## 3. 预览源码同步

每次在 Windows 中修改并保存代码后，先在 WSL 中执行预览：

```bash
rsync -rltv --delete --dry-run \
  --exclude='build/' \
  --exclude='utils/git_version.ps1' \
  "/mnt/d/project_afeng/a302motor/motor/fw_app/" \
  "$HOME/work/a302motor/motor/fw_app/"
```

说明：

- `--dry-run` 只显示计划同步的内容，不会修改文件。
- `--delete` 会让 WSL 源码副本与 Windows 源码保持一致。
- `build/` 被排除，预览和同步阶段不会覆盖现有构建目录。
- `utils/git_version.ps1` 被排除，避免删除 WSL 副本中已有的该文件。
- 源路径和目标路径末尾的 `/` 不能省略。

检查输出，确认列出的修改文件符合预期后再正式同步。

## 4. 正式同步源码

```bash
rsync -rltv --delete \
  --exclude='build/' \
  --exclude='utils/git_version.ps1' \
  "/mnt/d/project_afeng/a302motor/motor/fw_app/" \
  "$HOME/work/a302motor/motor/fw_app/"
```

Windows 目录是源码来源，WSL 目录是编译副本。正式同步会覆盖 WSL 中相同路径的旧源码，并删除 Windows 源目录中已经不存在的文件，但不会删除上面排除的内容。

## 5. 重新编译

加载工具链并进入工程：

```bash
source ~/.bashrc
cd ~/work/a302motor/motor/fw_app
command -v arm-none-eabi-gcc
```

完整干净编译：

```bash
make clean
make -j"$(nproc)"
```

只有 `make` 正常结束且没有出现 `Error` 时，才能继续使用新固件。

如果只做普通增量编译，可以执行：

```bash
make -j"$(nproc)"
```

正式烧录前建议使用完整干净编译。

## 6. 检查编译产物

```bash
find build -type f \( -name "*.hex" -o -name "*.bin" -o -name "*.elf" \)
arm-none-eabi-size build/hka302_motor_app.elf
sha256sum build/hka302_motor_app.hex
```

应生成：

```text
build/hka302_motor_app.elf
build/hka302_motor_app.bin
build/hka302_motor_app.hex
```

每次源码变化后，SHA-256 可能变化，这是正常现象。

## 7. 复制 HEX 到 Windows

```bash
mkdir -p /mnt/d/FirmwareOut
cp -f build/hka302_motor_app.hex /mnt/d/FirmwareOut/
```

验证 Linux 原文件与 Windows 目标文件一致：

```bash
sha256sum build/hka302_motor_app.hex
sha256sum /mnt/d/FirmwareOut/hka302_motor_app.hex
```

两个 SHA-256 必须完全相同。

Windows 烧录文件位置：

```text
D:\FirmwareOut\hka302_motor_app.hex
```

## 8. 每次修改后的完整命令

按顺序执行，不要跳过编译错误检查：

```bash
rsync -rltv --delete --dry-run \
  --exclude='build/' \
  --exclude='utils/git_version.ps1' \
  "/mnt/d/project_afeng/a302motor/motor/fw_app/" \
  "$HOME/work/a302motor/motor/fw_app/"
```

确认预览正确后：

```bash
rsync -rltv --delete \
  --exclude='build/' \
  --exclude='utils/git_version.ps1' \
  "/mnt/d/project_afeng/a302motor/motor/fw_app/" \
  "$HOME/work/a302motor/motor/fw_app/"

source ~/.bashrc
cd ~/work/a302motor/motor/fw_app
make clean
make -j"$(nproc)"
sha256sum build/hka302_motor_app.hex
mkdir -p /mnt/d/FirmwareOut
cp -f build/hka302_motor_app.hex /mnt/d/FirmwareOut/
sha256sum /mnt/d/FirmwareOut/hka302_motor_app.hex
```

## 9. 注意事项

- 确认 Windows 编辑器已经保存文件后再同步。
- 如果预览没有列出刚修改的文件，检查编辑的文件是否确实位于 Windows 源码目录中。
- 当前同步范围只包括 `fw_app`。如果修改了 `a302motor` 下其他目录，需要扩大同步范围或单独同步对应目录。
- 编译失败时不要复制或烧录旧的 `.hex`。
- 项目中的 `flash.sh` 当前不适用于本流程；本流程在 WSL 编译，在 Windows 中烧录。
