<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="glowOnly=false">{{lang.jfgt}}:</label>
      <div class="field">
        <XbsjSwitch v-model="glowOnly" :value="glowOnly"></XbsjSwitch>
      </div>

      <div class="row">
        <label class="label" @click="contrast=128">{{lang.duibidu}}:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="255" :step="1" showTip="always" v-model="contrast"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="brightness=-0.3">{{lang.liangdu}}:</label>
        <div class="field">
          <XbsjSlider :min="-5" :max="5" :step="0.1" showTip="always" v-model="brightness"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="delta=1">delta:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="5" :step="0.1" showTip="always" v-model="delta"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="sigma=3.78">sigma:</label>
        <div class="field">
          <XbsjSlider :min="0" :max="5" :step="0.1" showTip="always" v-model="sigma"></XbsjSlider>
        </div>
      </div>

      <div class="row">
        <label class="label" @click="stepSize=5.0">stepSize:</label>
        <div class="field">
          <XbsjSlider :min="1" :max="10" :step="0.1" showTip="always" v-model="stepSize"></XbsjSlider>
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
          jfgt: "仅发光图",
          duibidu: "对比度",
          liangdu: "亮度"
        },
        en: {
          jfgt: "glow",
          duibidu: "Cont",
          liangdu: "Bri"
        }
      },
      lang: undefined,
      glowOnly: false,
      contrast: 128,
      brightness: -0.3,
      delta: 1.0,
      sigma: 3.78,
      stepSize: 5.0
    };
  },
  created() {},
  mounted() {
    this.bind("glowOnly");
    this.bind("contrast");
    this.bind("brightness");
    this.bind("delta");
    this.bind("sigma");
    this.bind("stepSize");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.postProcess.bloom, prp)
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