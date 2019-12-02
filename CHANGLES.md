Change Log
==========

### 1.2.12

* 模型增加环境贴图
* 自定义图元扩展中的管道增加repeat属性

### 1.2.9 - 2019-11-29

##### Additions :tada:

* 折线和多边形类型增加depthTest属性，当地表透明时建议开启
* 折线和多边形增加拾取响应

##### Fixes :wrench:
* 修复地形开启半透明以后，导致拾取时模型闪烁的问题
* 修复对非draco顶点压缩模式模型和3dtiles数据进行加载时显示错乱的问题，但是进行模型压平时仍然会有问题
* 完善CzmObject对象的说明文档

### 1.2.8 - 2019-11-26

##### Major Announcements :loudspeaker:
* HeatMap类变更为GroundImage
* Pin的winPos属性从2个元素的数组变成4个元素的数组，即从[left, bottom]变成[left, top, right, bottom]，需要把之前winPos[1]改成winPos[3]
* SceneTree.Group类增加setAllChildrenEnabled方法，以替代enabled这个只写属性，目的是避免把enabled当成响应式属性来使用
* 通过3dtiles的style设置偏移量的功能，需要使用EarthSDK自带的Cesium，如果替换Cesium，此功能将不可用

##### Additions :tada:
* EarthUI和EarthSDK增加了pin里面的extText相关属性
* EarthUI增加了控制图层树checkbox显隐的属性
* EarthUI标绘增加了平行搜寻区功能
* 增加任意多边形框选功能
* 3dtiles的style可以设置部件偏移
* Pin中增加extText、isDivImage属性，改造winPos属性
* czmObject类型增加evalString、preUpdateEvalString等属性
* tileset和model可以设置环境贴图
* 进一步完善标绘的编辑功能，目前编辑时不会出现黄线
* 自定义图元类增加registerEditing方法，调用之后可进行编辑

##### Fixes :wrench:
* 修复强制光照经度、纬度不对的问题
* 修复外置图标打开看不见的问题
* 修复销毁地球时，有对象清理不掉的问题
* 修复Pin的enable属性不起作用等问题
* 修复场景树节点中ref属性不能保存的问题
* 修复odlines中enabled属性不起作用的问题
* 修复自定义图元移动后消失的问题

### 1.2.7 - 2019-11-9

##### Fixes :wrench:
* 修复旋转角度不对的问题

### 1.2.6 - 2019-11-9

##### Additions :tada:
* EarthUI标绘新增了贝塞尔2次曲线和贝塞尔3次曲线功能

##### Fixes :wrench:
* 完善数字城市的示例，通过自定义图元类增加多种可视化效果
* 修复视域分析等的旋转角度不对的问题
* 修复视域分析等示例中旋转角度表示错误
* 修复pin-div示例中出现了滚动条问题
* 修复扫描线点击示例中点击和拖动起冲突问题
* 把示例和视景器中的强制光照中的经度、纬度修改为滑动条，并把高度去掉

### 1.2.5 - 2019-11-6

##### Fixes :wrench:
* 修复registerPolygonCreatingWithHeight带来的属性变化问题
* 完善数字工厂的示例
* 完善自定义图元示例

### 1.2.4 - 2019-11-2

##### Additions :tada:
* 把mapv和cesium结合的示例加到了EarthSDK中；
* Cesium自定义材质增加了几个按钮；
* EarthUI标绘中增加了折线和圆弧；
* 新增了5个Cesium自定义Primitive相关的示例；
* 增加自定义图元功能和相关示例；
* 增加数字城市和数字工厂的示例；
* EarthUI标绘增加更多标绘按钮；

##### Fixes :wrench:
* 改进地形限制功能，创建时不再需要确定高度；
* 把tileset的skipLevelOfDetail属性修改为了false；
* 修复大雁塔等（无光照模型）不能启用阴影的问题;
* 修复启用阴影后崩溃的问题；
* 影像属性中增加最小最大级别限制；
* 修复PBR材质让部分属性生效；
* 修复点云大小不能设置的问题，并且让3dtiles中其他属性的设置也同时生效；
* 改进旋转编辑的UI交互，让旋转轴清晰可见，并在三维中直接实时动态显示测量结果；
* 修正旋转编辑时角度范围，从-270 - +90变更为-180 - +180；
* 地形限制的编辑交互中不需要设置高度；
* 修复动态加载js文件时报错的问题；

### 1.2.3 - 2019-10-21

##### Additions :tada:
* 增加了强制光照示例；
* EarthUI中增加了强制光照功能；
* EarthUI中模型的属性窗口增加了材质底色属性；

##### Fixes :wrench:
* 材质颜色修正

### 1.2.2 - 2019-10-21

##### Additions :tada:
* Model中增加luminanceAtZenith属性；
* 增加强制光照效果，可以任意修改太阳光方向；
* 影像纠偏示例增加了一些提示；
* 增加了热力图和水面示例；
* EarthUI中增加了水面功能；

##### Fixes :wrench:
* 修复引入Cesium1.62以后模型加载变灰的问题
* 修复引入Cesium1.62以后锯齿严重的问题
* 修复旋转用gltf重复加载问题

### 1.2.1 - 2019-10-18

##### Additions :tada:
* 底层Cesium.js独立拆分，可以替换成客户自行开发的Cesium来使用！
* 新增贴地图片轮换功能（动态热力图）；
* 新增水面效果，相关属性有：基础水面颜色、与反射的融合参数、水流方向和速度控制等；
* 新增3dtiles强制双面显示功能；

##### Fixes :wrench:
* 地表限制可以指定为任意多边形，包括凹多边形，且无论是否远离地球，边界都清晰可见；
* 修复点选后，取消选择状态时，不能取消物体的选择状态的问题；
* 修复大平面近视点的裁切问题；
* 默认的Cesium升级至1.62版；
* 修改版权声明为免费的条款
* 修复3dtiles的style样式设置问题
* 接口调整 effect.baseColor -> terrainEffect.baseColor；

### 1.1.0 - 2019-9-1

##### Additions :tada:
* 增加Path/Pin等对象
* 完善大量示例
* 完善响应式属性的设计

### 1.0.0 - 2019-08-01
* 初始版本


