<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="intensity=2">{{lang.qiangdu}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="10" :step="0.1" showTip="always" v-model="intensity"></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label" @click="distortion=10">{{lang.niuqudu}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="100" :step="1" showTip="always" v-model="distortion"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="dispersion=0.4">{{lang.fensandu}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="10" :step="0.01" showTip="always" v-model="dispersion"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="haloWidth=0.4">{{lang.gqkd}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="10" :step="0.01" showTip="always" v-model="haloWidth"></XbsjSlider>
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
          qiangdu: "强度",
          niuqudu: "扭曲度",
          fensandu: "分散度",
          gqkd: "光圈宽度"
        },
        en: {
          qiangdu: "qiangdu",
          niuqudu: "niuqudu",
          fensandu: "fensandu",
          gqkd: "gqkd"
        }
      },
      lang: undefined,
      intensity: 2.0,
      distortion: 10.0,
      dispersion: 0.4,
      haloWidth: 0.4,
      earthRadius: 6378137
    };
  },
  created() {},
  mounted() {
    this.bind("intensity");
    this.bind("distortion");
    this.bind("dispersion");
    this.bind("haloWidth");
    this.bind("earthRadius");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.postProcess.lensFlare, prp)
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
  width: 54px;
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