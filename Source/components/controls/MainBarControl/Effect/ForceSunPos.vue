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
        <label class="label" @click="useCameraPos=false">{{lang.jingdu}}</label>
        <div class="field">
          <!-- <XbsjLngLatHeight v-model="position"></XbsjLngLatHeight> -->
          <XbsjSlider
            :min="-180"
            :max="180"
            :step="1"
            showTip="always"
            v-model.number="position[0]"
          ></XbsjSlider>
        </div>
      </div>
      <div class="row">
        <label class="label" @click="useCameraPos=false">{{lang.weidu}}</label>
        <div class="field">
          <XbsjSlider :min="-90" :max="90" :step="1" showTip="always" v-model.number="position[1]"></XbsjSlider>
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
          position: "位置",
          jingdu: "经度:",
          weidu: "纬度:"
        },
        en: {
          usecamerapos: "cameraposition",
          position: "position",
          jingdu: "jingdu",
          weidu: "weidu"
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
    this.bindpos("position");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.effect.forceSunPos, prp)
      );
    },
    bindpos(pos) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bindPosition(
          this,
          pos,
          this.$root.$earth.effect.forceSunPos,
          pos
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
  width: 297px;
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
.divnotClick {
  pointer-events: none;
}

.divnotClick input {
  background: gray;
  border: none;
  padding: 3px 2px;
}
</style>