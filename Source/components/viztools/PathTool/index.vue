<template>
  <Window
    :width="622"
    :minWidth="622"
    :height="454"
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
        <input style="float:left;" type="text" v-model="path.name" />
      </div>

      <div class="flatten-flex">
        <!-- 编辑按钮 -->
        <div style="height: 40px;">
          <label>{{lang.eidtbtn}}</label>
          <XbsjSwitch v-model="path.show"></XbsjSwitch>
        </div>
        <div class="attitudeEdit" style="margin-left:25px;">
          <div class="buttonGroup">
            <div>
              <button
                class="attitudeEditCameraButton"
                @click="path.creating =!path.creating"
                :class="path.creating?'btncoloron':''"
              >{{lang.creating}}</button>
            </div>
            <div>
              <button
                class="attitudeEditCameraButton"
                @click="path.editing =!path.editing"
                :class="path.editing?'btncoloron':''"
              >{{lang.editing}}</button>
            </div>
            <div>
              <button id="textbtn" class="attitudeEditCameraButton">{{lang.select}}</button>
            </div>
          </div>
          <div
            :title="lang.drag"
            class="dragBox"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
            style="display: inline-block;"
          >
            <div class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
          </div>
        </div>
      </div>
      <div class="flatten">
        <div>
          <label>{{lang.loop}}</label>
          <XbsjSwitch v-model="path.loop"></XbsjSwitch>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 显示关键点方向 -->
        <div class="flatten">
          <label>{{lang.showDirection}}</label>
          <XbsjSwitch v-model="path.showDirection"></XbsjSwitch>
        </div>
        <div class="attitudeEdit" style="margin-left:25px;">
          <div class="buttonGroup">
            <div style="width:80px;">
              <button @click="directionAlongThePath" class="attitudeEditCameraButton">{{lang.yxfx}}</button>
            </div>
            <div>
              <button
                @click="path.targetPicking =!path.targetPicking"
                class="attitudeEditCameraButton"
              >{{lang.Observation}}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flatten-flex" style="margin-top:20px;">
        <!-- 动画 -->
        <div class="attitudeEdit">
          <label class="xbsj-label">{{lang.animation}}</label>
          <div class="buttonGroup">
            <div style="background:none;">
              <button v-show="!path.playing" class="playButton" @click="path.playing=!path.playing"></button>
              <button
                v-show="path.playing"
                class="suspendButton"
                @click="path.playing=!path.playing"
              ></button>
            </div>
          </div>
        </div>
        <!-- 视角跟随 -->
        <div class="flatten">
          <label>{{lang.looppaly}}</label>
          <XbsjSwitch v-model="path.loopPlay"></XbsjSwitch>
        </div>
        <!-- 视角跟随 -->
        <div class="flatten">
          <label>{{lang.cameraAttached}}</label>
          <XbsjSwitch v-model="path.cameraAttached"></XbsjSwitch>
        </div>
        <!-- 速度 -->
        <div class="flatten">
          <label>{{lang.currentSpeed}}</label>
          <input style="width:62px" v-model.number="path.currentSpeed" type="text" /> m/s
        </div>
      </div>
      <!-- 播放进度 -->
      <div class="flatten">
        <label>{{lang.nowtime}}</label>
        <div class="field">
          <XbsjSlider
            :min="0"
            :max="path.length"
            :step="0.00001"
            v-model.number="path.currentD"
            ref="glowFactor"
          ></XbsjSlider>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 当前状态 -->
        <div class="flatten">
          <label>{{lang.currentShow}}</label>
          <XbsjSwitch v-model="path.currentShow"></XbsjSwitch>
        </div>
        <div class="flatten">
          <label>{{lang.Tangentdirection}}</label>
          <XbsjSwitch v-model="path.alwaysAlongThePath"></XbsjSwitch>
        </div>
      </div>
      <div class="flatten">
        <label>{{lang.weizhi}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="path.currentPosition"></XbsjLngLatHeight>
        </div>
      </div>
      <div class="flatten">
        <label></label>
        <div class="flatten-box">
          <XbsjHeadingPitchRoll v-model="path.currentRotation"></XbsjHeadingPitchRoll>
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
      makiIconObj: {},
      drag_over: false,
      path: {
        name: "",
        creating: false,
        currentD: 0,
        playing: false,
        currentShow: false,
        currentSpeed: 50,
        editing: false,
        enabled: true,
        cameraAttached: false,
        // ignoreDefualt:true,
        isCreating: true,
        isSelected: false,
        alwaysAlongThePath: false,
        loop: false,
        loopPlay: false,
        positionPicking: true,
        // positions: {},
        // rotations: {},
        show: true,
        showDirection: false,
        showHelper: false,
        slices: 100,
        targetPicking: false,
        currentPosition: [0, 0, 0],
        currentRotation: [0, 0, 0],
        length: 0,
      },
      pinstyletype: true,

      langs: languagejs,
      dighole: false,
      connections: [],
      connectedTileset: "",
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      // console.log(this._czmObj);
      const bindData = {
        currentPosition: "path.currentPosition",
        currentRotation: "path.currentRotation",
        name: "path.name",
        playing: "path.playing",
        creating: "path.creating",
        currentD: "path.currentD",
        currentShow: "path.currentShow",
        currentSpeed: "path.currentSpeed",
        editing: "path.editing",
        enabled: "path.enabled",
        alwaysAlongThePath: "path.alwaysAlongThePath",
        // ignoreDefualt:"path.ignoreDefualt",
        // isCreating:"path.isCreating",
        isSelected: "path.isSelected",
        loop: "path.loop",
        loopPlay: "path.loopPlay",
        // positionPicking:"path.positionPicking",
        // positions: "path.positions",
        // rotations: "path.rotations",
        show: "path.show",
        showDirection: "path.showDirection",
        showHelper: "path.showHelper",
        slices: "path.slices",
        targetPicking: "path.targetPicking",
        cameraAttached: "path.cameraAttached",
        length: "path.length",
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
    }

    //测试通过拖拽图层树中的item进行绑定路径
    let btn = document.getElementById("textbtn");
    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    var that = this;
    function handleFileSelect(e) {
      // e.stopPropagation();
      e.preventDefault();
      that._czmObj.creating = false;
      let obj = e.dataTransfer.getData("obj");
      let arr = [];
      arr = JSON.parse(obj).positions;
      that._czmObj.positions = arr;
      that._czmObj.flyTo();
    }

    btn.addEventListener("dragover", handleDragOver, false);
    btn.addEventListener("drop", handleFileSelect, false);
  },
  computed: {
    name() {
      return this.path.name;
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
    borderbaseColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.borderbaseColor.every((c, index) => c === cc[index])) {
        this.borderbaseColor = cc;
      }
    },
    borderbgbaseColor(c) {
      this.borderbaseColorUI = {
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
    directionAlongThePath() {
      this._czmObj.directionAlongThePath();
    },
    optionssure(c) {
      this.pin.pinBuilder.makiIcon = c;
      this.showPinSelect = !this.showPinSelect;
    },
    selectinput() {
      this.showPinSelect = !this.showPinSelect;
      // console.log(this.showSelect);
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const pathToolObj = this._czmObj;
      if (!pathToolObj) {
        return;
      }
      pathToolObj.positionEditing = false;
      if (pathToolObj.isCreating) {
        pathToolObj.isCreating = false;
        pathToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const pathToolObj = this._czmObj;
      pathToolObj.editing = false;
      if (!pathToolObj) {
        return;
      }
      pathToolObj.positionEditing = false;
      // pathToolObj.twoPostionsEditing = false;
      if (pathToolObj.isCreating) {
        pathToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(pathToolObj);
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
  height: 40px;
  vertical-align: top;
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
.buttonGroup div:nth-child(1) {
  margin-left: 0;
}
.attitudeEditCameraButton {
  color: #dddddd;
  cursor: pointer;
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
  width: 120px;
  height: 25px;
  margin-left: 18px;
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