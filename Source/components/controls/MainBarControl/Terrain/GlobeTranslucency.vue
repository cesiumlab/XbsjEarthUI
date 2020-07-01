<template>
  <div class="xbsj-mainbar-popup popup" ref="globeTranslucency">
    <div class="row">
      <label class="label">{{lang.frontFace}}</label>
    </div>
    <div class="row">
      <XbsjCheckBox v-model="frontFixAlphaShow"></XbsjCheckBox>
      <label class="label">{{lang.fixAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          :disabled="!frontFixAlphaShow"
          v-model="frontFaceAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <XbsjCheckBox v-model="frontGradientAlphaShow"></XbsjCheckBox>
      <label class="label">{{lang.gradientAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          range
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          :disabled="!frontGradientAlphaShow"
          v-model="frontGradientAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label" style="margin-left:12px;">{{lang.gradientDistance}}:</label>
      <div class="field">
        <XbsjSlider
          range
          :min="0"
          :max="1000000"
          :step="1"
          showTip="always"
          v-model="frontGradientDistance"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.backFace}}</label>
    </div>
    <div class="row">
      <XbsjCheckBox v-model="backFixAlphaShow"></XbsjCheckBox>
      <label class="label">{{lang.fixAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          :disabled="!backFixAlphaShow"
          v-model="backFaceAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <XbsjCheckBox v-model="backGradientAlphaShow"></XbsjCheckBox>
      <label class="label">{{lang.gradientAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          range
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          :disabled="!backGradientAlphaShow"
          v-model="backGradientAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label" style="margin-left:12px;">{{lang.gradientDistance}}:</label>
      <div class="field">
        <XbsjSlider
          range
          :min="0"
          :max="1000000"
          :step="1"
          showTip="always"
          v-model="backGradientDistance"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <XbsjCheckBox style="margin-top:5px;" v-model="rectangleShow">{{lang.rectangle}}</XbsjCheckBox>
    </div>
    <div class="row">
      <label class="labelitem">{{lang.west}}:</label>
      <input
        class="inputitem"
        type="text"
        :disabled="!rectangleShow"
        v-model.number="rectangleArr[0]"
      />
      <span class="spanitem">°</span>
      <label class="labelitem">{{lang.south}}:</label>
      <input
        class="inputitem"
        type="text"
        :disabled="!rectangleShow"
        v-model.number="rectangleArr[1]"
      />
      <span class="spanitem">°</span>
    </div>
    <div class="row">
      <label class="labelitem">{{lang.east}}:</label>
      <input
        class="inputitem"
        type="text"
        :disabled="!rectangleShow"
        v-model.number="rectangleArr[2]"
      />
      <span class="spanitem">°</span>
      <label class="labelitem">{{lang.north}}:</label>
      <input
        class="inputitem"
        type="text"
        :disabled="!rectangleShow"
        v-model.number="rectangleArr[3]"
      />
      <span class="spanitem">°</span>
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";
export default {
  data() {
    return {
      langs: languagejs,
      frontFaceAlpha: 1,
      backFaceAlpha: 1,
      frontGradientAlpha: [0, 0],
      frontGradientDistance: [0, 1],
      frontFixAlphaShow: true,
      frontGradientAlphaShow: false,
      frontGradientDistanceShow: false,
      backGradientAlpha: [0, 0],
      backGradientDistance: [0, 1],
      backFixAlphaShow: true,
      backGradientAlphaShow: false,
      backGradientDistanceShow: false,
      rectangleShow: false,
      rectangle: [],
      rectangleArr: []
    };
  },
  mounted() {
    this.bind("frontFaceAlpha");
    this.bind("backFaceAlpha");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(
          this,
          prp,
          this.$root.$earth.terrainEffect.globeTranslucency,
          prp
        )
      );
    }
  },
  watch: {
    frontFixAlphaShow(val) {
      if (val) {
        this.frontGradientAlphaShow = false;
      } else {
        this.frontGradientAlphaShow = true;
      }
    },
    frontGradientAlphaShow(val) {
      if (!val) {
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = undefined;
        this.frontGradientAlpha = [0, 0];
        this.frontFixAlphaShow = true;
      } else {
        this.frontFixAlphaShow = false;
      }
    },
    frontGradientAlpha: {
      handler(newval, oldval) {
        if (this.frontGradientAlphaShow) {
          let frontFaceAlphaByDistanceArr1 = new Array(4);
          if (
            this.$root.$earth.terrainEffect.globeTranslucency
              .frontFaceAlphaByDistance !== undefined
          ) {
            frontFaceAlphaByDistanceArr1 = [
              ...this.$root.$earth.terrainEffect.globeTranslucency
                .frontFaceAlphaByDistance
            ];
          }
          frontFaceAlphaByDistanceArr1[1] = newval[1];
          frontFaceAlphaByDistanceArr1[3] = newval[0];
          this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = [
            ...frontFaceAlphaByDistanceArr1
          ];
        }
      },
      deep: true
    },
    frontGradientDistanceShow(val) {
      if (!val) {
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = undefined;
        this.frontGradientDistance = [0, 1];
      }
    },
    frontGradientDistance: {
      handler(newval, oldval) {
        if (this.frontGradientDistanceShow) {
          let frontFaceAlphaByDistance2 = new Array(4);
          if (
            this.$root.$earth.terrainEffect.globeTranslucency
              .frontFaceAlphaByDistance !== undefined
          ) {
            frontFaceAlphaByDistance2 = [
              ...this.$root.$earth.terrainEffect.globeTranslucency
                .frontFaceAlphaByDistance
            ];
          }
          frontFaceAlphaByDistance2[0] = newval[0];
          frontFaceAlphaByDistance2[2] = newval[1];
          this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = [
            ...frontFaceAlphaByDistance2
          ];
        }
      },
      deep: true
    },
    backFixAlphaShow(val) {
      if (val) {
        this.backGradientAlphaShow = false;
      } else {
        this.backGradientAlphaShow = true;
      }
    },
    backGradientAlphaShow(val) {
      if (!val) {
        this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = undefined;
        this.backGradientAlpha = [0, 0];
        this.backFixAlphaShow = true;
      } else {
        this.backFixAlphaShow = false;
      }
    },
    backGradientAlpha: {
      handler(newval, oldval) {
        if (this.backGradientAlphaShow) {
          let backFaceAlphaByDistanceArr1 = new Array(4);
          if (
            this.$root.$earth.terrainEffect.globeTranslucency
              .backFaceAlphaByDistance !== undefined
          ) {
            backFaceAlphaByDistanceArr1 = [
              ...this.$root.$earth.terrainEffect.globeTranslucency
                .backFaceAlphaByDistance
            ];
          }
          backFaceAlphaByDistanceArr1[1] = newval[0];
          backFaceAlphaByDistanceArr1[3] = newval[1];
          this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = [
            ...backFaceAlphaByDistanceArr1
          ];
        }
      },
      deep: true
    },
    backGradientDistanceShow(val) {
      if (!val) {
        this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = undefined;
        this.backGradientDistance = [0, 1];
      }
    },
    backGradientDistance: {
      handler(newval, oldval) {
        if (this.backGradientDistanceShow) {
          let backFaceAlphaByDistanceArr2 = new Array(4);
          if (
            this.$root.$earth.terrainEffect.globeTranslucency
              .backFaceAlphaByDistance !== undefined
          ) {
            backFaceAlphaByDistanceArr2 = [
              ...this.$root.$earth.terrainEffect.globeTranslucency
                .backFaceAlphaByDistance
            ];
          }
          backFaceAlphaByDistanceArr2[0] = newval[0];
          backFaceAlphaByDistanceArr2[2] = newval[1];
          this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = [
            ...backFaceAlphaByDistanceArr2
          ];
        }
      },
      deep: true
    },
    rectangleShow(val) {
      if (val) {
        if (this.rectangleArr.length === 0) {
          this.rectangleArr = [-180, -90, 180, 90];
        }
        this.$root.$earth.terrainEffect.globeTranslucency.rectangle = [
          (this.rectangleArr[0] * Math.PI) / 180,
          (this.rectangleArr[1] * Math.PI) / 180,
          (this.rectangleArr[2] * Math.PI) / 180,
          (this.rectangleArr[3] * Math.PI) / 180
        ];
      } else {
        this.rectangleArr = [];
        this.$root.$earth.terrainEffect.globeTranslucency.rectangle = undefined;
      }
    },
    rectangleArr: {
      handler(n, o) {
        if (this.rectangleShow) {
          this.$root.$earth.terrainEffect.globeTranslucency.rectangle = [
            (n[0] * Math.PI) / 180,
            (n[1] * Math.PI) / 180,
            (n[2] * Math.PI) / 180,
            (n[3] * Math.PI) / 180
          ];
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>


<style scoped>
.notallowe {
  cursor: not-allowed;
  background-color: #777777 !important;
  pointer-events: none;
}
.coloron {
  color: #1fffff !important;
}
.popup {
  width: 288px;
  height: 340px;
}
.popup button {
  height: 28px;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  margin-bottom: 10px;
  width: 70px;
  border-radius: 5px;
  cursor: pointer;
}
.label {
  display: inline-block;
  width: 64px;
  text-align: right;
}
.ramp {
  display: inline-block;
}
.row {
  display: flex;
  margin-top: 10px;
}
.field {
  width: 170px;
  margin-top: 7px;
  margin-left: 10px;
}
input {
  width: 154px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 0 10px;
}
input:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
input:disabled {
  cursor: not-allowed;
}
.labelitem {
  line-height: 28px;
  margin-right: 6px;
}
.inputitem {
  width: 74px;
  margin-right: 18px;
}
.spanitem {
  margin-left: -16px;
  margin-right: 26px;
}
</style>