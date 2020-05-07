<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="aroundTime=120">{{lang.hrzq}}:</label>
      <div class="field">
        <XbsjSlider :min="-200" :max="200" :step="0.1" showTip="always" v-model="aroundTime"></XbsjSlider>
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
          hrzq: "环绕周期"
        },
        en: {
          hrzq: "Circle"
        }
      },
      lang: undefined,
      aroundTime: 120
    };
  },
  created() {},
  mounted() {
    this.bind("aroundTime");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.cloud, prp)
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
  width: 307px;
  min-height: 60px;
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