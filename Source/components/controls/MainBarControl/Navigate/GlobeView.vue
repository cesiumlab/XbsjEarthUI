<template>
  <div class="xbsj-mainbar-popup popup">
    <div>
      <button @click="reset">{{lang.default}}</button>
      <button @click="current">{{lang.curcamera}}</button>
    </div>
    <div>
      <label class="xbsj-label">{{lang.flytime}}</label>

      <!-- <input type="text" v-model.number="duration" /> -->
      <div class="xbsj-slide-box">
        <XbsjSlider :min="0" :max="10" :step="0.1" showTip="always" v-model="duration"></XbsjSlider>
      </div>
    </div>

    <div>
      <label class="xbsj-label">{{lang.position}}</label>
      <div class="value">
        <XbsjLngLatHeight v-model="position"></XbsjLngLatHeight>
      </div>
    </div>

    <div>
      <label class="xbsj-label">{{lang.rotation}}</label>
      <div class="value">
        <XbsjHeadingPitchRoll v-model="rotation"></XbsjHeadingPitchRoll>
      </div>
    </div>
  </div>
</template>
<script>
import languagejs from "./CameraView_locale.js";
export default {
  data() {
    return {
      duration: 0.5,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      lang: {},
      langs: languagejs
    };
  },
  created() {},
  mounted() {
    //直接绑定
    this.bind("duration");
    this.bind("position");
    this.bind("rotation");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.cameraViewManager.globe, prp)
      );
    },
    reset() {
      let cvm = this.$root.$earth.cameraViewManager;
      cvm.defaultGlobe();
    },
    current() {
      let cvm = this.$root.$earth.cameraViewManager;
      cvm.globe.initWithCurrent(this.$root.$earth._scene);
    },
    show(v) {}
  },
  watch: {},
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>
<style scoped>
.popup {
  width: 312px;
  height: 185px;
}
.popup button {
  height: 28px;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  margin-bottom: 10px;
  width: 70px;
  border-radius: 5px;
  cursor: pointer;
}
.popup .value {
  margin-left: 40px;
  /* width: calc(100% - 50px); */
  margin-top: 10px;
}
.popup input[type="text"] {
  width: 220px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding-left: 5px;
  margin-left: 20px;
  border-radius: 3px;
  outline: none;
}
.popup .xbsj-label {
  display: inline-block;
  width: 54px;
  text-align: right;
  float: left;
  height: 28px;
  line-height: 24px;
}
.popup div:nth-child(3) {
  position: relative;
  margin-top: 10px;
}
/* .popup div:nth-child(3) label {
  position: absolute;
  top: 0;
  margin-right: 20px;
} */
.popup div:nth-child(3) textarea {
  width: 218px;
  height: 76px;
  position: absolute;
  left: 54px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding: 5px;
}
.popup div:nth-child(3) button {
  position: absolute;
  right: 0;
}
.xbsj-slide-box {
  display: inline-block;
  width: 242px;
  padding-top: 6px;
  vertical-align: middle;
  margin-left: 2px;
}
</style>

