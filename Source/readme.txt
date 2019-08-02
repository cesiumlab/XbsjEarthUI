注意代码目录
managers  
  earthUI的接口类定义

components
  earthUI的VUE实现

   common 
      通用性组件库，和三维地球没一点关系，我们可以在其他项目内复用的
      比如模态框 Modal，可移动窗口Window 以及滑块Slider 等UI组件

   controls
      earthUI上固定位置不可移动的所有控件
      比如 主工具栏，屏幕分割线，导航面板，状态栏，时间控制线等

    properties
      earthUI上针对对象定制的属性面板
         PropertyWindow
          为一个通用的属性面板，支持显示 和 修改任何通过jsonScheme定义的对象属性

    tools
       earthUI上工具面板
        比如图层管理工具
        比如包含影像、地形、瓦片数据源选择面板
     
    viztools
        earthUI上的需要和三维地图直接鼠标交互的可视化工具面板
          比如视阈分析，压平分析，裁剪面等等

   MainUIComp.vue 为主窗口的vue组件，内部引用其他所有UI元素

通用目录名开始第一个字母为小写，比如common，tools
组件目录名开始第一个字母为大写，比如Checkbox，组件目录下默认的组件实现是 index.vue
组件vue开始第一个字母为大写，如ColorPicker.vue
 

