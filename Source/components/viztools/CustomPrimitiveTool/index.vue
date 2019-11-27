<template>
  <Window
    :width="712"
    :minWidth="712"
    :height="668"
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
        <!-- 鼠标点选 -->
        <div class="flatten">
          <label></label>
          <div class="buttonGroup">
            <button
              class="attitudeEditCameraButton"
              @click="model.creating =!model.creating"
              :class="model.creating?'btncoloron':''"
            >{{lang.creating}}</button>
            <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="model.editing =!model.editing"
              :class="model.editing?'btncoloron':''"
            >{{lang.edit}}</button>
            <!-- <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="flyto"
            >{{lang.flyto}}</button>-->
          </div>
        </div>
      </div>
      <!-- 位置 -->
      <div class="flatten">
        <label>{{lang.weizhi}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="model.position"></XbsjLngLatHeight>
        </div>
      </div>
      <!-- 姿态 -->
      <div class="flatten">
        <label>{{lang.zitai}}</label>
        <div class="flatten-box">
          <XbsjHeadingPitchRoll v-model="model.rotation"></XbsjHeadingPitchRoll>
        </div>
      </div>

      <div class="flatten">
        <!-- 宽度  -->
        <label>{{lang.width}}</label>
        <div class="flatten-box">
          <XbsjInputNumber style="float:left; width: calc(50% - 87px);" v-model="model.canvasWidth"></XbsjInputNumber>
        </div>
        <!-- 高度  -->
        <label>{{lang.height}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 87px);"
            v-model="model.canvasHeight"
          ></XbsjInputNumber>
        </div>
      </div>

      <div class="flatten" style="display:flex;">
        <!-- 类型 -->
        <div style="position: relative;">
          <label>{{lang.primitivetype}}</label>
          <input
            type="text"
            v-model="primitiveTypeObj[model.primitiveType]"
            @click="selectinput"
            readonly
            style="cursor: pointer; width: 138px;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showTypeSelect" style="width: 148px; left: 83px;">
            <div @click="optionssure(index)" v-for="(c,index) in primitiveTypeObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
        <!-- pass -->
        <div style="position: relative;">
          <label>{{lang.pass}}</label>
          <input
            type="text"
            v-model="passObj[model.pass]"
            @click="selectpassinput"
            readonly
            style="cursor: pointer; width: 362px;"
          />
          <button class="selectButton"></button>
          <div
            class="cutselectbox"
            v-show="showPassSelect"
            style="width: 370px; height: 150px; overflow-y: auto; left: 84px;"
          >
            <div @click="passoptionssure(index)" v-for="(c,index) in passObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 预定义 -->
      <div class="flatten" style="display:flex;">
        <div style="position: relative;">
          <label>{{lang.predefined}}</label>
          <input
            type="text"
            @click="selectPredefinedinput"
            readonly
            style="cursor: pointer; width: 380px;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showPredefinedSelect" style="width: 389px; left: 84px;">
            <div>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="topbox">{{lang.editing}}{{topTitle}}</div>
      <div class="containbox">
        <div class="leftbox">
          <XbsjVirtualTree
            ref="vtree"
            :tree="tree"
            @on-click="itemClick"
            :checkBoxShow="checkBoxShow"
          ></XbsjVirtualTree>
        </div>
        <div class="rightbox">
          <textarea v-show="geometryShow"></textarea>
          <textarea v-show="createcodeShow" v-model="evalString"></textarea>
          <textarea v-show="framecodeShow" v-model="preUpdateEvalString"></textarea>
          <textarea v-show="destorycodeShow" v-model="destroyEvalString"></textarea>
          <textarea v-show="vertexshaderShow" v-model="vertexShaderSource"></textarea>
          <textarea v-show="spritsshaderShow" v-model="fragmentShaderSource"></textarea>
          <textarea v-show="renderstatsShow" v-model="renderState"></textarea>
          <div class="footbox">
            <button @click="apply">{{lang.apply}}</button>
          </div>
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
    getBind: Function
  },
  data() {
    return {
      lang: {},
      showTypeSelect: false,
      showPassSelect: false,
      showPredefinedSelect: false,
      geometryShow: true,
      createcodeShow: false,
      framecodeShow: false,
      destorycodeShow: false,
      vertexshaderShow: false,
      spritsshaderShow: false,
      renderstatsShow: false,
      checkBoxShow: false,
      evalString: "",
      preUpdateEvalString: "",
      destroyEvalString: "",
      vertexShaderSource: "",
      fragmentShaderSource: "",
      renderState: "",
      topTitle: "",
      tree: [],
      primitiveTypeObj: {
        0: "POINTS",
        1: "LINES",
        2: "LINE_LOOP",
        3: "LINE_STRIP",
        4: "TRIANGLES",
        5: "TRIANGLE_STRIP",
        6: "TRIANGLE_FAN"
      },
      passObj: {
        0: "ENVIRONMENT",
        1: "COMPUTE",
        2: "GLOBE",
        3: "TERRAIN_CLASSIFICATION",
        4: "CESIUM_3D_TILE",
        5: "CESIUM_3D_TILE_CLASSIFICATION",
        6: "CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW",
        7: "OPAQUE",
        8: "TRANSLUCENT",
        9: "OVERLAY",
        10: "NUMBER_OF_PASSES"
      },
      model: {
        name: "",
        show: true,
        // editing: false,
        canvasWidth: 0,
        canvasHeight: 0,
        // creating: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        primitiveType: Number,
        pass: Number
      },
      pinstyletype: true,
      langs: languagejs,
      bgbaseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      bgbaseColor: [0, 0, 0.5, 1]
    };
  },
  created() {},
  mounted() {
    this.topTitle = this.lang.geometry;
    this.tree = [
      {
        title: this.lang.geometry,
        expand: true,
        checkStatus: "checked",
        children: [],
        geometryShows: true
      },
      {
        title: this.lang.canvastexture,
        expand: true,
        checkStatus: "checked",
        children: [
          {
            title: this.lang.createcode,
            expand: false,
            checkStatus: "checked",
            createcodeShows: true
          },
          {
            title: this.lang.framecode,
            expand: false,
            checkStatus: "checked",
            framecodeShows: true
          },
          {
            title: this.lang.destorycode,
            expand: false,
            checkStatus: "checked",
            destorycodeShows: true
          }
        ]
      },
      {
        title: this.lang.render,
        expand: true,
        checkStatus: "checked",
        children: [
          {
            title: this.lang.vertexshader,
            expand: false,
            checkStatus: "checked",
            vertexshaderShows: true
          },
          {
            title: this.lang.spritsshader,
            expand: false,
            checkStatus: "checked",
            spritsshaderShows: true
          },
          {
            title: this.lang.renderstats,
            expand: false,
            checkStatus: "checked",
            renderstatsShows: true
          }
        ]
      }
    ];
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // console.log(czmObj);

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        // creating: "model.creating",
        // show: "model.show",
        // editing: "model.editing",
        position: "model.position",
        rotation: "model.rotation",
        canvasWidth: "model.canvasWidth",
        canvasHeight: "model.canvasHeight",
        primitiveType: "model.primitiveType",
        pass: "model.pass"
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
    }
  },
  methods: {
    selectinput() {
      this.showTypeSelect = !this.showTypeSelect;
    },
    optionssure(index) {
      this.model.primitiveType = parseInt(index);
      this.showTypeSelect = !this.showTypeSelect;
    },
    selectpassinput() {
      this.showPassSelect = !this.showPassSelect;
    },
    passoptionssure(index) {
      this.model.pass = parseInt(index);
      this.showPassSelect = !this.showPassSelect;
    },
    selectPredefinedinput() {
      this.showPredefinedSelect = !this.showPredefinedSelect;
    },
    itemClick(item) {
      // console.log(item);
      if (item.item.geometryShows) {
        this.geometryShow = true;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.topTitle = this.lang.geometry;
      }
      if (item.item.createcodeShows) {
        this.geometryShow = false;
        this.createcodeShow = true;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.evalString = this._czmObj.evalString;
        this.topTitle = this.lang.createcode;
      }
      if (item.item.framecodeShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = true;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.preUpdateEvalString = this._czmObj.preUpdateEvalString;
        this.topTitle = this.lang.framecode;
      }
      if (item.item.destorycodeShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = true;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.destroyEvalString = this._czmObj.destroyEvalString;
        this.topTitle = this.lang.destorycode;
      }
      if (item.item.vertexshaderShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = true;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.topTitle = this.lang.vertexshader;
        this.vertexShaderSource = this._czmObj.vertexShaderSource;
      }
      if (item.item.spritsshaderShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = true;
        this.renderstatsShow = false;
        this.topTitle = this.lang.spritsshader;
        this.fragmentShaderSource = this._czmObj.fragmentShaderSource;
      }
      if (item.item.renderstatsShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = true;
        this.topTitle = this.lang.renderstats;
        this.renderState = JSON.stringify(this._czmObj.renderState);
      }
    },
    apply() {
      if (this.evalString) {
        this._czmObj.evalString = this.evalString;
      }
      if (this.preUpdateEvalString) {
        this._czmObj.preUpdateEvalString = this.preUpdateEvalString;
      }
      if (this.destroyEvalString) {
        this._czmObj.destroyEvalString = this.destroyEvalString;
      }
      if (this.vertexShaderSource) {
        this._czmObj.vertexShaderSource = this.vertexShaderSource;
      }
      if (this.fragmentShaderSource) {
        this._czmObj.fragmentShaderSource = this.fragmentShaderSource;
      }
      if (this.renderState) {
        this._czmObj.renderState = JSON.parse(this.renderState);
        console.log(this._czmObj.renderState);
      }
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
        this.$root.$earth.sceneTree.addSceneObject(sceneObject);
      }
    },

    flyto() {
      this._czmObj.flyTo();
    },
    reset() {
      this.model.xbsjRotation = [0, 0, 0];
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
  /* margin-right: 15px; */
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 9px;
  top: 11px;
}

