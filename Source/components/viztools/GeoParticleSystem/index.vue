<template>
  <Window
    :width="596"
    :minWidth="582"
    :height="630"
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
        <input style="float:left;" type="text" v-model="model.name" />
      </div>
      <!-- 位置 -->
      <div class="flatten">
        <label>{{lang.position}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="model.position"></XbsjLngLatHeight>
        </div>
      </div>
      <!-- 角度 -->
      <div class="flatten">
        <label>{{lang.rotation}}</label>
        <div class="flatten-box">
          <XbsjHeadingPitchRoll v-model="model.rotation"></XbsjHeadingPitchRoll>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 创建 -->
        <div class="buttonGroup">
          <label class="xbsj-label"></label>
          <button
            class="attitudeEditCameraButton"
            @click="model.creating =!model.creating"
            :class="model.creating?'btncoloron':''"
          >{{lang.creating}}</button>
          <!-- 平移 -->
          <button
            class="attitudeEditCameraButton"
            @click="model.positionEditing =!model.positionEditing"
            :class="model.positionEditing?'btncoloron':''"
          >{{lang.positionEditing}}</button>
          <!-- 旋转 -->
          <button
            class="attitudeEditCameraButton"
            @click="model.rotationEditing =!model.rotationEditing"
            :class="model.rotationEditing?'btncoloron':''"
          >{{lang.rotationEditing}}</button>
        </div>
        <!-- 拖拽 -->
        <div
          :title="lang.drag"
          class="dragBox"
          @dragover="dragOver"
          @drop="drop"
          @dragleave="dragLeave"
        >
          <div class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
        </div>
      </div>
      <div class="flatten-flex">
        <label>{{lang.type}}</label>
        <!-- 烟雾状 -->
        <div class="buttonGroup">
          <button class="attitudeEditCameraButton" @click="toBeSmoke">{{lang.smoke}}</button>
          <!-- 喷泉状 -->
          <button class="attitudeEditCameraButton" @click="toBeFountain">{{lang.fountain}}</button>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 开始颜色 -->
        <label>{{lang.startcolor}}</label>
        <XbsjColorButton v-model="startColorUI"></XbsjColorButton>
        <!-- 结束颜色 -->
        <label>{{lang.endcolor}}</label>
        <XbsjColorButton v-model="endColorUI"></XbsjColorButton>
      </div>
      <!-- 发射器类型 -->
      <div class="flatten" style="display:flex;">
        <div style="position: relative;">
          <label>{{lang.emitterType}}</label>
          <input
            type="text"
            v-model="model.emitterType"
            @click="selectinput"
            readonly
            style="cursor: pointer;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showEmitterSelect">
            <div @click="optionssure(c)" v-for="(c,index) in emitterTypeObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flatten">
        <!-- 发射器半径  -->
        <label>{{lang.emitterRadius}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model.number="model.emitterRadius"
            :disabled="radiusdisabled"
          ></XbsjInputNumber>
        </div>
        <!-- 发射器弧度  -->
        <label>{{lang.emitterAngle}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model.number="model.emitterAngle"
            :disabled="angledisabled"
          ></XbsjInputNumber>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 发射速率(个/秒)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.emissionRate=5">{{lang.emissionrate}}</label>
          <div class="field">
            <XbsjSlider :min="1" :max="100" :step="1" showTip="always" v-model="model.emissionRate"></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的尺寸(单位：pixel)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.particleSize=25">{{lang.particleSize}}</label>
          <div class="field">
            <XbsjSlider :min="2" :max="60" :step="1" showTip="always" v-model="model.particleSize"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 粒子存在的时间  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.minimumParticleLife=2">{{lang.minimumParticleLife}}</label>
          <div class="field">
            <XbsjSlider
              :min="0.1"
              :max="29.1"
              :step="0.1"
              showTip="always"
              v-model="model.minimumParticleLife"
            ></XbsjSlider>
          </div>
        </div>
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.maximumParticleLife=2">{{lang.maximumParticleLife}}</label>
          <div class="field">
            <XbsjSlider
              :min="0.1"
              :max="29.1"
              :step="0.1"
              showTip="always"
              v-model="model.maximumParticleLife"
            ></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 粒子的初速度  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.minimumSpeed=1">{{lang.minimumSpeed}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="30" :step="1" showTip="always" v-model="model.minimumSpeed"></XbsjSlider>
          </div>
        </div>
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.maximumSpeed=4">{{lang.maximumSpeed}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="30" :step="1" showTip="always" v-model="model.maximumSpeed"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 粒子的初始比例(相对于粒子的像素)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.startScale=1">{{lang.startScale}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="10" :step="1" showTip="always" v-model="model.startScale"></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的结束比例(相对于粒子的像素)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.endScale=5">{{lang.endScale}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="10" :step="1" showTip="always" v-model="model.endScale"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!--  重力加速度，设置为负则向下  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.gravity=0">{{lang.gravity}}</label>
          <div class="field">
            <XbsjSlider :min="-20" :max="20" :step="1" showTip="always" v-model="model.gravity"></XbsjSlider>
          </div>
        </div>
      </div>
      <!-- 粒子图像 -->
      <div class="flatten">
        <label>{{lang.image}}</label>
        <input style="float:left;" type="text" v-model="model.image" />
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      showPinSelect: false,
      makiIconObj: {},
      drag_over: false,
      model: {
        name: "",
        show: false,
        creating: false,
        positionEditing: false,
        rotationEditing: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        particleSize: 25.0,
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 12,
        maximumParticleLife: 12,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        image: "",
        outlineWidth: 1,
        outlineShow: false,
        minWidthScale: 0.06,
        dynamicWidthScale: 0.1,
        arrowMaxHeightScale: 0.1,
        arrowWingWidthScale: 2,
        emitterType: "CircleEmitter",
        emitterRadius: 2,
        emitterAngle: 1
      },
      startColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      startColor: [0, 0, 0.5, 1],
      endColorUI: {
        rgba: {
          r: 0,
          g: 255,
          b: 0,
          a: 1
        }
      },
      endColor: [0, 1, 0, 1],
      pinstyletype: true,
      langs: languagejs,
      showEmitterSelect: false,
      emitterTypeObj: {
        BoxEmitter: "BoxEmitter",
        CircleEmitter: "CircleEmitter",
        ConeEmitter: "ConeEmitter",
        SphereEmitter: "SphereEmitter"
      },
      radiusdisabled: false,
      angledisabled: true
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // console.log(czmObj);

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        creating: "model.creating",
        positionEditing: "model.positionEditing",
        rotationEditing: "model.rotationEditing",
        position: "model.position",
        rotation: "model.rotation",
        emissionRate: "model.emissionRate",
        gravity: "model.gravity",
        minimumParticleLife: "model.minimumParticleLife",
        maximumParticleLife: "model.maximumParticleLife",
        minimumSpeed: "model.minimumSpeed",
        maximumSpeed: "model.maximumSpeed",
        startScale: "model.startScale",
        endScale: "model.endScale",
        particleSize: "model.particleSize",
        image: "model.image",
        emitterType: "model.emitterType",
        emitterRadius: "model.emitterRadius",
        emitterAngle: "model.emitterAngle"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      this._disposers.push(
        XE.MVVM.bind(this, "startColor", czmObj, "startColor")
      );
      this._disposers.push(XE.MVVM.bind(this, "endColor", czmObj, "endColor"));
    }
  },
  computed: {
    name() {
      return this.model.name;
    },
    guid() {
      return this.getBind().guid;
    }
  },
  watch: {
    startColorUI(color) {
      let v = color.rgba;
      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.startColor.every((c, index) => c === cc[index])) {
        this.startColor = cc;
      }
    },
    startColor(c) {
      this.startColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    endColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.endColor.every((c, index) => c === cc[index])) {
        this.endColor = cc;
      }
    },
    endColor(c) {
      this.endColorUI = {
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
    toBeSmoke() {
      this._czmObj.toBeSmoke();
    },
    toBeFountain() {
      this._czmObj.toBeFountain();
    },
    selectinput() {
      this.showEmitterSelect = !this.showEmitterSelect;
    },
    optionssure(c) {
      this.model.emitterType = c;
      if (this.model.emitterType === "ConeEmitter") {
        this.radiusdisabled = true;
        this.angledisabled = false;
      } else {
        this.radiusdisabled = false;
        this.angledisabled = true;
      }
      this.showEmitterSelect = !this.showEmitterSelect;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const modelToolObj = this._czmObj;
      if (!modelToolObj) {
        return;
      }
      modelToolObj.positionEditing = false;
      if (modelToolObj.isCreating) {
        modelToolObj.isCreating = false;
        modelToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const modelToolObj = this._czmObj;
      modelToolObj.editing = false;
      if (!modelToolObj) {
        return;
      }
      modelToolObj.positionEditing = false;
      if (modelToolObj.isCreating) {
        modelToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(modelToolObj);
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
      if (
        czmObj &&
        (czmObj.positions !== undefined || czmObj.position !== undefined)
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
        (czmObj.position !== undefined || czmObj.positions !== undefined)
      ) {
        this._czmObj.creating = false;
        if (czmObj.position !== undefined) {
          this._czmObj.position = [...czmObj.position];
        } else {
          this._czmObj.position = [...czmObj.positions[0]];
        }
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
.flatten-flex {
  display: flex;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 182px;
  margin-top: 12px;
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
  min-width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 100px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
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
  margin-left: calc(10% + 23px);
  background: rgba(138, 138, 138, 1);
  z-index: 9999;
  position: relative;
}

.cutselectbox {
  width: calc(100% - 92px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 84px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}

.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 15px;
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 15px;
  top: 11px;
}

.buttonGroup {
  display: flex;
}
.buttonGroup div {
  display: inline-block;
  width: 62px;
  height: 25px;
  margin-left: 18px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  padding: 0 4px;
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
  display: inline-block;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  margin-right: 20px;
}
.dragBox {
  display: inline-block;
}
.dragBox .dragButton {
  width: 120px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
}
.dragBox .dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>
