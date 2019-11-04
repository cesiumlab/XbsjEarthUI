<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="useCameraPos=false">{{lang.usecamerapos}}:</label>
      <div class="field">
        <XbsjSwitch v-model="useCameraPos" :value="useCameraPos"></XbsjSwitch>
      </div>
    </div>

    <div :class="!useCameraPos ? '': 'divnotClick'">
      <div class="row">
        <label class="label" @click="useCameraPos=false">{{lang.position}}</label>
        <div class="field">
          <XbsjLngLatHeight v-model="position"></XbsjLngLatHeight>
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
          usecamerapos: "相机方向",
          position: "位置"
        },
        en: {
          usecamerapos: "cameraposition",
          position: "position"
        }
      },
      lang: undefined,
      useCameraPos: false,
      position: [0, 0, 0]
    };
  },
  created() {},
  mounted() {
    this.bind("useCameraPos");
    this.bind("position");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.effect.forceSunPos, prp)
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
  width: 297px;
  min-height: 100px;
}

.label {
  display: inline-block;
  width: 64px;
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
.divnotClick {
  pointer-events: none;
}

.divnotClick input {
  background: gray;
  border: none;
  padding: 3px 2px;
}
</style>