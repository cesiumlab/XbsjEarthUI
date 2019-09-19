<template>
  <div style="width:100%;height:100%">
    <!-- 导航栏部分 -->
    <MainBarControl ref="mainBarControl"></MainBarControl>

    <div class="xbsjcesium" ref="xbsjcesium">
      <div ref="cesiumContainer" style="width: 100%; height: 100%"></div>
      <!-- 视口分屏 -->
      <ViewportLine></ViewportLine>
    </div>
    <StatusBarControl ref="statusBarControl"></StatusBarControl>
    <!-- <NavigatorControl ref="navigator"></NavigatorControl> -->

    <component
      v-for="(tool,index) in tools"
      :is="tool.component"
      :ref="tool.ref"
      :_toolIndex="index"
      :key="_getToolID(tool)"
      :getBind="tool.item"
      :nextczm="tool.nextczm"
    ></component>

    <ContextMenu ref="contextMenu"></ContextMenu>
    <!-- 只有一个 colorpicker -->
    <GlobalColorPicker ref="colorPicker"></GlobalColorPicker>

    <InformationBox
      v-for="(info,index) in infos"
      :_toolIndex="index"
      :info="info.info"
      :type="info.type"
      :key="info.key"
      :style="{top:(140+index*30)+'px'}"
    ></InformationBox>

    <!-- 只有一个 Modal 对话框 方便调用 -->
    <Modal :visible="modal" @cancel="modalCancel" @confirm="modalConfirm">{{confirmInfo}}</Modal>
  </div>
</template>

<script>
import MainBarControl from "./controls/MainBarControl";
import StatusBarControl from "./controls/StatusBarControl.vue";
import NavigatorControl from "./controls/NavigatorControl.vue";
import ViewportLine from "./controls/ViewportLine";

import SceneTreeTool from "./tools/SceneTreeTool";
import ImageryLab from "./tools/ImageryServices/ImageryLab.vue";
import ImageryOnline from "./tools/ImageryServices/ImageryOnline.vue";
import ImageryWMTS from "./tools/ImageryServices/ImageryWMTS.vue";

import ModelLab from "./tools/ModelServices/ModelLab.vue";
import ModelOnline from "./tools/ModelServices/ModelOnline.vue";
import TerrainLab from "./tools/TerrainServices/TerrainLab.vue";
import TerrainOnline from "./tools/TerrainServices/TerrainOnline.vue";
import CameraViewManager from "./tools/CameraViewManager";
import CutFillComputing from "./tools/CutFillComputing";
import FeatureProperty from "./tools/FeatureProperty";

import ContextMenu from "./common/ContextMenu";

import FlattenningTool from "./viztools/FlattenningTool";
import ClippingPlaneTool from "./viztools/ClippingPlaneTool";
import PinTool from "./viztools/PinTool";
import PinPictureTool from "./viztools/PinPictureTool";
import PinDivTool from "./viztools/PinDivTool";
import PathTool from "./viztools/PathTool";
import ModelTool from "./viztools/ModelTool";
import PolylineTool from "./viztools/PolylineTool";
import GeoCurveArrow from "./viztools/GeoCurveArrow";
import GeoDoubleArrow from "./viztools/GeoDoubleArrow";
import GeoSectorSearch from "./viztools/GeoSectorSearch";
import GeoPolylineArrow from "./viztools/GeoPolylineArrow";
import GeoTriFlag from "./viztools/GeoTriFlag";

import CamerVideoTool from "./viztools/CamerVideoTool";
import ViewshedTool from "./viztools/ViewshedTool";

import PropertyWindow from "./properties/PropertyWindow";
import CameraViewPrp from "./properties/CameraViewPrp";
import TilesetStyleEditor from "./properties/TilesetStyleEditor";

import GlobalColorPicker from "./common/GlobalColorPicker";
import InformationBox from "./utils/InformationBox";

import ModelTreeTool from "./tools/ModelTreeTool";

