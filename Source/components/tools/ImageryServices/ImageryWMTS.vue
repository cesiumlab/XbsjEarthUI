<template>
  <Window
    :footervisible="true"
    @cancel="cancel"
    @ok="ok"
    v-show="show"
    :width="463"
    :minWidth="202"
    :height="500"
    :left="5"
    :top="138"
    :title="lang.title"
  >
    <!--
    <button class="xbsj-button" @click="add">添加数据</button>-->

    <div ref="wmtsselectbox">
      <span class="field">{{lang.server}}:</span>
      <div class="values">
        <div class="value">
          <input v-model="server" @keyup.enter="updateServer" />
          <button @click.stop="showServers=!showServers" class="selectButton"></button>
        </div>
      </div>
      <div class="right">
        <XbsjLoading v-show="isshow"></XbsjLoading>
      </div>

      <!-- <button @click="showServers=!showServers">选择服务</button> -->
      <ul v-show="showServers" class="serverul">
        <li v-for="s in servers" :key="s.title" @click.stop="selectServer(s)">{{s.title}}</li>
      </ul>
    </div>

    <div>
      <span class="field">{{lang.Layer}}:</span>
      <div class="values">
        <XbsjSelect v-model="selected.layer" :list="layers" :title="'title'"></XbsjSelect>
      </div>
      <input class="location" v-model="rectangle" readonly />
      <button class="xbsj-button" @click="flyTo(selected.layer)">{{lang.flyTo}}</button>
    </div>

    <div v-if="selected.layer">
      <span class="field">{{lang.Style}}:</span>
      <div class="values">
        <XbsjSelect v-model="selected.style" :list="selected.layer.styles" :title="'title'"></XbsjSelect>
      </div>
      <div class="right">
        <img v-if="selected.style && selected.style.legend" :src="selected.style.legend.href" />
      </div>
    </div>

    <div v-if="selected.layer">
      <span class="field">{{lang.Format}}:</span>
      <div class="values">
        <XbsjSelect v-model="selected.format" :list="selected.layer.urls" :title="'format'"></XbsjSelect>
      </div>
      <input class="geshi" v-if="selected.format" v-model="selected.format.template" readonly />
    </div>

    <div v-if="selected.layer">
      <span class="field">{{lang.TileMatrixSet}}:</span>
      <div class="values">
        <XbsjSelect
          v-model="selected.tileMatrixSet"
          :list="selected.layer.tileMatrixSets"
          :title="'title'"
        ></XbsjSelect>
      </div>
      <div>
        <span class="field">{{lang.minimumLevel}}:</span>
        <input
          v-if="selected.tileMatrixSet && selected.tileMatrixSet.params"
          v-model="selected.tileMatrixSet.params.minimumLevel"
          readonly
          class="jibie"
        />
        <span class="field">{{lang.maximumLevel}}:</span>
        <input
          v-if="selected.tileMatrixSet && selected.tileMatrixSet.params"
          v-model="selected.tileMatrixSet.params.maximumLevel"
          readonly
          class="jibie"
        />
      </div>
    </div>
    <div>
      <span class="field">{{lang.useProxy}}:</span>
      <div class="values">
        <XbsjSwitch v-model="useProxy"></XbsjSwitch>
      </div>
    </div>
  </Window>
</template>

