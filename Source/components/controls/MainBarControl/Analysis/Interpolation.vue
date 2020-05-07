<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.jianju}}:</label>

      <div class="field">
        <XbsjInputNumber v-model="samplinginterval"></XbsjInputNumber>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["interval"],
  data() {
    return {
      langs: {
        zh: {
          jianju: "采样间隔"
        },
        en: {
          jianju: "sampling interval"
        }
      },
      lang: undefined,
      width: 1,
      samplinginterval: this.interval
    };
  },
  watch: {
    samplinginterval(v) {
      this.$emit("changeInterval", v);
    }
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>
<style scoped>
.popup {
  width: 288px;
  /* height: 473px; */
}
.label {
  display: inline-block;
  width: 60px;
  text-align: right;
  margin-right: 5px;
  vertical-align: middle;
}
.row {
  margin-top: 10px;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 200px;
}

.row button {
  width: 28px;
  height: 20px;
  border: none;
  background: rgba(255, 0, 0, 1);
  outline: none;
}
</style>

