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

    <span class="field">{{lang.url}}:</span>
    <input class="inputItem" v-model="url"/><br/>
    <span class="field">{{lang.format}}:</span>
    <input class="inputItem" v-model="format"/><br/>
    <span class="field">{{lang.layers}}:</span>
    <input class="inputItem" v-model="layers"/><br/>
    <span class="field">{{lang.credit}}:</span>
    <input class="inputItem" v-model="credit"/><br/>
    <span class="field">{{lang.style}}:</span>
    <input class="inputItem" v-model="style"/><br/>
    <!-- <span class="field">tileWidth:</span>
    <input class="inputItem" v-model="tileWidth"/><br/>
    <span class="field">tileHeight:</span>
    <input class="inputItem" v-model="tileHeight"/><br/> -->
    <span class="field">{{lang.tilingScheme}}:</span>
    <!-- <select v-model="tilingScheme">
      <option :key="tilingType" :value="tilingType" v-for="tilingType in tilingSchemes">{{ tilingType}}</option>
    </select> -->
    <Select v-model="tilingScheme">
        <Option v-for="item in tilingSchemes" :value="item" :key="item">{{ item }}</Option>
    </Select>
    <br/>
    
    <span class="field">{{lang.crs}}:</span>
    <input class="inputItem" v-model="crs"/><br/>
    <span class="field">{{lang.srs}}:</span>
    <input class="inputItem" v-model="srs"/><br/>
    <div style="height: 15px">
      <span class="field" style="float:left">{{lang.minimumLevel}}:</span>
      <XbsjSlider
        :min="0"
        :max="22"
        :step="1"
        v-model="minimumLevel" class="xbsj-slide-div xbsj-slider" style="float:left; left:10px; top:13px"
      ></XbsjSlider>
    </div>
    <br/>
    <div style="height: 15px">
      <span class="field" style="float:left">{{lang.maximumLevel}}:</span>
      <XbsjSlider
        :min="0"
        :max="22"
        :step="1"
        v-model="maximumLevel" class="xbsj-slide-div xbsj-slider" style="float:left; left:10px; top:13px"
      ></XbsjSlider>
    </div>
    <br/>
    
  </Window>
</template>

<script>
import { addOutterEventListener } from "../../utils/xbsjUtil";
export default {
    data () {
        return {
            show: false,
            url: '',
            format: 'image/jpeg', 
            layers: '', 
            credit: '',
            style: '', 
            // tileWidth: 256, 
            // tileHeight: 256, 
            tilingScheme: 'WebMercator', 
            rectangle: [], 
            minimumLevel: 0, 
            maximumLevel: 18,
            crs: '',
            srs: '',

            tilingSchemes: ['WebMercator', 'Geographic'],
            langs: {
                zh: {
                    title: "添加WMS服务",
                    url: "服务地址",
                    format: "格式",
                    layers: "图层",
                    credit: "credit",
                    style: "样式",
                    tilingScheme: "瓦片略图",
                    rectangle: "范围",
                    minimumLevel: "最小级别",
                    maximumLevel: "最大级别",
                    crs: "crs",
                    srs: "srs",
                    flyTo: "定位",
                },
                en: {
                    title: "add WMS services",
                    url: "ServerAddr",
                    format: "Format",
                    layers: "Layers",
                    credit: "Credit",
                    style: "Style",
                    tilingScheme: "TilingScheme",
                    rectangle: "Rectangle",
                    minimumLevel: "MinLevel",
                    maximumLevel: "MaxLevel",
                    crs: "Crs",
                    srs: "Srs",
                    flyTo: "Fly To",
                }
            },
        };
    },
    created () { },
    mounted () {
        
    },
    methods: {
        cancel () {
            if (this._imagelayer) this._imagelayer.destroy();
            this._imagelayer = undefined;

            this.show = false;
        },
        ok () {
            this.preview();
            if (!this._imagelayer) return;

            //添加到场景树中
            this.$root.$earthUI.tools.sceneTree.addSceneObject(
                this._imagelayer,
                // this.selected.layer.title
            );

            this.show = false;
            this._imagelayer = undefined;
        },

        preview(){
            if (this._imagelayer) this._imagelayer.destroy();
            this._imagelayer = undefined;
            const rectangle = this.rectangle && Cesium.Rectangle.fromRadians(...this.rectangle);

            let tilingScheme;
            // if (this.tilingScheme === 'WebMercator') {
            //     tilingScheme = new Cesium.WebMercatorTilingScheme();
            // } else if (this.tilingScheme === 'Geographic') {
            //     tilingScheme = new Cesium.GeographicTilingScheme();
            // }
            this._imagelayer = new XE.Obj.Imagery(this.$root.$earth);

            this._imagelayer.xbsjImageryProvider = {
                type: "WebMapServiceImageryProvider",
                WebMapServiceImageryProvider: {
                    layers: this.layers,
                    url: this.url,
                    format: this.format,
                    style: this.style,
                    maximumLevel: this.maximumLevel,
                    minimumLevel: this.minimumLevel,
                    tilingScheme: this.tilingScheme,
                    tileWidth: this.tileWidth, 
                    tileHeight: this.tileHeight, 
                    // rectangle: rectangle, 
                    crs: this.crs,
                    srs: this.srs,
                }
            };
        }
    },

    beforeDestroy () { },
    watch: {},
};
</script>

<style scoped>
.field {
  display: inline-block;
  width: 70px;

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

.inputItem {
  width:222px;
  height:26px;
  background:rgba(56,56,56,1);
  border:1px solid rgba(46,46,46,1);
  opacity:1;
  border-radius:3px;
  outline: none;
  margin:0px 0px 6px 0px;
  padding: 0 6px;
  color: #ffffff;
}
.inputItem:hover, .inputItem:focus {
  border:1px solid rgba(105,153,227,1);
}
.lableItem {
  display: inline-block;
  width: 100px;
  height: 16px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(224, 224, 224, 1);
  text-align: right;
}
</style>
