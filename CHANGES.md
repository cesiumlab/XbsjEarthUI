Change Log
==========

### 1.7.14 - 2022-8-22
##### Fixes :wrench:
* 修复bug：双层影像叠加，如果上一层有透明区域，此时又开启了地形挖坑，那么透明区域就会变白。
* 增加3dtiles的xbsjFrontFace属性，用来切换正反面
* 修复姿态编辑时使用的辅助相机大小变大的问题

### 1.7.10 - 2022-3-8
##### Fixes :wrench:
* 将模型结构移植到图层管理中
* 增加海量POI的示例
* 增加EarthSDK自定义对象：GeoJSON/CZML/KML
* 服务端口号修改成9003，适配cesiumlab3

##### Additions :tada:
* 增加挖坑转成静态几何体的功能

### 1.7.6 - 2021-10-27
##### Fixes :wrench:
* 修复上一版某绒滥报问题
* 修复示例中使用了偏移影像的问题

### 1.7.5 - 2021-10-15
##### Fixes :wrench:
* 修复ktx2纹理加载走样的问题
* 增加对cesium内部的鼠标事件控制属性(CameraEventAggregator.screenSpaceEventHandlerUseCanvasParentElement)

### 1.7.4 - 2021-9-4
##### Fixes :wrench:
* 修复原先双面显示崩溃的问题，增加双面显示按钮
* 重新支持对crn纹理的加载
* 增加地形夸张的属性，增加地形夸张UI
* 修复skybox设置为false导致的程序崩溃

### 1.7.3 - 2021-9-1
##### Fixes :wrench:
* 修复自定义图元纹理显示不出来的问题，同时修复earth-customPrimitive-div.html等几个示例
* 示例中不再使用无法显示的谷歌影像服务

### 1.7.2 -2021-7-30
##### Fixes :wrench:
* 消除火绒对浏览器的误报问题

### 1.7.1 -2021-7-30
##### Fixes :wrench:
* 支持CesiumLab的跨平台压缩数据加载

### 1.7.0 - 2021-7-21
##### Fixes :wrench:
* Cesium升级到1.83
* 修复PolygonHierarchy导致的报错
* 修复TMS影像加载后不能保存的问题(TileMapServiceImageryProvider)
* 修复模型、3dtiles数据增加轮廓效果时出现的渲染崩溃问题
* 修复顶点纹理坐标偏移失效和纹理坐标偏移导致的漏缝问题
* 修复中键旋转导致卡死的问题
* OD线集群增加曲率控制(heightRatio)
* 修复自定义图元尺寸非2的幂次会显示为一片黑色的问题
* 挖坑体增加notUseSampleHeightMostDetailed属性，默认false，如果设置为true，则会加速获取高程信息，但是该属性不适 
合存储用！
* 修复太阳经纬度所指方向反了的问题
* 自定义图元使用的纹理，如果是2的幂次，则自动生成mipmap
* 修复地形挖坑三个点不能创建底面的问题

### 1.6.4 - 2021-4-27
##### Fixes :wrench:
* 修复bug：场景初始化时控制台会报错: GET http://xxx/dbRoot.v5?output=proto 404 (Not Found);
* 修复defaultAccessToken不能存储的问题，另外defaultAccessToken为空字符串时，会默认使用Cesium的token。;
* 修复地下模式开启后再关闭失效的问题;
* 修复采用共享纹理模式加载3dtiles后出现的崩溃问题;
* 新增图像缓存功能，减轻调度压力;
* Polyline的OD线材质可以设置图像，新增了image、useImageAndRepeat两个属性;
* 让3dtiles数据的allowPicking属性生效;
* 3dtiles加载采用共享纹理模式

