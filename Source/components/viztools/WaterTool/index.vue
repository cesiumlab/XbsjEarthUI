<template>
  <Window
    :width="445"
    :minWidth="445"
    :height="416"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
  >
    <div class="xbsj-videoAttribute" ref="water">
      <!-- 名称 -->
      <div class="attributeName">
        <label class="xbsj-label">{{lang.name}}</label>
        <input type="text" v-model="attribute.name" />
      </div>
      <!-- 编辑按钮 -->
      <div class="attitudeEdit">
        <label class="xbsj-label"></label>
        <div class="buttonGroup">
          <div>
            <button
              class="creatingButton"
              :class="attribute.creating ? 'creatingButtonActive' : ''"
              @click="attribute.creating =!attribute.creating"
            >{{lang.creating}}</button>
          </div>
          <div>
            <button
              class="creatingButton"
              :class="attribute.editing ? 'creatingButtonActive' : ''"
              @click="attribute.editing =!attribute.editing"
            >{{lang.editing}}</button>
          </div>
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

      <div class="attributeLocation">
        <!-- 水面显隐 -->
        <label class="showlabel">{{lang.show}}</label>
        <XbsjSwitch v-model="attribute.show"></XbsjSwitch>
        <!-- 边框显隐 -->
        <label class="showlabel">{{lang.outlineshow}}</label>
        <XbsjSwitch v-model="outline.show"></XbsjSwitch>
        <!-- 是否贴地 -->
        <label class="showlabel">{{lang.ground}}</label>
        <XbsjSwitch v-model="attribute.ground"></XbsjSwitch>
      </div>
      <!-- 边框宽度 -->
      <div>
        <label class="xbsj-label">{{lang.outlinewidth}}</label>
        <div class="xbsj-slide-divs">
          <XbsjSlider :min="0" :max="100" :step="1" v-model="outline.width" :show-tip="showTip"></XbsjSlider>
          <span class="xbsj-rangespan">{{outline.width}}</span>
        </div>
      </div>

      <div style="display: flex; margin-bottom: 14px;">
        <!-- 边框颜色 -->
        <label class="xbsj-label" style="margin-right: 20px;">{{lang.outlinecolor}}</label>
        <XbsjColorButton v-model="outlineColorUI" ref="outlineColor"></XbsjColorButton>
        <!-- 基本颜色 -->
        <label class="xbsj-label" style="margin-right: 20px; margin-left: 42px;">{{lang.basecolor}}</label>
        <XbsjColorButton v-model="baseColorUI" ref="baseColor"></XbsjColorButton>
        <!-- 融合颜色 -->
        <label class="xbsj-label" style="margin-right: 20px; margin-left: 42px;">{{lang.blendcolor}}</label>
        <XbsjColorButton v-model="blendColorUI" ref="blendColor"></XbsjColorButton>
      </div>

      <div class="movebox">
        <!-- 水面频率 -->
        <label class="movespan">{{lang.frequency}}</label>
        <input type="text" v-model="attribute.frequency" />
        <!-- 动画速度 -->
        <label class="movespan">{{lang.animationspeed}}</label>
        <input type="text" v-model="attribute.animationSpeed" />
        <!-- 水面振幅 -->
        <label class="movespan">{{lang.amplitude}}</label>
        <input type="text" v-model="attribute.amplitude" />
        <!-- 水面强度 -->
        <label class="movespan">{{lang.specularintensity}}</label>
        <input type="text" v-model="attribute.specularIntensity" />
        <!-- 水平方向速度 -->
        <label class="movespan">{{lang.horizontalspeed}}</label>
        <input type="text" v-model="attribute.velocity[0]" />
        <!-- 垂直方向速度 -->
        <label class="movespan">{{lang.verticalspeed}}</label>
        <input type="text" v-model="attribute.velocity[1]" />
      </div>

      <!-- <div class="attributeName">
        <label class="xbsj-label">{{lang.animationspeed}}</label>
        <input type="text" v-model="attribute.animationSpeed" />
      </div>-->

      <!-- <div class="attributeName">
        <label class="xbsj-label">{{lang.amplitude}}</label>
        <input type="text" v-model="attribute.amplitude" />
      </div>-->

      <!-- <div class="attributeName">
        <label class="xbsj-label">{{lang.specularintensity}}</label>
        <input type="text" v-model="attribute.specularIntensity" />
      </div>-->

      <!-- <div class="attributeName">
        <label class="xbsj-label">{{lang.horizontalspeed}}</label>
        <input type="text" v-model="attribute.velocity[0]" />
      </div>-->

      <!-- <div class="attributeName">
        <label class="xbsj-label">{{lang.verticalspeed}}</label>
        <input type="text" v-model="attribute.velocity[1]" />
      </div>-->
    </div>
  </Window>
