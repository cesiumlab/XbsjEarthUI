<template>
  <!-- box -->
  <div class="xbsj-template">
    <div
      class="xbsj-list"
      ref="container"
      @mousedown="startMove($event)"
      @mousemove="onMoving($event)"
      @mouseup="endMove($event)"
    >
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.source}}</span>
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn onlinebutton"
            @click="terrainOnline=!terrainOnline"
            :class="{highlight:terrainOnline}"
          ></div>
          <span class="xbsj-item-name">{{lang.online}}</span>
        </div>
        <div class="xbsj-item-btnbox" v-show="labServiceUI">
          <div
            class="xbsj-item-btn localhostbutton"
            @click="terrainLab=!terrainLab"
            :class="{highlight:terrainLab}"
          ></div>
          <span class="xbsj-item-name">{{lang.localhost}}</span>
        </div>
        <div class="xbsj-item-btnbox" v-show="cloudServiceUI">
          <div
            class="xbsj-item-btn localhostbutton"
            @click="terrainCloud=!terrainCloud"
            :class="{highlight:terrainCloud}"
          ></div>
          <span class="xbsj-item-name">{{lang.cloudhost}}</span>
        </div>
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.tocolor}}</span>
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn elevationcolorbutton"
            :class="{highlight:shadeType=='ElevationRamp'}"
            @click="elevationRamp"
          ></div>
          <span class="xbsj-item-name">{{lang.elevationcolor}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'elevation'}"
          @click.stop="togglePopup('elevation',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn slopebutton"
            :class="{highlight:shadeType=='SlopeRamp'}"
            @click="slopeRamp"
          ></div>
          <span class="xbsj-item-name">{{lang.slope}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'slope'}"
          @click.stop="togglePopup('slope',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn slopeaspectbutton"
            :class="{highlight:shadeType=='AspectRamp'}"
            @click="aspectRamp"
          ></div>
          <span class="xbsj-item-name">{{lang.slopeaspect}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'aspect'}"
          @click.stop="togglePopup('aspect',$event)"
        ></span>

        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn contourbutton"
            :class="{highlight:contourEnable}"
            @click="contoure"
          ></div>
          <span class="xbsj-item-name">{{lang.contour}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'contour'}"
          @click.stop="togglePopup('contour',$event)"
        ></span>
      </div>

      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.effect}}</span>

        <div class="xbsj-item-btnbox ml20">
          <div
            ref="tailoringbutton"
            class="xbsj-item-btn tailoringbutton"
            @click="tailoringShow=!tailoringShow"
            :class="{highlight:tailoringShow}"
          ></div>
          <span class="xbsj-item-name">{{lang.tailoring}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'tailoring'}"
          @click.stop="togglePopup('tailoring',$event)"
        ></span>

        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn globalbutton"
            @click="globeShow=!globeShow"
            :class="{highlight:globeShow}"
          ></div>
          <span class="xbsj-item-name">{{lang.show}}</span>
        </div>

        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn globelightingbutton"
            @click="enableLighting=!enableLighting"
            :class="{highlight:enableLighting}"
          ></div>
          <span class="xbsj-item-name">{{lang.enableLighting}}</span>
        </div>

        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn depthdetectionbutton"
            @click="depthTest=!depthTest"
            :class="{highlight:depthTest}"
          ></div>
          <span class="xbsj-item-name">{{lang.depth}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn logarithmicbutton"
            @click="logDepth=!logDepth"
            :class="{highlight:logDepth}"
          ></div>
          <span class="xbsj-item-name">{{lang.logarithmic}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn undergroundbutton"
            @click="subSurfaceEnabled=!subSurfaceEnabled"
            :class="{highlight:subSurfaceEnabled}"
          ></div>
          <span class="xbsj-item-name">{{lang.subSurface}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn wireframebutton"
            @click="wireFrame=!wireFrame"
            :class="{highlight:wireFrame}"
          ></div>
          <span class="xbsj-item-name">{{lang.wireFrame}}</span>
        </div>
        <div class="xbsj-item-btnbox xbsjtransparent">
          <div class="XbsjSlider" :title="depthTest && '需要关闭地形深度检测，此功能才可使用！' || ''">
            <XbsjSlider
              :min="0"
              :max="1"
              :step="0.01"
              showTip="hover"
              v-model="surfaceOpacity"
              :disabled="depthTest"
            ></XbsjSlider>
          </div>
          <span class="xbsj-item-name">{{lang.transparent}}</span>
        </div>
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn globeTranslucencybutton"
            @click="globeTranslucencyShow=!globeTranslucencyShow"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
            :class="{highlight:globeTranslucencyShow || drag_over}"
          ></div>
          <span class="xbsj-item-name">{{lang.globeTranslucency}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'globeTranslucency'}"
          @click.stop="togglePopup('globeTranslucency',$event)"
        ></span>
      </div>
    </div>
    <Elevation ref="elevation" v-show="popup =='elevation'"></Elevation>
    <Aspect ref="aspect" v-show="popup =='aspect'"></Aspect>
    <Slope ref="slope" v-show="popup =='slope'"></Slope>
    <Contour ref="contour" v-show="popup =='contour'"></Contour>
    <Tailoring ref="tailoring" v-show="popup =='tailoring'"></Tailoring>
    <GlobeTranslucency ref="globeTranslucency" v-show="popup =='globeTranslucency'"></GlobeTranslucency>
  </div>
</template>

<script>
import languagejs from "./index_locale";

import Elevation from "./Elevation";
import Aspect from "./Aspect";
import Slope from "./Slope";
import Contour from "./Contour";
import Tailoring from "./Tailoring";
import GlobeTranslucency from "./GlobeTranslucency";

import { addOutterEventListener } from "../../../utils/xbsjUtil";

export default {
  props: ["labServiceUI", "cloudServiceUI"],
  components: {
    Elevation,
    Slope,
    Aspect,
    Contour,
    Tailoring,
    GlobeTranslucency
  },
  data() {
    return {
      showTip: "never",
      lang: {},
      terrainLab: false,
      terrainCloud: false,
      terrainOnline: false,
      shadeType: "",
      popup: "",
      contourEnable: false,
      depthTest: false,
      wireFrame: false,
      logDepth: true,
      subSurfaceEnabled: false,
      surfaceOpacity: 0.0,
      langs: languagejs,
      globeShow: true,
      tailoringShow: false,
      globeTranslucencyShow: false,
      enableLighting: false,
      drag_over: false
    };
  },
  created() {},
  mounted() {
    //给所有popup的el上添加外部事件
    Object.keys(this.$refs).forEach(key => {
      addOutterEventListener(this.$refs[key].$el, "mousedown", el => {
        let comp = this.getPopupComp();
        if (comp && comp.$el === el) {
          if (typeof comp.show == "function") {
            comp.show(false);
          }
          this.popup = "";
        }
      });
    });

    this.$parent.$on("hidePopup", () => {
      this.showPopup(false);
      this.popup = "";
    });

    this.$nextTick(() => {
      this.unbind = [];

      //绑定地形着色
      var c = XE.MVVM.watch(() => {
        var s = this.$root.$earth.terrainEffect.shading;
        if (!s) {
          this.shadeType = "";
        } else {
          this.shadeType = s.xbsjType;
        }
        //console.log(this.shadeType);
        this.contourEnable = this.$root.$earth.terrainEffect.contour.enabled;
      });
      this.unbind.push(c);

      this.unbind.push(
        XE.MVVM.bind(
          this,
          "depthTest",
          this.$root.$earth.terrainEffect,
          "depthTest"
        )
      );
      this.unbind.push(
        XE.MVVM.bind(
          this,
          "wireFrame",
          this.$root.$earth.terrainEffect,
          "wireFrame"
        )
      );
      this.unbind.push(
        XE.MVVM.bind(
          this,
          "logDepth",
          this.$root.$earth.terrainEffect,
          "logDepth"
        )
      );
      this.unbind.push(
        XE.MVVM.bind(
          this,
          "subSurfaceEnabled",
          this.$root.$earth.terrainEffect,
          "subSurfaceEnabled"
        )
      );
      this.unbind.push(
        XE.MVVM.bind(
          this,
          "surfaceOpacity",
          this.$root.$earth.terrainEffect,
          "surfaceOpacity"
        )
      );

      this.unbind.push(
        XE.MVVM.bind(this, "globeShow", this.$root.$earth.terrainEffect, "show")
      );

      this.unbind.push(
        XE.MVVM.bind(
          this,
          "tailoringShow",
          this.$root.$earth.terrainEffect.restrict,
          "enabled"
        )
      );

      this.unbind.push(
        XE.MVVM.bind(
          this,
          "globeTranslucencyShow",
          this.$root.$earth.terrainEffect.globeTranslucency,
          "enabled"
        )
      );

      this.unbind.push(
        XE.MVVM.bind(
          this,
          "enableLighting",
          this.$root.$earth.terrainEffect,
          "enableLighting"
        )
      );
    });

    let tailoringbutton = this.$refs.tailoringbutton;
    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    var that = this;
    function handleFileSelect(e) {
      // e.stopPropagation();
      e.preventDefault();
      let obj = e.dataTransfer.getData("obj");
      that.$root.$earth.terrainEffect.restrict.editing = true;

      let arr = [];
      arr = JSON.parse(obj).positions;
      for (var j = 0; j < arr.length; j++) {
        arr[j].pop();
      }
      arr = arr.toString().split(",");
      arr = arr.map(function(el) {
        return +el;
      });

      that.$root.$earth.terrainEffect.restrict.positions = arr;
      that.$root.$earth.terrainEffect.restrict.enabled = true;
      that.$root.$earth.terrainEffect.restrict.flyTo();
    }

    tailoringbutton.addEventListener("dragover", handleDragOver, false);
    tailoringbutton.addEventListener("drop", handleFileSelect, false);
  },
  methods: {
    contoure() {
      this.$root.$earth.terrainEffect.contour.enabled = !this.$root.$earth
        .terrainEffect.contour.enabled;
    },
    elevationRamp() {
      let te = this.$root.$earth.terrainEffect;
      if (te.shading && te.shading != te.elevation) {
        te.shading.enabled = false;
        te.elevation.enabled = true;
      } else {
        te.elevation.enabled = !te.elevation.enabled;
      }
    },
    slopeRamp() {
      let te = this.$root.$earth.terrainEffect;
      if (te.shading && te.shading != te.slope) {
        te.shading.enabled = false;
        te.slope.enabled = true;
      } else {
        te.slope.enabled = !te.slope.enabled;
      }
    },
    aspectRamp() {
      let te = this.$root.$earth.terrainEffect;
      if (te.shading && te.shading != te.aspect) {
        te.shading.enabled = false;
        te.aspect.enabled = true;
      } else {
        te.aspect.enabled = !te.aspect.enabled;
      }
    },
    getPopupComp() {
      if (this.$refs.hasOwnProperty(this.popup)) {
        return this.$refs[this.popup];
      } else {
        return undefined;
      }
    },
    showPopup(v) {
      let comp = this.getPopupComp();
      if (comp && typeof comp.show == "function") {
        comp.show(v);
      }
      return comp;
    },
    togglePopup(p, event) {
      //调用上一个组件的隐藏
      this.showPopup(false);

      this.popup = this.popup == p ? "" : p;

      //调用当前组件的显示
      let curComp = this.showPopup(true);
      if (!curComp) return;
      if (this.popup == "" || !event) return;
      try {
        //基于现在UI结构强行计算的
        let el = curComp.$el;
        el.style.left =
          event.target.offsetLeft +
          event.target.offsetParent.offsetLeft -
          40 +
          "px";
        el.style.top =
          event.target.offsetTop +
          event.target.offsetParent.offsetTop +
          44 +
          "px";
      } catch (ex) {
        console.log(ex);
      }
    },
    startMove(event) {
      //如果事件的目标不是本el 返回
      if (event.target.parentElement !== this.$refs.container) {
        this.moving = false;
        return;
      }
      this.moving = true;
    },
    onMoving(event) {
      //获取鼠标和为开始位置的插值，滚动滚动条
      if (!this.moving) return;

      var dom = this.$refs.container;
      var wleft = dom.scrollLeft - event.movementX;
      if (wleft >= 0 && wleft <= dom.scrollWidth - dom.clientWidth) {
        dom.scrollLeft = wleft;
      }
    },
    endMove(envent) {
      this.moving = false;
    },
    //拖拽移动上面
    dragOver(e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        czmObj.positions !== undefined &&
        czmObj.xbsjType === "Polygon"
      ) {
        e.dataTransfer.dropEffect = "copy";
        this.drag_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    dragLeave() {
      this.drag_over = false;
    },
    //拖拽放置
    drop(e) {
      this.drag_over = false;
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        czmObj.positions !== undefined &&
        czmObj.xbsjType === "Polygon"
      ) {
        var longitudeArr = [],
          latitudeArr = [];
        for (var i = 0, l = czmObj.positions.length; i < l; i += 2) {
          longitudeArr.push(czmObj.positions[i]);
        }
        for (var j = 1, l = czmObj.positions.length; j < l; j += 2) {
          latitudeArr.push(czmObj.positions[j]);
        }
        this.$refs.globeTranslucency.rectangleShow = true;
        var west = Math.min.apply(Math, longitudeArr),
          south = Math.min.apply(Math, latitudeArr),
          east = Math.max.apply(Math, longitudeArr),
          north = Math.max.apply(Math, latitudeArr);
        this.$refs.globeTranslucency.rectangleArr = [
          ((west * 180) / Math.PI).toFixed(7),
          ((south * 180) / Math.PI).toFixed(7),
          ((east * 180) / Math.PI).toFixed(7),
          ((north * 180) / Math.PI).toFixed(7)
        ];
      }
    }
  },
  beforeDestroy() {
    for (let i = 0; i < this.unbind.length; i++) {
      var ud = this.unbind[i];
      ud();
    }
    this.unbind = [];
  }
};
</script>

<style scoped>
.XbsjSlider {
  margin-top: 40px;
}
.xbsjtransparent {
  width: 100px !important;
}

.tailoringbutton {
  background: url(../../../../images/tailoring.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.tailoringbutton.highlight,
.tailoringbutton:hover {
  background: url(../../../../images/tailoring_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.globeTranslucencybutton {
  background: url(../../../../images/globeTranslucency.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globeTranslucencybutton.highlight,
.globeTranslucencybutton:hover {
  background: url(../../../../images/globeTranslucency_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.globalbutton {
  background: url(../../../../images/global.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globalbutton.highlight,
.globalbutton:hover {
  background: url(../../../../images/global_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.onlinebutton {
  background: url(../../../../images/online.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.onlinebutton.highlight,
.onlinebutton:hover {
  background: url(../../../../images/online_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.localhostbutton {
  background: url(../../../../images/localhost.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.localhostbutton.highlight,
.localhostbutton:hover {
  background: url(../../../../images/localhost_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-input-box {
  margin-top: 24px;
  width: 263px;
}
.xbsj-check-box {
  margin-top: 10px;
}
input[type="text"] {
  display: inline-block;
  background: rgba(71, 71, 71, 1);
  border: 2px solid rgba(138, 138, 138, 1);
  border-radius: 3px;
  padding: 3px 5px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(221, 221, 221, 1);
  width: 180px;
  height: 28px;
}
.xbsj-check-box input,
.xbsj-check-box label {
  cursor: pointer;
}
.xbsj-check-box label {
  margin-right: 10px;
}
input[type="checkbox"] {
  vertical-align: middle;
}
.xbsj-selection {
  float: right;
  margin-top: -19px;
}
.selectbutton {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(71, 71, 71, 1);
  border-radius: 3px;
  margin-top: 16px;
}
input[type="color"] {
  margin-left: 15px;
  margin-right: 18px;
  margin-top: 29px;
  width: 28px;
  height: 28px;
}
input[type="number"] {
  margin-top: 29px;
  width: 90px;
  height: 28px;
  padding-left: 10px;
}
.kuazhang {
  line-height: 83px;
  margin-left: 16px;
  margin-right: 10px;
  width: 50px;
}
.contourbutton {
  background: url(../../../../images/contour.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.contourbutton.highlight,
.contourbutton:hover {
  background: url(../../../../images/contour_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.depthdetectionbutton {
  background: url(../../../../images/depth-terrain.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.depthdetectionbutton.highlight,
.depthdetectionbutton:hover {
  background: url(../../../../images/depth-terrain_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.logarithmicbutton {
  background: url(../../../../images/logarithmic.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.logarithmicbutton.highlight,
.logarithmicbutton:hover {
  background: url(../../../../images/logarithmic_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.surfacebutton {
  background: url(../../../../images/surface.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.surfacebutton.highlight,
.surfacebutton:hover {
  background: url(../../../../images/surface_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.undergroundbutton {
  background: url(../../../../images/underground.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.undergroundbutton.highlight,
.undergroundbutton:hover {
  background: url(../../../../images/underground_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.wireframebutton {
  background: url(../../../../images/wireframe.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.wireframebutton.highlight,
.wireframebutton:hover {
  background: url(../../../../images/wireframe_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.elevationcolorbutton {
  background: url(../../../../images/elevationcolor.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.elevationcolorbutton.highlight,
.elevationcolorbutton:hover {
  background: url(../../../../images/elevationcolor_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.slopebutton {
  background: url(../../../../images/slope.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.slopebutton.highlight,
.slopebutton:hover {
  background: url(../../../../images/slope_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.slopeaspectbutton {
  background: url(../../../../images/slopeaspect.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.slopeaspectbutton.highlight,
.slopeaspectbutton:hover {
  background: url(../../../../images/slopeaspect_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.globelightingbutton {
  background: url(../../../../images/globeLighting.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globelightingbutton.highlight,
.globelightingbutton:hover {
  background: url(../../../../images/globeLighting_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.xbsj-check {
  cursor: pointer;
}
.xbsj-check input {
  display: inline-block;
  width: 12px;
  height: 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  background: url(../../../../images/check.png) no-repeat top center;
  background-size: 100% 100%;
  cursor: pointer;
  margin-top: -2px;
}
.xbsj-check input:checked {
  position: relative;
  background: url(../../../../images/check_on.png) no-repeat top center;
  background-size: 100% 100%;
}
.kuazhang {
  line-height: 92px;
  position: relative;
  bottom: 17px;
}
.kuazhangInput {
  width: 77px;
  height: 34px;
  position: relative;
  bottom: 18px;
}
.slide-div .xbsj-slide-label {
  position: relative;
  top: 22px;
  right: 166px;
}
.slide-div .xbsj-XbsjSlider {
  position: relative;
  top: 5px;
  right: 163px;
}
.slide-div .xbsj-rangespan {
  left: 52px;
  position: relative;
  bottom: 14px;
}
input[type="text"]:focus {
  border: 2px solid rgba(79, 179, 255, 1);
}
</style>

