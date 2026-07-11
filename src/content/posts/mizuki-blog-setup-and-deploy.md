---
title: Mizuki 个人博客搭建与部署记录
published: 2026-07-12
description: 记录这次基于 Mizuki 模板搭建个人博客、精简模板内容并通过 GitHub Pages 部署上线的完整过程。
image: ''
tags: [Astro, GitHub Pages, Markdown, Blog]
category: 建站
draft: false
pinned: true
comment: true
lang: zh-CN
---

# 写在前面

这篇笔记用来记录这次个人博客从模板选型、页面定制到 GitHub Pages 部署上线的全过程。后续如果要重建博客、迁移仓库，或者排查部署问题，可以直接按这篇文章回溯。

## 选型

这次选择的是 **Mizuki** 模板。

原因很简单：

- 基于 Astro，静态部署友好
- 原生支持 Markdown 内容
- 页面结构完整，适合继续精简成个人博客
- GitHub Pages 可以直接托管

## 本地启动

克隆仓库之后，核心命令是：

```bash
pnpm install
pnpm dev
```

开发时本地地址为：

```text
http://localhost:3000/
```

项目里还带有内容同步脚本，启动时会先尝试同步内容仓库。如果没有单独配置内容仓库，就会回退到本地内容模式。

## 这次做了哪些站点改动

### 1. 改成中文个人博客

主要修改了这些配置：

- 站点标题
- 副标题
- 个人资料
- 顶部导航
- 关于页内容

站点名改成了「羽毛笔」，副标题改成了更适合个人写作博客的描述。

### 2. 关闭模板自带展示型功能

原模板里有不少偏演示性质的页面和组件，这次先关掉了大部分，只保留博客主体需要的部分。

曾经关闭过的页面包括：

- Anime
- Projects
- Skills
- Timeline
- Devices
- AI Tools

后面又按需要重新恢复了：

- Diary
- Albums

### 3. 替换头像和说明

个人资料卡里的头像被替换成了自己的图片，简介和 GitHub 链接也换成了自己的内容。

### 4. 删除模板示例文章

为了让博客首页不再出现模板演示内容，删除了这些示例文章：

- Markdown Tutorial
- Encrypted Post
- Markdown Extended Features
- Markdown Mermaid
- Video
- Draft
- Guide

删完之后，`posts` 目录只保留空结构，方便后续自己开始写。

## GitHub Pages 部署过程

### 1. 新建自己的仓库

最终使用的仓库是：

```text
https://github.com/soyo19740-coder/mizuki-blog
```

### 2. 修改部署相关配置

为了让项目仓库能在 GitHub Pages 子路径下正常访问，改了两个关键点：

#### `siteURL`

```ts
siteURL: "https://soyo19740-coder.github.io/"
```

#### `base`

```ts
base: "/mizuki-blog/"
```

如果以后仓库名改了，这个 `base` 也要同步改。

## 部署时踩到的坑

这次部署并不是一次成功，中间连续修了几轮工作流。

### 1. 工作流 YAML 语法错误

最开始的 `deploy.yml` 里有一个空的 `env:` 块，GitHub Actions 直接把它当成无效工作流。

解决方式：

- 删除空的 `env:` 配置块

### 2. 第三方 Pages 部署 action 不稳定

一开始用的是把构建结果推到 `pages` 分支的方式，后面改成了 GitHub 官方 Pages 工作流：

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

这样兼容性更好，也更符合 GitHub Pages 现在的推荐方式。

### 3. `Setup Node.js` 和 `pnpm install` 连续失败

后面主要问题集中在 CI 环境的安装步骤：

- `cache: "pnpm"` 导致 `setup-node` 阶段失败
- 调试时加入的 `corepack` 步骤也不兼容当前运行环境
- `deploy.yml` 和 `lint.yml` 的安装配置不一致

最后的处理方式是：

- 去掉 `setup-node` 的 pnpm 缓存
- 删除不兼容的调试步骤
- 让 `deploy.yml` 的安装方式尽量和 `lint.yml` 保持一致
- 显式设置 `ENABLE_CONTENT_SYNC: false`

## 最终上线结果

博客最终通过 GitHub Pages 成功上线，地址是：

```text
https://soyo19740-coder.github.io/mizuki-blog/
```

如果更新后没有立即看到最新内容，一般强制刷新一下浏览器缓存就可以：

```text
Ctrl + F5
```

## 后续维护方式

以后写文章的流程会更简单：

1. 在本地写 Markdown
2. 放到 `src/content/posts/`
3. 提交到 GitHub
4. GitHub Actions 自动部署

也可以继续往下升级成：

- 独立内容仓库模式
- 评论系统
- 自定义域名
- 更干净的页面结构

## 结论

这次搭建的核心经验可以总结成一句话：

> 先把模板收成一个干净可用的博客壳，再去补内容和长期工作流。

这样做虽然前期要处理一些模板清理和部署细节，但后面写作和维护会顺很多。
