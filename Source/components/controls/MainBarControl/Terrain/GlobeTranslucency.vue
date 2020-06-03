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
      <XbsjCheckBox
        style="margin-top:5px;"
        v-model="alphadistanceShow"
      >{{lang.frontFaceAlphaByDistance}}</XbsjCheckBox>
      <input type="text" :disabled="!alphadistanceShow" v-model="frontFaceAlphaByDistancestr" />
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
      alphadistanceShow: false,
      frontFaceAlphaByDistancestr: ""
    };
  },
  mounted() {
    this.bind("frontFaceAlpha");
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
    alphadistanceShow(val) {
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
      if (this.alphadistanceShow) {
        var frontFaceAlphaByDistanceArr = this.frontFaceAlphaByDistancestr.split(
          ","
        );
        this.$root.$earth.terrainEffect.globeTranslucency.frontFaceAlphaByDistance = frontFaceAlphaByDistanceArr.map(
          Number
        );
      }
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
  width: 254px;
  height: 128px;
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
</style>