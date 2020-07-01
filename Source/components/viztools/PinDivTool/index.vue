<template>
  <div>
    <div id="testid"></div>
    <Window
      :width="480"
      :minWidth="480"
      :height="452"
      :title="lang.title"
      :floatright="true"
      @cancel="cancel"
      @ok="ok"
      :footervisible="true"
      @showclick="showSelect=false"
    >
      <div class="xbsj-flatten">
        <!-- 名字 -->
        <div class="flatten">
          <label>{{lang.name}}</label>
          <input style="float:left;" type="text" v-model="pin.name" />
        </div>

        <!-- 近远裁 -->
        <!-- <div class="flatten" style="margin-top:20px;display:flex;">
          <label>{{lang.nearfar}}</label>
          <div class="field">
            <XbsjSlider range :min="0" :max="30" :step="0.1" v-model="nearfar" ref="glowFactor"></XbsjSlider>
          </div>
        </div>-->
        <!-- 近远裁 -->
        <!-- <div class="flatten">
          <label></label>
          <div class="flatten-box">
            <input v-model="pin.near" placeholder="lang.near" style="width: 25%;" type="text" />
            <input
              v-model="pin.far"
              placeholder="lang.far"
              style="width: 25%;margin-left:5%;"
              type="text"
            />
          </div>
        </div>-->

        <!-- 位置 -->
        <div class="flatten">
          <label>{{lang.weizhi}}</label>
          <div class="flatten-box">
            <XbsjLngLatHeight v-model="pin.position"></XbsjLngLatHeight>
          </div>
        </div>

        <!-- 编辑按钮 -->
        <div class="attitudeEdit">
          <label class="xbsj-label"></label>
          <div class="buttonGroup">
            <div>
              <button
                class="attitudeEditCameraButton"
                @click="pin.creating =!pin.creating"
                :class="pin.creating?'btncoloron':''"
              >{{lang.creating}}</button>
            </div>
            <div>
              <button
                class="attitudeEditCameraButton"
                @click="pin.editing =!pin.editing"
                :class="pin.editing?'btncoloron':''"
              >{{lang.editing}}</button>
            </div>
            <!-- <div @dragover="dragOver" @drop="drop">
              <button class="attitudeEditDragButton">{{lang.drag}}</button>
            </div>-->
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
        <div class="flatten">
          <div style="position: relative;">
            <label>{{lang.pathAnimation}}</label>
            <input
              type="text"
              v-model="pin.attachedPathGuid"
              @click="pinselectinput"
              readonly
              style="cursor: pointer;"
            />
            <button class="selectButton"></button>
            <div
              class="cutselectbox"
              v-show="pinshowPinSelect"
              style="overflow:scroll;height:100px;"
            >
              <div @click="pinoptionssure(c)" v-for="(c,index) in pathGuidarr" :key="index">
                <span>{{c.name}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- pindiv部图标 -->
        <div class="flatten">
          <label>{{lang.divcontent}}</label>
          <textarea class="flatten-textarea" v-model="divcontent" />
        </div>
        <!-- <div class="apply" @click="apply">应用</div> -->
      </div>
    </Window>
  </div>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";
import Vue from "vue";
export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      showPinSelect: false,
      pinshowPinSelect: false,
      makiIconObj: {},
      divcontent: ``,
      drag_over: false,
      pin: {
        name: "",
        creating: true,
        enabled: true,
        editing: false,
        far: 25000000,
        near: 100,
        imageUrl: "",
        scale: 1,
        show: true,
        position: [0, 0, 0],
        pinBuilder: {},
        winPos: [0, 0, 0, 0],
        attachedPathGuid: ""
      },
      pinstyletype: true,
      bgbaseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      bgbaseColor: [0, 0, 0.5, 1],
      borderbaseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      borderbaseColor: [0, 0, 0.5, 1],
      langs: languagejs,
      dighole: false,
      connections: [],
      connectedTileset: "",
      pathGuidarr: []
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
        name: "pin.name",
        creating: "pin.creating",
        editing: "pin.editing",
        far: "pin.far",
        near: "pin.near",
        show: "pin.show",
        position: "pin.position",
        enabled: "pin.enabled",
        innerHTML: "divcontent",
        attachedPathGuid: "pin.attachedPathGuid"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      if (!this._czmObj.far) {
        this._czmObj.far = 1073741824;
      }
      if (!this._czmObj.innerHTML) {
        this._czmObj.innerHTML =
          `<div
        style="height:50px;width:100px;left:-76px;
        bottom:0px;position: absolute;color: white;
        background-size: 100% 100%;padding: 5px;
        border-radius: 5px;cursor:pointer;
        background-image:url('` +
          this._czmObj.defaultImgUrl() +
          `');">
    标记文字
    </div>`;
      }

      // console.log(this._czmObj.defaultImgUrl());
    }
  },
  computed: {
    name() {
      return this.pin.name;
    },
    guid() {
      return this.getBind().guid;
    },
    nearfar: {
      get() {
        return [0, 30];
      },
      set(newValue) {
        this.pin.near = Math.round(Math.pow(2, newValue[0]));
        this.pin.far = Math.round(Math.pow(2, newValue[1]));
      }
    }
  },
  watch: {},
  methods: {
    pinoptionssure(c) {
      this.pin.attachedPathGuid = c.guid;
      // console.log(this._czmObj)
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    pinselectinput() {
      this.pathGuidarr = [];
      let guidobj = {};
      this.pathGuidarr.push({ name: "空", guid: "" });
      this.$root.$earth.pathCollection.forEach(e => {
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
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    optionssure(c) {
      this.pin.pinBuilder.makiIcon = c;
      this.showPinSelect = !this.showPinSelect;
    },
    selectinput() {
      this.showPinSelect = !this.showPinSelect;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();

      const pinToolObj = this._czmObj;
      if (!pinToolObj) {
        return;
      }
      pinToolObj.positionEditing = false;
      if (pinToolObj.isCreating) {
        pinToolObj.isCreating = false;
        pinToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const pinToolObj = this._czmObj;
      pinToolObj.editing = false;
      if (!pinToolObj) {
        return;
      }

      if (pinToolObj.isCreating) {
        pinToolObj.isCreating = false;
        // 点击确定将pindiv添加到sceneTree当中
        const sceneObject = new XE.SceneTree.Leaf(pinToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      } else {
        pinToolObj.innerHTML = this.divcontent;
      }
    },
    apply() {
      const pinToolObj = this._czmObj;
      //修改pindiv操作
      pinToolObj.innerHTML = this.divcontent;
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
.field {
  margin-top: 9px;
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
  outline: none;
}
button:focus {
  outline: none !important;
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
.flatten-box {
  display: flex;
  width: calc(100% - 100px);
  height: 28px;
}
.attitudeEditMouseButton {
  display: inline-block;
  position: relative;
  width: 66px;
  height: 18px;
  background-size: contain;
  margin-top: 3px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  color: #dddddd;
}
.buttonGroup {
  display: inline-block;
  width: 224px;
  vertical-align: top;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  width: 100px;
  margin-left: 5%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  padding: 2px 1px;
}
.buttonGroup div:nth-child(1) {
  display: inline-block;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.attitudeEditCameraButton,
.attitudeEditDragButton {
  color: #dddddd;
  cursor: pointer;
}
.btncoloron {
  color: #1fffff !important;
}
.flatten-textarea {
  float: left;
  width: calc(100% - 100px);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  position: absolute;
  height: calc(100% - 188px);
  resize: none;
}
.apply {
  width: 35px !important;
  height: 25px;
  text-align: center;
  font-size: 14px;
  padding: 0px 15px;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  line-height: 27px;
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