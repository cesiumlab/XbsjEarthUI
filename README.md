# XbsjEarthUI

# 🌏

_我愿与你同行，因你势不可挡！_

## 简介

XbsjEarthUI 是一套基于 Cesium 和 EarthSDK 的三维 GIS/BIM 的应用框架，可以基于此定制自己的三维程序。

git 地址：  
https://github.com/cesiumlab/XbsjEarthUI  
https://gitee.com/cesiumlab/XbsjEarthUI (⭐github 上下载缓慢的话，可以在 gitee.com 上下载)

demo 展示地址：
https://www.earthsdk.com/v/last/Apps/Demos/Viewer/index.html

示例展示地址：
https://www.earthsdk.com/v/last/Apps/Examples/

api 文档：
https://www.earthsdk.com/v/last/

关于这个应用程序的操作，可以参考这个视频：  
https://www.bilibili.com/video/av60366649?from=search&seid=3851172190041118781

EarthSDK 的 API 设计属于类似 VUE 的响应式属性设计，可以参考这篇文章来了解：  
https://www.jianshu.com/p/a37cc18ca310

CesiumLab2.0 和 EarthSDK 的首次培训视频：  
https://www.bilibili.com/video/av61977045/

![](./Tools/readme/example.jpg)
![](./Tools/readme/start.png)  
![](./Tools/readme/视频融合.png)  
![](./Tools/readme/视域分析.png)  
![](./Tools/readme/瓦片位置编辑.png)  
![](./Tools/readme/压平.png)

## 使用步骤

### 开发模式

1. npm install
2. npm run dev
3. 浏览器地址栏输入 localhost:9530

### 使用模式

1. npm install
2. npm run build
3. cd dist  // ***这一步很重要！！！务必在dist目录下启动hs，很多人反馈打不开页面，都是因为少了这一步！***
4. hs -p 81 启动服务
5. 浏览器地址栏输入 localhost:81/index.html

注意：hs 是 http-server 的缩写，如果没有此命令，可以提前安装：npm install -g http-server

## 问题反馈

欢迎进行问题反馈和相关技术交流！
有以下两种途径：

1 QQ 群：830157717  
![](./Tools/readme/qq.png)

2 提 issue：  
https://github.com/cesiumlab/XbsjEarthUI/issues
