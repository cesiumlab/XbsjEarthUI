<template>
  <div class="xbsj-mainbar-popup popup">
    <div>
      <label class="xbsj-label">{{lang.angle}}</label>
      <input type="text" v-model.number="pitch">
      <label>°</label>
      <button @click="currentPitch">{{lang.current}}</button>
    </div>

    <div>
      <label class="xbsj-label">{{lang.distance}}</label>
      <input type="text" v-model.number="range">
      <label>{{lang.mi}}</label>
      <button @click="currentRange">{{lang.current}}</button>
    </div>

    <div>
      <label class="xbsj-label">{{lang.rotate}}</label>
      <input type="text" v-model.number="cycle">
      <label>{{lang.miao}}</label>
    </div>
  </div>
</template>
<script>
import languagejs from "./RotateCenter_locale.js";
export default {
  data() {
    return {
      pitch: 0,
      range: 0,
      cycle: 0,
      lang: {},
      langs:languagejs
    };
  },
  created() {
    
  },
  mounted() {
     
    this._rotate = this.$root.$earth.cameraFlight.rotateCenter;
    XE.MVVM.watch(()=>{
      var t =  this.$root.$earth.cameraFlight.rotateCenter;
      this.update(t);
    });

    //绑定
    this.update();
  },
  methods: {
    currentPitch() {
      const p = this.$root.$earth.czm.viewer.camera.pitch;
      //计算当前相机相对
      this._rotate.pitch = p;
    },
    currentRange() {
      //相机距离中心点距离
      const camera = this.$root.$earth.czm.viewer.camera;
      const scene = this.$root.$earth.czm.viewer.scene;
      var ray = camera.getPickRay(
        new Cesium.Cartesian2(
          scene.canvas.width * 0.5,
          scene.canvas.height * 0.5
        )
      );
      //获取屏幕中心点，如果获取不到，不进行飞行
      var position = scene.globe.pick(ray, scene);
      if (!position) return;

      this._rotate.range = Cesium.Cartesian3.distance(
        position,
        camera.positionWC
      );
    },
    update() {
      this.pitch = Cesium.Math.toDegrees(this._rotate.pitch);
      this.range = this._rotate.range;
      this.cycle = this._rotate.cycle;
    }
  },
  watch: {
    pitch(v) {
      this._rotate.pitch = Cesium.Math.toRadians(v);
    },
    range(v) {
      this._rotate.range = v;
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