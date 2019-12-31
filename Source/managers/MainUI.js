import MainUIComp from "../components/MainUIComp.vue";
import Vue from "vue";
import Modal from "../components/common/Modal";
import Window from "../components/common/Window";
import XbsjColorButton from "../components/common/ColorButton";
import XbsjCheckBox from "../components/common/CheckBox";
import XbsjSelect from "../components/common/Select";
import XbsjInput from "../components/common/Input";
import XbsjSwitch from "../components/common/Switch";
import XbsjSlider from "../components/common/Slider";
import XbsjInputNumber from "../components/common/Slider/input-number";
import XbsjIcon from "../components/common/Icon";
import XbsjRampSelect from "../components/common/RampSelect";
import XbsjLngLatHeight from "../components/common/LngLatHeight";
import XbsjHeadingPitchRoll from "../components/common/HeadingPitchRoll";
import XbsjMeterInput from "../components/common/MeterInput";
import XbsjCaptureThumbnail from "../components/common/CaptureThumbnail";
import XbsjVirtualTree from "../components/common/VirtualTree";
import XbsjLoading from "../components/common/Loading";
import XbsjColorButtonArray from "../components/common/ColorButtonArray";
import "../css/xbsjicon.css";
import "../css/common.css";
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
// Vue.prototype.$EventBus = new Vue();
Vue.component("Modal", Modal); // 全局注册组件
Vue.component("Window", Window); // 全局注册组件
Vue.component("XbsjColorButton", XbsjColorButton); // 全局注册组件
Vue.component("XbsjCheckBox", XbsjCheckBox); // 全局注册组件
Vue.component("XbsjSelect", XbsjSelect); // 全局注册组件
Vue.component("XbsjInput", XbsjInput); // 全局注册组件
Vue.component("XbsjSwitch", XbsjSwitch); // 全局注册组件
Vue.component("XbsjSlider", XbsjSlider); // 全局注册组件
Vue.component("XbsjInputNumber", XbsjInputNumber); // 全局注册组件
Vue.component("XbsjIcon", XbsjIcon); // 全局注册组件y 
Vue.component("XbsjRampSelect", XbsjRampSelect); // 全局注册组件y
Vue.component('XbsjLngLatHeight', XbsjLngLatHeight);
Vue.component('XbsjHeadingPitchRoll', XbsjHeadingPitchRoll);
Vue.component('XbsjMeterInput', XbsjMeterInput);
Vue.component('XbsjCaptureThumbnail', XbsjCaptureThumbnail);
Vue.component('XbsjVirtualTree', XbsjVirtualTree);
Vue.component('XbsjLoading', XbsjLoading);
Vue.component('XbsjColorButtonArray', XbsjColorButtonArray);
//import iView from "iview"; // 以后要删除
// import "iview/dist/styles/iview.css";

import StatusBar from "./controls/StatusBar";
import SceneTree from "./tools/SceneTree";
import ContextMenu from "./ContextMenu";
import MainBar from "./controls/MainBar";

import ImageryLab from "./tools/ImageryLab";
import ImageryCloud from "./tools/ImageryCloud";
import ImageryOnline from "./tools/ImageryOnline";
import ImageryWMTS from "./tools/ImageryWMTS";
import LabServer from "./LabServer";
import ModelLab from "./tools/ModelLab";
import ModelCloud from "./tools/ModelCloud";
import ModelOnline from "./tools/ModelOnline";
import TerrainLab from "./tools/TerrainLab";
import TerrainCloud from "./tools/TerrainCloud";
import TerrainOnline from "./tools/TerrainOnline";
import CameraViewManager from "./tools/CameraViewManager";
import CutFillComputing from "./tools/CutFillComputing";
import ColorPicker from "./ColorPicker"
import FeatureProperty from "./tools/FeatureProperty"
import LabScene from "./LabScene"

import ModelTree from "./tools/ModelTree";
import EntityMore from "./tools/EntityMore";
import Symbol from "./tools/Symbol"
import TilesTest from "./tools/TilesTest"
/**
 * EarthUI根管理器
 * @class
 */
