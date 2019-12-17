<template>
  <Window
    :width="490"
    :minWidth="490"
    :height="370"
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
            <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="flyto"
            >{{lang.flyto}}</button>
          </div>
          <!-- 拖拽 -->
          <div
            :title="lang.drag"
            class="dragBox"
            style="display: inline-block;"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
          >
            <div class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
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
          <input style="float:left;" type="text" v-model.number="model.radius" />
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
              style="margin-top: -6px;"
              class="attitudeEditCameraButton"
              @click="model.loopPlay =!model.loopPlay"
              :class="model.loopPlay?'btncoloron':''"
            >{{lang.loopPlay}}</button>
          </div>
        </div>

        <!-- 循环周期 -->
        <div class="flatten">
          <label>{{lang.loopcycle}}</label>
          <input style="float:left;width:60px;" type="text" v-model="model.timeDuration" />
        </div>
      </div>
      <!-- 当前时刻 -->
      <div class="flatten">
        <label>{{lang.nowtime}}</label>
        <div class="field">
          <XbsjSlider
            :min="0"
            :max="maxcurrentTime"
            :step="0.01"
            v-model="model.currentTime"
            ref="glowFactor"
          ></XbsjSlider>
        </div>
      </div>

      <!-- 颜色 -->
      <div class="flatten">
        <label>{{lang.color}}</label>
        <XbsjColorButton v-model="bgbaseColorUI" ref="bgbaseColor"></XbsjColorButton>
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
        playing: false,
        show: true,
        editing: false,
        enabled: true,
        radius: Number,
        timeDuration: 0,
        currentTime: 0,
        creating: true,
        loopPlay: true,
        xbsjPosition: [0, 0, 0],
        xbsjRotation: [0, 0, 0]
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
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // console.log(czmObj);

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        creating: "model.creating",
        show: "model.show",
        editing: "model.editing",
        position: "model.xbsjPosition",
        radius: "model.radius",
        loopPlay: "model.loopPlay",
        playing: "model.playing",
        timeDuration: "model.timeDuration",
        currentTime: "model.currentTime",
        enabled: "model.enabled"
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
    maxcurrentTime() {
      return Number(this.model.timeDuration);
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

    flyto() {
      this._czmObj.flyTo();
    },
    reset() {
      this.model.xbsjRotation = [0, 0, 0];
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
  display: inline-block;
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
.dragButton {
  display: inline-block;
  width: 120px;
  height: 25px;
  margin-left: 18px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
  float: left;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>