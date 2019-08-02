<template>
  <div class="xbsj-mainbar-popup popup">
    <div>
      <label class="xbsj-label">{{lang.weidu}}</label>
      <input type="text" v-model.number="latitude">
      <label>°</label>
      <button @click="currentLatitude">{{lang.current}}</button>
    </div>

    <div>
      <label class="xbsj-label">{{lang.height}}</label>
      <input type="text" v-model.number="height">
      <label>{{lang.mi}}</label>
      <button @click="currentHeight">{{lang.current}}</button>
    </div>

    <div>
      <label class="xbsj-label">{{lang.rotate}}</label>
      <input type="text" v-model.number="cycle">
      <label>{{lang.miao}}</label>
    </div>
  </div>
</template>
<script>
import languagejs from "./RotateGlobe_locale.js";
export default {
  data() {
    return {
      latitude: 0,
      height: 0,
      cycle: 0,
      lang: {},
      langs:languagejs
    };
  },
  created() {
    
  },
  mounted() {
    
    this._rotate = this.$root.$earth.cameraFlight.rotateGlobe;
    XE.MVVM.watch(()=>{
      var t =  this.$root.$earth.cameraFlight.rotateGlobe;
      this.update(t);
    });

    //绑定
    this.update();
  },
  methods: {
    currentLatitude() {
      const p = this.$root.$earth.czm.viewer.camera.positionCartographic;
      this._rotate.latitude = p.latitude;
    },
    currentHeight() {
      const p = this.$root.$earth.czm.viewer.camera.positionCartographic;
      this._rotate.height = p.height;
    },
    update() {
      this.latitude = Cesium.Math.toDegrees(this._rotate.latitude);
      this.height = this._rotate.height;
      this.cycle = this._rotate.cycle;
    }
  },
  watch: {
    latitude(v) {
      this._rotate.latitude = Cesium.Math.toRadians(v);
    },
    height(v) {
      this._rotate.height = v;
    },
    cycle(v) {
      this._rotate.cycle = v;
    }
  }
};
</script>
<style scoped>
.popup {
  width: 365px;
  height: 160px; 
}
.xbsj-label {
  display: inline-block;
  width: 54px;
  text-align: right;
}
label {
  display: inline-block;
  width: 14px;
  text-align: center;
}
div {
  margin-bottom: 5px;
}
.popup input[type="text"] {
  width: 180px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding-left: 5px;
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
</style>