class MainUI {
  constructor(container) {
    //super();
    // container
    if (typeof container === "string") {
      container = document.getElementById(container);
    }

    this._container = container;

    // cesiumContainer
    const cesiumContainer = document.createElement("div");
    cesiumContainer.style.cssText = "width: 100%; height: 100%;";

    var earth = new XE.Earth(cesiumContainer);
    earth.camera.navigator.showCompass = true; // 显示指北针
    earth.camera.navigator.distanceLegendStyle.bottom = 40; // 比例尺位置调整
    earth.camera.navigator.showDistanceLegend = true; // 显示比例尺
    this._earth = earth;

    // mainUI
    const mainUIDiv = document.createElement("div");
    mainUIDiv.innerHTML = `
            <main-u-i-comp ref='mainUI'></main-u-i-comp>
        `;
    // this._ui.style.cssText = `
    //     position: absolute; left: 0; bottom: 0; width: 100%; height: 26px; background: rgba(0, 0, 0, 0.5); color: #FFF;
    // `;
    mainUIDiv.style.cssText = `
            position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; color: #FFF;overflow: hidden;
        `;

    this._mainUI = mainUIDiv;

    this._container.appendChild(mainUIDiv);
    const mainUI = this;

    //labserver提前构造
    var labServer = new LabServer(this);


    //全局mixin
    Vue.mixin({
      data: function () {
        return {
          lang: {}
        }
      },
      created: function () {
        this.switchLanguage();
        this.$root.$on('language.changed', lang => {
          this.switchLanguage();
        });
      },
      methods: {
        switchLanguage: function () {
          var lang = this.$root.language;
          if (this.langs && this.langs) {
            this.lang = this.langs[lang];
          }
        }
      }
    });


    this._vm = new Vue({
      el: mainUIDiv,
      components: {
        MainUIComp
      },
      data: {
        language: 'zh'
      },
      created() {
        this.$earth = earth;
        this.$earthUI = mainUI;
        this.$labServer = labServer;
      },
      mounted() {

      },
      watch: {
        language: function (lang) {
          this.$emit('language.changed', lang);
        }
      }
    });

    this._mainUI = this._vm.$el;

    // this._vm.$earthUI = this;
    this._comp = this._vm.$refs.mainUI;
    const cesiumContainerVue = this._comp.$refs.cesiumContainer;
    cesiumContainerVue.appendChild(cesiumContainer);

    //控件初始化
    this._statusBar = new StatusBar(this);
    this._mainbar = new MainBar(this);


    /**
      * 控件管理器
      * @class
      * @name ControlsCollection
      */
    /**
    * 控件集
    * @readonly
    * @type {ControlsCollection} 
    * @instance
    * @memberof MainUI
    * @name controls
    */
    Object.defineProperty(this, "controls", {
      get: () => {
        return {
          /**
          * 状态栏
          * @readonly
          * @type {StatusBar} 
          * @instance
          * @memberof ControlsCollection
          */
          get statusBar() {
            return mainUI._statusBar;
          },
          // get navigator() {
          //     return mainUI._navigator;
          // },
          /**
          * 主工具栏
          * @readonly
          * @type {MainBar} 
          * @instance
          * @memberof ControlsCollection
          */
          get mainBar() {
            return mainUI._mainbar;
          }
        };
      }
    });

    //工具初始化
    this._sceneTree = new SceneTree(this);

    //模型结构
    this._modelTree = new ModelTree(this);
    this._entitymore = new EntityMore(this);
    this._symbol = new Symbol(this);
    //其他工具
    this._imageryLab = new ImageryLab(this);
    this._imageryCloud = new ImageryCloud(this);
    this._imageryOnline = new ImageryOnline(this);
    this._imageryWMTS = new ImageryWMTS(this);
    //其他工具
    this._modelLab = new ModelLab(this);
    this._modelCloud = new ModelCloud(this);
    this._modelOnline = new ModelOnline(this);

    //其他工具
    this._terrainLab = new TerrainLab(this);
    this._terrainCloud = new TerrainCloud(this);
    this._terrainOnline = new TerrainOnline(this);

    this._cameraViewManager = new CameraViewManager(this);
    this._cutFillComputing = new CutFillComputing(this);

    this._featureProperty = new FeatureProperty(this);
    this._tilesTest = new TilesTest(this);
    /**
    * 工具管理器
    * @class
    * @name ToolsCollection
    */
    /**
    * 工具集
    * @readonly
    * @type {ToolsCollection} 
    * @instance
    * @memberof MainUI
    * @name tools
    */
    Object.defineProperty(this, "tools", {
      get: () => {
        return {
          /**
          * 图层管理器
          * @readonly
          * @type {SceneTree} 
          * @instance
          * @memberof ToolsCollection
          */
          get sceneTree() {
            return mainUI._sceneTree;
          },
          /**
          * 来自本地lab服务器的影像数据源选择器
          * @readonly
          * @type {ImageryLab} 
          * @instance
          * @memberof ToolsCollection
          */
          get imageryLab() {
            return mainUI._imageryLab;
          },

          /**
          * 来自云平台的影像数据源选择器
          * @readonly
          * @type {ImageryLabCloud} 
          * @instance
          * @memberof ToolsCollection
          */
          get imageryLabCloud() {
            return mainUI._imageryCloud;
          },

          /**
          * 来自云平台的瓦片数据源选择器
          * @readonly
          * @type {ModelCloud} 
          * @instance
          * @memberof ToolsCollection
          */
          get modelCloud() {
            return mainUI._modelCloud;
          },

          /**
           * 来自云平台的地形数据源选择器
           * @readonly
           * @type {terrainCloud} 
           * @instance
           * @memberof ToolsCollection
           */
          get terrainCloud() {
            return mainUI._terrainCloud;
          },

          /**
          * 在线的影像数据源选择器
          * @readonly
          * @type {ImageryOnline} 
          * @instance
          * @memberof ToolsCollection
          */
          get imageryOnline() {
            return mainUI._imageryOnline;
          },
          /**
          * WMTS影像数据源选择器
          * @readonly
          * @type {ImageryWMTS} 
          * @instance
          * @memberof ToolsCollection
          */
          get imageryWMTS() {
            return mainUI._imageryWMTS;
          },
          /**
          * 来自本地Lab服务器的瓦片数据源选择器
          * @readonly
          * @type {ModelLab} 
          * @instance
          * @memberof ToolsCollection
          */
          get modelLab() {
            return mainUI._modelLab;
          },
          /**
          * 来自在线的瓦片数据源选择器
          * @readonly
          * @type {ModelOnline} 
          * @instance
          * @memberof ToolsCollection
          */
          get modelOnline() {
            return mainUI._modelOnline;
          },
          /**
          * 来自本地Lab服务的地形数据源选择器
          * @readonly
          * @type {TerrainLab} 
          * @instance
          * @memberof ToolsCollection
          */
          get terrainLab() {
            return mainUI._terrainLab;
          },
          /**
          * 来自在线的地形数据源选择器
          * @readonly
          * @type {TerrainOnline} 
          * @instance
          * @memberof ToolsCollection
          */
          get terrainOnline() {
            return mainUI._terrainOnline;
          },
          /**
          * 视角管理器
          * @readonly
          * @type {CameraViewManager} 
          * @instance
          * @memberof ToolsCollection
          */
          get cameraViewManager() {
            return mainUI._cameraViewManager;
          },
          /**
          * 挖填方分析工具
          * @readonly
          * @type {CutFillComputing} 
          * @instance
          * @memberof ToolsCollection
          */
          get cutFillComputing() {
            return mainUI._cutFillComputing;
          },
          /**
          * 属性显示器
          * @readonly
          * @type {FeatureProperty} 
          * @instance
          * @memberof ToolsCollection
          */
          get featureProperty() {
            return mainUI._featureProperty;
          },
          /**
          * 模型结构管理树
          * @readonly
          * @type {ModelTree} 
          * @instance
          * @memberof ToolsCollection
          */
          get modelTree() {
            return mainUI._modelTree;
          },
          /**
          * 标绘更多结构管理树
          * @readonly
          * @type {EntityMore} 
          * @instance
          * @memberof ToolsCollection
          */
          get entitymore() {
            return mainUI._entitymore;
          },

          /**
          * 符号标绘
          * @readonly
          * @type {Symbol} 
          * @instance
          * @memberof ToolsCollection
          */
          get symbol() {
            return mainUI._symbol;
          }
        };
      }
    });

    /**
    * 颜色选择器
    * @readonly
    * @type {ColorPicker} 
    * @instance
    * @memberof MainUI
    * @name colorPicker
    */
    this._colorPicker = new ColorPicker(this);
    Object.defineProperty(this, "colorPicker", {
      get: () => {
        return this._colorPicker;
      }
    });

    /**
    * 右键菜单
    * @readonly
    * @type {ContextMenu} 
    * @instance
    * @memberof MainUI
    * @name contextMenu
    */

    //弹出菜单
    this._contextMenu = new ContextMenu(this);
    Object.defineProperty(this, "contextMenu", {
      get: () => {
        return this._contextMenu;
      }
    });
    /**
    * 当前窗口大小 返回一个对象包含width和height 分别指定当前UI的宽高
    * @readonly
    * @type {Object} 
    * @instance
    * @memberof MainUI
    * @name size
    */
    Object.defineProperty(this, "size", {
      get: () => {
        return {
          width: this._vm.$el.offsetWidth,
          height: this._vm.$el.offsetHeight
        };
      }
    });

    // 监测是否有对象销毁，如果有销毁，对应的属性窗口也需要跟着销毁 vtxf 190624
    this._czmObjectOpsEventDisposer = this._earth.czmObjectOpsEvent.addEventListener(
      ({ type, xbsjObj }) => {
        if (type === "destroy") {
          const index = this._vm.$refs.mainUI.tools.findIndex(
            e => e.item && e.item() === xbsjObj
          );
          if (index >= 0) this._vm.$refs.mainUI.tools.splice(index, 1);
        }
      }
    );


    this._labServer = labServer;
    /**
    * Lab服务管理
    * @readonly
    * @type {LabServer} 
    * @instance
    * @memberof MainUI
    * @name labServer
    */
    Object.defineProperty(this, "labServer", {
      get: () => {
        return this._labServer;
      }
    });


    //当前场景管理
    this._labScene = new LabScene(this);
    /**
    * 场景加载
    * @readonly
    * @type {LabScene} 
    * @instance
    * @memberof MainUI
    * @name labScene
    */
    Object.defineProperty(this,
      "labScene",
      {
        get: () => {
          return this._labScene;
        }
      });


    //todo  当earthUI以iframe嵌入的时候，按下esc无法退出 第一人称漫游，这里手动响应下esc
    document.addEventListener('keyup', (event) => {
      //如果按了esc 那么退出第一人称漫游
      if (event.keyCode === 27) {
        earth.camera.immersion.ghostMode = false;
        console.log('escsec iframe');
      }
    });
  }

