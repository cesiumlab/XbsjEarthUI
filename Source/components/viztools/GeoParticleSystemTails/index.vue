<template>
  <Window
    :width="594"
    :minWidth="582"
    :height="608"
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
      <!-- 位置 -->
      <div class="flatten">
        <label>{{lang.position}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="model.position"></XbsjLngLatHeight>
        </div>
      </div>
      <!-- 角度 -->
      <div class="flatten">
        <label>{{lang.rotation}}</label>
        <div class="flatten-box">
          <XbsjHeadingPitchRoll v-model="model.rotation"></XbsjHeadingPitchRoll>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 创建 -->
        <div class="buttonGroup">
          <label class="xbsj-label"></label>
          <button
            class="attitudeEditCameraButton"
            @click="model.creating =!model.creating"
            :class="model.creating?'btncoloron':''"
          >{{lang.creating}}</button>
          <!-- 平移 -->
          <button
            class="attitudeEditCameraButton"
            @click="model.positionEditing =!model.positionEditing"
            :class="model.positionEditing?'btncoloron':''"
          >{{lang.positionEditing}}</button>
          <!-- 旋转 -->
          <button
            class="attitudeEditCameraButton"
            @click="model.rotationEditing =!model.rotationEditing"
            :class="model.rotationEditing?'btncoloron':''"
          >{{lang.rotationEditing}}</button>
        </div>
        <!-- 拖拽 -->
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
      <!-- 类型(分别看起来像彗星的彗尾和火箭的喷射) -->
      <div class="flatten-flex">
        <label>{{lang.type}}</label>
        <!-- 彗尾状 -->
        <div class="buttonGroup">
          <button class="attitudeEditCameraButton" @click="toBeCometTail">{{lang.comatosetail}}</button>
          <!-- 火焰喷射状 -->
          <button class="attitudeEditCameraButton" @click="toBeRocketThruster">{{lang.flamejet}}</button>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 发射速率(个/秒)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.emissionRate=30">{{lang.emissionRate}}</label>
          <div class="field">
            <XbsjSlider
              :min="10"
              :max="200"
              :step="1"
              showTip="always"
              v-model="model.emissionRate"
            ></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的尺寸(单位：pixel)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.particleSize=15">{{lang.particleSize}}</label>
          <div class="field">
            <XbsjSlider :min="5" :max="30" :step="1" showTip="always" v-model="model.particleSize"></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten-flex">
        <!-- 构成一圈的粒子数量(粒子发射器的总数)  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.particleNumber=100">{{lang.particleNumber}}</label>
          <div class="field">
            <XbsjSlider
              :min="10"
              :max="200"
              :step="1"
              showTip="always"
              v-model="model.particleNumber"
            ></XbsjSlider>
          </div>
        </div>
        <!-- 粒子的存在时间  -->
        <div class="flatten" style="margin-top:10px;">
          <label @click="model.particleLife=3.5">{{lang.particleLife}}</label>
          <div class="field">
            <XbsjSlider
              :min="1"
              :max="20"
              :step="0.1"
              showTip="always"
              v-model="model.particleLife"
            ></XbsjSlider>
          </div>
        </div>
      </div>
      <div class="flatten">
        <!-- 圆圈可能扩散到的最大半径(只有在自转ratate保持低速时才能看到最大半径)，单位m  -->
        <label>{{lang.radius}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model.number="model.radius"
          ></XbsjInputNumber>
        </div>
      </div>
      <div class="flatten">
        <!-- 粒子的存在时间过程中总共旋转经过的弧度  -->
        <label>{{lang.rotate}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            :step="0.01"
            v-model.number="model.rotate"
          ></XbsjInputNumber>
        </div>
        <!-- 粒子发射器竖直方向上移动的总距离，单位m  -->
        <label>{{lang.height}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model.number="model.height"
          ></XbsjInputNumber>
        </div>
      </div>
      <div>
        <label>{{lang.color}}</label>

        <div class="flatten-table">
          <table class="item-btn-box">
            <thead>
              <tr>
                <th>{{lang.order}}</th>
                <th>{{lang.color}}</th>
                <th class="header-add">
                  <button class="flatten-btn add" @click="add"></button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in colors" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <XbsjColorButton v-model="colors[index]"></XbsjColorButton>
                </td>
                <td>
                  <input type="button" class="flatten-btn del" @click="del(index)" />
                </td>
              </tr>
            </tbody>
          </table>
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
      drag_over: false,
      model: {
        name: "",
        show: false,
        creating: false,
        positionEditing: false,
        rotationEditing: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        emissionRate: 30,
        particleSize: 15,
        particleNumber: 100,
        radius: 30,
        particleLife: 0.8,
        rotate: 0.01,
        height: 50,
        colors: []
      },
      colors: [],
      pinstyletype: true,
      langs: languagejs,
      showTypeSelect: false,
      radiusdisabled: false,
      angledisabled: true
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
        positionEditing: "model.positionEditing",
        rotationEditing: "model.rotationEditing",
        position: "model.position",
        rotation: "model.rotation",
        emissionRate: "model.emissionRate",
        particleSize: "model.particleSize",
        particleNumber: "model.particleNumber",
        radius: "model.radius",
        particleLife: "model.particleLife",
        rotate: "model.rotate",
        height: "model.height"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });

      this._colorsUnbind = this._colorsUnbind && this._colorsUnbind();
      this._colorsUnbind = XE.MVVM.bind(this, "model.colors", czmObj, "colors");
      this.changeColors(this.model);
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
    colors: {
      handler(n, o) {
        var ccc = [];
        n.forEach(element => {
          let v = element.rgba;
          var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
          cc.forEach(value => {
            ccc.push(value);
          });
        });
        this._czmObj.colors = ccc;
      },
      deep: true // 可以深度检测到 colors 对象的属性值的变化
    }
  },
  methods: {
    toBeCometTail() {
      this._czmObj.toBeCometTail();
      this.$nextTick(() => {
        (this.model.colors = []), (this.colors = []);
        this._colorsUnbind = this._colorsUnbind && this._colorsUnbind();
        this._colorsUnbind = XE.MVVM.bind(
          this,
          "model.colors",
          this._czmObj,
          "colors"
        );
        this.changeColors(this.model);
      });
    },
    toBeRocketThruster() {
      this._czmObj.toBeRocketThruster();
      this.$nextTick(() => {
        (this.model.colors = []), (this.colors = []);
        this._colorsUnbind = this._colorsUnbind && this._colorsUnbind();
        this._colorsUnbind = XE.MVVM.bind(
          this,
          "model.colors",
          this._czmObj,
          "colors"
        );
        this.changeColors(this.model);
      });
    },
    changeColors(model) {
      for (var i = 0, l = model.colors.length; i < l; i += 4) {
        this.colors.push({
          rgba: {
            r: model.colors[i] * 255,
            g: model.colors[i + 1] * 255,
            b: model.colors[i + 2] * 255,
            a: model.colors[i + 3]
          }
        });
      }
    },
    add() {
      this.colors.push({ rgba: { r: 255, g: 255, b: 255, a: 1 } });
    },
    del(index) {
      //弹出提示
      this.$root.$earthUI.confirm("确认删除该颜色?", () => {
        this.colors.splice(index, 1);
      });
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
  width: 182px;
  margin-top: 12px;
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
  width: calc(100% - 92px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 84px;
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
.dragBox {
  display: inline-block;
}
.dragBox .dragButton {
  width: 120px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
}
.dragBox .dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>
