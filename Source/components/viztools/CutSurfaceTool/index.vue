<template>
  <Window
    :width="536"
    :minWidth="490"
    :height="448"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <div class="flatten" style="position: relative;">
        <label>{{lang.cutsurfacetiles}}</label>
        <input
          type="text"
          v-model="connectedTileset"
          @click.stop="showSelect=!showSelect"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton"></button>
        <div class="cutselectbox">
          <div
            v-show="showSelect"
            v-for="c in connections"
            :key="c.tileset.guid"
            @click="toggleConnection(c)"
          >
            <span>{{c.name}}</span>
            <span style="position: absolute;right: 10px;" v-show="c.guid == guid">✔</span>
            <span style="position: absolute;right: 10px;" v-show="c.guid != '' && c.guid!=guid">✘</span>
          </div>
        </div>
      </div>
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
              style="margin-left:2px;"
              class="attitudeEditCameraButton"
              @click="model.editing =!model.editing"
              :class="model.editing?'btncoloron':''"
            >{{lang.editing}}</button>
            <button
              style="margin-left:2px;"
              class="attitudeEditCameraButton"
              @click="model.bottomTextureRotationEditing =!model.bottomTextureRotationEditing"
              :class="model.bottomTextureRotationEditing?'btncoloron':''"
            >{{lang.bottomrotation}}</button>
            <!-- 挖坑地形 -->
            <button
              style="margin-left:2px;"
              class="attitudeEditCameraButton"
              @click="terrainDiscardClick"
            >{{lang.terraindiscard}}</button>
            <!-- 转成静态几何体 -->
            <button
              style="margin-left:2px;"
              class="attitudeEditCameraButton"
              @click="applyStatic"
            >{{lang.applyStatic}}</button>
          </div>
          <!-- 拖拽 -->
          <div
            :title="lang.drag"
            class="dragBox"
            style="display: inline-block;margin-left:2px;"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
          >
            <div style="margin-left:2px;" class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
          </div>
        </div>
      </div>

      <div class="flatten">
        <!-- 采样间距 -->
        <label>{{lang.sampledistance}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 104px);"
            v-model.number="model.sampledDistance"
          ></XbsjInputNumber>
        </div>
      </div>

      <div class="flatten">
        <!-- 侧面纹理图像 -->
        <label>{{lang.wallimageurl}}</label>
        <input style="float:left;" type="text" v-model="model.wallImageUrl" />
      </div>

      <div class="flatten">
        <!-- 侧面纹理高度 -->
        <label>{{lang.wallimageheight}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 104px);"
            v-model.number="model.wallImageHeight"
          ></XbsjInputNumber>
        </div>
        <!-- 宽度缩放比例 -->
        <label>{{lang.wallimagewidthscale}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 103px);"
            v-model.number="model.wallImageWidthScale"
          ></XbsjInputNumber>
        </div>
      </div>

      <div class="flatten">
        <!-- 底面纹理图像 -->
        <label>{{lang.bottomimageurl}}</label>
        <input style="float:left;" type="text" v-model="model.bottomImageUrl" />
      </div>

      <div class="flatten">
        <!-- 底面纹理高度 -->
        <label>{{lang.bottomimageheight}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 104px);"
            v-model.number="model.bottomImageHeight"
          ></XbsjInputNumber>
        </div>
        <!-- 宽度缩放比例 -->
        <label>{{lang.bottomimagewidthscale}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 103px);"
            v-model.number="model.bottomImageWidthScale"
          ></XbsjInputNumber>
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
      drag_over: false,
      model: {
        name: "",
        show: true,
        creating: true,
        editing: false,
        sampledDistance: 10,
        textureRotationEditing: false,
        imageWidthScale: 1.0,
        wallImageUrl: "",
        wallImageHeight: 3,
        wallImageWidthScale: 1,
        bottomImageUrl: "",
        bottomImageHeight: 3,
        bottomImageWidthScale: 1,
        bottomTextureRotationEditing: false
      },
      connections: [],
      connectedTileset: "",
      showSelect: false,
      langs: languagejs
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];

    this.updateConnections();

    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        creating: "model.creating",
        show: "model.show",
        editing: "model.editing",
        sampledDistance: "model.sampledDistance",
        wallImageUrl: "model.wallImageUrl",
        wallImageHeight: "model.wallImageHeight",
        wallImageWidthScale: "model.wallImageWidthScale",
        bottomImageUrl: "model.bottomImageUrl",
        bottomImageHeight: "model.bottomImageHeight",
        bottomImageWidthScale: "model.bottomImageWidthScale",
        bottomTextureRotationEditing: "model.bottomTextureRotationEditing"
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
  computed: {
    name() {
      return this.model.name;
    },
    guid() {
      return this.getBind().getDiscardGuid();
    }
  },
  methods: {
    toggleConnection(con) {
      var tileset = con.tileset();

      if (con.guid == this.guid) {
        tileset.xbsjFlattenGuid = "";
      } else {
        if (con.guid != "" && con.guid != this.guid) {
          //弹出提示
          this.$root.$earthUI.confirm(this.lang.confirmOther, () => {
            tileset.xbsjFlattenGuid = this.guid;
            this.updateConnections();
          });
        } else {
          tileset.xbsjFlattenGuid = this.guid;
        }
      }

      this.updateConnections();
      this.showSelect = false;
    },
    updateConnections() {
      //获取当前所有tileset  只需要名称，对象，是否关联三个属性
      var cc = this.$root.$earth.tilesetCollection;

      var connections = [];
      var guid = this.getBind().getDiscardGuid();

      var connectedTileset = undefined;
      var count = 0;
      cc.forEach(t => {
        var con = {
          name: t.name,
          tileset: () => {
            return t;
          },
          guid: t.xbsjFlattenGuid
        };

        if (con.guid == this.guid) {
          if (!connectedTileset) {
            connectedTileset = con.name;
          }
          count++;
        }
        connections.push(con);
      });

      if (count >= 2) {
        connectedTileset += this.lang.other + count + this.lang.count;
      }
      this.connectedTileset = connectedTileset;
      this.connections = connections;
    },
    terrainDiscardClick() {
      this.$root.$earth.terrainEffect.depthTest = true;
      this._czmObj.applyTerrain();
    },
    applyStatic() {
      // 生成静态几何体
      var targetNodeChildren = this.$root.$earth.sceneTree.root.children;
      var targetObj = this._czmObj;

      if (targetObj.xbsjType === 'CutSurface') {
        if (targetObj._bottomSurface && targetObj._bottomSurface._cp) {
          var bottomCpJson = targetObj._bottomSurface._cp.toJSON();
          bottomCpJson.name = '挖坑底面';
          targetNodeChildren.push({ czmObject: bottomCpJson });
        }
        if (targetObj._cp) {
          var wallCpJson = targetObj._cp.toJSON();
          wallCpJson.name = '挖坑墙面';
          targetNodeChildren.push({ czmObject: wallCpJson });
        }
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
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
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
  min-width: 72px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 111px);
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
  width: calc(100% - 103px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 96px;
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