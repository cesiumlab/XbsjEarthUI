<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="ambientOcclusionOnly=false">{{lang.jzzt}}:</label>
      <div class="field">
        <XbsjSwitch v-model="ambientOcclusionOnly" :value="ambientOcclusionOnly"></XbsjSwitch>
      </div>

      <div class="row">
        <label class="label" @click="intensity=3">{{lang.qiangdu}}:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="10" :step="0.1" showTip="always" v-model="intensity"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="bias=-0.1">{{lang.pianyi}}:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="1" :step="0.01" showTip="always" v-model="bias"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="lengthCap=0.03">lengthCap:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="1" :step="0.01" showTip="always" v-model="lengthCap"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="stepSize=1">stepSize:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="5" :step="0.1" showTip="always" v-model="stepSize"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="blurStepSize=0.86">blurStepSize:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="2" :step="0.1" showTip="always" v-model="blurStepSize"></XbsjSlider>
        </div>
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
          jzzt: "仅遮罩图",
          qiangdu: "强度",
          pianyi: "偏移"
        },
        en: {
          jzzt: "AOOnly",
          qiangdu: "Ins",
          pianyi: "Bias"
        }
      },
      lang: undefined,
      ambientOcclusionOnly: false,
      intensity: 3.0,
      bias: 0.1,
      lengthCap: 0.03,
      stepSize: 1,
      blurStepSize: 0.86
    };
  },
  created() {},
  mounted() {
    this.bind("ambientOcclusionOnly");
    this.bind("intensity");
    this.bind("bias");
    this.bind("lengthCap");
    this.bind("stepSize");
    this.bind("blurStepSize");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(
          this,
          prp,
          this.$root.$earth.postProcess.ambientOcclusion,
          prp
        )
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