### 1.6.0 - 2021-4-13
##### Fixes :wrench:
* 升级到Cesium1.80
* 修复Polygon.ground属性的文档说明，默认值是false
* 修复Gltf的纹理坐标偏移扩展会出现缝隙的问题
* 修复ODLines.color设置不能生效的问题
* OD线集群增加双向流动
* OD线和OD线集群可以设置线条背景色
* 距离测量和面积测量的回调函数改进
* tileset增加colorBlendAmount和colorBlendMode属性
* 修复扫描线附近不能拾取其他物体的问题
* 修复Model的silhouetteColor属性设置不起作用的问题
* 完善xbsjStyle的范例说明
* 影像类型增加GoogleEarth
* 点测量的回调改进，只在左键点击时才发出
* 修复加载场景时，场景中KML的show属性为false时，依然可见的问题

##### Additions :tada:
* OD线增加双向控制属性bidirectional
* OD线的材质增加bgColor属性(背景色)
* 折线和多边形增加最大最小可视海拔高度
* 多边形增加hole
* 视角管理器增加播放功能

### 1.5.3 - 2021-1-13
* 修复Pin的属性窗口类型设置错误
* 修复importScript加载js文件报错的问题
* 修复3dtiles进行位置偏移后导致深度测试不对的问题
* 修复Cesium官方地形不能展示高程的问题
* 修复键盘漫游时编辑框输入时仍然会导致按键响应的问题

### 1.5.1 - 2020-12-7
* 修复bug 因为创建arcgisMapService的url为空导致的 '<'报错(wcx)
* MVVM框架适配Vue3.0
* 修复上一个版本材质底色不起作用的问题

### 1.5.0 - 2020-11-25
* Cesium升级到1.75;
* 影像类型支持ArcGIS和WMS(wcx);
* 修复Array.prototype中增加的方法导致for in使用上出现问题;
* 修复安卓移动端加载跨平台纹理数据时出现白模的问题;
* 修复含有跨平台纹理的3dtiles加载后再开启双面显示时的崩溃问题;
* 修复3dtiles瓦片参数的问题，使其可以恢复默认值(wcx)

### 1.4.27 - 2020-11-10
* 视频融合增加maskUrl属性，用来设置掩码图像路径;
* 修复标绘按钮创建报错的问题;
* 修复控制clock不起作用的bug(wcx);
* 新增动态响应式属性相机的fov角度;
* 恢复强制太阳光方向属性的设置，使用Cesium的DiectionalLight来实现;
* 场景保存时支持对拾取颜色的存储和读取;
* Pin中新增iframe相关属性，用来打开一个信息框，该信息框的内容一个网址;
* 修复部分带动画的gltf模型加载后崩溃的问题;
* Picking增加hoveredPickedObj，clickedPickedObj属性;
* 漫游菜单增加相机的fov角度;
* 时间轴默认改为隐藏;

### 1.4.21 - 2020-9-3
##### Additions :tada:
* 增加CustomPrimitive.createDynamicCountour和CustomPrimitive.createDynamicCountour2方法
* 增加CustomPrimitive.createDynamicPoi和CustomPrimitive.creatNumberPoi方法
##### Fixes :wrench:
* 修复面积测量始终出现一个0平方米的标签的问题
* 3dtiels的内置科技感shader完善，增加部分注释，方便客户自行修改
* 修正clock，修复gltf动画加载后动画播放不正常的问题(wcx)
* 修复包括跨平台压缩纹理(BASIS)的3dtiles数据在EarthSDK示例中不能展示的问题
* 修复Pin的背景会被填充棉遮挡的问题
* 自定义图元针对imageUrl属性，采用共享纹理模式，即imageUrl相同的纹理，讲只加载一次
* XbsjEliipsoidTerrainProvider增加tilingScheme属性，方便进行墨卡托分块测试

### 1.4.18 - 2020-8-4
##### Additions :tada:
* 修复earth.destroy()报错的问题
* 增加对flv格式的支持，如果flv视频资源没有后缀flv后缀名，路径中需要加入 -.flv
* 增加div转canvas的方法
* 增加贴地图元功能
* 增加贴地图元上绘制echart图标的示例
* 增加贴地土塬上绘制div元素的示例
* 增加时间轴功能(wcx)
* 更改了timeline的默认状态，现在为无边界，默认系统时间

