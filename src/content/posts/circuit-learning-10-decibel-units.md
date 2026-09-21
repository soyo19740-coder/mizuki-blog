---
title: "第十课时：功率 dBm、dBW 与电压 dBV、dBμV"
published: 2026-09-20T19:00:54+08:00
description: 学习分贝的基本含义，区分功率与电压的 dB 公式，并掌握 dBm、dBW、dBV 和 dBμV 的基础换算。
image: ''
tags: [硬件设计, 电路基础, dB, dBm, dBW, dBV, 信号]
category: 学习记录
learningSection: 电路设计
draft: false
pinned: false
comment: true
lang: zh-CN
---

# 第十课时：功率 dBm、dBW 与电压 dBV、dBμV

## 学习目标

理解分贝（dB）表示的含义，能够区分功率和电压的 dB 公式，并完成 dBm、dBW、dBV、dBμV 的基本换算。

## 1. dB 的作用

dB（分贝）用于表示两个量之间的比值，采用对数形式。

- 数值范围大时，dB 表示更简洁。
- 多级放大或衰减电路级联时，实际倍数相乘，dB 数值直接相加。
- 常用于放大器增益、线缆损耗、滤波器衰减和射频信号强度。

正 dB 表示增益，负 dB 表示衰减，`0 dB` 表示两个量相等。

## 2. dB 与放大倍数

### 功率比

\[
G_{\mathrm{dB}}=10\log_{10}\left(\frac{P_2}{P_1}\right)
\]

\[
\frac{P_2}{P_1}=10^{G_{\mathrm{dB}}/10}
\]

### 电压或电流比

当输入、输出阻抗相同时：

\[
G_{\mathrm{dB}}=20\log_{10}\left(\frac{U_2}{U_1}\right)
\]

\[
\frac{U_2}{U_1}=10^{G_{\mathrm{dB}}/20}
\]

电压使用 `20log`，因为功率与电压平方成正比：

\[
P=\frac{U^2}{R}
\]

| dB | 功率倍数 | 电压/电流倍数 |
| ---: | ---: | ---: |
| 3 dB | 约 2 倍 | 1.414 倍 |
| 6 dB | 约 4 倍 | 2 倍 |
| 10 dB | 10 倍 | 3.16 倍 |
| 20 dB | 100 倍 | 10 倍 |
| 30 dB | 1000 倍 | 31.6 倍 |
| -3 dB | 约 1/2 | 0.707 倍 |

## 3. 级联增益

实际增益相乘，dB 值相加：

\[
G_{\text{总(dB)}}=G_1+G_2+\cdots
\]

例如，一级功率增益为 `20 dB`，二级功率增益为 `13 dB`：

\[
G_{\text{总}}=20+13=33\mathrm{dB}
\]

对应功率放大约：

\[
10^{33/10}\approx2000
\]

## 4. 绝对功率单位

dB 本身只描述比值。dBm、dBW 通过固定参考功率表示绝对功率。

### dBm

以 `1 mW` 为参考：

\[
P_{\mathrm{dBm}}=10\log_{10}\left(\frac{P}{1\mathrm{mW}}\right)
\]

- `0 dBm = 1 mW`
- `10 dBm = 10 mW`
- `20 dBm = 100 mW`
- `30 dBm = 1 W`

### dBW

以 `1 W` 为参考：

\[
P_{\mathrm{dBW}}=10\log_{10}\left(\frac{P}{1\mathrm{W}}\right)
\]

两者关系：

\[
\mathrm{dBW}=\mathrm{dBm}-30
\]

因此：

\[
0\mathrm{dBW}=30\mathrm{dBm}=1\mathrm{W}
\]

## 5. 绝对电压单位

### dBV

以 `1 V` 为参考：

\[
U_{\mathrm{dBV}}=20\log_{10}\left(\frac{U}{1\mathrm{V}}\right)
\]

例：

\[
0.05\mathrm{V}\approx-26\mathrm{dBV}
\]

### dBμV

以 `1 μV` 为参考：

\[
U_{\mathrm{dB\mu V}}=20\log_{10}\left(\frac{U}{1\mu\mathrm{V}}\right)
\]

与 dBV 的关系：

\[
\mathrm{dB\mu V}=\mathrm{dBV}+120
\]

例：

\[
0.05\mathrm{V}=50000\mu\mathrm{V}\approx94\mathrm{dB\mu V}
\]

## 6. dBm 与 dBμV 的换算

功率与电压之间的换算必须知道阻抗：

\[
P=\frac{U^2}{R}
\]

通用换算公式：

\[
\mathrm{dB\mu V}=\mathrm{dBm}+90+10\log_{10}R
\]

其中，`R` 的单位为 Ω。

- 在 `50 Ω` 系统中：
  \[
  \mathrm{dB\mu V}\approx\mathrm{dBm}+107
  \]
- 在 `75 Ω` 系统中：
  \[
  \mathrm{dB\mu V}\approx\mathrm{dBm}+108.75
  \]

> 没有阻抗，不能可靠地在 dBm 和 dBμV 之间换算。

## 7. -3 dB 的意义

\[
-3\mathrm{dB}\Rightarrow P\approx0.5P_0
\]

即功率降为原来的一半。

阻抗不变时：

\[
-3\mathrm{dB}\Rightarrow U\approx0.707U_0
\]

滤波器的截止频率通常以 `-3 dB` 为标志，也称半功率点。

## 8. 易错点

1. 功率比使用 `10log`，电压或电流比使用 `20log`。
2. dBm、dBW 是功率单位；dBV、dBμV 是电压单位。
3. dBm 和 dBμV 换算前，必须确认阻抗，例如 `50 Ω` 或 `75 Ω`。
4. `-3 dB` 不是电压减半，而是功率减半；电压约变为原来的 `0.707` 倍。
5. 课件中若将 `100 倍`直接说成`2 dB`，该表述不正确：功率比为 100 倍是 `20 dB`，电压比为 100 倍是 `40 dB`。

## 最小记忆版

> 功率看 `10log`，电压看 `20log`；功率单位看 dBm/dBW，电压单位看 dBV/dBμV；功率和电压换算要看阻抗；`-3 dB` 表示功率减半。