<script>
import { addOutterEventListener } from "../../utils/xbsjUtil";
export default {
  data() {
    return {
      langs: {
        zh: {
          title: "添加WMTS服务",
          server: "服务地址",
          flyTo: "定位",
          minimumLevel: "最小级别",
          maximumLevel: "最大级别",
          Layer: "图层",
          Style: "样式",
          Format: "格式",
          TileMatrixSet: "切片规则",
          useProxy: "代理访问"
        },
        en: {
          title: "add WMTS services",
          server: "ServerAddr",
          flyTo: "Fly To",
          minimumLevel: "MinLevel",
          maximumLevel: "MaxLevel",
          Layer: "Layer",
          Style: "Style",
          Format: "Format",
          TileMatrixSet: "TileMatrixSet",
          useProxy: "Proxy"
        }
      },
      show: false,
      lang: undefined,
      server: "",
      layers: [],
      useProxy: false,
      servers: [
        {
          title: "本地GeoServer",
          addr: "http://localhost:8080/geoserver/gwc/service/wmts"
        },
        {
          title: "National Map",
          addr:
            "//basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS"
        },

        {
          title: "Geologic maps of US states",
          addr:
            "https://mrdata.usgs.gov/mapcache/wmts?service=WMTS&request=GetCapabilities&version=1.0.0"
        },

        {
          title: "Magnetic anomaly map of North America",
          addr:
            "https://mrdata.usgs.gov/mapcache/wmts?service=WMTS&request=GetCapabilities&version=1.0.0"
        },

        {
          title:
            "Hydrothermal alteration in the Basin and Range province of the US",
          addr:
            "https://mrdata.usgs.gov/mapcache/wmts?service=WMTS&request=GetCapabilities&version=1.0.0"
        }
      ],
      showServers: false,
      isshow: false,
      selected: {
        layer: undefined,
        format: undefined,
        style: undefined,
        tileMatrixSet: undefined
      },
      rectangle: ""
    };
  },
  created() {},
  mounted() {
    //添加一个外部事件，如果点击后隐藏
    addOutterEventListener(this.$refs.wmtsselectbox, "mousedown", () => {
      this.showServers = false;
    });
  },
  methods: {
    selectServer(s) {
      this.server = s.addr;
      this.updateServer();
      this.showServers = false;
    },
    updateServer() {
      //请求xml 并解析
      let url = this.server;
      if (!url.startsWith("http")) {
        this.$root.$earthUI.promptInfo(
          "please input a right wmts address",
          "warning"
        );
        return;
      }

      var wmts = new XE.Tool.WMTSParser();
      url = wmts.addUrlParam(url);

      if (this.useProxy) {
        url =
          this.$root.$labServer.server +
          "other/proxy?url=" +
          encodeURIComponent(url);
      }

      this.selected = {
        layer: undefined,
        format: undefined,
        style: undefined,
        tileMatrixSet: undefined
      };

      this.isshow = true;
      wmts
        .parser(url)
        .then(layers => {
          this.isshow = false;
          this.layers = layers;
          if (layers.length == 0) {
            this.$root.$earthUI.promptInfo(
              "server has no supproted layers",
              "warning"
            );
          } else {
            //默认选择第一个Layer
            this.selected.layer = this.layers[0];
          }
        })
        .catch(err => {
          this.isshow = false;
          this.$root.$earthUI.promptInfo(
            "GetCapabilities failed:" + err.message,
            "error"
          );
        });
    },
    cancel() {
      if (this._imagelayer) this._imagelayer.destroy();
      this._imagelayer = undefined;

      this.show = false;
    },
    ok() {
      if (!this._imagelayer) return;

      //添加到场景树中
      this.$root.$earthUI.tools.sceneTree.addSceneObject(
        this._imagelayer,
        this.selected.layer.title
      );

      this.show = false;
      this._imagelayer = undefined;
    },
    preview() {
      //根据当前选择构造预览图层
      if (this._imagelayer) this._imagelayer.destroy();
      this._imagelayer = undefined;

      if (!this.selected.layer) return;
      var layer = this.selected.layer.title;

      if (!this.selected.format) return;
      var url = this.selected.format.template;

      if (this.useProxy) {
        url = this.$root.$labServer.server + "other/proxy?url=" + url;
      }

      var format = this.selected.format.format;

      if (!this.selected.style) return;
      var style = this.selected.style.id;

      if (!this.selected.tileMatrixSet) return;

      this._imagelayer = new XE.Obj.Imagery(this.$root.$earth);
      var rectangle = this.selected.layer.rectangle
        ? this.selected.layer.rectangle.map(d => (d * Math.PI) / 180)
        : undefined;
      if (rectangle) {
        this._imagelayer.rectangle = rectangle;
      }

      this._imagelayer.xbsjImageryProvider = {
        type: "WebMapTileServiceImageryProvider",
        WebMapTileServiceImageryProvider: {
          layer,
          url,
          format,
          style,
          tileMatrixSetID: this.selected.tileMatrixSet.tileMatrixSetID,
          tileMatrixLabels: this.selected.tileMatrixSet.params.tileMatrixLabels,
          maximumLevel: this.selected.tileMatrixSet.params.maximumLevel,
          minimumLevel: this.selected.tileMatrixSet.params.minimumLevel,
          tilingScheme: this.selected.tileMatrixSet.params.tilingScheme
        }
      };
    },
    flyTo(l) {
      if (!l || !l.rectangle) {
        this.rectangle = "";
        return;
      }
      //更新范围
      this.rectangle = l.rectangle.map(r => r.toFixed(5) + "°").join(",");

      //飞行定位
      this.$root.$earth.czm.viewer.camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(
          l.rectangle[0],
          l.rectangle[1],
          l.rectangle[2],
          l.rectangle[3]
        )
      });
    }
  },

  beforeDestroy() {},
  watch: {
    "selected.layer": function(l) {
      if (!l) return;

      this.flyTo(l);

      //设置默认的 format
      if (l.urls && l.urls.length > 0) {
        this.selected.format = l.urls[0];
      } else {
        this.selected.format = undefined;
      }
      //设置默认的tilematrixset
      if (l.tileMatrixSets && l.tileMatrixSets.length > 0) {
        this.selected.tileMatrixSet = l.tileMatrixSets[0];
      } else {
        this.selected.tileMatrixSet = undefined;
      }
      //设置默认的 style
      var defaultStyle;
      if (l.styles) defaultStyle = l.styles.find(s => s.default);
      if (defaultStyle) {
        this.selected.style = defaultStyle;
      } else if (l.styles && l.styles.length > 0) {
        this.selected.style = l.styles[0];
      } else {
        this.selected.style = undefined;
      }
    },
    "selected.format": function() {
      this.preview();
    },
    "selected.style": function() {
      this.preview();
    },
    "selected.tileMatrixSet": function() {
      this.preview();
    }
  }
};
</script>

