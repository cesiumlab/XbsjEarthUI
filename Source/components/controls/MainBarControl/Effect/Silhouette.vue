<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label" @click="length=0.5">{{lang.long}}:</label>

      <div class="field">
        <XbsjSlider :min="0.1" :max="5" :step="0.1" showTip="always" v-model="length"></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label">{{lang.yanse}}:</label>

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
          long: "长度",
          yanse: "颜色"
        },
        en: {
          long: "long",
          yanse: "yanse"
        }
      },
      lang: undefined,
      color: [],
      length: 0.5,
      uicolor: undefined
    };
  },
  created() {},
  mounted() {
    this.bind("length");
    this.bind("color");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.postProcess.silhouette, prp)
      );
    },
    fromColor(fromcolor) {
      this.color = [
        fromcolor.r / 255.0,
        fromcolor.g / 255.0,
        fromcolor.b / 255.0,
        fromcolor.a
      ];
    }
  },
  watch: {
    uicolor(color) {
      var v = color.rgba;
      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.color.every((c, index) => c === cc[index])) {
        this.color = cc;
      }
    },
    color(c) {
      this.uicolor = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
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
  width: 286px;
  min-height: 100px;
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
.colorstartDiv {
  margin-left: 40px;
  margin-top: -30px;
}
</style>