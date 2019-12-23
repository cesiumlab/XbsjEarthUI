<template>
  <Window
    :width="480"
    :minWidth="480"
    :height="420"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <!-- 名字 -->
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="ground.name" />
      </div>

      <!-- 位置 -->
      <div class="flatten">
        <label>{{lang.weizhi}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="ground.position"></XbsjLngLatHeight>
        </div>
      </div>

      <!-- 编辑按钮 -->
      <div class="attitudeEdit">
        <label class="xbsj-label"></label>
        <div class="buttonGroup">
          <div>
            <button
              class="attitudeEditCameraButton"
              @click="ground.creating =!ground.creating"
              :class="ground.creating?'btncoloron':''"
            >{{lang.creating}}</button>
          </div>
          <div>
            <button
              class="attitudeEditCameraButton"
              @click="ground.editing =!ground.editing"
              :class="ground.editing?'btncoloron':''"
            >{{lang.editing}}</button>
          </div>
        </div>
      </div>

      <!-- ground自定义外部图标 -->
      <div class="flatten">
        <label>{{lang.imageUrls}}</label>
        <input style="float:left;" type="text" v-model="ground.imageUrls" />
      </div>

      <!-- 原点 -->
      <div class="flatten" style="display:flex;">
        <div>
          <label>{{lang.origin.x}}</label>
          <XbsjInputNumber
            v-model="ground.origin[0]"
            style="float:left;"
            :step="0.1"
            :min="0"
            :max="1"
          ></XbsjInputNumber>
        </div>
        <div>
          <label>{{lang.origin.y}}</label>
          <XbsjInputNumber
            v-model="ground.origin[1]"
            style="float:left;"
            :step="0.1"
            :min="0"
            :max="1"
          ></XbsjInputNumber>
        </div>
      </div>

      <!-- 宽高 -->
      <div class="flatten" style="display:flex;">
        <div>
          <label></label>
          <XbsjCheckBox v-model="ground.autoWidth">{{lang.autoWidth}}</XbsjCheckBox>
        </div>
        <div>
          <label></label>
          <XbsjCheckBox v-model="ground.autoHeight">{{lang.autoHeight}}</XbsjCheckBox>
        </div>
      </div>
      <div class="flatten" style="display:flex;">
        <div>
          <label>{{lang.width}}</label>
          <input style="float:left;" type="text" v-model.number="ground.width" />
        </div>
        <div>
          <label>{{lang.height}}</label>
          <input style="float:left;" type="text" v-model.number="ground.height" />
        </div>
      </div>

      <div class="flatten">
        <div>
          <label>{{lang.rotation}}</label>
          <XbsjInputNumber v-model.number="rotation" :step="1"></XbsjInputNumber>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";
import XbsjInputNumber from "../../common/Slider/input-number";

export default {
  props: {
    getBind: Function
  },
  components: {
    XbsjInputNumber
  },
  data () {
    return {
      showGroundSelect: false,
      groundshowGroundSelect: false,
      groundClone: {},
      ground: {
        name: "",
        creating: true,
        editing: false,
        imageUrl: "",
        width: 100,
        height: 100,
        autoWidth: false,
        autoHeight: true,
        origin: [0.5, 0.5],
        rotation: 0,
        show: true,
        position: [0, 0, 0]
      },
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
      pathGuidarr: [],
      lang: {}
    };
  },
  created () { },
  mounted () {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "ground.name",
        creating: "ground.creating",
        editing: "ground.editing",
        imageUrls: "ground.imageUrls",
        show: "ground.show",
        origin: "ground.origin",
        position: "ground.position",
        width: "ground.width",
        height: "ground.height",
        rotation: "ground.rotation",
        autoWidth: "ground.autoWidth",
        autoHeight: "ground.autoHeight"
      };

      for (var prop in bindData) {
        if (typeof bindData[prop] === "string") {
          this._disposers.push(XE.MVVM.bind(this, bindData[prop], this._czmObj, prop));
        } else {
          this._disposers.push(vm.handler(this, bindData[prop], this._czmObj, prop));
        }
      }

      for (var prop in this.ground) {
        this.groundClone[prop] = this.ground[prop]
      }
    }
  },
  beforeDestroy () {
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    // this._disposers = this._disposers && this._disposers();
  },
  computed: {
    name () {
      return this.ground.name;
    },
    guid () {
      return this.getBind().guid;
    },
    "ground.width": {
      get () {
        return this.getBind().width;
      },
      set (newValue) {
        this.ground.height = this.getBind().height;
      }
    },
    "ground.height": {
      get () {
        return this.getBind().height;
      },
      set (newValue) {
        this.ground.width = this.getBind().width;
      }
    },
    rotation: {
      get () {
        return Math.round(this.ground.rotation * 180 / Math.PI, 0)
      },
      set (v) {
        this.ground.rotation = v * Math.PI / 180
      }
    }
  },
  watch: {
    "ground.width" (e) {
      if (e !== "" && this.ground.autoHeight) {
        this.ground.height = this.getBind().height;
      }
    },
    "ground.height" (e) {
      if (e !== "" && this.ground.autoWidth) {
        this.ground.width = this.getBind().width;
      }
    },
    "ground.autoWidth" (e) {
      if (e === true) {
        this.ground.autoHeight = false
      }
    },
    "ground.autoHeight" (e) {
      if (e === true) {
        this.ground.autoWidth = false
      }
    }
  },
  methods: {
    groundoptionssure (c) {
      this.ground.attachedPathGuid = c.guid;
      this.groundshowGroundSelect = !this.groundshowGroundSelect;
    },
    groundselectinput () {
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
      this.groundshowGroundSelect = !this.groundshowGroundSelect;
    },
    optionssure (c) {
      this.ground.groundBuilder.makiIcon = c;
      this.showGroundSelect = !this.showGroundSelect;
    },
    selectinput () {
      this.showGroundSelect = !this.showGroundSelect;
      // console.log(this.showSelect);
    },
    close () {
      this.$parent.destroyTool(this);
    },
    cancel () {
      for (var prop in this.groundClone) {
        this._czmObj[prop] = this.groundClone[prop]
      }
      this.close();
      const groundToolObj = this._czmObj;
      if (!groundToolObj) {
        return;
      }

      groundToolObj.editing = false;
      groundToolObj.creating = false;
      if (groundToolObj.isCreating) {
        groundToolObj.destroy();
      }

      if (groundToolObj.modifyEnd) {
        groundToolObj.modifyEnd(false, groundToolObj)
      }
    },
    ok () {
      if (this.ground.imageUrls === "") {
        this.$root.$earthUI.promptInfo("请输入图片地址！", "error");
        return;
      }
      this.close();
      const groundToolObj = this._czmObj;
      if (!groundToolObj) {
        return;
      }
      groundToolObj.editing = false;
      // groundToolObj.imageUrls = this.ground.imageUrls;
      if (groundToolObj.isCreating) {
        groundToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(groundToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
      groundToolObj.editing = false;
      groundToolObj.creating = false;

      if (groundToolObj.modifyEnd) {
        groundToolObj.modifyEnd(true, groundToolObj)
      }
    },

    flyto (index) {
      this._czmObj.polygons[index].flyTo();
    }
  }
};
</script>


<style scoped>
.field {
  margin-top: 20px;
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
  display: flex;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  width: 25%;
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
.attitudeEditCameraButton {
  color: #dddddd;
}
.btncoloron {
  color: #1fffff !important;
}
</style>