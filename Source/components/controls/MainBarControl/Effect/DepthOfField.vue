<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="focalDistance=87">{{lang.jjjl}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="1000" :step="1" showTip="always" v-model="focalDistance"></XbsjSlider>
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
      <label class="label" @click="stepSize=2.46">stepSize:</label>
      <div class="field">
        <XbsjSlider :min="1" :max="10" :step="0.1" showTip="always" v-model="stepSize"></XbsjSlider>
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
          jjjl: "聚焦距离"
        },
        en: {
          jjjl: "Distance"
        }
      },
      lang: undefined,
      focalDistance: 87,
      delta: 1,
      sigma: 3.78,
      stepSize: 2.46
    };
  },
  created() {},
  mounted() {
    this.bind("focalDistance");
    this.bind("delta");
    this.bind("sigma");
    this.bind("stepSize");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.postProcess.depthOfField, prp)
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