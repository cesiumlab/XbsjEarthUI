<template>
  <Window
    @cancel="cancel"
    v-show="show"
    :height="550"
    :width="690"
    :minWidth="500"
    :left="200"
    :top="138"
    :title="lang.online.title"
    class="xbsj-onlineSymbol"
  >
    <div class="onlineSymbolBox">
      <div class="onlineSymbolDiv">
        <!-- <label>{{lang.online.label}}:</label> -->
        <input v-model="label" @keyup.enter="query" />
        <button @click="query" class="seaarchButton">
          <img src="../../../images/search2.png" />
          {{lang.search}}
        </button>
        <button @click="orderByUsageCount" class="usednumButton">{{lang.usednum}}</button>
        <button @click="orderByShareDate" class="lastTimeButton">{{lang.lasttime}}</button>
      </div>
    </div>

    <ul ref="symbolList" class="flexul" :class="showContent ? 'contentUl' : ''">
      <li v-for="s in symbols" @click="createGroundImage(s)" :key="s._id">
        <div :class="[{highlight:selected == s} ]" class="backimg">
          <img :src="s.thumbnail" alt />
          <div>
            <span class="date">{{s.share_date|f_time}}</span>
            <span class="auther">{{s.username}}</span>
          </div>
        </div>
        <div class="onlinImageName">
          <span class="name">{{getName(s)}}</span>
          <span class="used">{{s.usage_count}}次下载</span>
          <p>{{s.desc}}</p>
          <!-- <span class="onlineSymbolToolTip" v-html="getDetail(s)"></span> -->
        </div>
      </li>
    </ul>
  </Window>
</template>

<script>
import languagejs from "./locale";
import axios from "axios";
import moment from "moment";
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
      symbols: [],
      param: {
        skip: 0,
        pagesize: 10,
        order: 'usage_count'
      }
    };
  },
  mounted () {
    this.$nextTick(function () {
      this.$refs.symbolList.addEventListener('scroll', this.onScroll)
    })
  },
  created () { },
  watch: {
    show () {
      this.symbols = [];
      this.param.skip = 0;
      this.label = null;
      this.getonlineinfo();
    }
  },
  methods: {
    // 滚动事件触发下拉加载
    onScroll () {
      if (this.$refs.symbolList.scrollHeight - this.$refs.symbolList.clientHeight - this.$refs.symbolList.scrollTop <= 0) {
        this.param.skip += this.param.pagesize;
        // 调用请求函数
        this.getonlineinfo();
      }
    },
    query () {
      this.symbols = [];
      this.param.skip = 0;
      if (this.label !== undefined && this.label !== null && this.label !== '') {
        this.param.queryfields = 'label';
        this.param.querykeys = this.label;
      } else {
        this.param.queryfields = null;
        this.param.querykeys = null;
      }
      this.getonlineinfo();
    },
    orderByUsageCount () {
      this.param.order = 'usage_count';
      this.query();
    },
    orderByShareDate () {
      this.param.order = 'share_date';
      this.query();
    },
    getonlineinfo () {
      let self = this;
      var labServer = this.$root.$labServer;
      labServer.getShareSymbol(this.param)
        .then(res => {
          self.symbols = [];
          if (res.status === "ok") {
            self.symbols.push(...res.result);
          } else {
            self.$root.$earthUI.promptInfo(res.status, "info");
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
        if (self.symbol.xbsjType === 'Imagery' || self.symbol.xbsjType === 'Terrain' || self.symbol.xbsjType === 'Tileset') {
          //直接添加到场景树中
          var symbol = XE.Core.XbsjObject.createObject(content.xbsjType, self.$root.$earth);
          symbol.xbsjFromJSON(content);
          self.$root.$earthUI.tools.sceneTree.addSceneObject(
            symbol,
            symbol.name
          );
          self.symbol.destroy();
        } else {
          self.symbol.isCreating = true;
          self.symbol.shareID = s._id;
          self.symbol._callback = self.shareSymbolAddCount;
          self.$root.$earthUI.showPropertyWindow(self.symbol);
          self.symbol.creating = true;
        }
      })
        .catch(err => {
          console.log(err)
        });
    },
    cancel () {
      this.show = false;
    },
    getName (s) {
      if (!s.name) return this.lang.unName;

      return s.name;
    },
    getDetail (s) {
      if (!s) return this.lang.unName;
      var info =
        "名称：" +
        s.name +
        "<br>" +
        "标签：" +
        s.label +
        "<br>" +
        "分享用户：" +
        s.username +
        "<br>" +
        "分享时间：" +
        s.share_date +
        "<br>" +
        "使用次数：" +
        s.usage_count +
        "<br>" +
        "描述：" +
        s.desc;
      return info;
    }
  },
  computed: {},
  filters: {
    f_time (data) {
      return moment(data).format("YYYY/M/D");
    }
  },
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
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 86px);
  margin: 0 18px;
}
.xbsj-onlineSymbol .contentUl {
  overflow-x: hidden;
  height: calc(100% - 124px);
}
.xbsj-onlineSymbol .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
  width: 192px;
  height: 196px;
  margin-right: 20px;
  margin-bottom: 16px;
  cursor: pointer;
}
.xbsj-onlineSymbol .flexul li .onlinImageName {
  display: inline-block;
  width: 100%;
  height: 70px;
}
.onlinImageName .name {
  font-size: 14px;
}
.onlinImageName .used {
  font-size: 12px;
  float: right;
}
.onlinImageName p {
  font-size: 12px;
  color: #ffffff;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 将对象作为弹性伸缩盒子模型显示 */
  display: -webkit-box;
  /* 用来限制在一个块元素显示的文本的行数,2表示最多显示2行。 为了实现该效果，它需要组合其他的WebKit属性 */
  -webkit-line-clamp: 2;
  /* 置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-box-orient: vertical;
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
  width: 100%;
  height: 128px;
  background: gray;
  position: relative;
  margin-bottom: 14px;
  border-radius: 4px;
}
.backimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.backimg div {
  display: inline-block;
  width: 100%;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  bottom: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.backimg div span {
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}
.backimg div .date {
  float: left;
  margin-left: 4px;
}
.backimg div .auther {
  float: right;
  margin-right: 4px;
}
/* .xbsj-onlineSymbol .backimg.highlight,
.xbsj-onlineSymbol .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
} */
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
  width: calc(100% - 314px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
  margin-left: 8px;
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
  width: 80px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
.seaarchButton img {
  margin-top: -3px;
  vertical-align: middle;
  margin-right: 2px;
}
.usednumButton,
.lastTimeButton {
  width: 70px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
</style>