##### Fixes :wrench:
* 修复支持ogg等视频不能播放的问题
* 修复js文件重复加载报错的问题(感谢vue-cesium大神zouyaoji)
* 修复timeLine的速率的bug

### 1.4.14 - 2020-7-13
##### Fixes :wrench:
* 修复上一个版本视频融合编辑无反应的问题
* 修复挖坑面保存后，偶尔打开失效的问题

### 1.4.13 - 2020-7-9
##### Additions :tada:
* 视频融合支持贴jpg/png图片、mp4视频、m3u8直播视频
* 自定义图元中imageUrl和videoUrl属性统一，imageUrl可以加载jpg/png/mp4/m3u8链接，videoUrl去除
* 自定义贴地矩形可以支持视频直播
##### Fixes :wrench:
* 修复自定义贴图矩形设置图片地址导致崩溃的问题

### 1.4.12 - 2020-7-7
##### Fixes :wrench:
* 修复自定义图元加载某些obj文件性能缓慢的问题
* 修复自定义图元obj模型重复加载的问题
* 非手机端自动调整分辨率，避免出现锯齿

### 1.4.10 - 2020-7-1
##### Additions :tada:
* 增加对BASIS纹理的支持
* 增加对google地形数据加载的支持
##### Fixes :wrench:
* 修复自定义图元读取obj文件时法向和纹理坐标的顺序反了的问题
* obj文件读取时考虑顶点颜色和四边形的情况

### 1.4.8 - 2020-6-20

##### Additions :tada:
* 增加视频模型示例
* 自定义图元增加videoUrl和objUrl属性，分别用来展示视频和obj模型

### 1.4.7 - 2020-6-18

##### Additions :tada:
* 增加VR功能和示例

##### Fixes :wrench:
* 修复插件加载错误
* 修复水面拖拽多边形无法创建水面的bug
* 天空盒调整为一个单独的功能

### 1.4.6 - 2020-6-18

##### Additions :tada:
* 增加天空盒功能和示例
* GeoPin增加定位功能
* 粒子、粒子烟火和粒子喷射增加拖拽功能
* pin图标增加填充颜色和边框颜色这两个属性
* 地表透明增加多边形拖拽功能

##### Fixes :wrench:
* 修复删除3dtitles时报错的bug
* 修复pin图标近远裁不能实时改变的bug
* 修改地表透明UI界面

### 1.4.2 - 2020-6-4

##### Additions :tada:
* 增加粒子、粒子烟火、粒子喷射功能
* 图层树增加编辑ref功能
* 地形增加地表透明功能
* 瓦片增加调试信息功能

##### Fixes :wrench:
* 修复自定义图元中点击应用渲染失败的bug
* 修复部分自定义标绘出不来的问题
* 改进小物体的漫游交互体验，避免缩放时突然小时，避免中键转动视角失效等问题
* 增加Cesium的地表透明效果

### 1.3.10 - 2020-5-26

##### Additions :tada:
* 增加对顶点纹理坐标偏移的扩展(XBSJ_vertex_texture_transform)

##### Fixes :wrench:
* 修复ODLines渲染性能下降的问题
* 修复实例模型数量为1时程序异常的问题
* 修复部分没有根矩阵的3dtiles数据不能显示的问题

### 1.3.8 - 2020-5-18 

##### Additions :tada:
* Earth增加了ionDefaultAccessToken属性，方便存储accessToken。
* 增加对GeoJSON/KML/Czml的支持
* CutSurface类增加terrainDiscard属性，开启后可以进行地形挖坑，但是目前只能挖一个地形的坑
* 增加雾效，可以调整颜色和强度，可以保存

##### Fixes :wrench:
* 修复查看加载代码看不到图元的问题
* 填充面的飞入功能改进
* 修复填充面较小时导致面片不显示的问题
* 修复后处理模式的雨雪特效的不能保存的问题
* 修复贴地图像(GroundImage)关闭循环播放时程序崩溃的问题
* 填充面和挖坑中增加默认纹理
* 修复挖坑的飞入功能

### 1.3.6 - 2020-4-19
##### Fixes :wrench:
* 键盘漫游改进