  get earth() {
    return this._earth;
  }

  /**
  * 弹出模态对话框确认
  * @param {String} info 需要显示的文本信息
  * @param {Function} ok 点击确定按钮后的回调
  * @param {Function} cancel 点击取消按钮后的回调
  */
  confirm(info, ok, cancel) {
    this._vm.$refs.mainUI.confirm(info, ok, cancel);
  }

  /**
  * 弹出对象的属性窗口
  * @param {Object} czmObject 需要显示属性的对象
  * @param {Object} options 其他参数，详细请见示例 
  */
  showPropertyWindow(czmObject, options) {
    this._vm.$refs.mainUI.showPropertyWindow(czmObject, options);
  }

  /**
  * 获取拖拽对象
  * @param {Object} dataTransfer 被拖拽的对象
  */
  getCzmObjectFromDrag(dataTransfer) {
    return this._vm.$refs.mainUI.getCzmObjectFromDrag(dataTransfer);
  }

  /**
  * 获取拖拽对象位置
  * @param {Object} dragczmObj 被拖拽的对象
  * @param {Object} czmObj 被编辑的对象
  */
  getCzmObjectPositionFromDrag(dragczmObj, czmObj) {
    this._vm.$refs.mainUI.getCzmObjectPositionFromDrag(dragczmObj, czmObj);
  }


