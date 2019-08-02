<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.xiankuan}}:</label>

      <div class="field">
        <XbsjSlider :min="1" :max="10" :step="1" showTip="always" v-model="width" ref="widthXbsjSlider"></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.jianju}}:</label>

      <div class="field">
        <XbsjSlider
          :min="1"
          :max="300"
          :step="1"
          showTip="always"
          v-model="spacing"
          ref="spacingXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>

    <div class="row">
      <label class="label">{{lang.yanse}}:</label>
      <!-- <div class="field">
        <ColorPicker
          ref="colorpicker"
          class="colorpicker"
          theme="dark"
          :sucker-hide="true"
          color="rgba(255,0,0,1)"
          @changeColor="changeColor"
        ></ColorPicker>
      </div>-->

      <div class="colorDiv">
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
          xiankuan: "线宽",
          jianju: "间距",
          yanse: "颜色"
        },
        en: {
          xiankuan: "Width",
          jianju: "Space",
          yanse: "Color"
        }
      },
      lang: undefined,
      width: 1,
      spacing: 100,
      colorShow: false,
      color: [],
      uicolor: undefined
    };
  },
  created() {
    
  },
  mounted() {
    
    this.bind("width");
    this.bind("spacing");
    this.bind("spacing");
    this.bind("color");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(
          this,
          prp,
          this.$root.$earth.terrainEffect.contour,
          prp
        )
      );
    }
  },
  computed: {},
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
    // width(v) {
    //   this.$root.$earth.terrainEffect.contour.width = v;
    // },
    // spacing(v) {
    //   this.$root.$earth.terrainEffect.contour.spacing = v;
    // }
  },
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
  width: 30px;
  text-align: right;
  margin-right: 5px;
  vertical-align: top;
}
.ramp {
  display: inline-block;
}
.row {
  margin-top: 10px;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 220px;
}
.colorpicker {
  padding: 0px !important;
}
.row button {
  width: 28px;
  height: 20px;
  border: none;
  background: rgba(255, 0, 0, 1);
  outline: none;
}
.colorDiv {
  margin-left: 38px;
  margin-top: -19px;
}
</style>

