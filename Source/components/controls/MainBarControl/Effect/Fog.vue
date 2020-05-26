<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="density=2.0e-4">{{lang.midu}}:</label>
      <div class="field">
        <XbsjSlider :min="2.0e-5" :max="2.0e-3" :step="0.0001" showTip="always" v-model="density"></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label" @click="minimumBrightness=0.1">{{lang.zxld}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="1" :step="0.01" showTip="always" v-model="minimumBrightness"></XbsjSlider>
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
          midu: "密度",
          zxld: "最小亮度"
        },
        en: {
          midu: "Density",
          zxld: "minBri"
        }
      },
      lang: undefined,
      density: 2.0e-4,
      minimumBrightness: 0.1,
      screenSpaceErrorFactor: 2.0
    };
  },
  created() {},
  mounted() {
    this.bind("density");
    this.bind("minimumBrightness");
    this.bind("screenSpaceErrorFactor");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.fog, prp)
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
  width: 310px;
  min-height: 100px;
}

.label {
  display: inline-block;
  width: 52px;
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