  destroy() {
    this._czmObjectOpsEventDisposer =
      this._czmObjectOpsEventDisposer && this._czmObjectOpsEventDisposer();
    this._vm.$destroy();
    this._container.removeChild(this._mainUI);
    this._earth && this._earth.destroy();
    this._earth = undefined;
  }

  /**
  * 保存当前三维窗口截图
  * @param {Number} width 截图宽度
  * @param {Number} height 截图高度
  * @param {String} filename 需要保存的文件名
  */
  saveScreenToFile(width, height, filename) {
    this._earth
      .capture(width, height)
      .then(img => {
        img = img.replace("image/png", "image/octet-stream");
        var link = document.createElement("a");
        link.href = img;
        link.download = filename;
        link.click();
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  /**
* 保存当前场景json
* @param {String} content 需要保存的内容
* @param {String} filename 需要保存的文件名
*/
  saveContentToFile(content, filename) {
    var link = document.createElement("a");
    var blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  /**
  *  UI的语言  语言支持两种：  'en','zh' 分别表示 英文 和 中文简体
  * @instance
  * @type {String} 
  */
  get language() {
    return this._vm.language;
  }
  set language(lang) {
    if (lang == "zh" || lang == "en") {
      {
        this._vm.language = lang;
        //this._vm.$refs.mainUI.setLanguage(lang);
      }
    }
  }


  /**
   * 显示提示信息
   * @param {String} info 需要提示的内容
   * @param {String} type 提示类型，分三种  'info','warning','error'
   */
  promptInfo(info, type) {
    this._vm.$refs.mainUI.promptInfo(info, type);
  }

  /**
   * 添加对象到场景树
   * @param {Object} czmObject 对象
   */
  addSceneObject(czmObject) {
    if (czmObject.czmObject && (typeof czmObject.czmObject._callback === 'function')) {
      czmObject.czmObject._callback();
    }
    this._earth.sceneTree.addSceneObject(czmObject);
  }

  /**
   * 打开外部地址
   * @param {String} url 地址链接 
   */
  openURL(url) {
    if (typeof this._openURLCB == 'function') {
      this._openURLCB(url);
    }
    else {
      window.open(url, '_blank');
    }
  }


  /**
 *  打开URL回调
 * @instance
 * @type {Function} 
 */
  get openURLCB() {
    return this._openURLCB;
  }
  set openURLCB(cb) {
    this._openURLCB = cb;
  }
}

export default MainUI;
