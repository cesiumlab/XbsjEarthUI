<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="glowFactor=1">{{lang.fgbl}}:</label>

      <div class="field">
        <XbsjSlider
          :min="0.1"
          :max="10"
          :step="0.1"
          showTip="always"
          v-model="glowFactor"
          ref="glowFactor"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.sffg}}:</label>
      <div class="field">
        <XbsjSwitch v-model="bloom" :value="bloom"></XbsjSwitch>
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
          fgbl: "发光比率",
          sffg: "是否泛光"
        },
        en: {
          fgbl: "Glow",
          sffg: "Bloom"
        }
      },
      lang: undefined,
      glowFactor: 1,
      bloom: true,
      color: [1.8, 1.85, 2.0]
    };
  },
  created() {},
  mounted() {
    this.bind("glowFactor");
    this.bind("bloom");
    this.bind("color");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.sun, prp)
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
  width: 308px;
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