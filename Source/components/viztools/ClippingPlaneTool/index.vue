<template>
  <Window
    :width="418"
    :minWidth="340"
    :height="500"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
  >
    <div class="xbsj-cutting">
      <div class="cutting" ref="cutselectbox">
        <label>{{lang.cuttitleset}}</label>
        <div @click.stop="showSelect=!showSelect">
          <input type="text" v-model="connectedTileset" readonly />
          <button class="selectButton"></button>
        </div>
        <div class="cutselectbox">
          <table v-show="showSelect" border="1" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th>{{lang.layer}}</th>
                <th>{{lang.edgeWidth}}</th>
                <th>{{lang.color}}</th>
                <th>{{lang.connected}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c,index in connections" :key="c.tileset().guid">
                <td>{{c.name}}</td>

                <td>
                  <input v-model.number="c.edgeWidth" />
                </td>
                <td>
                  <XbsjColorButtonArray v-model="c.edgeColor"></XbsjColorButtonArray>
                </td>
                <td>
                  <XbsjSwitch v-model="c.connected" @input="toggleConnection(c)"></XbsjSwitch>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="cutting">
        <label>{{lang.name}}</label>
        <input type="text" v-model="attribute.name" />
      </div>
      <div class="attributeLocation">
        <label>{{lang.position}}</label>

        <XbsjLngLatHeight v-model="attribute.position"></XbsjLngLatHeight>
      </div>
      <div class="attributeAttitude">
        <label>{{lang.posture}}</label>

        <XbsjHeadingPitchRoll v-model="attribute.rotation"></XbsjHeadingPitchRoll>
      </div>
      <div class="cutting">
        <div class="attitudeEdit">
          <label class="xbsj-label">{{lang.posturestatus}}</label>
          <div class="attitudeEditMouseDiv">
            <button
              class="attitudeEditMouseButton"
              :class="attribute.creating ? 'attitudeEditMouseButtonActive' : ''"
              @click="attribute.creating =! attribute.creating"
            >{{lang.positionPicking}}</button>
          </div>
          <div class="attitudeEditRotationDiv">
            <button
              class="attitudeEditRotationButton"
              :class="attribute.positionEditing ? 'attitudeEditRotationButtonActive' : ''"
              @click="attribute.positionEditing =!attribute.positionEditing"
            >{{lang.move}}</button>
          </div>

          <div class="attitudeEditRotationDiv">
            <button
              class="attitudeEditRotationButton"
              :class="attribute.rotationEditing ? 'attitudeEditRotationButtonActive' : ''"
              @click="attribute.rotationEditing =!attribute.rotationEditing"
            >{{lang.rotation}}</button>
          </div>
        </div>
      </div>
      <div class="cutting">
        <label>{{lang.getswitch}}</label>
        <div class="cutswitch">
          <XbsjSwitch v-model="attribute.show"></XbsjSwitch>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./index_locale";

import { addOutterEventListener } from "../../utils/xbsjUtil";

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      attribute: {
        name: "",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        positionEditing: false,
        creating: false,
        rotationEditing: false,
        show: false
      },
      langs: languagejs,
      connections: [],
      connectedTileset: "",
      showSelect: false
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
        name: "attribute.name",
        position: "attribute.position",
        rotation: "attribute.rotation",
        show: "attribute.show",
        positionEditing: "attribute.positionEditing",
        creating: "attribute.creating",
        rotationEditing: "attribute.rotationEditing"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
    }

    this.updateConnections();

    //添加一个外部事件，如果点击后隐藏
    addOutterEventListener(this.$refs.cutselectbox, "mousedown", () => {
      this.showSelect = false;
    });
  },
  computed: {
    name() {
      return this.attribute.name;
    }
  },
  watch: {},
  methods: {
    update(v) {
      // this.attribute.position = v;
      // this.attribute.position.splice(0, 3, ...v);
    },
    toggleConnection(con) {
      var guid = this.getBind().guid;

      var tileset = con.tileset();
      var idx = tileset.xbsjClippingPlanes.planes.findIndex(g => g == guid);
      if (idx < 0) {
        tileset.xbsjClippingPlanes.planes.push(guid);
      } else {
        tileset.xbsjClippingPlanes.planes.splice(idx, 1);
      }

      this.updateConnections();
      this.showSelect = false;
    },
    updateConnections() {
      this._disposersCon = this._disposersCon || [];

      this._disposersCon.forEach(e => e());
      this._disposersCon.length = 0;

      //获取当前所有tileset  只需要名称，对象，是否关联三个属性
      var cc = this.$root.$earth.tilesetCollection;

      this.connections = [];
      var guid = this.getBind().guid;

      var connectedTileset = undefined;
      var count = 0;
      cc.forEach(t => {
        //遍历所有裁剪面，判定是否包含
        var idx = t.xbsjClippingPlanes.planes.findIndex(g => g == guid);
        var con = {
          name: t.name,
          tileset: () => {
            return t;
          },
          connected: idx >= 0,
          edgeWidth: t.xbsjClippingPlanes.edgeWidth,
          edgeColor: t.xbsjClippingPlanes.edgeColor.map(t => t)
        };

        if (con.connected) {
          if (!connectedTileset) {
            connectedTileset = con.name;
          }
          count++;
        }
        this.connections.push(con);

        var index = this.connections.length - 1;

        //绑定con的 名称，边界线，颜色
        this._disposersCon.push(
          XE.MVVM.bind(this, "connections." + index + ".name", t, "name")
        );
        this._disposersCon.push(
          XE.MVVM.bind(
            this,
            "connections." + index + ".edgeWidth",
            t,
            "xbsjClippingPlanes.edgeWidth"
          )
        );
        this._disposersCon.push(
          XE.MVVM.bind(
            this,
            "connections." + index + ".edgeColor",
            t,
            "xbsjClippingPlanes.edgeColor"
          )
        );
      });

      if (count >= 2) {
        connectedTileset += this.lang.other + count + this.lang.count;
      }
      this.connectedTileset = connectedTileset;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const clippingPlane = this._czmObj;
      if (!clippingPlane) {
        return;
      }
      clippingPlane.positionEditing = false;
      if (clippingPlane.isCreating) {
        clippingPlane.isCreating = false;
        clippingPlane.destroy();
      }
    },
    ok() {
      this.close();

      const clippingPlane = this._czmObj;
      if (!clippingPlane) {
        return;
      }
      clippingPlane.positionEditing = false;
      clippingPlane.rotationEditing = false;
      clippingPlane.twoPostionsEditing = false;
      if (clippingPlane.isCreating) {
        clippingPlane.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(clippingPlane);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    }
  },
  beforeDestroy() {
    //恢复默认值
    // this.$root.$earthUI.tools.featureProperty.disabled = this._disableDefautlPrp;
    // this.$root.$earth.interaction.picking.enabled = this._enablePicking;

    // 解绑数据关联
    if (this._disposers) {
      this._disposers.forEach(e => e());
      this._disposers.length = 0;
    }

    if (this._disposersCon) {
      this._disposersCon.forEach(e => e());
      this._disposersCon.length = 0;
    }

    //回复
  }
};
</script>

