<template>
  <Window
    :width="480"
    :minWidth="480"
    :height="494"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <!-- 名称 -->
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="polyline.name" />
      </div>

      <!-- 创建、编辑按钮 -->
      <!-- <div class="attitudeEdit">
        <label class="xbsj-label">{{lang.eidtbtn}}</label>
        <div class="buttonGroup">
          <div style="margin-left: 0px;">
            <button
              class="attitudeEditCameraButton"
              @click="polyline.creating =!polyline.creating"
              :class="polyline.creating?'btncoloron':''"
            >{{lang.creating}}</button>
          </div>
          <div>
            <button
              class="attitudeEditCameraButton"
              @click="polyline.editing =!polyline.editing"
              :class="polyline.editing?'btncoloron':''"
            >{{lang.editing}}</button>
          </div>
        </div>
      </div>-->

      <div class="flatten-flex">
        <!-- 编辑按钮 -->
        <div class="buttonGroup">
          <label class="xbsj-label"></label>
          <button
            class="attitudeEditCameraButton"
            @click="polyline.creating =!polyline.creating"
            :class="polyline.creating?'btncoloron':''"
          >{{lang.creating}}</button>
          <button
            class="attitudeEditCameraButton"
            @click="polyline.editing =!polyline.editing"
            :class="polyline.editing?'btncoloron':''"
          >{{lang.editing}}</button>
        </div>
        <!-- 拖拽 -->
        <div
          @dragover="dragOver"
          @drop="drop"
          @dragleave="dragLeave"
          class="dragButton"
          :class="{highlight:drag_over}"
          :title="lang.drag"
        >{{lang.dragcontent}}</div>
      </div>

      <div class="flatten">
        <!-- 首尾相连 -->
        <div class="flatten" style="display: inline-block;">
          <label>{{lang.loop}}</label>
          <XbsjSwitch v-model="polyline.loop"></XbsjSwitch>
        </div>
        <!-- 深度检测 -->
        <div class="flatten" style="display: inline-block;">
          <label>{{lang.depthTest}}</label>
          <XbsjSwitch v-model="polyline.depthTest"></XbsjSwitch>
        </div>
      </div>

      <!-- 显示辅助线框
      <div class="flatten">
        <label>{{lang.showHelper}}</label>
        <XbsjSwitch v-model="polyline.showHelper"></XbsjSwitch>
      </div>-->

      <!-- 宽度 -->
      <div class="flatten" style="margin-top:20px;">
        <label>{{lang.width}}</label>
        <div class="field">
          <XbsjSlider :min="1" :max="100" :step="1" showTip="always" v-model="polyline.width"></XbsjSlider>
        </div>
      </div>

      <!-- 插值方式 -->
      <div class="flatten" style="display:flex;">
        <div style="position: relative;">
          <label>{{lang.polylinearctype}}</label>
          <input
            type="text"
            v-model="polyline.arcType"
            @click="selectinput"
            readonly
            style="cursor: pointer;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showPolylineSelect">
            <div @click="optionssure(c)" v-for="(c,index) in arcTypeObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 材质 -->
      <div class="flatten" style="display:flex;">
        <div style="position: relative;">
          <label>{{lang.materialbtn}}</label>
          <input
            type="text"
            v-model="materialName"
            @click="selectinputMaterial"
            readonly
            style="cursor: pointer;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showMaterialSelect">
            <div @click="optionssureMaterial(c)" v-for="(c,index) in materialTypeObj" :key="index">
              <span>{{c.name}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 材质 -->
      <div class="flatten" v-show="colorMaterialBox">
        <label>{{lang.color}}</label>
        <XbsjColorButton v-model="colorUI" ref="polylineColor"></XbsjColorButton>
      </div>
      <div class="flatten" v-show="dashMaterialBox">
        <label>{{lang.dashcolor}}</label>
        <XbsjColorButton v-model="dashColorUI" ref="dashColor"></XbsjColorButton>
        <label>{{lang.gapColor}}</label>
        <XbsjColorButton v-model="gapColorUI" ref="gapColor"></XbsjColorButton>
        <div style="margin-top:16px; margin-bottom:10px;">
          <label>{{lang.dashLength}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="200" :step="1" showTip="always" v-model="dashLength"></XbsjSlider>
          </div>
        </div>
        <div style="margin-top:16px; margin-bottom:10px;">
          <label>{{lang.dashPattern}}</label>
          <div class="dottedstyle">
            <div
              @click="changebtn(15)"
              class="Dottedline-default"
              :class="dashPatternarr[15]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(14)"
              class="Dottedline-default"
              :class="dashPatternarr[14]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(13)"
              class="Dottedline-default"
              :class="dashPatternarr[13]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(12)"
              class="Dottedline-default"
              :class="dashPatternarr[12]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(11)"
              class="Dottedline-default"
              :class="dashPatternarr[11]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(10)"
              class="Dottedline-default"
              :class="dashPatternarr[10]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(9)"
              class="Dottedline-default"
              :class="dashPatternarr[9]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(8)"
              class="Dottedline-default"
              :class="dashPatternarr[8]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(7)"
              class="Dottedline-default"
              :class="dashPatternarr[7]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(6)"
              class="Dottedline-default"
              :class="dashPatternarr[6]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(5)"
              class="Dottedline-default"
              :class="dashPatternarr[5]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(4)"
              class="Dottedline-default"
              :class="dashPatternarr[4]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(3)"
              class="Dottedline-default"
              :class="dashPatternarr[3]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(2)"
              class="Dottedline-default"
              :class="dashPatternarr[2]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(1)"
              class="Dottedline-default"
              :class="dashPatternarr[1]===1?'Dottedline-active':''"
            ></div>
            <div
              @click="changebtn(0)"
              class="Dottedline-default"
              :class="dashPatternarr[0]===1?'Dottedline-active':''"
            ></div>
          </div>

          <!-- <div class="field">
            <XbsjSlider :min="2" :max="255" :step="1" showTip="always" v-model="dashPattern"></XbsjSlider>
          </div>-->
          <!-- <input
            type="text"
            v-model="dashPattern"
            @click="selectinputPattern"
            readonly
            style="cursor: pointer; width:152px;"
          />
          <button class="selectButton2"></button>
          <div class="cutselectbox2" v-show="showDashSelect">
            <div @click="optionssurePattern(c)" v-for="(c,index) in dashPatternObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>-->
        </div>
      </div>
      <div class="flatten" v-show="arrowMaterialBox">
        <label>{{lang.arrowcolor}}</label>
        <XbsjColorButton v-model="arrowColorUI" ref="arrowColor"></XbsjColorButton>
      </div>
      <div class="flatten" v-show="oDLineMaterialBox">
        <label>{{lang.odLinecolor}}</label>
        <XbsjColorButton v-model="oDLineColorUI" ref="oDLineColor"></XbsjColorButton>
        <div style="margin-top:16px; margin-bottom:10px;">
          <label>{{lang.totoalFrameCount}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="200" :step="1" showTip="always" v-model="totoalFrameCount"></XbsjSlider>
          </div>帧
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";
import { fips } from "crypto";
import Vue from "vue";
export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      showPolylineSelect: false,
      makiIconObj: {},
      dashPatternarr: [],
      dashPatternarrString: "",
      drag_over: false,
      polyline: {
        name: "",
        creating: false,
        editing: false,
        show: true,
        loop: false,
        showHelper: false,
        width: 2,
        depthTest: false,
        arcType: "GEODESIC",
        material: {}
      },
      arcTypeObj: {
        GEODESIC: "GEODESIC",
        NONE: "NONE",
        RHUMB: "RHUMB"
      },
      materialType: "XbsjColorMaterial",
      materialName: "实线",
      dashPatternObj: {
        0: 3,
        1: 3,
        2: 48,
        3: 51,
        4: 64,
        5: 124,
        6: 127,
        6: 255
      },
      colorMaterialBox: true,
      dashMaterialBox: false,
      arrowMaterialBox: false,
      oDLineMaterialBox: false,
      lang: {},
      langs: languagejs,
      showMaterialSelect: false,
      materialTypeObj: {
        XbsjColorMaterial: {
          type: "XbsjColorMaterial",
          name: "实线"
        },
        XbsjPolylineDashMaterial: {
          type: "XbsjPolylineDashMaterial",
          name: "虚线"
        },
        XbsjPolylineArrowMaterial: {
          type: "XbsjPolylineArrowMaterial",
          name: "箭头线"
        },
        XbsjODLineMaterial: {
          type: "XbsjODLineMaterial",
          name: "轨迹线"
        }
      },
      colorUI: {
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
      },
      polylineColor: [1, 1, 1, 1],
      dashColorUI: {
        rgba: {
          r: 255,
          g: 0,
          b: 255,
          a: 1
        }
      },
      dashColor: [1, 0, 1, 1],
      gapColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 0,
          a: 0
        }
      },
      gapColor: [0, 0, 0, 0],
      arrowColorUI: {
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 255
        }
      },
      arrowColor: [1, 1, 1, 1],
      oDLineColorUI: {
        rgba: {
          r: 255,
          g: 255,
          b: 0,
          a: 255
        }
      },
      oDLineColor: [1, 1, 0, 1],
      dashLength: 16,
      dashPattern: 255,
      showDashSelect: false,
      totoalFrameCount: 45
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "polyline.name",
        creating: "polyline.creating",
        editing: "polyline.editing",
        show: "polyline.show",
        loop: "polyline.loop",
        showHelper: "polyline.showHelper",
        width: "polyline.width",
        depthTest: "polyline.depthTest",
        arcType: "polyline.arcType",
        material: "polyline.material"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      this._disposers.push(
        XE.MVVM.bind(this, "materialType", czmObj, "material.type")
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "polylineColor",
          czmObj,
          "material.XbsjColorMaterial.color"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "dashColor",
          czmObj,
          "material.XbsjPolylineDashMaterial.color"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "gapColor",
          czmObj,
          "material.XbsjPolylineDashMaterial.gapColor"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "dashLength",
          czmObj,
          "material.XbsjPolylineDashMaterial.dashLength"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "dashPattern",
          czmObj,
          "material.XbsjPolylineDashMaterial.dashPattern"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "arrowColor",
          czmObj,
          "material.XbsjPolylineArrowMaterial.color"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "oDLineColor",
          czmObj,
          "material.XbsjODLineMaterial.color"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "totoalFrameCount",
          czmObj,
          "material.XbsjODLineMaterial.totoalFrameCount"
        )
      );

      Object.keys(this.materialTypeObj).forEach(e => {
        if (e == this._czmObj.material.type) {
          this.showMaterialSelect = true;
          this.optionssureMaterial(this.materialTypeObj[e]);
        }
      });

      if (
        this._czmObj.dashPatternarrString !== undefined &&
        this._czmObj.dashPatternarrString !== ""
      ) {
        this.dashPatternarr = this._czmObj.dashPatternarrString.split("");
        this.dashPatternarr = this.dashPatternarr.map(i => {
          return parseInt(i);
        });
      } else {
        this.dashPatternarr = [];
        this.dashPatternarr = this.dashPattern.toString(2).split("");
        this.dashPatternarr = this.dashPatternarr.map(i => {
          return parseInt(i);
        });

        if (this.dashPatternarr.length < 16) {
          let count = 16 - this.dashPatternarr.length;
          for (var i = 1; i <= count; i++) {
            this.dashPatternarr.unshift(0);
          }
        }
      }
    }
  },

  computed: {
    name() {
      return this.polyline.name;
    },
    guid() {
      return this.getBind().guid;
    }
  },
  watch: {
    dashPattern() {
      this.dashPatternarr = [];
      this.dashPatternarr = this.dashPattern.toString(2).split("");
      this.dashPatternarr = this.dashPatternarr.map(i => {
        return parseInt(i);
      });

      if (this.dashPatternarr.length < 16) {
        let count = 16 - this.dashPatternarr.length;
        for (var i = 1; i <= count; i++) {
          this.dashPatternarr.unshift(0);
        }
      }
    },
    dashPatternarr: {
      handler(old, newval) {
        let str = newval.join("");
        this._czmObj.dashPatternarrString = str;
        this.dashPattern = parseInt(this.dashPatternarr.join(""), 2);
      },
      deep: true
    },
    colorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.polylineColor.every((c, index) => c === cc[index])) {
        this.polylineColor = cc;
      }
    },
    polylineColor(c) {
      this.colorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    dashColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.dashColor.every((c, index) => c === cc[index])) {
        this.dashColor = cc;
      }
    },
    dashColor(c) {
      this.dashColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    gapColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.gapColor.every((c, index) => c === cc[index])) {
        this.gapColor = cc;
      }
    },
    gapColor(c) {
      this.gapColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    arrowColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.arrowColor.every((c, index) => c === cc[index])) {
        this.arrowColor = cc;
      }
    },
    arrowColor(c) {
      this.arrowColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    oDLineColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.oDLineColor.every((c, index) => c === cc[index])) {
        this.oDLineColor = cc;
      }
    },
    oDLineColor(c) {
      this.oDLineColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    }
  },
  methods: {
    changebtn(c) {
      if (this.dashPatternarr[c] === 1) {
        Vue.set(this.dashPatternarr, c, 0);
      } else {
        Vue.set(this.dashPatternarr, c, 1);
      }
    },
    optionssure(c) {
      this.polyline.arcType = c;
      this.showPolylineSelect = !this.showPolylineSelect;
    },
    selectinput() {
      this.showPolylineSelect = !this.showPolylineSelect;
    },
    optionssurePattern(c) {
      this.dashPattern = c;
      this.showDashSelect = !this.showDashSelect;
    },
    selectinputPattern() {
      this.showDashSelect = !this.showDashSelect;
    },
    selectinputMaterial() {
      this.showMaterialSelect = !this.showMaterialSelect;
    },
    optionssureMaterial(c) {
      this.materialName = c.name;
      this.materialType = c.type;
      if (c.type === "XbsjColorMaterial") {
        this.colorMaterialBox = true;
        this.dashMaterialBox = false;
        this.arrowMaterialBox = false;
        this.oDLineMaterialBox = false;
      } else if (c.type === "XbsjPolylineDashMaterial") {
        this.colorMaterialBox = false;
        this.dashMaterialBox = true;
        this.arrowMaterialBox = false;
        this.oDLineMaterialBox = false;
      } else if (c.type === "XbsjPolylineArrowMaterial") {
        this.colorMaterialBox = false;
        this.dashMaterialBox = false;
        this.arrowMaterialBox = true;
        this.oDLineMaterialBox = false;
      } else {
        this.colorMaterialBox = false;
        this.dashMaterialBox = false;
        this.arrowMaterialBox = false;
        this.oDLineMaterialBox = true;
      }
      this.showMaterialSelect = !this.showMaterialSelect;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const polyLineToolObj = this._czmObj;
      if (!polyLineToolObj) {
        return;
      }
      polyLineToolObj.positionEditing = false;
      if (polyLineToolObj.isCreating) {
        polyLineToolObj.isCreating = false;
        polyLineToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const polyLineToolObj = this._czmObj;
      if (!polyLineToolObj) {
        return;
      }
      polyLineToolObj.editing = false;
      polyLineToolObj.positionEditing = false;
      if (polyLineToolObj.isCreating) {
        polyLineToolObj.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(polyLineToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    },

    flyto(index) {
      this._czmObj.polygons[index].flyTo();
    },
    //拖拽移动上面
    dragOver(e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions !== undefined) {
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
      if (czmObj && czmObj.positions !== undefined) {
        this._czmObj.creating = false;
        this.$root.$earthUI.getCzmObjectPositionFromDrag(czmObj, this._czmObj);
      }
    }
  },
  beforeDestroy() {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach(e => e());
    this._disposers.length = 0;
  }
};
</script>

<style scoped>
.field {
  padding-left: 4px;
  display: inline-block;
  width: 220px;
}
.header-add .add {
  background: url(../../../images/flatten/add.png) no-repeat;
  background-position: center;
  border-left: none !important;
}
.header-add .add:focus {
  outline: none;
}

.item-btn-box input {
  float: left;
}
.item-btn-box .del {
  background: url(../../../images/flatten/del.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .edit {
  background: url(../../../images/flatten/edit.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .edit-on {
  background: url(../../../images/flatten/edit_on.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .position {
  background: url(../../../images/flatten/position.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .autoheight {
  background: url(../../../images/flatten/autoheight.png) no-repeat !important;
  background-position: center !important;
}
.flatten-btn {
  background: none;
  border: none;
  width: 100%;
  height: 34px;
  /* border-left: 1px solid black; */
  margin-top: -1px;
  cursor: pointer;
}
.flatten-btn:focus {
  outline: none;
}
.item-btn-box {
  width: 100%;
  padding-top: 1px;
  border: 1px solid #000;
  border-collapse: collapse;
}
.item-btn-box thead tr {
  border-bottom: 1px solid #000;
}

.item-btn-box thead tr th {
  width: 16.66%;
  text-align: center;
  border-right: 1px solid #000;
}
.item-btn-box tbody tr td {
  border-right: 1px solid #000;
  text-align: center;
}
.item-btn-box tbody tr {
  border-top: 1px solid #000;
}

.iteminput {
  width: 72px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin: 2px;
}
.item-order {
  width: 51px;
  height: 34px;
  text-align: center;
  line-height: 30px;
  border-right: none !important;
  border-top: none !important;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
  cursor: pointer;
}
.header-add {
  width: 61px;
  height: 30px;
  /* border-bottom: none !important; */
}
.falatten-body-item div {
  float: left;
}
.header-content {
  width: 264px;
  height: 30px;
  border-left: none !important;
  border-right: none !important;
}
.flatten-table-header {
  width: 100%;
  height: 30px;
}
.flatten-table-header .border {
  float: left;
}
.flatten-table-order {
  width: 51px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  /* border-bottom: none !important; */
}
.xbsj-flatten {
  min-width: 462px;
}
.xbsj-flatten > div {
  width: 100%;
  height: 28px;
  margin-top: 10px;
}
.xbsj-flatten label {
  float: left;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 98px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  padding-right: 14px;
}
.xbsj-flatten .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.xbsj-flatten .attributePlay .playspan {
  display: inline-block;
  width: 17px;
  height: 20px;
  background: url(../../../images/play.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributePlay .suspendspan {
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(../../../images/suspend.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributeLocation input,
.xbsj-flatten .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-right: 6px;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.flatten-table {
  display: inline-block;
  width: 80%;
}
.border {
  border: 1px solid black;
}
.select-ul {
  width: 80%;
  padding-left: 8px;
  margin-left: calc(5% + 23px);
  background: rgba(138, 138, 138, 1);
  z-index: 9999;
  position: relative;
}

.cutselectbox,
.cutselectbox2 {
  width: calc(100% - 74px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 73px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox2 {
  width: calc(100% - 87px);
  left: 83px;
}
.cutselectbox div,
.cutselectbox2 div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover,
.cutselectbox2 div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span,
.cutselectbox2 span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}

.selectButton,
.selectButton2 {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 10px;
  top: 11px;
}

.selectButton2 {
  right: 18px;
}

/* .buttonGroup {
  display: flex;
} */
/* .buttonGroup div {
  display: inline-block;
  width: 62px;
  height: 25px;
  margin-left: 18px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  padding: 0 4px;
  cursor: pointer;
} */
.attitudeEditCameraButton {
  color: #dddddd;
  margin-right: 20px;
}
.btncoloron {
  color: #1fffff !important;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
  outline: none;
}
button:focus {
  outline: none !important;
}
.attitudeEditCameraButton {
  display: block;
  float: left;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.Dottedline-default {
  width: 18px;
  height: 12px;
  background: #333333;
  margin-top: 9px;
}
.Dottedline-active {
  background: red !important;
}
.dottedstyle {
  display: flex;
  justify-content: space-around;
}
.dragButton {
  display: inline-block;
  width: 120px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>