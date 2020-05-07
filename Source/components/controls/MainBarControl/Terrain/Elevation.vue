<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.kdfw}}:</label>

      <div class="XbsjSlider">
        <XbsjSlider
          :min="0"
          :max="10000"
          :step="10"
          showTip="always"
          :range="true"
          v-model="height"
          ref="XbsjSlider"
        ></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label">{{lang.sedai}}:</label>
      <XbsjRampSelect class="ramp" ref="ramp" @selected="selected"></XbsjRampSelect>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      height: [0, 10000],
      langs: {
        zh: {
          kdfw: "高度范围",
          sedai: "色带"
        },
        en: {
          kdfw: "H.Range",
          sedai: "Legend"
        }
      },
      lang: undefined
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.autorunDisposer = XE.MVVM.watch(() => {
        this.height[0] = this.$root.$earth.terrainEffect.elevation.minHeight;
        this.height[1] = this.$root.$earth.terrainEffect.elevation.maxHeight;

        this.$refs.XbsjSlider.currentValue = this.height;
      });
    });
  },
  methods: {
    format(v) {
      return v + "米";
    },
    selected(it) {
      // console.log(it.img);
      this.$root.$earth.terrainEffect.elevation.image = it.img;
    }
  },
  watch: {
    height(v) {
      //设置最大最小高度
      this.$root.$earth.terrainEffect.elevation.minHeight = v[0];
      this.$root.$earth.terrainEffect.elevation.maxHeight = v[1];
    }
  },
  beforeDestroy() {
    if (this.autorunDisposer) {
      this.autorunDisposer();
      this.autorunDisposer = undefined;
    }
  }
};
</script>
<style scoped>
.popup {
  width: 377px;
  height: 166px;
}
.label {
  display: inline-block;
  width: 56px;
  text-align: right;
}
.ramp {
  display: inline-block;
}
.row {
  margin-bottom: 10px;
  margin-top: 10px;
}
.XbsjSlider {
  padding-left: 4px;
  display: inline-block;
  width: 284px;
}
</style>

