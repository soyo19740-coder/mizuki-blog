---
title: Push 到 Gerrit 远程仓库失败的解决方案
published: 2026-07-06
description: 记录向 Gerrit 推送代码时出现 SSH 公钥认证失败的排查过程，以及通过修正远程仓库用户名恢复推送的方法。
image: ''
tags: [Git, Gerrit, SSH, 代码评审]
category: 软件笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 1. 背景

本地仓库路径：

```powershell
D:\Project\HK1401\HK14 Main
```

当前需求是将本地提交上传到 Gerrit 远程仓库。

Gerrit 上传命令通常是：

```powershell
git push origin HEAD:refs/for/master
```

其中：

- `origin`：远程仓库名称。
- `HEAD`：当前分支的最新提交。
- `refs/for/master`：上传到 Gerrit，对 `master` 分支发起代码评审。

## 2. 遇到的问题

执行：

```powershell
git push origin HEAD:refs/for/master
```

报错：

```text
cslau@d.d-l.io: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

含义：

Gerrit 使用 SSH 公钥认证，但当前本机 SSH key 没有被远程 Gerrit 账号接受，或者 remote 地址中的用户名不是当前 SSH key 对应的 Gerrit 用户。

## 3. 检查远程仓库地址

执行：

```powershell
git remote -v
```

输出：

```text
origin  ssh://cslau@d.d-l.io:29418/hcolor/pcb/hk14-main (fetch)
origin  ssh://cslau@d.d-l.io:29418/hcolor/pcb/hk14-main (push)
```

说明当前远程地址使用的是 Gerrit 用户：

```text
cslau
```

仓库地址格式本身是正确的：

```text
ssh://用户名@服务器:端口/项目路径
```

## 4. 检查本机 SSH key

执行：

```powershell
ls ~/.ssh
```

看到本机已有 SSH key：

```text
id_rsa
id_rsa.pub
```

其中：

- `id_rsa` 是私钥，不能给别人，也不能上传到 Gerrit。
- `id_rsa.pub` 是公钥，可以添加到 Gerrit 的 SSH Public Keys。

查看公钥内容：

```powershell
type ~/.ssh/id_rsa.pub
```

如果要使用某个 Gerrit 用户，需要把这条命令输出的整行公钥添加到该 Gerrit 用户的：

```text
Settings / SSH Public Keys
```

## 5. SSH 测试异常

执行：

```powershell
ssh -p 29418 cslau@d.d-l.io
```

或：

```powershell
ssh -p 29418 afeng@d.d-l.io
```

出现：

```text
CreateProcessW failed error:2
posix_spawnp: No such file or directory
```

这个错误通常不是 Gerrit 仓库本身的问题，而是本机 SSH 配置可能调用了不存在的程序，例如：

- `ProxyCommand`
- `connect.exe`
- `nc`
- 某些代理工具

可检查 SSH 配置：

```powershell
type ~/.ssh/config
```

也可以临时绕过 SSH 配置测试：

```powershell
ssh -F NUL -i ~/.ssh/id_rsa -p 29418 cslau@d.d-l.io
```

## 6. 最终发现的可用解决方式

通过查看历史命令：

```bash
134  git remote get-url origin
135  git remote set-url origin ssh://cslau@d.d-l.io:29418/hcolor/pcb/hk14-main
136  git remote set-url origin ssh://afeng@d.d-l.io:29418/hcolor/pcb/hk14-main
137  git remote get-url origin
138  git push
```

可以看出，之前可以正常 push 的关键是把 remote 地址中的用户名从：

```text
cslau
```

改成了：

```text
afeng
```

也就是：

```powershell
git remote set-url origin ssh://afeng@d.d-l.io:29418/hcolor/pcb/hk14-main
```

原因判断：

本机当前 SSH key 很可能已经绑定在 Gerrit 用户 `afeng` 上，而没有绑定在 `cslau` 上，所以使用 `cslau@d.d-l.io` 会认证失败，使用 `afeng@d.d-l.io` 可以通过认证。

## 7. 推荐操作流程

先确认当前 remote：

```powershell
git remote get-url origin
```

如果当前是：

```text
ssh://cslau@d.d-l.io:29418/hcolor/pcb/hk14-main
```

但实际可用账号是 `afeng`，则修改为：

```powershell
git remote set-url origin ssh://afeng@d.d-l.io:29418/hcolor/pcb/hk14-main
```

再次确认：

```powershell
git remote get-url origin
```

然后上传到 Gerrit：

```powershell
git push origin HEAD:refs/for/master
```

## 8. 注意事项

不要随便只执行：

```powershell
git push
```

因为 `git push` 具体推送到哪里，取决于当前仓库的 push 配置，可能直接推到远程分支，也可能不走 Gerrit review。

如果目标是上传到 Gerrit 审核，建议明确使用：

```powershell
git push origin HEAD:refs/for/master
```

如果 Gerrit 目标分支不是 `master`，需要把 `master` 替换成实际目标分支，例如：

```powershell
git push origin HEAD:refs/for/main
```

## 9. 快速版命令

如果确认当前可用 Gerrit 用户是 `afeng`，可以直接执行：

```powershell
git remote set-url origin ssh://afeng@d.d-l.io:29418/hcolor/pcb/hk14-main
git remote get-url origin
git push origin HEAD:refs/for/master
```
