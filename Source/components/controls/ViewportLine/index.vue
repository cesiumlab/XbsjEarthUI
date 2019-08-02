<template>
  <div class="container">
    <!-- 分屏 -->
    <div class="vertical" ref="vertical" v-show="vShow" :style="vLeft" @mousedown="moveV"></div>
    <div class="transverse" ref="transverse" v-show="hShow" :style="hTop" @mousedown="moveH"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      splitX: 0,
      splitY: 0
    };
  },
  mounted() {
    this._unbinds = [];
    this._unbinds.push(
      XE.MVVM.bind(
        this,
        "splitX",
        this.$root.$earth.camera.viewport,
        "splitX"
      )
    );
    this._unbinds.push(
      XE.MVVM.bind(
        this,
        "splitY",
        this.$root.$earth.camera.viewport,
        "splitY"
      )
    );
  },
  beforeDestroy() {
    this._unbinds.forEach(e => e());
    this._unbinds.length = 0;
  },
  computed: {
    hShow() {
      return this.splitY > 0 && this.splitY < 1;
    },
    vShow() {
      return this.splitX > 0 && this.splitX < 1;
    },
    hTop() {
      let top = (this.splitY * 100).toFixed(4) + "%";
      return { top };
    },
    vLeft() {
      let left = (this.splitX * 100).toFixed(4) + "%";
      return { left };
    }
  },
  methods: {
    moveV() {
      let self = this;
      let vertical = this.$refs.vertical;
      let canvasbox = this.$root.$earth.czm.viewer.canvas;
      function move(e) {
        e.preventDefault();

        self.splitX = e.offsetX / canvasbox.width;
      }
      function up() {
        canvasbox.removeEventListener("mousemove", move, false);
        document.removeEventListener("mouseup", up, false);
      }
      document.addEventListener("mouseup", up, false);
      canvasbox.addEventListener("mousemove", move, false);
    },
    moveH() {
      let self = this;
      let transverse = this.$refs.transverse;
      let canvasbox = this.$root.$earth.czm.viewer.canvas;
      function move(e) {
        e.preventDefault();
        self.splitY = e.offsetY / canvasbox.height;
      }
      function up() {
        canvasbox.removeEventListener("mousemove", move, false);
        document.removeEventListener("mouseup", up, false);
      }
      document.addEventListener("mouseup", up, false);
      canvasbox.addEventListener("mousemove", move, false);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.vertical {
  width: 4px;
  height: 100%;
  background: #8f8f8f;
  position: absolute;
  left: 50%;
  margin-left: -2px;
  cursor: w-resize;
  pointer-events: all;
}
.transverse {
  width: 100%;
  height: 4px;
  background: #8f8f8f;
  position: absolute;
  top: 50%;
  margin-top: -2px;
  cursor: s-resize;
  pointer-events: all;
}
</style>