<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="darkness=0.3">{{lang.andu}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="1" :step="0.01" showTip="always" v-model="darkness"></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label" @click="maximumDistance=5000">{{lang.zdjl}}:</label>
      <div class="field">
        <XbsjSlider :min="1" :max="100000" :step="1" showTip="always" v-model="maximumDistance"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="terrainShadow=true">{{lang.dxyy}}:</label>
      <div class="field">
        <XbsjSwitch v-model="terrainShadow" :value="terrainShadow"></XbsjSwitch>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="softShadows=false">{{lang.ryy}}:</label>
      <div class="field">
        <XbsjSwitch v-model="softShadows" :value="softShadows"></XbsjSwitch>
      </div>
    </div>

    <div class="row">
      <label class="label" @click="normalOffset=true">{{lang.fxlpy}}:</label>
      <div class="field">
        <XbsjSwitch v-model="normalOffset" :value="normalOffset"></XbsjSwitch>
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
          andu: "暗度",
          zdjl: "最大距离",
          dxyy: "地形阴影",
          ryy: "软阴影",
          fxlpy: "法向量偏移"
        },
        en: {
          andu: "andu",
          zdjl: "zdjl",
          dxyy: "dxyy",
          ryy: "ryy",
          fxlpy: "fxlpy"
        }
      },
      lang: undefined,
      terrainShadow: true,
      softShadows: false,
      size: 2048,
      darkness: 0.3,
      maximumDistance: 5000.0,
      normalOffset: true
    };
  },
  created() {},
  mounted() {
    this.bind("terrainShadow");
    this.bind("softShadows");
    this.bind("size");
    this.bind("darkness");
    this.bind("maximumDistance");
    this.bind("normalOffset");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.effect.shadow, prp)
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