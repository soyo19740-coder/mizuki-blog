---
title: 工作记录程序部署笔记
published: 2026-09-20T15:39:13+08:00
description: 记录 Super Productivity 在 Windows 上的选型、安装、中文设置、工作计划、计时、日报导出与数据备份流程。
image: ''
tags: [Super Productivity, 工作记录, 时间管理, Windows, 部署, 日报]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 工作记录程序部署笔记

## 1. 项目定位

目标是使用一个支持每日任务、时间安排、工作计时和日报导出的工具，记录每天早上的工作计划、执行过程和当天总结。

当前考察的程序是 **Super Productivity**：

- GitHub：https://github.com/super-productivity/super-productivity
- 网页版：https://app.super-productivity.com/
- 发布页：https://github.com/super-productivity/super-productivity/releases

## 2. 当前电脑环境

- 操作系统：Windows 11 企业版
- 系统架构：64 位
- 处理器：Intel Core i5-13500H

## 3. 下载版本

在发布页的 Windows 下载区域选择：

> **x64 → Installer x64**

这是普通安装版，适合长期使用。不要选择 `arm64`，因为当前电脑是 Intel x64 架构。

`Portable x64` 是免安装便携版，适合临时使用或不希望写入系统安装目录的情况。

本次截图中看到的版本为 `v19.1.0`；实际下载时以发布页最新稳定版本为准。

## 4. 安装步骤

1. 打开 Super Productivity GitHub [Releases](https://github.com/super-productivity/super-productivity/releases) 页面。
2. 下载 Windows 的 **Installer x64**。
3. 双击安装包，按向导完成安装。
4. 启动软件后，在设置中将语言切换为 **简体中文**。
5. 先创建一个用于工作的项目，例如“日常工作”。

## 5. 中文支持

程序支持简体中文和繁体中文，源码中对应的语言代码为 `zh` 和 `zh-tw`。部分较新的功能可能暂时显示英文。

## 6. 背景图和主题设置

Super Productivity 支持以下自定义内容：

- 为今日、收件箱、项目和标签设置背景图。
- 浅色模式和深色模式分别设置背景图。
- 调整背景图片的明暗程度。
- 调整背景图片的模糊程度。
- 使用 Glass、Liquid Glass、Dracula、Cybr 等内置主题。
- 从 CSS 文件安装自定义主题。

设置入口通常为：

> **设置 → 常规 → 主题**

建议先使用低透明度或适度模糊的二次元背景，确保任务文字清晰可读。

官方主题说明：https://github.com/super-productivity/super-productivity/blob/master/docs/wiki/3.09-Theming.md

## 7. 每日工作使用流程

### 早上：制定计划

为当天建立任务，并填写：

- 任务名称
- 所属项目
- 优先级
- 预计用时
- 截止时间或计划时间段
- 任务备注

建议先列出当天最重要的 3 项工作，再补充零散事务。

### 工作中：记录执行情况

- 开始任务时启动计时。
- 中断时暂停计时，避免把休息时间算入任务。
- 在任务描述中记录关键结果、问题和待跟进事项。
- 将大任务拆成多个子任务，方便日报描述实际进展。

### 下班前：完成当天总结

使用 **结束一天 / Finish Day** 功能查看当天完成情况、预计用时与实际用时，并填写必要的反思或备注。

## 8. 导出工作日报素材

打开 **工作日志 / Worklog**，选择当天日期，然后使用 **导出数据**。

推荐导出字段：

- 任务和子任务
- 项目名称
- 任务描述
- 实际工作时间
- 开始和结束时间

可以选择：

- **展示为文本 → 复制到剪贴板**：最适合直接粘贴给 ChatGPT 整理日报。
- **保存到文件**：适合留档。

发送给 ChatGPT 时可以附带以下要求：

> 请根据这份工作记录整理成工作日报，按“今日完成、进行中及问题、明日计划”组织，语言简洁客观；记录中没有的信息不要自行编写。

## 9. 数据安全和备份

程序是本地优先，任务和计时数据主要保存在本机。导出的数据通常是明文 JSON 或文本，可能包含工作内容和账号信息。

- 不要把完整数据备份直接发到公开位置。
- 分享给 ChatGPT 前，检查并删除账号、Token、客户名称等敏感信息。
- 在设置中配置自动备份或定期手动导出。
- 需要跨设备使用时，再配置同步；初期单机使用即可。

## 10. 参考资料

- [项目主页](https://github.com/super-productivity/super-productivity)
- [首次使用指南](https://github.com/super-productivity/super-productivity/blob/master/docs/wiki/1.01-First-Steps.md)
- [主题设置说明](https://github.com/super-productivity/super-productivity/blob/master/docs/wiki/3.09-Theming.md)
- [数据管理、备份和导出](https://github.com/super-productivity/super-productivity/blob/master/docs/wiki/4.23-Managing-Your-Data.md)

## 11. 待确认事项

- [ ] 完成 Windows x64 安装
- [ ] 切换到简体中文
- [ ] 设置二次元背景图和主题
- [ ] 创建“日常工作”项目
- [ ] 新建一条测试任务并记录耗时
- [ ] 导出一条工作日志，验证复制到剪贴板功能