.buttonGroup {
  display: flex;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
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
  height: 30px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.xbsj-videoAttribute .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.buttonGroup div .playButton {
  background: url(../../../images/play.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.buttonGroup div .suspendButton {
  background: url(../../../images/suspend.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.containbox {
  display: flex;
  width: calc(100% - 36px) !important;
  height: 270px !important;
  margin-left: 30px;
}
.topbox {
  width: calc(100% - 36px) !important;
  height: 28px;
  text-align: center;
  line-height: 28px;
  margin-bottom: -10px;
  margin-left: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid black;
}
li {
  list-style: none;
  float: left;
  width: 82px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 36%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
  background: rgba(0, 0, 0, 0.5);
}
.rightbox {
  width: 64%;
  height: 100%;
  float: left;
  background: rgba(0, 0, 0, 0.5);
}
.leftbox span {
  display: block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  padding-left: 10px;
}
.leftbox span:hover {
  background: rgba(0, 0, 0, 0.51);
}
textarea {
  width: calc(100% - 20px);
  height: calc(100% - 55px);
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 10px;
  outline: none;
  resize: none;
}
.footbox {
  width: 100%;
  height: 30px;
  border-top: 1px solid black;
}
.footbox button {
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  /* padding: 2px 15px; */
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  float: right;
}
.footbox button:hover {
  color: #1fffff;
}
.xbsj-input-number {
  border-radius: 4px;
  border: none;
}
</style>