<template>
  <Window
    @cancel="cancel"
    v-show="show"
    :height="420"
    :width="500"
    :minWidth="202"
    :left="200"
    :top="138"
    :title="lang.online.title"
    class="xbsj-onlineSymbol"
  >
    <div class="onlineSymbolBox">
      <div class="onlineSymbolDiv">
        <label>{{lang.online.label}}:</label>
        <input v-model="label" @keyup.enter="getonlineinfo" />
        <button @click="getonlineinfo" class="seaarchButton">{{lang.search}}</button>
      </div>
    </div>

    <ul class="flexul" :class="showContent ? 'contentUl' : ''">
      <li v-for="s in symbols" @click="createGroundImage(s)" :key="s._id">
        <div :class="[{highlight:selected == s} ]" class="backimg">
          <img style="width:128px;height:128px;" :src="s.thumbnail" alt />
        </div>
        <div class="onlinImageName">
          {{getName(s)}}
          <span class="onlineSymbolToolTip" v-html="getDetail(s)"></span>
        </div>
      </li>
    </ul>
  </Window>
</template>

<script>
import languagejs from "./locale";
import axios from "axios";
export default {
  components: {},
  data () {
    return {
      langs: languagejs,
      show: false,
      error: "",
      selected: null,
      label: "",
      lang: undefined,
      showContent: false,
      symbols: []
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
      let param = {};
      if (this.label !== undefined && this.label !== '') {
        param.queryfields = 'label';
        param.querykeys = this.label;
      }
      labServer.getShareSymbol(param)
        .then(res => {
          if (res.status === "ok") {
            this.symbols = res.result;
          } else {
            this.symbols = [];
            this.$root.$earthUI.promptInfo(res.status, "info");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    shareSymbolAddCount () {
      var labServer = this.$root.$labServer;
      labServer.shareSymbolAddCount(this.symbol.shareID)
        .then(res => {
          if (res.status === "ok") {

          } else {
            console.log(res.status)
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
    createGroundImage (s) {
      let self = this;
      var labServer = this.$root.$labServer;
      labServer.getContentById(s._id).then(content => {
        if (self.symbol && self.symbol.isCreating) { // 新创建的，没确定之前，又选择了其他图标
          self.symbol.destroy()
        }
        self.symbol = XE.Core.XbsjObject.createObject(content.xbsjType, self.$root.$earth);
        self.symbol.xbsjFromJSON(content);
        self.symbol.isCreating = true;
        self.symbol.shareID = s._id;
        self.symbol._callback = self.shareSymbolAddCount;
        self.$root.$earthUI.showPropertyWindow(self.symbol);
        self.symbol.creating = true;
      })
        .catch(err => {
          console.log(err)
        });
    },
    cancel () {
      this.show = false;
    },
    getName (s) {
      if (!s) return this.lang.unName;

      return s.name;
    },
    getDetail (s) {
      if (!s) return this.lang.unName;
      var info = "名称：" + s.name + '<br>' +
        "标签：" + s.label + '<br>' +
        "分享用户：" + s.username + '<br>' +
        "分享时间：" + s.share_date + '<br>' +
        "使用次数：" + s.used + '<br>' +
        "描述：" + s.desc;
      return info;
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
.xbsj-onlineSymbol .error {
  color: red;
}
.xbsj-onlineSymbol .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 86px);
}
.xbsj-onlineSymbol .contentUl {
  overflow-x: hidden;
  height: calc(100% - 124px);
}
.xbsj-onlineSymbol .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
  height: 158px;
}
.xbsj-onlineSymbol .flexul li .onlinImageName {
  display: inline-block;
  width: 128px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-onlineSymbol .flexul li .onlineSymbolToolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: left;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 0px;
  top: 0px;
  max-width: 160px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-y: auto;
}
.xbsj-onlineSymbol .backimg {
  width: 128px;
  height: 128px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
}
.xbsj-onlineSymbol .backimg.highlight,
.xbsj-onlineSymbol .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-model-content-box {
  overflow-x: hidden;
  /* overflow-y: hidden; */
}
.xbsj-onlineSymbol .onlineSymbolDiv {
  margin: 10px 10px;
}
.xbsj-onlineSymbol .onlineSymbolDiv > label {
  display: inline-block;
  width: 52px;
  text-align: right;
  margin-right: 15px;
  float: left;
  margin-top: 6px;
}
.xbsj-onlineSymbol .onlineSymbolDiv > input {
  width: calc(100% - 140px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-onlineSymbol .onlineSymbolzb {
  width: 470px;
  height: 28px;
}
.xbsj-onlineSymbol .onlineSymbolBox {
  /* width: 500px; */
}
.xbsj-onlineSymbol .flexul li:hover .onlineSymbolToolTip {
  visibility: visible;
}
.xbsj-onlineSymbol .seaarchButton {
  width: 54px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
</style>
