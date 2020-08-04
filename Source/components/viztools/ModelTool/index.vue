<template>
  <Window
    :width="546"
    :minWidth="480"
    :height="358"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div style="height: 100%;">
      <div style="text-align: center; width: 100%; background: rgba(0,0,0,0.5);">
        <ul class="tab">
          <li @click="tabShow='1'" :class="{highlight: tabShow=='1'}">{{lang.routine}}</li>
          <li @click="tabShow='2'" :class="{highlight: tabShow=='2'}">{{lang.senior}}</li>
          <li @click="tabShow='3'" :class="{highlight: tabShow=='3'}">{{lang.effect}}</li>
        </ul>
      </div>
      <div class="xbsj-flatten" v-show="tabShow == '1'">
        <!-- 名称 -->
        <div class="flatten">
          <label>{{lang.name}}</label>
          <input style="float:left;" type="text" v-model="model.name" />
        </div>
        <!-- 资源路径 -->
        <div class="flatten">
          <label>{{lang.url}}</label>
          <input style="float:left;" type="text" v-model="model.url" />
        </div>
        <div class="flatten-flex">
          <!-- 鼠标点选 -->
          <div class="flatten">
            <label>{{lang.weizhi}}</label>
            <div class="buttonGroup">
              <button
                class="attitudeEditCameraButton"
                @click="model.creating =!model.creating"
                :class="model.creating?'btncoloron':''"
              >{{lang.creating}}</button>
              <button
                style="margin-left:20px;"
                class="attitudeEditCameraButton"
                @click="model.positionEditing =!model.positionEditing"
                :class="model.positionEditing?'btncoloron':''"
              >{{lang.positionEditing}}</button>
              <button
                style="margin-left:20px;"
                class="attitudeEditCameraButton"
                @click="flyto"
              >{{lang.flyto}}</button>
            </div>
          </div>
        </div>
        <!-- 位置 -->
        <div class="flatten">
          <label></label>
          <div class="flatten-box">
            <XbsjLngLatHeight v-model="model.xbsjPosition"></XbsjLngLatHeight>
          </div>
        </div>
        <!-- 朝向 -->
        <div class="flatten-flex">
          <div class="flatten">
            <label>{{lang.cx}}</label>
            <div class="buttonGroup">
              <button
                class="attitudeEditCameraButton"
                @click="model.rotationEditing =!model.rotationEditing"
                :class="model.rotationEditing?'btncoloron':''"
              >{{lang.rotationEditing}}</button>
              <button
                @click="reset"
                style="margin-left:20px;"
                class="attitudeEditCameraButton"
              >{{lang.reset}}</button>
            </div>
          </div>
        </div>
        <!-- rotation -->
        <div class="flatten">
          <label></label>
          <div class="flatten-box">
            <XbsjHeadingPitchRoll v-model="model.xbsjRotation"></XbsjHeadingPitchRoll>
          </div>
        </div>
      </div>

      <div class="xbsj-flatten" v-show="tabShow == '2'">
        <!-- 路径动画 -->
        <div class="flatten">
          <div style="position: relative;">
            <label>{{lang.pathAnimation}}</label>
            <input
              type="text"
              v-model="model.attachedPathGuid"
              @click="selectinput"
              readonly
              style="cursor: pointer;"
            />
            <button class="selectButton"></button>
            <div class="cutselectbox" v-show="showPinSelect" style="overflow:scroll;height:100px;">
              <div @click="optionssure(c)" v-for="(c,index) in pathGuidarr" :key="index">
                <span>{{c.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 像素大小 -->
        <div class="flatten">
          <label>{{lang.minpx}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="256" :step="1" v-model.number="model.minimumPixelSize"></XbsjSlider>
          </div>
        </div>
        <!-- 放大比例 -->
        <div class="flatten">
          <label>{{lang.enlargeScale}}</label>
          <div class="flatten-box">
            <input style="width:100px;" v-model.number="model.maximumScale" />
          </div>
        </div>
        <!-- 可见距离范围 -->
        <div class="flatten">
          <label>{{lang.distancedisplay}}</label>
          <div class="field">
            <XbsjSlider
              range
              :min="0"
              :max="50000000"
              :step="1"
              v-model="model.distanceDisplayCondition"
            ></XbsjSlider>
          </div>
        </div>
      </div>

      <div class="xbsj-flatten" v-show="tabShow == '3'">
        <!-- 环境贴图 -->
        <div class="flatten">
          <label>{{lang.environmentmaps}}</label>
          <input style="float:left;" type="text" v-model="model.specularEnvironmentMaps" />
        </div>
        <!-- 材质底色 -->
        <div class="flatten">
          <label @click="model.luminanceAtZenith=0.2">{{lang.material}}</label>
          <div class="field">
            <XbsjSlider :min="0" :max="5.0" :step="0.02" v-model.number="model.luminanceAtZenith"></XbsjSlider>
          </div>
        </div>
        <!-- 颜色 -->
        <div class="flatten">
          <label>{{lang.color}}</label>
          <XbsjColorButton v-model="bgbaseColorUI" ref="bgbaseColor"></XbsjColorButton>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";

export default {
  props: {
    getBind: Function,
  },
  data() {
    return {
      lang: {},
      showPinSelect: false,
      pathGuidarr: [],
      tabShow: "1",
      model: {
        name: "",
        show: true,
        creating: true,
        url: "",
        specularEnvironmentMaps: undefined,
        positionEditing: false,
        rotationEditing: false,
        xbsjPosition: [0, 0, 0],
        xbsjRotation: [0, 0, 0],
        maximumScale: 0,
        minimumPixelSize: 0,
        attachedPathGuid: "",
        luminanceAtZenith: 0.2,
        distanceDisplayCondition: [0, 0],
      },
      pinstyletype: true,
      langs: languagejs,
      bgbaseColorUI: {
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 1,
        },
      },
      bgbaseColor: [1, 1, 1, 1],
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    console.log(czmObj);

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        creating: "model.creating",
        show: "model.show",
        url: "model.url",
        specularEnvironmentMaps: "model.specularEnvironmentMaps",
        positionEditing: "model.positionEditing",
        rotationEditing: "model.rotationEditing",
        xbsjRotation: "model.xbsjRotation",
        xbsjPosition: "model.xbsjPosition",
        maximumScale: "model.maximumScale",
        distanceDisplayCondition: "model.distanceDisplayCondition",
        minimumPixelSize: "model.minimumPixelSize",
        attachedPathGuid: "model.attachedPathGuid",
        luminanceAtZenith: "model.luminanceAtZenith",
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
      this._disposers.push(XE.MVVM.bind(this, "bgbaseColor", czmObj, "color"));
    }
  },
  computed: {
    name() {
      return this.model.name;
    },
    guid() {
      return this.getBind().guid;
    },
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
          a: c[3],
        },
      };
    },
  },
  methods: {
    optionssure(c) {
      this.model.attachedPathGuid = c.guid;
      this.showPinSelect = !this.showPinSelect;
    },
    selectinput() {
      this.pathGuidarr = [];
      let guidobj = {};
      this.pathGuidarr.push({ name: "空", guid: "" });
      this.$root.$earth.pathCollection.forEach((e) => {
        guidobj.name = e.name;
        guidobj.guid = e.guid;
        this.pathGuidarr.push(guidobj);
      });
      if (this.pathGuidarr.length < 2) {
        this.$root.$earthUI.promptInfo(
          "There is no path in the current scenario",
          "warning"
        );
        return;
      }
      this.showPinSelect = !this.showPinSelect;
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

    flyto() {
      this._czmObj.flyTo();
    },
    reset() {
      this.model.xbsjRotation = [0, 0, 0];
    },
  },
  beforeDestroy() {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach((e) => e());
    this._disposers.length = 0;
  },
};
</script>

<style scoped>
.flatten-flex {
  display: flex;
}
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
  left: 85px;
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
.attitudeEditCameraButton {
  color: #dddddd;
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
.tab {
  overflow: hidden;
  margin-left: 10px;
}
.tab li {
  display: inline-block;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  float: left;
  border-radius: 4px;
}
.tab li:hover,
.tab .highlight {
  background: #000;
}
</style>