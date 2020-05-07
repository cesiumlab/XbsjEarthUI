<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="brightnessShift=0">{{lang.ldpy}}:</label>
      <div class="field">
        <XbsjSlider :min="-1" :max="1" :step="0.01" showTip="always" v-model="brightnessShift"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="hueShift=0">{{lang.sdpy}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="1" :step="0.01" showTip="always" v-model="hueShift"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="saturationShift=0">{{lang.bhdpy}}:</label>
      <div class="field">
        <XbsjSlider :min="-1" :max="1" :step="0.01" showTip="always" v-model="saturationShift"></XbsjSlider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          ldpy: "亮度偏移",
          sdpy: "色调偏移",
          bhdpy: "饱和度偏移"
        },
        en: {
          ldpy: "Bri",
          sdpy: "Hue",
          bhdpy: "Sat"
        }
      },
      lang: undefined,
      brightnessShift: 0,
      hueShift: 0,
      saturationShift: 0
    };
  },
  created() {},
  mounted() {
    this.bind("brightnessShift");
    this.bind("hueShift");
    this.bind("saturationShift");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.atmosphere, prp)
      );
    }
  },
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>

<style scoped>
.popup {
  width: 326px;
  min-height: 100px;
}

.label {
  display: inline-block;
  width: 64px;
  text-align: right;
  margin-right: 5px;
  vertical-align: middle;
  line-height: 29px;
}
.row {
  margin-top: 10px;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 220px;
  vertical-align: middle;
}
</style>