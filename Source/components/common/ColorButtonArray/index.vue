<template>
  <div class="xbsj-color">
    <button @click="colorOk" ref="bgColor"></button>
  </div>
</template>
<script>
export default {
  model: {
    prop: "color",
    event: "colorChanged"
  },
  props: {
    color: {
      type: Array,
      default() {
        return [1, 1, 1, 1];
      }
    }
  },
  data() {
    return {
      pickerShow: false
    };
  },
  created() {},
  mounted() {
    var color = this.rgbaStr(this.color);
    this.$refs.bgColor.style.backgroundColor = color;
  },
  methods: {
    changeColor(c) {
      var rgba = c.rgba;

      this.$emit("colorChanged", [
        rgba.r / 255,
        rgba.g / 255,
        rgba.b / 255,
        rgba.a
      ]);
    },
    colorOk() {
      var cp = this.$root.$refs.mainUI.$refs.colorPicker;
      //满足一条都显示
      //cp没有显示 或者 cp绑定的按钮不是自己  或者 当前没有选择
      if (!cp.show || cp.binded !== this) {
        cp.pop(this.rgbaStr(this.color), v => {
          this.changeColor(v);
        });

        cp.binded = this;
      } else {
        cp.hide();
      }
    },
    rgbaStr(c) {
      if (!c ||  c.length != 4) return "rgba(255,255,255,1)";

      return (
        "rgba(" +
        Math.floor(c[0] * 255) +
        "," +
        Math.floor(c[1] * 255) +
        "," +
        Math.floor(c[2] * 255) +
        "," +
        c[3] +
        ")"
      );
    }
  },
  watch: {
    color(v) {
      if (!v) return;
      var color = this.rgbaStr(v);
      this.$refs.bgColor.style.backgroundColor = color;
    }
  }
};
</script>
<style scoped>
.xbsj-color button {
  width: 34px;
  height: 34px;
  border: none;
  outline: none;
  position: relative;
  border: 1px solid #ffffff;
}
</style>
