<template>
  <div class="xbsj-nav" @click="hidePopup" v-show="show">
    <ul class="xbsj-title-ul">
      <li
        @click="switchPage('navigate')"
        :class="{'xbsj-title-item-on':page=='navigate'}"
      >{{lang.roam}}</li>
      <li
        @click="switchPage('view')"
        :class="{'xbsj-title-item-on':page=='view'}"
      >{{lang.view}}</li>
      <li
        @click="switchPage('imagery')"
        :class="{'xbsj-title-item-on':page=='imagery'}"
      >{{lang.images}}</li>
      <li
        @click="switchPage('model')"
        :class="{'xbsj-title-item-on':page=='model'}"
      >{{lang.model}}</li>
      <li
        @click="switchPage('terrain')"
        :class="{'xbsj-title-item-on':page=='terrain'}"
      >{{lang.terrain}}</li>
      <li
        @click="switchPage('analysis')"
        :class="{'xbsj-title-item-on':page=='analysis'}"
      >{{lang.analysis}}</li>
      <li
        @click="switchPage('effect')"
        :class="{'xbsj-title-item-on':page=='effect'}"
      >{{lang.effect}}</li>
      <!--
      <li
        @click="switchPage('entity')"
        :class="{'xbsj-title-item-on':page=='entity'}"
      >{{lang.plotting}}</li>-->
      <!-- <li @click="openmodel">测试model对话框</li> -->
    </ul>
 
    <!-- <Modal :visible="visible" @cancel="cancelmodal" @confirm="confirm">
      <p>我是想要提示的内容</p>
        <p>我是想要提示的内容</p>
          <p>我是想要提示的内容</p>  
    </Modal> -->
    <!-- 七大组件部分 -->
    <div>
      <NavigateComp ref="navigate" v-show="page=='navigate'"></NavigateComp>
      <XbsjViewComp ref="view" v-show="page=='view'"></XbsjViewComp>
      <ImageryComp ref="imagery" v-show="page=='imagery'"></ImageryComp>
      <TilesetComp ref="model" v-show="page=='model'"></TilesetComp>
      <TerrainComp ref="terrain" v-show="page=='terrain'"></TerrainComp>
      <AnalysisComp ref="analysis" v-show="page=='analysis'"></AnalysisComp>
      <EffectComp ref="effect" v-show="page=='effect'"></EffectComp>
      <EntityComp ref="entity" v-show="page=='entity'"></EntityComp>
    </div>
  </div>
</template>

<script> 
import NavigateComp from "./Navigate";
import XbsjViewComp from "./View";
import ImageryComp from "./Imagery";
import TilesetComp from "./Tileset";
import TerrainComp from "./Terrain";
import AnalysisComp from "./Analysis";
import EffectComp from "./Effect";
import EntityComp from "./Entity"; 
import languagejs from "./index_locale";

export default {
  components: {
    NavigateComp,
    XbsjViewComp,
    ImageryComp,
    TilesetComp,
    TerrainComp,
    AnalysisComp,
    EffectComp,
    EntityComp 
  },
  data: function() {
    return {
      show:true,
      page: "navigate", //当前显示的页面
      lang: {},
      visible:false,
      langs:languagejs
    };
  },
  created() {
    
  },
  mounted() {
   
  },
  methods: {
    openmodel(){
       this.$root.$earthUI.confirm("xxxx",()=>{

       },()=>{

       });
    },
    cancelmodal(){
      this.visible = false;
    },
    confirm(){
      alert("我点击了确定");
      this.visible = false;
    },
    hidePopup(event) {
     
    },
    switchPage(page) {
      this.$emit("hidePopup");
      //控制组件显示隐藏
      if (this.page == page) {
        this.page = "";
      } else {
        this.page = page;
      }
    },
    showPage(page){
        this.$emit("hidePopup");
        this.page = page;
    },
    getSize() {
      //获取当前组件的大小
      return {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      };
    }
  }
};
</script>

<style>
.xbsj-nav {
  z-index: 9999;
  position: relative;
}
/* .xbsj-template {
  width: 100%;
  height: 96px;
  background: rgba(107, 107, 107, 1);
} */
.xbsj-title-ul {
  margin: 0;
  padding: 0;
  width: 100%;
  background: #474747;
  height: 41px;
  min-width: 656px;
}
.xbsj-title-ul li {
  float: left;
  padding: 10px 20px;
  list-style: none;
  font-size: 14px;
  /* border: 1px solid; */
  cursor: pointer;
}
.xbsj-title-ul li:hover {
  background: #6b6b6b;
}
.xbsj-title-item-on {
  background: #6b6b6b;
}
</style>

