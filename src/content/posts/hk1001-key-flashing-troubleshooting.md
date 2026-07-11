---
title: HK1001 Key 烧录遇到的问题
published: 2026-07-01
description: 记录 HK1001 Key 烧录工具运行时遇到的 websockets 版本兼容、Python 3.14 事件循环和 Chromium 依赖问题，以及对应的处理方法。
image: ''
tags: [HK1001, 烧录, Python, websockets, Chromium]
category: 开发笔记
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 问题概览

这次遇到的并不是单一问题，而是以下三个问题叠加造成的：

1. `websockets` 库升级后，原有 API 不再兼容。
2. 即使将 `websockets` 降级，Python 3.14 对事件循环的处理仍需要额外适配。
3. 程序需要调用 Chromium，但系统尚未安装对应浏览器。

## 首次报错

首次执行 `main_freq.py` 时，程序在 `websockets.serve(...)` 处失败：

```text
Traceback (most recent call last):
  File ".../main_freq.py", line 295, in <module>
    start_web(burn_and_test)
  File ".../web_serve.py", line 77, in start_web
    start_server = websockets.serve(serve, addr, port, create_protocol=FileServer)
  File ".../websockets/asyncio/server.py", line 284, in __init__
    self.loop = asyncio.get_running_loop()
RuntimeError: no running event loop
```

排查后确认，问题来自 `websockets` 库升级导致的 API 不兼容。

### 处理方法：回退 websockets 版本

先检查当前安装的版本：

```bash
python3 -c "import websockets; print(websockets.__version__)"
```

然后卸载当前版本并回退到 `10.4`：

```bash
pip uninstall websockets
pip install "websockets==10.4"
```

## 二次报错

将 `websockets` 降级后，再次执行 `main_freq.py`，事件循环仍然报错：

```text
Traceback (most recent call last):
  File ".../main_freq.py", line 295, in <module>
    start_web(burn_and_test)
  File ".../web_serve.py", line 77, in start_web
    start_server = websockets.serve(serve, addr, port, create_protocol=FileServer)
  File ".../websockets/legacy/server.py", line 1034, in __init__
    loop = asyncio.get_event_loop()
RuntimeError: There is no current event loop in thread 'MainThread'.
```

原因是 Python 3.14 对事件循环的处理更严格，需要手动创建并绑定 `EventLoop`。

## 代码修改

### 1. 修改 `web_serve.py`

修改前：

```python
def start_web(init_cb, addr='localhost', port=8080):
    global conn_init_cb
    conn_init_cb = init_cb
    start_server = websockets.serve(serve, addr, port, create_protocol=FileServer)
    asyncio.get_event_loop().run_until_complete(start_server)
    # asyncio.get_event_loop().run_forever()
```

修改后：

```python
def start_web(init_cb, addr='localhost', port=8080):
    global conn_init_cb
    conn_init_cb = init_cb

    # Python 3.14 需要手动创建 EventLoop。
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    start_server = websockets.serve(
        serve,
        addr,
        port,
        create_protocol=FileServer,
    )

    loop.run_until_complete(start_server)
```

### 2. 修改 `main_freq.py`

修改前：

```python
if __name__ == "__main__":
    start_web(burn_and_test)
    asyncio.get_event_loop().create_task(cmd_service())
    asyncio.get_event_loop().create_task(open_brower())
    asyncio.get_event_loop().run_forever()
```

修改后：

```python
if __name__ == "__main__":
    start_web(burn_and_test)

    loop = asyncio.get_event_loop()

    loop.create_task(cmd_service())
    loop.create_task(open_brower())

    loop.run_forever()
```

## 安装 Chromium 依赖

程序指定打开 Chromium，但系统中没有对应的浏览器程序时，需要在终端安装：

```bash
sudo apt update
sudo apt install chromium-browser
```

## 最终结果

完成上述调整后，执行以下命令可以正常打开网站：

```bash
python3 main_freq.py
```
