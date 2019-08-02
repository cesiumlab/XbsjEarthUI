<template>
  <div class="container" v-show="show" :style="position">
    <ColorPicker
      ref="colorPicker"
      :sucker-hide="true"
      color="rgba(255,0,0,1)"
      @changeColor="changeColor"
    ></ColorPicker>
  </div>
</template>
<script>
import ColorPicker from "../ColorPicker";
import {addOutterEventListener} from "../../utils/xbsjUtil"

export default {
  components: {
    ColorPicker
  },
  data() {
    return {
      show: false,
      cursor: {
        x: 0,
        y: 0
      },
      position: "left:0px;top:0px;"
    };
  },
  mounted() {
    //全局监控鼠标位置

    let container = this.$root.$refs.mainUI.$el;
    //监控鼠标位置
    document.body.addEventListener("mousemove", event => {
      let left = container.offsetLeft;
      let top = container.offsetTop;

      this.cursor = {
        x: event.clientX - left,
        y: event.clientY - top
      };
    });

    //如果有外部鼠标点击，隐藏
    addOutterEventListener(this.$el, 'mousedown',()=>{
      this.hide();
    });

  },
  methods: {
    hide() {
      this.show = false;
      this._cb = undefined;
    },
    pop(color, cb, x, y) {
      //设置颜色
      if (color) this.$refs.colorPicker.selectColor(color);

      this._cb = cb;
      this.show = true;

      if (x == undefined) x = this.cursor.x;
      if (y == undefined) y = this.cursor.y;
      this.position = `left:${x}px; top:${y}px;`;
    },
    changeColor(v) {
      if (this._cb) {
        this._cb(v);
      }
    }
  }
};
</script>
<style scoped>
.container {
  position: absolute;
  width: 200px;
  height: 320px;
  padding: 1px;
  z-index: 10003;
}
</style>


