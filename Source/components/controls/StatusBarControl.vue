<template>
  <div
    v-show="show"
    style="width: 100%; height: 30px;background: rgba(71, 71, 71, 0.8); position: absolute; bottom: 0; font-size: 14px;line-height:30px;z-index:9999;"
  >{{ statusString }}</div>
</template>

<script>
export default {
  data: function() {
    return {
      show: true,
      cameraString: "",
      fpsString: "",
      langs: {
        zh: {
          longitude: "经度",
          latitude: "纬度",
          height: "高度",
          fps: "帧率",
          heading: "偏航角",
          pitch: "俯仰角",
          roll: "翻滚角",
          meter:'米'
        },
        en: {
          longitude: "LNG",
          latitude: "LAT",
          height: "HEIGHT",
          fps: " FRAME RATE",
          heading: "HEADING",
          pitch: "PITCH",
          roll: "ROLL",
          meter:' M'
        }
      },
      lang: undefined
    };
  },
  created() {
    
  },
  mounted() {
    this._scene = this.$root.$earth.czm.scene;
    this._camera = this.$root.$earth.czm.camera;

    const td = Cesium.Math.toDegrees;

    const updateCameraString = () => {
      const camera = this._camera;

      var l = td(camera.positionCartographic.longitude).toFixed(5);
      var b = td(camera.positionCartographic.latitude).toFixed(5);
      var h = camera.positionCartographic.height.toFixed(2);
      var y = camera.heading.toFixed(2);
      var p = camera.pitch.toFixed(2);
      var r = camera.roll.toFixed(2);

      this.cameraString = `${this.lang.longitude}: ${l}° ${this.lang.latitude}: ${b}° ${this.lang.height}: ${h}${this.lang.meter} ${this.lang.heading}: ${y}° ${this.lang.pitch}: ${p}° ${this.lang.roll}: ${r}°`;
    };

    this._cameraChangedListenerDisposer = this._camera.changed.addEventListener(
      updateCameraString
    );
    updateCameraString();

    // 帧率的计算借助了Cesium中的东西，需要开启debugShowFramesPerSecond
    this._scene.debugShowFramesPerSecond = true;
    const tempDisposer = this._scene._postRender.addEventListener(() => {
      tempDisposer();
      this._scene._performanceContainer.style.visibility = "hidden"; // 隐藏默认的帧率显示窗口
    });

    this._scenePostRenderListenerDisposer = this._scene._postRender.addEventListener(
      () => {
        if (this._scene._performanceDisplay) {
          this.fpsString = `${this.lang.fps}: ${this._scene._performanceDisplay._fpsText.nodeValue} `;
        } else {
          this.fpsString = "";
        }
      }
    );
  },
  computed: {
    statusString() {
      return this.fpsString + this.cameraString;
    }
  },
  beforeDestroy() {
    this._cameraChangedListenerDisposer =
      this._cameraChangedListenerDisposer &&
      this._cameraChangedListenerDisposer();
    this.this._scenePostRenderListenerDisposer =
      this.this._scenePostRenderListenerDisposer &&
      this.this._scenePostRenderListenerDisposer();
  }
};
</script>

<style>
</style>