### 1.3.3 - 2020-4-3
##### Additions :tada:
* 增加了道路、挡土墙、填充面、新体积测量功能和示例
* 多边形增加了拉伸属性
* 增加了单体化功能

### 1.2.28 - 2020-2-25
##### Fixes :wrench:
* 避免GroundImage创建时设置show属性不起作用
* 避免GroundImage设置图像之前的闪跳

### 1.2.27 - 2020-2-25
##### Additions :tada:
* 地表透明模式下使用POI时，会出现POI被融合的问题，此处增加了Cesium.BillboardCollection.xbsjForceRSOpaqueDepthMask属性，设置为true即可。但是会导致位置拾取不准确。

### 1.2.26 - 2020-2-20

##### Fixes :wrench:
* 修复点云渲染性能慢的问题

### 1.2.25 - 2020-2-3

##### Additions :tada:
* 视频融合支持直接播放m3u8格式视频
* 增加winPos的api文档说明

### 1.2.24 - 2020-1-14

##### Additions :tada:
* 增加Lod模型图层，可以批量化生成Lod模型
* 增加Tileset自动测试功能
* 增加polyline创建，编辑提示信息
* 增加压平面创建，编辑提示信息
* 增加平移、旋转、位置拾取提示信息
* 视图菜单中新增瓦片测试功能
* 拖拽geojson时 限制只加载前100条
* 模型属性面板添加了tab切换，并新增了可见距离属性
* 添加clt格式的tileset
* 分析菜单中新增模型展开功能
* 分析菜单中水面面板新增拖拽功能
* 增加XE.Obj.Forest类型，可以自动加载树模型数据(vtxf)

##### Fixes :wrench:
* 拖拽geojson到地球时，限制只加载前100条
* 修改生成抛物线时，末尾点抬高的问题
* 图层管理右键菜单弹出位置适应当前窗口
* 修复feature属性窗口自动弹出的问题(vtxf)
* EarthSDK示例修复了热力图当前时间进度条不随持续时间不同而变化的bug
* 修复位置拾取过程中点击右键时报错的问题(vtxf)
* 不进行XbsjCzmObj类型的严格限定，让有onclick和onclickout函数的对象都可以进行拾取操作(vtxf)
* GroundImage增加不透明度属性(vtxf)
* 修复给无光照3dtiles数据设置科技感会崩溃的问题(vtxf)
* 修复水面引起的3dtiles反射贴图不能生效且发暗的问题(vtxf)
* 修复XbsjCzmObj的派生类不能定义defaultOptions的问题(vtxf)
* 折线和多边形的创建操作改进，右键取消上一个点，shift+右键结束操作(vtxf)

### 1.2.22 - 2019-12-23
##### Additions :tada:
* 新增热力图类XE.Obj.HeatMap
* 自定义图元增加拾取功能

##### Fixes :wrench:
* 修复pin的extText和point不受near和far属性控制的问题
* 修复不同图元拾取时指向同一个回调的问题
* 解决CzmObject的子Object的拾取问题
* ODLines的属性posititons变更为positions
* 修复指北针左键操作不了，只有中键和右键能用的问题
* 修复贴地面不停地更新时，不能隐藏
* Pin增加指示线条
* 修正跨域访问图像导致图像不能加载的问题，目前替换成Cesium加载图片的模式，按照Cesium的规则来加载图片

### 1.2.18 - 2019-12-6

##### Additions :tada:
* 自定义图元扩展中的管道增加repeat属性
* 自定义图元、自定义贴地矩形增加imageUrl属性

##### Fixes :wrench:
* 修复开启路径面板后低速运动时不能前进的问题
* 修复模型的相机绑定属性不起作用的问题
* 修复3dtiles拾取问题
* 修复环境贴图报错问题
* 模型增加环境贴图属性
* 修改了标绘菜单排版
* 自定义图元添加了scale属性
* 修复了标绘的属性面板弹出的面板不一致的bug
* 修复了视角管理器属性无法打开的bug
* 瓦片增加科技感按钮
* 修复管道enabled属性不起作用的问题

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


