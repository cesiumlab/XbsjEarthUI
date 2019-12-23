<template>
  <Window
    :footervisible="true"
    @cancel="cancel"
    @ok="ok"
    v-show="show"
    :height="420"
    :width="500"
    :minWidth="202"
    :left="200"
    :top="138"
    :title="lang.title"
    class="xbsj-onlineImage"
  >
    <div class="onlineImageBox">
      <div class="onlineImageDiv">
        <label>{{lang.address}}:</label>
        <input v-model="selectedUrl" />
      </div>
      <div class="onlineImageDiv onlineImagezb">
        <label class="datazbLabel">{{lang.datazb}}:</label>

        <div class="onlineimage-selectdiv" @click="selectClick">
          <span class="onlineimage-selectText">{{srcCoordType}}</span>
          <button class="onlineimage-selectButton"></button>
        </div>
        <ul class="onlineimage-selectOption" v-show="selectshow">
          <li v-for="ct in dataCoordTypes" :key="ct" @click="selectName(ct)">
            <span>{{ ct }}</span>
          </li>
        </ul>
        <!-- </div> -->
        <label class="loadzbLabel">{{lang.loadzb}}:</label>
        <!-- <select v-model="dstCoordType">
            <option v-for="ct in dstCoordTypes" :key="ct">{{ct}}</option>
        </select>-->
        <!-- <div class="onlineimage-selectBox"> -->
        <div class="onlineimage-selectdiv" @click="select2Click">
          <span class="onlineimage-selectText">{{dstCoordType}}</span>
          <button class="onlineimage-selectButton"></button>
        </div>
        <ul class="onlineimage-selectOption2" v-show="select2show">
          <li v-for="ct in dstCoordTypes" :key="ct" @click="select2Name(ct)">
            <span>{{ ct }}</span>
          </li>
        </ul>
        <!-- </div> -->
      </div>
    </div>
    <!-- <label v-show="error!=''" class="error">{{error}}</label> -->
    <div v-if="selected!=null" class="onlineImageBox">
      <!-- <div class="onlineImageDiv">
          <label v-show="error!=''" class="error">{{error}}</label>
      </div>-->
      <div v-if="selected.requireField" class="onlineImageDiv">
        <label>{{selected.requireField }}:</label>
        <input v-model="requireValue" />
      </div>
    </div>
    <ul class="flexul" :class="showContent ? 'contentUl' : ''">
      <li v-for="s in services" @click="select(s)" :key="s.name">
        <div :class="[{highlight:selected == s} ]" class="backimg">
          <img style="width:64px;height:64px;" :src="s.thumbnail" alt />
        </div>
        <div class="onlinImageName">
          {{getName(s)}}
          <span class="onlineImageToolTip">{{getName(s)}}</span>
        </div>
      </li>
    </ul>
  </Window>
</template>

