<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="gradations=5">{{lang.jibie}}:</label>

      <div class="field">
        <XbsjSlider :min="1" :max="20" :step="1" showTip="always" v-model="gradations"></XbsjSlider>
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
          jibie: "级别"
        },
        en: {
          jibie: "Grada"
        }
      },
      lang: undefined,
      gradations: 5
    };
  },
  created() {},
  mounted() {
    this.bind("gradations");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(
          this,
          prp,
          this.$root.$earth.postProcess.blackAndWhite,
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