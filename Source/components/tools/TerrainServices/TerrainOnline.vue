<template>
  <Window
    :footervisible="true"
    @ok="ok"
    @cancel="show=false"
    v-show="show"
    :height="420"
    :width="500"
    :minWidth="202"
    :left="200"
    :top="138"
    :title="lang.title"
    class="xbsj-onlineTerrain"
  >
    <div class="onlineTerrainDiv">
      <label>{{lang.address}}:</label>
      <input v-model="selectedUrl" />
    </div>
    <div class="onlineTerrainDiv">
      <label>{{lang.type}}:</label>
      <input
        class="inputcheck"
        type="radio"
        id="cesiumtype"
        v-model="terrainType"
        value="XbsjCesiumTerrainProvider"
        name="terrainType"
        style="vertical-align: top;"
      />
      <label style="cursor:pointer;width:26px;" for="cesiumtype">{{lang.cesiumterrain}}</label>
      <input
        class="inputcheck"
        type="radio"
        id="googletype"
        v-model="terrainType"
        value="GoogleEarthEnterpriseTerrainProvider"
        name="terrainType"
        style="vertical-align: top;"
      />
      <label style="cursor:pointer;width:26px;" for="googletype">{{lang.googleterrain}}</label>
    </div>
    <!-- <label v-show="error!=''" class="error">{{error}}</label> -->
    <div v-if="selected!=null">
      <!-- <div class="onlineTerrainDiv">
          <label>服务地址:</label>
          <input v-model="selectedUrl">
      </div>-->
      <div v-if="!selected.notSupportNormal">
        <div class="onlineTerrainDiv">
          <!-- <label>法向量:</label>
          <input type="checkbox" v-model="normal">-->
          <label>{{lang.normal}}:</label>
          <input class="inputcheck" type="checkbox" v-model="normal" />
        </div>
      </div>

      <div v-if="!selected.notSupportWater">
        <div class="onlineTerrainDiv">
          <label>{{lang.water}}:</label>
          <input class="inputcheck" type="checkbox" v-model="water" />
        </div>
      </div>

      <!-- <div class="onlineTerrainDiv">
          <label v-show="error!=''" class="error">{{error}}</label>
      </div>-->

      <div v-show="selected.requireField" class="onlineTerrainDiv">
        <label>{{selected.requireField }}:</label>
        <input v-model="requireValue" />
      </div>
    </div>
    <ul class="flexul" :class="showContent ? 'contentUl' : ''">
      <li v-for="s in services" @click="select(s)" :key="s.url">
        <div :class="[{highlight:selected == s} ]" class="backimg">
          <img style="width:64px;height:64px;" :src="s.thumbnail" alt />
        </div>
        <!-- <span>{{s.name}}</span> -->
        <div class="onlinTerrainName">
          {{s.cnname}}
          <span class="onlineTerrainToolTip">{{s.cnname}}</span>
        </div>
      </li>
    </ul>
  </Window>
</template>

<script>
import languagejs from "./terrain_locale";
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      show: false,
      error: "",
      selected: null,
      selectedUrl: "",
      normal: true,
      water: true,
      showContent: false,
      lang: {},
      services: [],
      terrainType: "XbsjCesiumTerrainProvider",
      type: "XbsjCesiumTerrainProvider",
      langs: languagejs
    };
  },
  watch: {
    show() {
      this.getonlineinfo();
    },
    terrainType(val) {
      this.type = val;
    }
  },
  methods: {
    getonlineinfo() {
      var labServer = this.$root.$labServer;
      let url = labServer.serverOnline + "api/onlineResouces/terrain";
      axios
        .get(url, {
          params: {
            desc: false
          }
        })
        .then(res => {
          if (res.data.status === "ok") {
            this.services = res.data.result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changelang() {
      this.services = [
        // {
        //   name: this.lang.cesium,
        //   url: "Ion(1)",
        //   cls: "google_map"
        // },
        // {
        //   name: this.lang.chinaterrain,
        //   url:
        //     "//lab.earthsdk.com/terrain/577fd5b0ac1f11e99dbd8fd044883638",
        //   notSupportWater: true,
        //   cls: "google_map"
        // },
        // {
        //   name: this.lang.mount,
        //   url:
        //     "//lab.earthsdk.com/terrain/42752d50ac1f11e99dbd8fd044883638",
        //   notSupportNormal: false,
        //   notSupportWater: true,
        //   cls: "google_map"
        // }
      ];
    },
    select(service) {
      this.selected = service;
      // console.log(service);
      //因为界面可能修改这个值，所以需要单独一个变量
      this.selectedUrl = this.selected.url;
      this.requireValue = "";
      this.error = "";
      this.showContent = false;
      if (service.supportNormal === true) {
        this.showContent = true;
      }
    },
    ok() {
      if (this.selectedUrl == "") {
        //提示需要弹出url
        this.error = this.lang.selectinput;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        //构造地形

        var terrain = new XE.Obj.Terrain(this.$root.$earth);

        //如何设置全球数据，如何附加法向量和水面属性
        if (this.type === "XbsjCesiumTerrainProvider") {
          terrain.xbsjTerrainProvider = {
            type: this.type,
            XbsjCesiumTerrainProvider: {
              url: this.selectedUrl,
              requestVertexNormals: this.normal,
              requestWaterMask: this.water
            }
          };
        } else {
          terrain.xbsjTerrainProvider = {
            type: this.type,
            GoogleEarthEnterpriseTerrainProvider: {
              url: this.selectedUrl
            }
          };
        }

        //添加到场景树中
        this.$root.$earthUI.tools.sceneTree.addSceneObject(
          terrain,
          this.selected ? this.selected.cnname : this.lang.unName
        );

        this.show = false;
        this.error = "";
      }
    }
  },
  computed: {},
  beforeDestroy() {
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
  }
};
</script>

<style scoped>
.xbsj-onlineTerrain .google_image {
  background: url("../../../images/services/google_image.jpg") !important;
}
.xbsj-onlineTerrain .google_map {
  background: url("../../../images/services/google_map.png") !important;
}
.xbsj-onlineTerrain .error {
  color: red;
}
.xbsj-onlineTerrain .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 48px);
}
.xbsj-onlineTerrain .contentUl {
  overflow-x: hidden;
  height: calc(100% - 104px);
}
.xbsj-onlineTerrain .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
  height: 102px;
}
.xbsj-onlineTerrain .backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
}
.xbsj-onlineTerrain .backimg.highlight,
.xbsj-onlineTerrain .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-onlineTerrain .onlineTerrainDiv {
  margin: 10px 10px;
}
.xbsj-onlineTerrain .onlineTerrainDiv > label {
  display: inline-block;
  width: 52px;
  text-align: right;
  margin-right: 15px;
}
.xbsj-onlineTerrain .onlineTerrainDiv > input {
  width: calc(100% - 81px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-onlineTerrain .flexul li .onlinTerrainName {
  display: inline-block;
  width: 64px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-onlineTerrain .flexul li .onlinTerrainName .onlineTerrainToolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 11px;
  bottom: 30px;
}
.xbsj-onlineTerrain .flexul li .onlinTerrainName:hover .onlineTerrainToolTip {
  visibility: visible;
}
.xbsj-onlineTerrain .onlineTerrainDiv .inputcheck {
  display: inline-block;
  width: 15px;
  height: 15px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  background: url(../../../images/check.png) no-repeat top center;
  background-size: 100% 100%;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 0%;
}
.xbsj-onlineTerrain .onlineTerrainDiv input:checked {
  position: relative;
  background: url(../../../images/check_on.png) no-repeat top center;
  background-size: 100% 100%;
}
</style>
