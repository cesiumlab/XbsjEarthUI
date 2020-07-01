<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.skyBoxType}}:</label>
      <XbsjSelect
        :class="!skyBoxOnGround ? 'selectdisabled' : ''"
        v-model="skyBoxTypeItem"
        :list="skyBoxType1"
      ></XbsjSelect>
    </div>
    <div class="row">
      <label class="label">{{lang.topSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="topSkyBoxOnGroundImageUri" />
      <label class="label">{{lang.bottomSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="bottomSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.eastSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="eastSkyBoxOnGroundImageUri" />
      <label class="label">{{lang.southSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="southSkyBoxOnGroundImageUri" />
    </div>
    <div class="row">
      <label class="label">{{lang.westSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="westSkyBoxOnGroundImageUri" />
      <label class="label">{{lang.northSkyBoxOnGroundImageUri}}:</label>
      <input type="text" :disabled="!skyBoxOnGround" v-model="northSkyBoxOnGroundImageUri" />
    </div>
    <div class="rows">
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
          skyBoxOnGround: "天空盒",
          skyBoxType: "类型",
          topSkyBoxOnGroundImageUri: "上",
          bottomSkyBoxOnGroundImageUri: "下",
          eastSkyBoxOnGroundImageUri: "东",
          southSkyBoxOnGroundImageUri: "南",
          westSkyBoxOnGroundImageUri: "西",
          northSkyBoxOnGroundImageUri: "北",
          backgroundImageUri: "背景图片"
        },
        en: {
          skyBoxOnGround: "skyBoxOnGround",
          skyBoxType: "Type",
          topSkyBoxOnGroundImageUri: "top",
          bottomSkyBoxOnGroundImageUri: "bottom",
          eastSkyBoxOnGroundImageUri: "east",
          southSkyBoxOnGroundImageUri: "south",
          westSkyBoxOnGroundImageUri: "west",
          northSkyBoxOnGroundImageUri: "north",
          backgroundImageUri: "backgroundImage"
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
      backgroundImageUri: "",
      skyBoxTypeItem: "",
      skyBoxType1: [
        "晴空万里",
        "落霞",
        "梦幻",
        "白云朵朵",
        "浪漫星空",
        "碧海蓝天"
      ],
      skyBoxType2: [
        {
          top: "./assets/skyboxes/sky1/top.jpg",
          bottom: "./assets/skyboxes/sky1/bottom.jpg",
          east: "./assets/skyboxes/sky1/east.jpg",
          south: "./assets/skyboxes/sky1/south.jpg",
          west: "./assets/skyboxes/sky1/west.jpg",
          north: "./assets/skyboxes/sky1/north.jpg"
        },
        {
          top: "./assets/skyboxes/sky3/top.jpg",
          bottom: "./assets/skyboxes/sky3/bottom.jpg",
          east: "./assets/skyboxes/sky3/east.jpg",
          south: "./assets/skyboxes/sky3/south.jpg",
          west: "./assets/skyboxes/sky3/west.jpg",
          north: "./assets/skyboxes/sky3/north.jpg"
        },
        {
          top: "./assets/skyboxes/sky4/top.jpg",
          bottom: "./assets/skyboxes/sky4/bottom.jpg",
          east: "./assets/skyboxes/sky4/east.jpg",
          south: "./assets/skyboxes/sky4/south.jpg",
          west: "./assets/skyboxes/sky4/west.jpg",
          north: "./assets/skyboxes/sky4/north.jpg"
        },
        {
          top: "./assets/skyboxes/sky5/top.jpg",
          bottom: "./assets/skyboxes/sky5/bottom.jpg",
          east: "./assets/skyboxes/sky5/east.jpg",
          south: "./assets/skyboxes/sky5/south.jpg",
          west: "./assets/skyboxes/sky5/west.jpg",
          north: "./assets/skyboxes/sky5/north.jpg"
        },
        {
          top: "./assets/skyboxes/sky6/top.jpg",
          bottom: "./assets/skyboxes/sky6/bottom.jpg",
          east: "./assets/skyboxes/sky6/east.jpg",
          south: "./assets/skyboxes/sky6/south.jpg",
          west: "./assets/skyboxes/sky6/west.jpg",
          north: "./assets/skyboxes/sky6/north.jpg"
        },
        {
          top: "./assets/skyboxes/sky7/top.jpg",
          bottom: "./assets/skyboxes/sky7/bottom.jpg",
          east: "./assets/skyboxes/sky7/east.jpg",
          south: "./assets/skyboxes/sky7/south.jpg",
          west: "./assets/skyboxes/sky7/west.jpg",
          north: "./assets/skyboxes/sky7/north.jpg"
        }
      ]
    };
  },
  created() {},
  watch: {
    skyBoxTypeItem(val) {
      var index = this.skyBoxType1.indexOf(val);
      this.topSkyBoxOnGroundImageUri = this.skyBoxType2[index].top;
      this.bottomSkyBoxOnGroundImageUri = this.skyBoxType2[index].bottom;
      this.eastSkyBoxOnGroundImageUri = this.skyBoxType2[index].east;
      this.southSkyBoxOnGroundImageUri = this.skyBoxType2[index].south;
      this.westSkyBoxOnGroundImageUri = this.skyBoxType2[index].west;
      this.northSkyBoxOnGroundImageUri = this.skyBoxType2[index].north;
    }
  },
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
  width: 52px;
  text-align: right;
  margin-right: 5px;
  vertical-align: middle;
  line-height: 29px;
}
.row,
.rows {
  display: flex;
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
.row input,
.rows input {
  width: 80px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 0 10px;
}
.rows input {
  width: 232px;
}
input:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
input:disabled {
  cursor: not-allowed;
}
.selectdisabled {
  pointer-events: none;
}
.xbsjselect {
  width: 242px !important;
}
</style>