<style scoped>
.attitudeEditRotationButton {
  display: inline-block;
  position: relative;
  width: 94px;
  height: 18px;
  background: url(../../../images/offsetrotation.png) no-repeat;
  background-size: contain;
  margin-top: 3px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  color: #dddddd;
}
.attitudeEditRotationButtonActive,
.attitudeEditRotationButton:hover {
  background: url(../../../images/offsetrotation_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.attitudeEditMouseButton {
  display: inline-block;
  position: relative;
  width: 90px;
  height: 18px;
  background: url(../../../images/mousepick.png) no-repeat;
  background-size: contain;
  margin-top: 3px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  margin-right: 80px;
  color: #dddddd;
}
.attitudeEdit div {
  display: inline-block;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.attitudeEdit .attitudeEditMouseDiv {
  width: 92px;
  /* margin-left: 20px; */
}
.attitudeEdit .attitudeEditRotationDiv {
  width: 92px;
  margin-left: 15px;
}
.mouseTooltip {
  left: -45px;
  top: -50px;
}
.attitudeEditMouseButtonActive,
.attitudeEditMouseButton:hover {
  background: url(../../../images/mousepick_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-cutting {
  min-width: 340px;
}
.xbsj-cutting > div {
  width: 100%;
  height: 28px;
  margin-top: 10px;
}
.xbsj-cutting label {
  float: left;
  width: 52px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-cutting .cutting input,
.xbsj-cutting .attributePath input {
  width: calc(100% - 123px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-left: 20px;
}
.xbsj-cutting .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
input[type="text"]:read-only {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
input[type="text"]:focus,
button:focus,
input[type="text"]:read-only:focus {
  outline: none;
}
/* input[type="text"]:focus,
button:focus,
input[type="text"]:read-only:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
} */
.xbsj-cutting .attributeLocation input,
.xbsj-cutting .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-right: 6px;
}
.cutting-switch-container {
  height: 25px;
  width: 48px;
  display: inline-block;
  overflow: hidden;
}
.cutting-switch-container input {
  display: none;
}
.cutting-switch-container label {
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  border-radius: 25px;
  transition: all 0.4s ease;
  margin: 0;
}
.cutting-switch-container label:before {
  content: "";
  display: block;
  border-radius: 25px;
  height: 21px;
  width: 21px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  background-color: #fff;
  position: relative;
  right: -2px;
  top: 2px;
}

.cutting-switch-container input:checked ~ label:before {
  right: -25px;
  background-color: #fcc118;
}

.cutting-switch-container input:checked ~ label {
  background-color: #1890ff;
}

.cutselectbox {
  width: calc(100% - 123px);
  max-height: calc(100% - 60px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 100px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 1;
}

.cutselectbox span {
  display: inline-block;
  text-align: left;
}

.cutselectbox .span1 {
  margin-left: 10px;
  width: calc(100% - 38px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cutselectbox .span2 {
  width: 12px;
  float: right;
  margin-right: 10px;
}

.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  outline: none;
  position: absolute;
  right: 15px;
  top: 16px;
}

.cutswitch {
  margin-left: 95px;
}

.cutselectbox tr {
  /* border-bottom: 1px solid black; */
  height: 40px;
}

.cutselectbox table {
  border: solid black;
  border-width: 0px 1px 1px 0px;
  width: 100%;
}
.cutselectbox table td {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
}
.cutselectbox table th {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
}
/* .cutselectbox table tbody td {
  width: 40px;
} */
.xbsj-cutting .cutselectbox table tbody td input {
  width: 30px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  text-align: center;
  padding-left: 0px;
  margin-left: 0px;
}
.xbsj-cutting .cutselectbox table tbody tr td:nth-child(2),
.xbsj-cutting .cutselectbox table tbody tr th:nth-child(2),
.xbsj-cutting .cutselectbox table tbody tr td:nth-child(3),
.xbsj-cutting .cutselectbox table tbody tr th:nth-child(3) {
  width: 40px;
}

.xbsj-cutting .cutselectbox table tbody tr td:nth-child(4),
.xbsj-cutting .cutselectbox table tbody tr th:nth-child(4) {
  width: 56px;
}

.xbsj-cutting .cutselectbox table tbody tr td:nth-child(3) div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 25px;
  margin-bottom: 6px;
}

.xbsj-cutting .cutselectbox table tbody tr td:nth-child(4) div {
  margin-top: 6px;
}

/* .cutselectbox div:hover {
  background: rgba(107, 107, 107, 1);
} */
</style>