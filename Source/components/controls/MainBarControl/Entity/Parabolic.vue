<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="glowFactor=1">{{lang.interval}}:</label>
      <input type="text" v-model.number="minDistance" />
    </div>
    <div class="row">
      <label class="label">{{lang.archeight}}:</label>
      <input type="text" v-model.number="heightRatio" />
    </div>
    <div class="row">
      <button class="xbsj-button" @click="ok">{{lang.ok}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          interval: "间隔距离",
          archeight: "弧线高度",
          ok: "确定"
        },
        en: {
          interval: "Interval",
          archeight: "Archeight",
          ok: "OK"
        }
      },
      lang: undefined,
      minDistance: 10,
      heightRatio: 5,
      _position0:undefined,
      _position1:undefined
    };
  },
  created() {},
  mounted() {},
  methods: { 
    ok() {
       this.$parent.createParabolic(this.minDistance,this.heightRatio);
  } },
  beforeDestroy() {}
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
  vertical-align: top;
  line-height: 29px;
}
.row {
  margin-top: 10px;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 220px;
}
.popup input[type="text"] {
  width: 220px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding-left: 5px;
  margin-left: 20px;
  border-radius: 3px;
  outline: none;
}
</style>