<style scoped>
.field {
  display: inline-block;
  width: 54px;

  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
  vertical-align: bottom;
}
.value {
  display: inline-block;
  min-width: 100px;
  height: 30px;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.value input {
  width: calc(100% - 36px);
  color: #dddddd;
  height: 28px;
  background: transparent;
  border: none;
  outline: none;
  margin-left: 3px;
}
.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 20px;
  margin-top: 11px;
  outline: none;
}
.values {
  display: inline-block;
  width: calc(100% - 134px);
  margin-top: 5px;
  margin-left: 2px;
}
.location {
  width: calc(100% - 190px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 0 13px;
  margin-left: 79px;
  margin-top: 8px;
  outline: none;
}
.geshi {
  width: calc(100% - 146px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  margin-left: 80px;
  margin-top: 8px;
  padding: 0 13px;
  outline: none;
}
.serverul {
  width: calc(100% - 130px);
  background: rgb(138, 138, 138);
  position: absolute;
  left: 85px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 1;
}
.serverul li {
  cursor: pointer;
  padding-left: 10px;
  height: 25px;
  line-height: 25px;
  font-size: 14px;
}
.serverul li:hover {
  background: rgba(107, 107, 107, 1);
}
.xbsj-button {
  outline: none;
}
.jibie {
  display: inline-block;
  min-width: 100px;
  height: 28px;
  width: calc(50% - 115px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 13px;
  margin-top: 5px;
  outline: none;
}
.right {
  float: right;
  margin-top: 10px;
  margin-right: 5px;
}
</style>
