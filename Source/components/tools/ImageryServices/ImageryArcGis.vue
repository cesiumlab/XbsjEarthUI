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

    <label class="lableItem">url:</label>
    <input class="inputItem" v-model="url"/><br/>
    <label class="lableItem">token:</label>
    <input class="inputItem" v-model="token"/><br/>
    <label class="lableItem">credit:</label>
    <input class="inputItem" v-model="credit"/><br/>

    <label class="lableItem">tileWidth:</label>
    <input class="inputItem" v-model="tileWidth"/><br/>
    <label class="lableItem">tileHeight:</label>
    <input class="inputItem" v-model="tileHeight"/><br/>
    <label class="lableItem">tilingScheme:</label>
    <select v-model="tilingScheme">
      <option :key="tilingType" :value="tilingType" v-for="tilingType in tilingSchemes">{{ tilingType}}</option>
    </select>
    <br/>
    <label class="lableItem">maximumLevel:</label>
    <input class="inputItem" v-model="maximumLevel"/><br/>
  </Window>
</template>

<script>
import { addOutterEventListener } from "../../utils/xbsjUtil";
export default {
    data () {
        return {
            show: false,
            url: '',
            token: '', 
            layers: '', 
            credit: '',
            tileWidth: 256, 
            tileHeight: 256, 
            tilingScheme: 'WebMercator', 
            // rectangle: [], 
            maximumLevel: 18,

            tilingSchemes: ['WebMercator', 'Geographic'],
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

            let ArcGisMapServerImageryProvider = {
                layers: this.layers,
                url: this.url,
                token: this.token,
                maximumLevel: this.maximumLevel,
                tilingScheme: this.tilingScheme,
                credit: this.credit,
                tileWidth: this.tileWidth,
                tileHeight: this.tileHeight,
            };
            if( !this.token) delete ArcGisMapServerImageryProvider.token;
            this._imagelayer.xbsjImageryProvider = {
                type: "ArcGisMapServerImageryProvider",
                ArcGisMapServerImageryProvider
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
  width: 60px;
  height: 16px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(224, 224, 224, 1);
  text-align: right;
}
</style>
