<template>
  <div class="xbsj-mainbar-popup popup" ref="globeTranslucency">
    <div class="row">
      <label class="label">{{lang.frontFaceAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          v-model="frontFaceAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.backFaceAlpha}}:</label>
      <div class="field">
        <XbsjSlider
          :min="0"
          :max="1"
          :step="0.1"
          showTip="always"
          v-model="backFaceAlpha"
          ref="widthXbsjSlider"
        ></XbsjSlider>
      </div>
    </div>
    <div class="row">
      <XbsjCheckBox
        style="margin-top:5px;"
        v-model="frontAlphadistanceShow"
      >{{lang.frontFaceAlphaByDistance}}</XbsjCheckBox>
      <input type="text" :disabled="!frontAlphadistanceShow" v-model="frontFaceAlphaByDistancestr" />
    </div>
    <div class="row">
      <XbsjCheckBox
        style="margin-top:5px;"
        v-model="backAlphadistanceShow"
      >{{lang.backFaceAlphaByDistance}}</XbsjCheckBox>
      <input type="text" :disabled="!backAlphadistanceShow" v-model="backFaceAlphaByDistancestr" />
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
      frontAlphadistanceShow: false,
      frontFaceAlphaByDistancestr: "",
      backAlphadistanceShow: false,
      backFaceAlphaByDistancestr: "",
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
    frontAlphadistanceShow(val) {
      if (val) {
        this.frontFaceAlphaByDistancestr = "0, 0, 1, 0";
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = [
          0,
          0,
          1,
          0
        ];
      } else {
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = undefined;
        this.frontFaceAlphaByDistancestr = "";
      }
    },
    frontFaceAlphaByDistancestr(val) {
      if (this.frontAlphadistanceShow) {
        var frontFaceAlphaByDistanceArr = this.frontFaceAlphaByDistancestr.split(
          ","
        );
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = frontFaceAlphaByDistanceArr.map(
          Number
        );
      }
    },
    backAlphadistanceShow(val) {
      if (val) {
        this.backFaceAlphaByDistancestr = "0, 0, 1, 0";
        this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = [
          0,
          0,
          1,
          0
        ];
      } else {
        this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = undefined;
        this.backFaceAlphaByDistancestr = "";
      }
    },
    backFaceAlphaByDistancestr(val) {
      if (this.backAlphadistanceShow) {
        var backFaceAlphaByDistanceArr = this.backFaceAlphaByDistancestr.split(
          ","
        );
        this.$root.$earth.terrainEffect.globeTranslucency.backFaceAlphaByDistance = backFaceAlphaByDistanceArr.map(
          Number
        );
      }
    },
    rectangleShow(val) {
      if (val) {
        this.rectangleArr = [-180, -90, 180, 90];
        this.$root.$earth.terrainEffect.globeTranslucency.rectangle = [
          -Math.PI,
          -Math.PI * 0.5,
          Math.PI,
          Math.PI * 0.5
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
  width: 278px;
  height: 270px;
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
  margin-top: 14px;
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