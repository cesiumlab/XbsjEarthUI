<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="brightness=0.5">{{lang.liangdu}}:</label>

      <div class="field">
        <XbsjSlider :min="0" :max="5" :step="0.1" showTip="always" v-model="brightness"></XbsjSlider>
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
          liangdu: "亮度"
        },
        en: {
          liangdu: "Bri"
        }
      },
      lang: undefined,
      brightness: 0.5
    };
  },
  created() {},
  mounted() {
    this.bind("brightness");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.postProcess.brightness, prp)
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
  width: 286px;
  min-height: 60px;
}

.label {
  display: inline-block;
  width: 32px;
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