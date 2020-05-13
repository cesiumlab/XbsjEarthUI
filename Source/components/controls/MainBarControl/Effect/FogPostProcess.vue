<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="strength=0.5">{{lang.strength}}:</label>
      <div class="field">
        <XbsjSlider :min="0" :max="1" :step="0.1" showTip="always" v-model="strength"></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.color}}:</label>
      <div class="colorstartDiv">
        <XbsjColorButton ref="colorButton" v-model="uicolor"></XbsjColorButton>
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
          strength: "强度",
          color: "颜色"
        },
        en: {
          strength: "strength",
          color: "color"
        }
      },
      lang: undefined,
      strength: 0.5,
      color: [1, 1, 1, 1],
      uicolor: undefined
    };
  },
  created() {},
  mounted() {
    this.bind("strength");
    this.bind("color");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.fogPostProcess, prp)
      );
    }
  },
  watch: {
    uicolor(scolor) {
      var sv = scolor.rgba;
      var scc = [sv.r / 255.0, sv.g / 255.0, sv.b / 255.0, sv.a];
      if (!this.color.every((sc, index) => sc === scc[index])) {
        this.color = scc;
      }
    },
    color(sc) {
      this.uicolor = {
        rgba: {
          r: sc[0] * 255,
          g: sc[1] * 255,
          b: sc[2] * 255,
          a: sc[3]
        }
      };
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
.colorstartDiv,
.colorendDiv {
  display: inline-block;
}
.colorstartDiv {
  margin-right: 30px;
  vertical-align: middle;
}
</style>