<template>
  <Window
    :width="486"
    :minWidth="480"
    :height="290"
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
          <li @click="tabShow='2'" :class="{highlight: tabShow=='2'}">{{lang.code}}</li>
        </ul>
      </div>
      <div class="xbsj-flatten" v-show="tabShow == '1'">
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

            <button
              class="attitudeEditCameraButton"
              @click="model.extrudedHeightEditing =!model.extrudedHeightEditing"
              :class="model.extrudedHeightEditing?'btncoloron':''"
            >{{lang.extrudedheightediting}}</button>
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

        <div class="flatten-flex">
          <!-- 辅助线 -->
          <div class="flatten">
            <label>{{lang.showhelper}}</label>
            <XbsjSwitch v-model="model.showHelper"></XbsjSwitch>
          </div>
        </div>

        <div class="flatten-flex">
          <!-- 拉伸 -->
          <label>{{lang.extrudedheight}}</label>
          <XbsjInputNumber style="float:left;" v-model.number="model.extrudedHeight"></XbsjInputNumber>
          <span style="float:left;line-height:28px;">{{lang.metre}}</span>
          <!-- 颜色 -->
          <label style="float:left;margin-left:-12px;">{{lang.color}}</label>
          <XbsjColorButton v-model="bgbaseColorUI" ref="bgbaseColor"></XbsjColorButton>
        </div>
      </div>
      <div class="xbsj-flatten" style="height: calc(100% - 38px);" v-show="tabShow == '2'">
        <div style="height: 100%">
          <label>{{lang.evalstring}}</label>
          <textarea v-model="model.evalString"></textarea>
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
    getBind: Function,
  },
  data() {
    return {
      lang: {},
      showPinSelect: false,
      makiIconObj: {},
      drag_over: false,
      tabShow: "1",
      model: {
        name: "",
        show: false,
        creating: false,
        editing: false,
        showHelper: false,
        height: 0,
        extrudedHeight: 0,
        extrudedHeightEditing: false,
        evalString: "",
      },
      bgbaseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1,
        },
      },
      bgbaseColor: [0, 0, 0.5, 1],
      langs: languagejs,
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // uia.earth.interaction.picking.enabled = true; // 开启拾取操作

    // 拾取事件定制
    // czmObj.onclick = () => (czmObj.color = [0, 1, 0, 0.5]);
    // czmObj.onclickout = () => (czmObj.color = [1, 1, 0, 0.01]);
    if (!czmObj.evalString) {
      czmObj.evalString = `
      // 开启拾取操作
      uia.earth.interaction.picking.enabled = true; 
      p.onclick = () => (alert(1));
      `;
    }

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        show: "model.show",
        creating: "model.creating",
        editing: "model.editing",
        showHelper: "model.showHelper",
        height: "model.height",
        extrudedHeight: "model.extrudedHeight",
        extrudedHeightEditing: "model.extrudedHeightEditing",
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        // console.log(vm);
        // console.log(sm);

        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      this._disposers.push(XE.MVVM.bind(this, "bgbaseColor", czmObj, "color"));
      this.model.evalString = this._czmObj.evalString;
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
    "model.extrudedHeight": {
      handler: function (val) {
        if (typeof val == "string") {
          this._czmObj.extrudedHeight = null;
        }
      },
      deep: true,
    },
  },
  methods: {
    apply() {
      this._czmObj.evalString = this.model.evalString;
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
        this.$root.$earthUI.getCzmObjectPositionFromDrags(czmObj, this._czmObj);
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
  /* width: 311px; */
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
  /* margin-right: 16px; */
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
.flatten-flex {
  display: flex;
}
</style>