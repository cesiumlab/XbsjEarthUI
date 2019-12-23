<template>
  <Window
    :width="445"
    :minWidth="200"
    :height="472"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="false"
  >
    <div class="xbsj-videoAttribute">
      <div class="attributeName">
        <label class="xbsj-label">{{lang.name}}</label>
        <input type="text" v-model="attribute.name" />
      </div>
      <!-- <div class="attributePlay">
        <label class="xbsj-label">{{languagedata.playcontrol}}</label>
        <button v-show="playShow" class="playButton" @click="playClick"></button>
        <button v-show="suspendShow" class="suspendButton" @click="suspendClick"></button>
      </div>
      <div class="attributePath">
        <label class="xbsj-label">{{lang.videopath}}</label>
        <input type="text" />
      </div>-->
      <div class="attributeLocation">
        <label class="xbsj-label">{{lang.position}}</label>

        <XbsjLngLatHeight v-model="attribute.position"></XbsjLngLatHeight>
      </div>
      <div class="attributeAttitude">
        <label class="xbsj-label">{{lang.attitude}}</label>

        <XbsjHeadingPitchRoll v-model="attribute.rotation"></XbsjHeadingPitchRoll>
      </div>
      <div class="attitudeEdit">
        <label class="xbsj-label">{{lang.attitudeedit}}</label>
        <div class="buttonGroup">
          <div>
            <button
              class="attitudeEditCameraButton"
              :class="cameraShow ? 'attitudeEditCameraButtonActive' : ''"
              @click="cameraClick"
            >{{lang.camera}}</button>
          </div>
          <div>
            <button
              class="attitudeEditMouseButton"
              :class="mouseShow ? 'attitudeEditMouseButtonActive' : ''"
              @click="mouseClick"
            >{{lang.mouse}}</button>
          </div>
          <div>
            <button
              class="attitudeEditRotationButton"
              :class="positionEditing ? 'attitudeEditRotationButtonActive' : ''"
              @click="positionClick"
            >{{lang.move}}</button>
          </div>

          <div>
            <button
              class="attitudeEditRotationButton"
              :class="rotationEditing ? 'attitudeEditRotationButtonActive' : ''"
              @click="rotationClick"
            >{{lang.rotation}}</button>
          </div>
        </div>
      </div>
      <div>
        <label class="xbsj-label">{{lang.adjudication}}</label>
        <div class="xbsj-slide-divs">
          <XbsjSlider :min="1" :max="1000" :step="0.1" v-model="attribute.nearFar" range></XbsjSlider>
        </div>
      </div>
      <div>
        <label class="xbsj-label">{{lang.horizonangle}}</label>
        <div class="xbsj-slide-divs">
          <XbsjSlider :min="1" :max="179" :step="1" v-model="attribute.fovH" :show-tip="showTip"></XbsjSlider>
          <span class="xbsj-rangespan">{{attribute.fovH}}</span>
        </div>
      </div>
      <div>
        <label class="xbsj-label">{{lang.verticalangle}}</label>
        <div class="xbsj-slide-divs">
          <XbsjSlider :min="1" :max="179" :step="1" v-model="attribute.fovV" :show-tip="showTip"></XbsjSlider>
          <span class="xbsj-rangespan">{{attribute.fovV}}</span>
        </div>
      </div>
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
      horizonangleValue: 80,
      verticalangleValue: 80,
      adjudicationValue: [2000, 5000],
      playShow: true,
      suspendShow: false,
      cameraShow: false,
      mouseShow: false,
      positionEditing: false,
      rotationEditing: false,
      attribute: {
        name: "",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        fovH: 0,
        fovV: 0,
        nearFar: [0, 0],
        show: true
      },
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
        show: "attribute.show",
        position: "attribute.position",
        rotation: "attribute.rotation",
        far: "attribute.nearFar.1",
        near: "attribute.nearFar.0",
        // showHelper: "attribute.showHelper",
        // videoUrl: "attribute.videoUrl",
        fovH: {
          prop: "attribute.fovH",
          handler: XE.MVVM.bindDegreeRadian
        },
        fovV: {
          prop: "attribute.fovV",
          handler: XE.MVVM.bindDegreeRadian
        },
        twoPostionsEditing: "mouseShow",
        positionEditing: "positionEditing",
        rotationEditing: "rotationEditing"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
      this.attribute.nearFar[0] = 1;
    }
  },
  methods: {
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
    },
    playClick() {
      this.playShow = false;
      this.suspendShow = true;
      // console.log("open");
    },
    suspendClick() {
      this.playShow = true;
      this.suspendShow = false;
      // console.log("close");
    },
    cameraClick() {
      // this.cameraShow = !this.cameraShow;
      this._czmObj && this._czmObj.setPositionWithCurrentCamera();
    },
    mouseClick() {
      this.mouseShow = !this.mouseShow;
    },
    rotationClick() {
      this.rotationEditing = !this.rotationEditing;
    },
    positionClick() {
      this.positionEditing = !this.positionEditing;
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
    }
  },
  beforeDestroy() {
    // 解绑数据关联
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
</style>
