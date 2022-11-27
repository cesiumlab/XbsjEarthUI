<template>
  <div class="xbsj-nav-parents">
    <div class="xbsj-nav" @click="hidePopup" v-show="show">
      <ul class="xbsj-title-ul">
        <li
          @click="switchPage('navigates')"
          :class="{ 'xbsj-title-item-on': page == 'navigates' }"
        >
          <div class="navs-title-images navs-images-roam"></div>
          <div>{{ lang.roam }}</div>
        </li>
        <li
          @click="switchPage('view')"
          :class="{ 'xbsj-title-item-on': page == 'view' }"
        >
          <div class="navs-title-images navs-images-view_nav"></div>
          <div>{{ lang.view }}</div>
        </li>
        <li
          @click="switchPage('imagery')"
          :class="{ 'xbsj-title-item-on': page == 'imagery' }"
        >
          <div class="navs-title-images navs-images-imagery"></div>
          <div>{{ lang.images }}</div>
        </li>
        <li
          @click="switchPage('model')"
          :class="{ 'xbsj-title-item-on': page == 'model' }"
        >
          <div class="navs-title-images navs-images-model"></div>
          <div>{{ lang.model }}</div>
        </li>
        <li
          @click="switchPage('terrain')"
          :class="{ 'xbsj-title-item-on': page == 'terrain' }"
        >
          <div class="navs-title-images navs-images-terrain_nav"></div>
          <div>{{ lang.terrain }}</div>
        </li>
        <li
          @click="switchPage('analysis')"
          :class="{ 'xbsj-title-item-on': page == 'analysis' }"
        >
          <div class="navs-title-images navs-images-analysis"></div>
          <div>{{ lang.analysis }}</div>
        </li>
        <li
          @click="switchPage('effect')"
          :class="{ 'xbsj-title-item-on': page == 'effect' }"
        >
          <div class="navs-title-images navs-images-effect"></div>
          <div>{{ lang.effect }}</div>
        </li>

        <li
          @click="switchPage('entity')"
          :class="{ 'xbsj-title-item-on': page == 'entity' }"
        >
          <div class="navs-title-images navs-images-plotting"></div>
          <div>{{ lang.plotting }}</div>
        </li>
        <li
          @click="switchPage('other')"
          :class="{ 'xbsj-title-item-on': page == 'other' }"
        >
          <div class="navs-title-images navs-images-other"></div>
          <div>{{ lang.other }}</div>
        </li>
        <!-- <li @click="openmodel">测试model对话框</li> -->
      </ul>

      <!-- <Modal :visible="visible" @cancel="cancelmodal" @confirm="confirm">
        <p>我是想要提示的内容</p>
          <p>我是想要提示的内容</p>
            <p>我是想要提示的内容</p>  
      </Modal>-->
      <!-- 七大组件部分 -->

      <div>
        <NavigateComp
          ref="navigate"
          v-show="page == 'navigates'"
          :labServiceUI="labServiceUI"
        ></NavigateComp>
        <XbsjViewComp ref="view" v-show="page == 'view'"></XbsjViewComp>
        <ImageryComp
          ref="imagery"
          v-show="page == 'imagery'"
          :cloudServiceUI="cloudServiceUI"
          :labServiceUI="labServiceUI"
        ></ImageryComp>
        <TilesetComp
          ref="model"
          v-show="page == 'model'"
          :cloudServiceUI="cloudServiceUI"
          :labServiceUI="labServiceUI"
        ></TilesetComp>
        <TerrainComp
          ref="terrain"
          v-show="page == 'terrain'"
          :cloudServiceUI="cloudServiceUI"
          :labServiceUI="labServiceUI"
        ></TerrainComp>
        <AnalysisComp ref="analysis" v-show="page == 'analysis'"></AnalysisComp>
        <EffectComp ref="effect" v-show="page == 'effect'"></EffectComp>
        <EntityComp ref="entity" v-show="page == 'entity'"></EntityComp>
        <OtherComp ref="other" v-show="page == 'other'"></OtherComp>
      </div>
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
import OtherComp from "./Other";
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
    EntityComp,
    OtherComp,
  },
  data: function () {
    return {
      show: true,
      page: "", //当前显示的页面
      lang: {},
      visible: false,
      labServiceUI: true,
      cloudServiceUI: false,
      langs: languagejs,
    };
  },
  created() {},
  mounted() {
    // var search = window.location.search;
    // window.labserver = this.getSearchString("labserver", search);
    // if (window.labserver !== undefined) {
    //   this.$root.$labServer.server = window.labserver;
    // }
  },
  methods: {
    // //key(需要检索的键） url(传入的需要分割的url地址)
    // getSearchString(key, Url) {
    //   var str = Url;
    //   str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
    //   // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
    //   var arr = str.split("&");
    //   var obj = new Object();
    //   // 将每一个数组元素以=分隔并赋给obj对象
    //   for (var i = 0; i < arr.length; i++) {
    //     var tmp_arr = arr[i].split("=");
    //     obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    //   }
    //   return obj[key];
    // },
    openmodel() {
      this.$root.$earthUI.confirm(
        "xxxx",
        () => {},
        () => {}
      );
    },
    cancelmodal() {
      this.visible = false;
    },
    confirm() {
      alert("我点击了确定");
      this.visible = false;
    },
    hidePopup(event) {},
    switchPage(page) {
      this.$emit("hidePopup");
      //控制组件显示隐藏
      if (this.page == page) {
        this.page = "";
      } else {
        this.page = page;
      }
    },
    showPage(page) {
      this.$emit("hidePopup");
      this.page = page;
    },
    getSize() {
      //获取当前组件的大小
      return {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight,
      };
    },
  },
};
</script>

<style>
.xbsj-nav-parents {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background: #474747;
}
.xbsj-nav {
  position: relative;
  height: 100%;
}
/* .xbsj-template {
  width: 100%;
  height: 96px;
  background: rgba(107, 107, 107, 1);
} */
.xbsj-title-ul {
  margin: 0;
  padding: 0;
  width: 70px;
  background: #474747;
  height: 100%;
}
/* 主NAV空间大小和字体 */
.xbsj-title-ul li {
  /* float: left; */
  padding: 15px 15px;
  list-style: none;
  font-size: 10px;
  text-align: center;
  line-height: 25px;
  color: rgb(180, 180, 180);
  /* border: 1px solid; */
  cursor: pointer;
}
.xbsj-title-ul li:hover {
  background: #6b6b6b;
}
.xbsj-title-item-on {
  background: #6b6b6b;
}

.navs-title-images{
    width: 28px;
    height: 28px;
    background-position: center !important;
    cursor: pointer;
}
</style>

