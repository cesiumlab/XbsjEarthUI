<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.skyBoxOnGround}}:</label>
      <div class="field">
        <XbsjSwitch v-model="skyBoxOnGround" :value="skyBoxOnGround"></XbsjSwitch>
      </div>
    </div>
    <div class="row">
      <label class="label">{{lang.topSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="topSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.bottomSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="bottomSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.eastSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="eastSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.southSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="southSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.westSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="westSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.northSkyBoxOnGroundImageUri}}:</label>
      <input type="text" v-model="northSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.backgroundImageUri}}:</label>
      <input type="text" v-model="backgroundImageUri" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          skyBoxOnGround: "开启天空盒",
          topSkyBoxOnGroundImageUri: "顶部背景图片",
          bottomSkyBoxOnGroundImageUri: "底部背景图片",
          eastSkyBoxOnGroundImageUri: "东部背景图片",
          southSkyBoxOnGroundImageUri: "南部背景图片",
          westSkyBoxOnGroundImageUri: "西部背景图片",
          northSkyBoxOnGroundImageUri: "北部背景图片",
          backgroundImageUri: "天空盒背景图片"
        },
        en: {
          skyBoxOnGround: "skyBoxOnGround",
          topSkyBoxOnGroundImageUri: "topSkyBoxOnGroundImageUri",
          bottomSkyBoxOnGroundImageUri: "bottomSkyBoxOnGroundImageUri",
          eastSkyBoxOnGroundImageUri: "eastSkyBoxOnGroundImageUri",
          southSkyBoxOnGroundImageUri: "southSkyBoxOnGroundImageUri",
          westSkyBoxOnGroundImageUri: "westSkyBoxOnGroundImageUri",
          northSkyBoxOnGroundImageUri: "northSkyBoxOnGroundImageUri",
          backgroundImageUri: "backgroundImageUri"
        }
      },
      lang: undefined,
      skyBoxOnGround: false,
      topSkyBoxOnGroundImageUri: "",
      bottomSkyBoxOnGroundImageUri: "",
      eastSkyBoxOnGroundImageUri: "",
      southSkyBoxOnGroundImageUri: "",
      westSkyBoxOnGroundImageUri: "",
      northSkyBoxOnGroundImageUri: "",
      backgroundImageUri: ""
    };
  },
  created() {},
  mounted() {
    this.bind("skyBoxOnGround");
    this.bind("topSkyBoxOnGroundImageUri");
    this.bind("bottomSkyBoxOnGroundImageUri");
    this.bind("eastSkyBoxOnGroundImageUri");
    this.bind("southSkyBoxOnGroundImageUri");
    this.bind("westSkyBoxOnGroundImageUri");
    this.bind("northSkyBoxOnGroundImageUri");
    this.bind("backgroundImageUri");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.skyBox, prp)
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
  width: 310px;
  min-height: 100px;
}

.label {
  display: inline-block;
  width: 88px;
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
  width: 208px;
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
.row input {
  width: 192px;
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
</style>