</template>
<script>
import languagejs from "./index_locale";
export default {
  props: {
    getBind: Function
  },

  data() {
    return {
      showTip: "never",
      drag_over: false,
      attribute: {
        name: "",
        creating: false,
        editing: false,
        show: true,
        ground: false,
        frequency: 0,
        animationSpeed: 0,
        amplitude: 0,
        specularIntensity: 0,
        velocity: [],
        arrlist: []
      },
      outline: {},
      outlineColorUI: {
        rgba: {
          r: 0,
          g: 255,
          b: 0,
          a: 1
        }
      },
      outlineColor: [0, 1, 0, 1],
      baseColorUI: {
        rgba: {
          r: 51,
          g: 77,
          b: 153,
          a: 1
        }
      },
      baseColor: [0.2, 0.3, 0.6, 1],
      blendColorUI: {
        rgba: {
          r: 128,
          g: 128,
          b: 128,
          a: 0.7
        }
      },
      blendColor: [0.5, 0.5, 0.5, 0.7],
      lang: {},
      langs: languagejs
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
        creating: "attribute.creating",
        editing: "attribute.editing",
        show: "attribute.show",
        outline: "outline",
        ground: "attribute.ground",
        frequency: "attribute.frequency",
        animationSpeed: "attribute.animationSpeed",
        amplitude: "attribute.amplitude",
        specularIntensity: "attribute.specularIntensity",
        velocity: "attribute.velocity"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
      this._disposers.push(
        XE.MVVM.bind(this, "outlineColor", czmObj, "outline.color")
      );
      this._disposers.push(
        XE.MVVM.bind(this, "baseColor", czmObj, "baseWaterColor")
      );
      this._disposers.push(
        XE.MVVM.bind(this, "blendColor", czmObj, "blendColor")
      );
    }

    // let water = this.$refs.water;
    // function handleDragOver(e) {
    //   e.stopPropagation();
    //   e.preventDefault();
    // }

    // var that = this;
    // function handleFileSelect(e) {
    //   e.stopPropagation();
    //   e.preventDefault();
    //   that._czmObj.creating = false;
    //   that._czmObj.edit = true;

    //   let obj = e.dataTransfer.getData("obj");
    //   console.log(obj);
    //   let arr = [];
    //   arr = JSON.parse(obj).positions;
    //   console.log(arr);
    //   for (var j = 0; j < arr.length; j++) {
    //     arr[j].pop();
    //   }
    //   arr = arr.toString().split(",");
    //   arr = arr.map(function(el) {
    //     return +el;
    //   });
    //   that._czmObj.positions = arr;
    //   that._czmObj.flyTo();
    // }

    // water.addEventListener("dragover", handleDragOver, false);
    // water.addEventListener("drop", handleFileSelect, false);
  },
  methods: {
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
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      // console.log("取消！");
      const viewshed = this._czmObj;
      if (!viewshed) {
        return;
      }
      viewshed.positionEditing = false;
      viewshed.twoPostionsEditing = false;
      if (viewshed.isCreating) {
        viewshed.isCreating = false;
        viewshed.destroy();
      }
    },
    ok() {
      this.close();

      const viewshed = this._czmObj;
      viewshed.editing = false;
      if (!viewshed) {
        return;
      }
      viewshed.positionEditing = false;
      viewshed.twoPostionsEditing = false;
      if (viewshed.isCreating) {
        viewshed.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(viewshed);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    }
  },
  computed: {
    name() {
      return this.attribute.name;
    }
  },
  watch: {
    // name(oldval, newval) {
    //   this.csn && (this.csn.title = this.attribute.name);
    // }
    name(oldval, newval) {
      var sn = this.getBind();
      sn.title = this.attribute.name;
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
    },
    baseColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.baseColor.every((c, index) => c === cc[index])) {
        this.baseColor = cc;
      }
    },
    baseColor(c) {
      this.baseColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    },
    blendColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.blendColor.every((c, index) => c === cc[index])) {
        this.blendColor = cc;
      }
    },
    blendColor(c) {
      this.blendColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
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
.xbsj-videoAttribute > div {
  /* width: 340px; */
  height: 28px;
  margin-top: 10px;
}
.xbsj-videoAttribute .xbsj-label {
  float: left;
  width: 52px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  /* margin-right: 15px; */
}
.xbsj-videoAttribute .attributeName input,
.xbsj-videoAttribute .attributePath input {
  width: calc(100% - 115px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 20px;
}
.xbsj-videoAttribute .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.xbsj-videoAttribute .attributePlay .playButton {
  background: url(../../../images/play.png) no-repeat;
  background-size: contain;
  margin-left: 20px;
}
.xbsj-videoAttribute .attributePlay .suspendButton {
  background: url(../../../images/suspend.png) no-repeat;
  background-size: contain;
  position: relative;
  left: -15px;
}
.xbsj-videoAttribute .attributeLocation input,
.xbsj-videoAttribute .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 8px;
  padding-right: 8px;
  margin-right: 6px;
}
.xbsj-videoAttribute .attitudeEdit {
  /* width: 300px; */
  height: 28px;
  display: flex;
}
.creatingButton {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  outline: none;
  color: #dddddd;
}
.creatingButton:hover {
  color: #1fffff;
}
.creatingButtonActive {
  color: #1fffff;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditCameraButton {
  display: inline-block;
  width: 76px;
  height: 18px;
  background: url(../../../images/camera.png) no-repeat;
  background-size: contain;
  margin-top: 3px;
  margin-left: 8px;
  border: none;
  cursor: pointer;
  position: relative;
  outline: none;
  color: #dddddd;
}
.xbsj-videoAttribute .attitudeEdit .cameraTooltip,
.xbsj-videoAttribute .attitudeEdit .mouseTooltip,
.xbsj-videoAttribute .attitudeEdit .rotationTooltip {
  visibility: hidden;
  width: 120px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: -45px;
  top: -33px;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditCameraButton:hover {
  background: url(../../../images/camera_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditCameraButtonActive {
  background: url(../../../images/camera_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute
  .attitudeEdit
  .attitudeEditCameraButton:hover
  .cameraTooltip {
  visibility: visible;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditMouseButton {
  display: inline-block;
  position: relative;
  width: 66px;
  height: 18px;
  background: url(../../../images/mousepick.png) no-repeat;
  background-size: contain;
  margin-top: 3px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
  outline: none;
  color: #dddddd;
}
.xbsj-videoAttribute .attitudeEdit .mouseTooltip {
  left: -45px;
  top: -50px;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditMouseButton:hover {
  background: url(../../../images/mousepick_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditMouseButtonActive {
  background: url(../../../images/mousepick_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute
  .attitudeEdit
  .attitudeEditMouseButton:hover
  .mouseTooltip {
  visibility: visible;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditRotationButton {
  display: inline-block;
  position: relative;
  width: 70px;
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
.xbsj-videoAttribute .attitudeEdit .rotationTooltip {
  left: -45px;
  top: -35px;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditRotationButton:hover {
  background: url(../../../images/offsetrotation_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute .attitudeEdit .attitudeEditRotationButtonActive {
  background: url(../../../images/offsetrotation_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.xbsj-videoAttribute
  .attitudeEdit
  .attitudeEditRotationButton:hover
  .rotationTooltip {
  visibility: visible;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.xbsj-videoAttribute .progress {
  background: rgba(31, 255, 255, 0.6);
  position: relative;
  left: 60px;
  top: 17px;
  z-index: 1;
  left: 75px;
}
.xbsj-videoAttribute .xbsj-slide-div {
  width: 169px;
  height: 4px;
}
.xbsj-videoAttribute .xbsj-rangespan {
  position: absolute;
  bottom: -6px;
  right: -23px;
}
.xbsj-slide-divs {
  width: calc(100% - 132px);
  position: relative;
  left: 88px;
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
.buttonGroup div:nth-child(1) {
  margin-left: 20px;
}
.showlabel {
  margin-right: 20px;
  width: 52px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 12px;
  vertical-align: text-bottom;
}
.movespan {
  margin-left: 12px;
}
.movebox input {
  width: calc(50% - 108px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 18px;
  margin-bottom: 10px;
}
.dragButton {
  display: inline-block;
  width: 120px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
  margin-left: 20px;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>