export default {
  components: {
    StatusBarControl,
    NavigatorControl,
    MainBarControl,
    SceneTreeTool,
    ContextMenu,
    ViewportLine,
    CameraViewManager,
    CutFillComputing,
    FeatureProperty,

    FlattenningTool,
    ClippingPlaneTool,
    PinTool,
    PinPictureTool,
    PinDivTool,
    PathTool,
    ModelTool,
    PolylineTool,
    GeoCurveArrow,
    GeoDoubleArrow,
    GeoSectorSearch,
    GeoPolylineArrow,
    GeoTriFlag,

    CamerVideoTool,
    ViewshedTool,

    ImageryLab,
    ImageryOnline,
    ImageryWMTS,
    ModelLab,
    ModelOnline,
    TerrainLab,
    TerrainOnline,
    PropertyWindow,
    CameraViewPrp,
    TilesetStyleEditor,
    GlobalColorPicker,
    InformationBox,
    ModelTreeTool
  },
  data: function() {
    return {
      modal: false,
      confirmInfo: "",
      registerComponents: {
        // czmObject的类型和组件名称的关联表，如果为绑定，则使用TreeCommon vtxf 190629
        FlattenedPolygonCollection: "FlattenningTool",
        CameraVideo: "CamerVideoTool",
        Viewshed: "ViewshedTool",
        ClippingPlane: "ClippingPlaneTool",
        PinTool: "PinTool",
        PinDivTool: "PinDivTool",
        PinPictureTool: "PinPictureTool",
        Path: "PathTool",
        Model: "ModelTool",
        Polyline: "PolylineTool",
        GeoCurveArrow: "GeoCurveArrow",
        GeoSectorSearch: "GeoSectorSearch",
        GeoPolylineArrow: "GeoPolylineArrow",
        GeoTriFlag: "GeoTriFlag",
        GeoDoubleArrow: "GeoDoubleArrow",
        ["CameraView.View"]: "CameraViewPrp"
      },
      tools: [
        {
          component: "SceneTreeTool",
          ref: "sceneTreeTool"
        },
        {
          component: "ImageryLab",
          ref: "imageryLab"
        },
        {
          component: "ImageryOnline",
          ref: "imageryOnline"
        },
        {
          component: "ImageryWMTS",
          ref: "imageryWMTS"
        },
        {
          component: "ModelLab",
          ref: "modelLab"
        },
        {
          component: "ModelOnline",
          ref: "modelOnline"
        },
        {
          component: "TerrainLab",
          ref: "terrainLab"
        },
        {
          component: "TerrainOnline",
          ref: "terrainOnline"
        },
        {
          component: "CameraViewManager",
          ref: "cameraViewManager"
        },
        {
          component: "CutFillComputing",
          ref: "cutFillComputing"
        },
        {
          component: "FeatureProperty",
          ref: "featureProperty"
        },
        {
          component: "ModelTreeTool",
          ref: "modelTreeTool"
        }
      ],
      infos: []
    };
  },
  mounted() {},
  computed: {
    type() {
      return this.viewporttype;
    }
  },
  methods: {
    _getToolID(tool) {
      if (!tool.guid) {
        tool.guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function(c) {
            var r = (Math.random() * 16) | 0;
            var v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }
      return tool.guid;
    },
    confirm(info, ok, cancel) {
      this.confirmInfo = info;
      this.modal = true;
      this._ok = ok;
      this._cancel = cancel;
    },
    modalCancel() {
      this.modal = false;
      if (typeof this._cancel == "function") {
        this._ok();
      }
    },
    modalConfirm() {
      this.modal = false;
      if (typeof this._ok == "function") {
        this._ok();
      }
    },

    //显示对象的属性窗口
    showPropertyWindow(czmObject, options) {
      //一个对象可以弹出若干种不同类型的属性窗口,判定是哪种component

      //用于判断是否弹出属性面板--mrq
      // try {
      //   if (!((options && options.jsonSchema) || czmObject._jsonSchema)) {
      //     return;
      //   }
      // } catch (error) {
      //   return
      // }

      //默认是统一类型的属性窗口
      var component;
      console.log(czmObject.ctrtype);
      //如果有外部配置
      if (
        options &&
        (typeof options.component == "string" ||
          typeof options.component == "object")
      ) {
        component = options.component;
      }

      //如果有默认映射
      else if (czmObject.xbsjType) {
        if (czmObject.ctrtype) {
            var c = this.registerComponents[czmObject.ctrtype];
          if (c) {
            component = c;
          }
        } else {
          var c = this.registerComponents[czmObject.xbsjType];
          if (c) {
            component = c;
          }
        }
      }

      //如果没有comp，那么判断是否要弹出默认属性面板
      if (!component) {
        try {
          if (
            (options && options.jsonSchema) ||
            (czmObject && czmObject._jsonSchema)
          ) {
            component = "PropertyWindow";
          } else {
            console.log("no configed component");
            return;
          }
        } catch (ex) {
          console.log("no configed component" + ex);
          return;
        }
      }
      //判定是否有属性窗口
      const index = this.tools.findIndex(e => {
        //类型不一致，直接返回
        if (e.component != component) return false;
        //绑定的对象一致的
        return e.item && e.item() === czmObject;
      });
      //，如果有放到最前
      if (index >= 0) {
        this._topWindow(index);
        return;
      }

      //新建窗口
      this.tools.push({
        component: component,
        ref: czmObject.guid,
        guid: czmObject.guid,
        item: () => {
          return czmObject;
        },
        //mrq添加
        nextczm: options && options.jsonSchema
      });
    },
    _topWindow(index) {
      if (index < 0 && index == this.tools.length - 1) return;

      const tool = this.tools[index];
      this.tools.splice(index, 1);
      this.tools.push(tool);
    },
    topWindow(window) {
      const index = window.$parent.$attrs._toolIndex;
      this._topWindow(index);
    },
    destroyTool(tool) {
      const index = tool.$attrs._toolIndex;
      if (index !== -1) {
        //const tool = this.tools[index];
        this.tools.splice(index, 1);
      }
    },

    promptInfo(info, type) {
      var _info = {
        info,
        type,
        key: Cesium.createGuid()
      };
      this.infos.push(_info);
      //开始计时，5s之后移除这个info
      setTimeout(() => {
        const index = this.infos.findIndex(i => {
          return i.key === _info.key;
        });
        if (index >= 0) {
          this.infos.splice(index, 1);
        }
      }, 5000);
    }
  }
};
</script>

<style>
.xbsjcesium {
  width: 100%;
  height: calc(100% - 137px);
  position: relative;
}
</style>