<script>
import languagejs from "./imagery_locale";
import axios from "axios";
export default {
  components: {},
  data () {
    return {
      selectshow: false,
      langs: languagejs,
      select2show: false,
      show: false,
      error: "",
      selected: null,
      selectedUrl: "",
      srcCoordType: "",
      dstCoordType: "",
      requireValue: "",
      dataCoordTypes: ["WGS84", "GCJ02", "BD09"],
      dstCoordTypes: ["WGS84", "GCJ02"],
      lang: {},
      showContent: false,
      services: []
    };
  },
  created () { },
  watch: {
    show () {
      this.getonlineinfo();
    }
  },
  methods: {
    getonlineinfo () {
      var labServer = this.$root.$labServer;
      let url = labServer.serverOnline + "api/onlineResouces/image";
      axios
        .get(url, {
          params: {
            desc: false
          }
        })
        .then(res => {
          if (res.data.status === "ok") {
            this.services = res.data.result;
            this.services.forEach(s => {
              if (s.requireField == " ") {
                s.requireField = undefined;
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击select
    selectClick () {
      this.selectshow = !this.selectshow;
    },
    selectName (value) {
      this.srcCoordType = value;
      this.selectshow = false;
    },
    select2Click () {
      this.select2show = !this.select2show;
    },
    select2Name (value) {
      this.dstCoordType = value;
      this.select2show = false;
    },
    select (service) {
      this.selected = service;

      this.srcCoordType = service.coordType;
      this.dstCoordType = "WGS84";
      this.selectedUrl = service.url;

      this.error = "";

      //构造一个imagerylayer 添加到地球上

      if (this._imagelayer) this._imagelayer.destroy();

      this._imagelayer = new XE.Obj.Imagery(this.$root.$earth);

      var url = this.selectedUrl;
      if (this.selected.requireField) {
        url += "&" + this.selected.requireField + "=" + this.requireValue;
      }

      this._imagelayer.xbsjImageryProvider = {
        type: "XbsjImageryProvider",
        XbsjImageryProvider: {
          url: url,
          srcCoordType: service.coordType,
          dstCoordType: "WGS84"
        }
      };
    },
    cancel () {
      this.show = false;

      if (this._imagelayer) this._imagelayer.destroy();
      this._imagelayer = undefined;
      this.selected = undefined;
    },
    ok () {
      if (this.selectedUrl == "") {
        //提示需要弹出url
        this.error = this.lang.selectinput;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        //构造imagerylay

        var url = this.selectedUrl;
        if (this.selected && this.selected.requireField) {
          if (!this.requireValue || this.requireValue == "") {
            this.$root.$earthUI.promptInfo(
              "please input require value",
              "error"
            );
            return;
          }
          url += "&" + this.selected.requireField + "=" + this.requireValue;
        }

        var imageLayer = new XE.Obj.Imagery(this.$root.$earth);

        imageLayer.xbsjImageryProvider = {
          type: "XbsjImageryProvider",
          XbsjImageryProvider: {
            url: url,
            srcCoordType: this.srcCoordType,
            dstCoordType: this.dstCoordType
          }
        };

        //添加到场景树中
        this.$root.$earthUI.tools.sceneTree.addSceneObject(
          imageLayer,
          this.getName(this.selected)
        );

        this.show = false;
        this.error = "";

        this.cancel();
      }
    },
    onContexMenu (server, event) {
      //弹出菜单
      this.$root.$earthUI.contextMenu.pop([
        {
          text: "保存缩略图",
          keys: "",
          func: () => {
            this.$root.$earthUI.saveScreenToFile(
              this.$root.$earth.czm.viewer.canvas.width,
              this.$root.$earth.czm.viewer.canvas.height,
              server.name + ".png"
            );
          }
        }
      ]);
    },
    getName (s) {
      if (!s) return this.lang.unName;

      if (s.cnname in this.lang) return this.lang[s.cnname];

      return s.cnname;
    }
  },
  computed: {},
  filters: {},
  beforeDestroy () {
    this.cancel();
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
  }
};
</script>

<style scoped>
.google_image {
  background: url("../../../images/services/google_image.jpg") !important;
}
.google_image_label {
  background: url("../../../images/services/google_image_label.jpg") !important;
}
.google_imagewithlabel {
  background: url("../../../images/services/google_imagewithlabel.jpg") !important;
}
.google_map {
  background: url("../../../images/services/google_map.jpg") !important;
}
.tianditu_image {
  background: url("../../../images/services/tianditu_image.jpg") !important;
}
.tianditu_image_label {
  background: url("../../../images/services/tianditu_image_label.jpg") !important;
}
.tianditu_map {
  background: url("../../../images/services/tianditu_map.jpg") !important;
}
.tianditu_map_label {
  background: url("../../../images/services/tianditu_map_label.jpg") !important;
}
.gaode_map {
  background: url("../../../images/services/gaode_map.jpg") !important;
}
.gaode_image {
  background: url("../../../images/services/gaode_image.jpg") !important;
}
.gaode_image_label {
  background: url("../../../images/services/gaode_image_label.jpg") !important;
}
.baidu_map {
  background: url("../../../images/services/baidu_map.jpg") !important;
}
.baidu_image {
  background: url("../../../images/services/baidu_image.jpg") !important;
}
.baidu_image_label {
  background: url("../../../images/services/baidu_image_label.jpg") !important;
}
.baidu_map_midnight {
  background: url("../../../images/services/baidu_map_midnight.jpg") !important;
}
.baidu_map_dark {
  background: url("../../../images/services/baidu_map_dark.jpg") !important;
}
.openstreetmap {
  background: url("../../../images/services/openstreetmap.jpg") !important;
}
.mapbox_satellite {
  background: url("../../../images/services/mapbox_satellite.jpg") !important;
}
.mapbox_streets {
  background: url("../../../images/services/mapbox_streets.jpg") !important;
}
.mapbox_light {
  background: url("../../../images/services/mapbox_light.jpg") !important;
}
.mapbox_dark {
  background: url("../../../images/services/mapbox_dark.jpg") !important;
}
.mapbox_streets_satellite {
  background: url("../../../images/services/mapbox_streets_satellite.jpg") !important;
}
.mapbox_wheatpaste {
  background: url("../../../images/services/mapbox_wheatpaste.jpg") !important;
}
.mapbox_streets_basic {
  background: url("../../../images/services/mapbox_streets_basic.jpg") !important;
}
.mapbox_comic {
  background: url("../../../images/services/mapbox_comic.jpg") !important;
}
.mapbox_outdoors {
  background: url("../../../images/services/mapbox_outdoors.jpg") !important;
}
.mapbox_run_bike_hike {
  background: url("../../../images/services/mapbox_run_bike_hike.jpg") !important;
}
.mapbox_pencil {
  background: url("../../../images/services/mapbox_pencil.jpg") !important;
}
.mapbox_pirates {
  background: url("../../../images/services/mapbox_pirates.jpg") !important;
}
.mapbox_emerald {
  background: url("../../../images/services/mapbox_emerald.jpg") !important;
}
.mapbox_high_contrast {
  background: url("../../../images/services/mapbox_high_contrast.jpg") !important;
}
.xbsj-onlineImage .error {
  color: red;
}
.xbsj-onlineImage .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 86px);
}
.xbsj-onlineImage .contentUl {
  overflow-x: hidden;
  height: calc(100% - 124px);
}
.xbsj-onlineImage .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
  height: 100px;
}
.xbsj-onlineImage .flexul li .onlinImageName {
  display: inline-block;
  width: 64px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-onlineImage .flexul li .onlinImageName .onlineImageToolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 6px;
  bottom: 30px;
}
.xbsj-onlineImage .backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
}
.xbsj-onlineImage .backimg.highlight,
.xbsj-onlineImage .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-model-content-box {
  overflow-x: hidden;
  /* overflow-y: hidden; */
}
.xbsj-onlineImage .onlineImageDiv {
  margin: 10px 10px;
}
.xbsj-onlineImage .onlineImageDiv > label {
  display: inline-block;
  width: 52px;
  text-align: right;
  margin-right: 15px;
  float: left;
  margin-top: 6px;
}
.xbsj-onlineImage .onlineImageDiv .loadzbLabel {
  margin-left: 25px;
}
.xbsj-onlineImage .onlineImageDiv > input {
  width: calc(100% - 80px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-onlineImage .onlineImagezb {
  width: 470px;
  height: 28px;
}
.xbsj-onlineImage .onlineimage-selectBox {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}
.xbsj-onlineImage .onlineimage-selectdiv {
  display: inline-block;
  width: 138px;
  background: rgba(0, 0, 0, 0.4);
  height: 28px;
  position: relative;
  text-align: left;
  line-height: 28px;
  cursor: pointer;
  padding-left: 13px;
  left: -2px;
  top: 2px;
  border-radius: 3px;
  float: left;
}
.xbsj-onlineImage .onlineimage-selectText {
  font-size: 12px;
}
.xbsj-onlineImage .onlineimage-selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  outline: none;
}
.xbsj-onlineImage .onlineimage-selectOption,
.xbsj-onlineImage .onlineimage-selectOption2 {
  width: 150px;
  height: 64px;
  margin-left: 10px;
  background: rgba(138, 138, 138, 1);
  border-radius: 0px 0px 4px 4px;
  list-style: none;
  margin-top: 30px;
  overflow: auto;
  z-index: 1;
  position: absolute;
  left: 70px;
}
.xbsj-onlineImage .onlineimage-selectOption2 {
  left: 314px;
}
.xbsj-onlineImage .onlineimage-selectOption li,
.xbsj-onlineImage .onlineimage-selectOption2 li {
  width: 100%;
  height: 20px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  line-height: 20px;
  cursor: pointer;
}
.xbsj-onlineImage .onlineimage-selectOption li span,
.xbsj-onlineImage .onlineimage-selectOption2 li span {
  display: inline-block;
  height: 20px;
  position: relative;
  left: 11px;
}
.xbsj-onlineImage .onlineimage-selectOption li:hover,
.xbsj-onlineImage .onlineimage-selectOption2 li:hover {
  background: rgba(107, 107, 107, 1);
}
.xbsj-onlineImage .onlineImageBox {
  /* width: 500px; */
}
.xbsj-onlineImage .flexul li .onlinImageName:hover .onlineImageToolTip {
  visibility: visible;
}
</style>
