---
title: "第 10 节：Linux 权限模型与 chmod"
published: 2026-08-25T23:06:39+08:00
description: 学习 Linux 文件权限模型，读取 ls -l 权限字符串，并使用 chmod 的数字与符号模式安全修改权限。
image: ''
tags: [Linux, 权限, chmod, 文件权限, Linux基础]
category: 学习记录
learningSection: LINUX学习
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 学习目标

- 读取 `ls -l` 中的文件权限。
- 理解所有者、所属组和其他用户三类身份。
- 用数字和符号方式修改权限。
- 在安全练习目录中验证权限变化并运行脚本。

## 风险提示

`chmod` 会改变文件或目录的访问权限。对系统文件或错误路径操作，可能导致文件无法读取、脚本无法运行或系统服务异常。本节只在 `~/linux-learning/lesson-10` 中操作。

## 权限模型

权限字符串示例：

```text
-rw-r--r--
```

- 第 1 位：文件类型；`-` 表示普通文件，`d` 表示目录。
- 接下来三位：所有者权限。
- 再后三位：所属组权限。
- 最后三位：其他用户权限。

权限值：`r=4`（读）、`w=2`（写）、`x=1`（执行）、`-=0`（无权限）。

常见组合：

| 权限 | 数值 |
| --- | ---: |
| `rwx` | 7 |
| `rw-` | 6 |
| `r-x` | 5 |
| `r--` | 4 |
| `---` | 0 |

## 核心命令

```bash
ls -l file
chmod 600 file
chmod 640 file
chmod 755 script.sh
chmod g-r file
chmod o+r file
```

- `600`：所有者读写，组和其他用户无权限。
- `640`：所有者读写，组只读，其他用户无权限。
- `755`：所有者读写执行，组和其他用户读执行。
- `u`：所有者；`g`：所属组；`o`：其他用户。
- `+` 添加权限，`-` 移除权限。

## 实际练习

练习目录：

```text
~/linux-learning/lesson-10
```

创建文件和脚本：

```bash
touch p.txt r.txt s.sh
printf '%s\n' '#!/usr/bin/env bash' 'echo "permission practice"' > script.sh
```

执行权限设置：

```bash
chmod 600 p.txt
chmod 640 r.txt
chmod 755 script.sh
chmod g-r r.txt
chmod o+r r.txt
```

最终验证输出：

```text
-rw------- p.txt
-rw----r-- r.txt
-rwxr-xr-x script.sh
```

运行脚本：

```bash
./script.sh
```

输出：

```text
permission practice
```

## 本节遇到的问题

输入：

```bash
chmod 755 s
```

终端显示了 `s.sh`、`script.sh` 等补全候选，说明命令目标尚未确定，不能把它当作已成功执行。随后正确执行：

```bash
chmod 755 script.sh
```

验收回答中第 7、8 题曾混在一起，正确含义是：

- `chmod g-r r.txt`：移除所属组的读权限。
- `chmod o+r r.txt`：给其他用户添加读权限。

最终权限 `-rw----r--` 已证明两条命令执行正确。

## 验收速查

1. 三组权限依次是：所有者、所属组、其他用户。
2. `rwx` 的数字值是 `7`。
3. `rw-` 的数字值是 `6`。
4. `chmod 600 p.txt` 后其他用户无权限。
5. `chmod 640 r.txt` 初始时所属组为只读。
6. 设置脚本为 `rwxr-xr-x`：`chmod 755 script.sh`。
7. `chmod g-r r.txt` 移除所属组读权限。
8. `chmod o+r r.txt` 添加其他用户读权限。
9. 可由所有者执行的是 `script.sh`。

## 本节状态

已完成实操验收。重点记忆：`chmod` 的三位数字依次对应所有者、所属组、其他用户；修改权限前必须确认路径，并优先在安全练习目录操作。
