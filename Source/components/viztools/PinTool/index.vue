<template>
  <Window
    :width="602"
    :minWidth="480"
    :height="530"
    :top="164"
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
          <li @click="tabShow='2'" :class="{highlight: tabShow=='2'}">{{lang.image}}</li>
          <li @click="tabShow='3'" :class="{highlight: tabShow=='3'}">{{lang.text}}</li>
          <li @click="tabShow='4'" :class="{highlight: tabShow=='4'}">{{lang.code}}</li>
        </ul>
      </div>
      <div class="xbsj-flatten" v-show="tabShow == '1'">
        <!-- 名字 -->
        <div class="flatten">
          <label>{{lang.name}}</label>
          <input style="float:left;" type="text" v-model="pin.name" />
        </div>

        <!-- 近远裁 -->
        <div class="flatten" style="margin-top:20px;display:flex;">
          <label>{{lang.nearfar}}</label>
          <div class="field">
            <XbsjSlider
              range
              :min="0"
              :max="1073741824"
              :step="1"
              v-model="nearfar"
              ref="glowFactor"
            ></XbsjSlider>
          </div>
        </div>
        <!-- 近远裁 -->
        <div class="flatten">
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
        </div>

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
          </div>
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

        <!-- pin内置样式 -->
        <!-- <div class="flatten" style="display:flex;">
          <div>
            <label>{{lang.pinBuilder.text}}</label>
            <input style="float:left;" type="text" v-model="pin.pinBuilder.text" />
          </div>
          <div style="position: relative;">
            <label>{{lang.pinBuilder.pinstyle}}</label>
            <input
              type="text"
              v-model="pin.pinBuilder.makiIcon"
              @click="selectinput"
              readonly
              style="cursor: pointer;"
            />
            <button class="selectButton"></button>
            <div
              class="cutselectbox"
              v-show="showPinSelect"
              style="  overflow:scroll;height:100px;"
            >
              <div @click="optionssure(c)" v-for="(c,index) in makiIconObj" :key="index">
                <span>{{c}}</span>
              </div>
            </div>
          </div>
        </div>-->

        <div v-show="pin.imageUrl===''" class="flatten" style="margin-top:20px;">
          <label>{{lang.pinBuilder.size}}</label>
          <div class="field">
            <XbsjSlider
              :min="1"
              :max="100"
              :step="1"
              showTip="always"
              v-model="pin.pinBuilder.size"
              ref="glowFactor"
            ></XbsjSlider>
          </div>
        </div>

        <!-- pin内置样式 -->
        <div class="flatten" style="display:flex;">
          <div>
            <label>{{lang.pinBuilder.text}}</label>
            <input style="float:left;" type="text" v-model="pin.pinBuilder.text" />
          </div>
          <div style="position: relative;">
            <label>{{lang.pinBuilder.pinstyle}}</label>
            <input
              type="text"
              v-model="pin.pinBuilder.makiIcon"
              @click="selectinput"
              readonly
              style="cursor: pointer;"
            />
            <button class="selectButton"></button>
            <div
              class="cutselectbox"
              v-show="showPinSelect"
              style="  overflow:scroll;height:100px;"
            >
              <div @click="optionssure(c)" v-for="(c,index) in makiIconObj" :key="index">
                <span>{{c}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flatten" style="display:flex;">
          <!-- 图标背景 -->
          <label style="margin-top:4px;">{{lang.pinBuilder.fillColor}}</label>
          <XbsjColorButton v-model="fillColorUI" ref="fillColor"></XbsjColorButton>
          <!-- 边框/文字 -->
          <label style="margin-top:4px;">{{lang.pinBuilder.outlineColor}}</label>
          <XbsjColorButton v-model="outlineColorUI" ref="outlineColor"></XbsjColorButton>
        </div>

        <!-- 锚点  -->
        <div class="flatten">
          <label>{{lang.origin}}</label>
          <input
            type="text"
            style="float:left; width: 25%; margin-right: 20px;"
            v-model="pin.origin[0]"
          />
          <input type="text" style="float:left; width: 25%;" v-model="pin.origin[1]" />
          <XbsjCheckBox v-model="pin.isDivImage">{{lang.isDivImage}}</XbsjCheckBox>
        </div>

        <!-- <div class="flatten" style="display:flex;">
          <div>
            <label></label>
            <XbsjCheckBox v-model="pin.isDivImage">{{lang.isDivImage}}</XbsjCheckBox>
          </div>
        </div>-->

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
      </div>

      <div class="xbsj-flatten" v-show="tabShow == '2'">
        <!-- pin自定义外部图标 -->
        <div class="flatten">
          <label>{{lang.imageUrl}}</label>
          <input style="float:left;" type="text" v-model="pin.imageUrl" />
        </div>

        <!-- 缩放 -->
        <div class="flatten" style="margin-top:20px;">
          <label>{{lang.scale}}</label>
          <!-- <input style="float:left;" type="text" v-model="pin.scale" /> -->
          <div class="field">
            <XbsjSlider
              :min="0.05"
              :max="2"
              :step="0.01"
              showTip="always"
              v-model="pin.scale"
              ref="glowFactor"
            ></XbsjSlider>
          </div>
        </div>
      </div>

      <div class="xbsj-flatten" v-show="tabShow == '3'">
        <div class="flatten" style="display:flex;">
          <!-- pin文本内容 -->
          <div>
            <label>{{lang.pinBuilder.exttext}}</label>
            <input style="float:left;" type="text" v-model="pin.pinBuilder.extText" />
          </div>
          <!-- pin文本内容字体样式 -->
          <div>
            <label>{{lang.pinBuilder.exttextfont}}</label>
            <input style="float:left;" type="text" v-model="pin.pinBuilder.extTextFont" />
          </div>
        </div>
        <!-- 文本内容偏移 -->
        <div class="flatten" style="display:flex;">
          <!-- 左右偏移 -->
          <div>
            <label>{{lang.pinBuilder.lroffset}}</label>
            <XbsjInputNumber v-model="extTextPixelOffset[0]"></XbsjInputNumber>
          </div>
          <!-- 上下偏移 -->
          <div>
            <label>{{lang.pinBuilder.tboffset}}</label>
            <XbsjInputNumber v-model="extTextPixelOffset[1]"></XbsjInputNumber>
          </div>
        </div>
      </div>

      <div class="xbsj-flatten" style="height: calc(100% - 38px);" v-show="tabShow == '4'">
        <div style="height: 100%">
          <label>{{lang.evalstring}}</label>
          <textarea v-model="pin.evalString"></textarea>
          <div class="footbox">
            <button @click="apply">{{lang.apply}}</button>
          </div>
        </div>
        <!-- <div class="footbox">
          <button @click="apply">{{lang.apply}}</button>
        </div>-->
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
      ranges: true,
      lang: {},
      showPinSelect: false,
      pinshowPinSelect: false,
      tabShow: "1",
      makiIconObj: {},
      drag_over: false,
      pin: {
        name: "",
        creating: true,
        enabled: true,
        editing: false,
        far: 100,
        near: 1,
        imageUrl: "",
        scale: 1,
        show: true,
        position: [0, 0, 0],
        pinBuilder: {},
        attachedPathGuid: "",
        origin: [0, 0],
        isDivImage: true,
        evalString: ""
      },
      pinstyletype: true,
      nearfar: [0, 0],
      fillColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      fillColor: [0, 0, 0.5, 1],
      outlineColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      outlineColor: [0, 0, 0.5, 1],
      langs: languagejs,
      dighole: false,
      connections: [],
      connectedTileset: "",
      pathGuidarr: [],
      extTextPixelOffset: []
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
        imageUrl: "pin.imageUrl",
        show: "pin.show",
        position: "pin.position",
        scale: "pin.scale",
        enabled: "pin.enabled",
        pinBuilder: "pin.pinBuilder",
        attachedPathGuid: "pin.attachedPathGuid",
        origin: "pin.origin",
        isDivImage: "pin.isDivImage"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      this._disposers.push(
        XE.MVVM.bind(this, "fillColor", czmObj, "pinBuilder.fillColor")
      );
      this._disposers.push(
        XE.MVVM.bind(this, "outlineColor", czmObj, "pinBuilder.outlineColor")
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "extTextPixelOffset",
          czmObj,
          "pinBuilder.extTextPixelOffset"
        )
      );

      this.makiIconObj = XE.Obj.Pin.MakiIcon;
      this.makiIconObj.null = "";
      this.pin.evalString = this._czmObj.evalString;
      this.nearfar = [this.pin.near, this.pin.far];
    }
  },

  computed: {
    name() {
      return this.pin.name;
    },
    guid() {
      return this.getBind().guid;
    }
    // nearfar: {
    //   get() {
    //     return [0, 30];
    //   },
    //   set(newValue) {
    //     this.pin.near = Math.round(Math.pow(2, newValue[0]));
    //     this.pin.far = Math.round(Math.pow(2, newValue[1]));
    //   }
    // }
  },
  watch: {
    nearfar: {
      handler(nval, oval) {
        this.pin.near = nval[0];
        this.pin.far = nval[1];
      },
      deep: true
    },
    "pin.near"(nearval) {
      this.nearfar = [nearval, this.pin.far];
    },
    "pin.far"(farval) {
      this.nearfar = [this.pin.near, farval];
    },
    "pin.pinBuilder.text"(e) {
      if (e !== "") {
        this.pin.pinBuilder.makiIcon = "";
      }
    },
    fillColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.fillColor.every((c, index) => c === cc[index])) {
        this.fillColor = cc;
      }
    },
    fillColor(c) {
      this.fillColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    outlineColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.outlineColor.every((c, index) => c === cc[index])) {
        this.outlineColor = cc;
      }
    },
    outlineColor(c) {
      this.outlineColorUI = {
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
    pinoptionssure(c) {
      this.pin.attachedPathGuid = c.guid;
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
      // console.log(this.showSelect);
    },
    apply() {
      this._czmObj.evalString = this.pin.evalString;
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
      pinToolObj.positionEditing = false;
      pinToolObj.twoPostionsEditing = false;
      if (pinToolObj.isCreating) {
        pinToolObj.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(pinToolObj);
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
.field {
  margin-top: 11px;
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
  width: calc(100% - 92px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 74px;
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
  width: 311px;
  height: 40px;
  vertical-align: top;
  margin-top: -1px;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  width: 132px;
  margin-left: 5%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  padding: 2px 1px;
  margin-right: 6px;
}
.buttonGroup div:nth-child(1) {
  display: inline-block;
  height: 25px;
  margin-left: 0;
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
.dragBox {
  display: inline-block;
}
.xbsj-input-number {
  width: 150px;
  height: 32px;
  margin-top: 0px;
  border: 0;
  border-radius: 4px;
  margin-right: 16px;
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
textarea {
  width: calc(100% - 106px);
  height: calc(100% - 55px);
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: #ffffff;
  padding: 10px;
  outline: none;
  resize: none;
}
.footbox {
  width: 100%;
  height: 30px;
  /* border-top: 1px solid black; */
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
  margin-right: 12px;
}
.footbox button:hover {
  color: #1fffff;
}
.dragButton {
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