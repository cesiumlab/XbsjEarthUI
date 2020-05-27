<template>
  <Window
    :width="582"
    :minWidth="582"
    :height="406"
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
      <div class="flatten-flex">
        <!-- 编辑按钮 -->
        <div class="buttonGroup">
          <label class="xbsj-label"></label>
          <button
            class="attitudeEditCameraButton"
            @click="model.creating =!model.creating"
            :class="model.creating?'btncoloron':''"
          >{{lang.creating}}</button>

          <button
            class="attitudeEditCameraButton"
            @click="model.editing =!model.editing"
            :class="model.editing?'btncoloron':''"
          >{{lang.editing}}</button>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 发射速度(个/秒)  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.emissionrate}}</label>
          <div class="field">
            <XbsjSlider :min="1" :max="100" :step="1" showTip="always" v-model="model.emissionrate"></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的尺寸(单位：pixel)  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.particleSize}}</label>
          <div class="field">
            <XbsjSlider :min="2" :max="60" :step="1" showTip="always" v-model="model.particleSize"></XbsjSlider>
          </div>
        </div>

        <!-- 重力加速度，设置为负则向上  -->
        <!-- <label>{{lang.gravity}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model.number="model.gravity"
          ></XbsjInputNumber>
        </div>-->
      </div>
      <div class="flatten-flex">
        <!-- 粒子存在的时间  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.minimumParticleLife}}</label>
          <div class="field">
            <XbsjSlider
              :min="0.1"
              :max="29.1"
              :step="1.0"
              showTip="always"
              v-model="model.minimumParticleLife"
            ></XbsjSlider>
          </div>
        </div>
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.maximumParticleLife}}</label>
          <div class="field">
            <XbsjSlider
              :min="0.1"
              :max="29.1"
              :step="1.0"
              showTip="always"
              v-model="model.maximumParticleLife"
            ></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 粒子的初速度  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.minimumSpeed}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="30" :step="1" showTip="always" v-model="model.minimumSpeed"></XbsjSlider>
          </div>
        </div>
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.maximumSpeed}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="30" :step="1" showTip="always" v-model="model.maximumSpeed"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 粒子的初始比例(相对于粒子的像素)  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.startScale}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="10" :step="1" showTip="always" v-model="model.startScale"></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的结束比例(相对于粒子的像素)  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.endScale}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="10" :step="1" showTip="always" v-model="model.endScale"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!--  重力加速度，设置为负则向下  -->
        <div class="flatten" style="margin-top:10px;">
          <label>{{lang.gravity}}</label>
          <div class="field">
            <XbsjSlider :min="-20" :max="20" :step="1" showTip="always" v-model="model.gravity"></XbsjSlider>
          </div>
        </div>
        <!-- 粒子存在的时间  -->
        <!-- <div class="flatten" style="margin-top:10px;">
          <label>{{lang.lifetime}}</label>
          <div class="field">
            <XbsjSlider :min="2" :max="60" :step="1" showTip="always" v-model="model.lifetime"></XbsjSlider>
          </div>
        </div>-->
      </div>
      <!-- 粒子图像 -->
      <div class="flatten">
        <label>{{lang.image}}</label>
        <input style="float:left;" type="text" v-model="model.image" />
      </div>
      <!-- <div class="flatten-flex">
        <div class="flatten">
          <div class="flatten">
            <label>{{lang.outlineShow}}</label>
            <XbsjSwitch v-model="model.outlineShow"></XbsjSwitch>
          </div>
        </div>
        颜色
        <div class="flatten">
          <label>{{lang.color}}</label>
          <XbsjColorButton style="float:left;" v-model="bgbaseColorUI" ref="bgbaseColor"></XbsjColorButton>
        </div>
      </div>-->

      <!-- 宽度 -->
      <!-- <div class="flatten-flex" style="margin-top:30px;">
        <label>{{lang.outlineWidth}}</label>
        <div class="field">
          <XbsjSlider
            :min="1"
            :max="100"
            :step="1"
            showTip="always"
            v-model="model.outlineWidth"
            ref="glowFactor"
          ></XbsjSlider>
        </div>
        <div class="flatten" v-show="pinstyletype">
          <label>{{lang.outlineColor}}</label>
          <XbsjColorButton style="float:left;" v-model="borderbaseColorUI" ref="borderbaseColor"></XbsjColorButton>
        </div>
      </div>-->
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
      model: {
        name: "",
        show: false,
        creating: false,
        editing: false,
        ground: false,
        particleSize: 25.0,
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 12,
        maximumParticleLife: 12,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        lifetime: 20.0,
        image: "",
        outlineWidth: 1,
        outlineShow: false,
        minWidthScale: 0.06,
        dynamicWidthScale: 0.1,
        arrowMaxHeightScale: 0.1,
        arrowWingWidthScale: 2
      },
      bgbaseColorUI: {
        rgba: {
          r: 0,
          g: 255,
          b: 0,
          a: 0.1
        }
      },
      bgbaseColor: [0, 1, 0, 0.1],
      borderbaseColorUI: {
        rgba: {
          r: 0,
          g: 255,
          b: 0,
          a: 1
        }
      },
      borderbaseColor: [0, 1, 0, 1],
      pinstyletype: true,
      langs: languagejs
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
        emissionRate: "model.emissionRate",
        gravity: "model.gravity",
        minimumParticleLife: "model.minimumParticleLife",
        maximumParticleLife: "model.maximumParticleLife",
        minimumSpeed: "model.minimumSpeed",
        maximumSpeed: "model.maximumSpeed",
        startScale: "model.startScale",
        endScale: "model.endScale",
        particleSize: "model.particleSize",
        // lifetime: "model.lifetime"
        image: "model.image"
        // show: "model.show"
        // creating: "model.creating",
        // editing: "model.editing",
        // outlineWidth: "model.outlineWidth",
        // ground: "model.ground",
        // outlineWidth: "model.outlineWidth",
        // outlineShow: "model.outlineShow",
        // minWidthScale: "model.minWidthScale",
        // dynamicWidthScale: "model.dynamicWidthScale",
        // arrowMaxHeightScale: "model.arrowMaxHeightScale",
        // arrowWingWidthScale: "model.arrowWingWidthScale"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      // this._disposers.push(XE.MVVM.bind(this, "bgbaseColor", czmObj, "color"));
      // this._disposers.push(
      //   XE.MVVM.bind(this, "borderbaseColor", czmObj, "outlineColor")
      // );
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
    bgbaseColorUI(color) {
      let v = color.rgba;
      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.bgbaseColor.every((c, index) => c === cc[index])) {
        this.bgbaseColor = cc;
      }
    },
    bgbaseColor(c) {
      this.bgbaseColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    borderbaseColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.borderbaseColor.every((c, index) => c === cc[index])) {
        this.borderbaseColor = cc;
      }
    },
    borderbaseColor(c) {
      this.borderbaseColorUI = {
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
  width: calc(100% - 102px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 78px;
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
</style>