## 安装

1. 安装依赖

执行
```
pip install -r requirements.txt
```

2. 安装 Tesseract

参照 [Tesseract Wiki](https://github.com/tesseract-ocr/tesseract/wiki) 安装。

## 修改配置

1. 修改 main.py

将第 55 行的内网穿透代理地址修改成自己的内网穿透服务，推荐使用 [FRP](https://github.com/fatedier/frp) 搭建内网穿透代理，具体办法可以看我的[博客](https://dreace.top/?p=316)。

将第 56 行的 OCR 服务地址修改成自己的 OCR 服务。

2. 修改iCal.py

将第 24 行的目录修改为可以通过 HTTP 访问且存在的目录

将第 102 行的地址修改为可以通过 HTTP 访问的地址

## 启动

最好使用 [Screen](http://www.runoob.com/linux/linux-comm-screen.html) 启动以便后台运行和查看日志。

1. 启动主服务 

执行
```
python Starter.py
```
启动主服务，若没有报错则启动成功。默认监听 83 端口，但微信要求所有请求都必须是 HTTPS 协议，最简单的办法是将服务端运行在 Apache 之后，通过反向代理将请求转发到 83 端口。

2. 启动 OCR 服务

切换到 OCR_Server 目录下，执行
```
python Starter.py
```
启动 OCR 服务，若没有报错则启动成功。默认监听 85 端口。强烈建议将主服务与 OCR 服务分开放在两个不同的服务器上，以防 OCR 服务抢占 CPU 时间。
两个服务都可以通过负载均衡来达到更好的性能。
