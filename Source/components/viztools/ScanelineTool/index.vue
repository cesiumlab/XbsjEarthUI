<template>
  <Window
    :width="480"
    :minWidth="480"
    :height="322"
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
              @click="model.editing =!model.editing"
              :class="model.editing?'btncoloron':''"
            >{{lang.editing}}</button>
            <!-- <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="flyto"
            >{{lang.flyto}}</button>-->
          </div>
        </div>
      </div>
      <!-- 当前位置 -->
      <div class="flatten">
        <label></label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="model.xbsjPosition"></XbsjLngLatHeight>
        </div>
      </div>

      <!-- 半径  -->
      <div class="flatten">
        <label>{{lang.radius}}</label>
        <div class="flatten-box">
          <input style="float:left;" type="text" v-model="model.radius" />
        </div>
      </div>

      <!-- 动画 -->
      <div class="flatten-flex xbsj-videoAttribute">
        <label>{{lang.animation}}</label>
        <div class="buttonGroup">
          <div style="background:none;">
            <button
              v-show="!model.playing"
              class="playButton"
              @click="model.playing=!model.playing"
            ></button>

            <button
              v-show="model.playing"
              class="suspendButton"
              @click="model.playing=!model.playing"
            ></button>
          </div>

          <div style="background:none;margin-left:20px;">
            <button
              class="attitudeEditCameraButton"
              @click="model.loopPlay =!model.loopPlay"
              :class="model.loopPlay?'btncoloron':''"
            >{{lang.loopPlay}}</button>
          </div>

          <!-- 循环周期 -->
          <div class="flatten">
            <label>{{lang.loopcycle}}</label>
            <input style="float:left;" type="text" v-model="model.name" />
          </div>

          <!-- 当前时刻 -->
          <div class="flatten">
            <label>{{lang.loopcycle}}</label>
            <div class="field">
              <!-- <XbsjSlider range :min="0" :max="30" :step="1" v-model="nearfar" ref="glowFactor"></XbsjSlider> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 颜色 -->
      <div class="flatten-flex">
        <div class="flatten">
          <label>{{lang.color}}</label>
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
      showPinSelect: false,
      makiIconObj: {},
      model: {
        name: "",
        show: true,
        editing: false,
        radius: Number,
        creating: true,
        xbsjPosition: [0, 0, 0],
        xbsjRotation: [0, 0, 0]
      },
      pinstyletype: true,
      langs: languagejs
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
        editing: "model.editing",
        // positionEditing: "model.positionEditing",
        // rotationEditing: "model.rotationEditing",
        // xbsjRotation: "model.xbsjRotation",
        position: "model.xbsjPosition",
        radius: "model.radius"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
    }
  },
  beforeDestroy() {
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers = this._disposers && this._disposers();
  },
  computed: {
    name() {
      return this.model.name;
    },
    guid() {
      return this.getBind().guid;
    }
  },
  watch: {},
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
    //销毁监控
    // this.disAutorun();
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
  height: 25px;
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
</style>