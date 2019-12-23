<template>
  <Window
    :footervisible="true"
    @cancel="show=false"
    @ok="ok"
    v-show="show"
    :width="463"
    :minWidth="202"
    :height="500"
    :left="5"
    :top="138"
    :title="lang.cloudtitle"
    class="xbsj-localImage"
  >
    <div v-if="selected!=null" class="localImageDiv">
      <!-- <label>服务地址:{{serverUrl(selected)}}</label> -->
      <div>
        <label class="localLabel">{{lang.address}}:</label>
        <input v-model="selectedUrl" readonly />
        <!-- <div class="localDiv">{{serverUrl(selected)}}</div>-->
      </div>
      <div>
        <label class="localLabel">{{lang.maxzoom}}:</label>
        <input v-model="selectedMaxzoom" readonly />
        <!-- <div class="localDiv">{{selected.maxzoom}}</div> -->
      </div>
      <div>
        <label class="localLabel">{{lang.dilifanwei}}:</label>
        <input :value="selected|f_range" readonly />
        <!-- <div class="localDiv">{{selected|f_range}}</div> -->
      </div>
    </div>

    <!-- 按照日期，按照item 双重遍历 -->
    <div class="contentDiv" :class="contentShow ? 'contentsDiv' : ''">
      <table border="1" cellpadding="0" cellspacing="0">
        <tr>
          <td>名称</td>
          <td>描述</td>
          <td>用户</td>
          <td>时间</td>
        </tr>
        <tr v-for="(value,index) in services" :key="index" @click="select(value)">
          <td>{{value.title}}</td>
          <td>{{value.desc}}</td>
          <td>{{value.username}}</td>
          <td>{{value.date}}</td>
        </tr>
      </table>
    </div>
  </Window>
</template>

<script>
import languagejs from "./imagery_locale";
export default {
  components: {},
  data () {
    return {
      show: false,
      services: [],
      key: "",
      error: "",
      selected: null,
      dayItems: [],
      selectedUrl: "",
      selectedMaxzoom: Number,
      contentShow: false,
      lang: {},
      langs: languagejs
    };
  },
  created () { },
  mounted () { },
  methods: {
    select (s) {
      this.selected = s;
      // console.log(this.selected);
      this.selectedUrl = this.serverUrl(s);
      this.selectedMaxzoom = this.selected.maxzoom;
      this.contentShow = true;
      this.error = "";
    },
    query () {
      var labServer = this.$root.$earthUI.labServer;

      this.dayItems = [];
      labServer
        .cloudlayers("image")
        .then(services => {
          this.services = services;
          for (var i = 0; i < this.services.length; i++) {
            this.services[i].west = (this.services[i].west * 180) / Math.PI;
            this.services[i].east = (this.services[i].east * 180) / Math.PI;
            this.services[i].south = (this.services[i].south * 180) / Math.PI;
            this.services[i].north = (this.services[i].north * 180) / Math.PI;
          }
        })
        .catch(err => {
          this.error = err;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    serverUrl (server) {
      return (
        this.$root.$earthUI.labServer.cloudServiceUrl +
        "/api/wmts/gettile/" +
        server._id +
        "/{z}/{x}/{y}&tk=248169fc4766127fb29c4e046e04ac0a"
      );
    },
    ok () {
      if (!this.selected) {
        this.error = this.lang.selectservice;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        //添加图层服务

        var imageLayer = new XE.Obj.Imagery(this.$root.$earth);

        imageLayer.xbsjImageryProvider = {
          type: "XbsjImageryProvider",
          XbsjImageryProvider: {
            url: this.serverUrl(this.selected),
            rectangle: [
              (this.selected.west * Math.PI) / 180,
              (this.selected.south * Math.PI) / 180,
              (this.selected.east * Math.PI) / 180,
              (this.selected.north * Math.PI) / 180
            ]
          }
        };

        imageLayer.rectangle = [
          (this.selected.west * Math.PI) / 180,
          (this.selected.south * Math.PI) / 180,
          (this.selected.east * Math.PI) / 180,
          (this.selected.north * Math.PI) / 180
        ];

        imageLayer.cutoutRectangle = [
          (this.selected.west * Math.PI) / 180,
          (this.selected.south * Math.PI) / 180,
          (this.selected.east * Math.PI) / 180,
          (this.selected.north * Math.PI) / 180
        ];

        //添加到场景树中
        this.$root.$earthUI.tools.sceneTree.addSceneObject(
          imageLayer,
          this.selected.title
        );

        this.show = false;
        this.error = "";
      }
    }
  },
  computed: {},
  filters: {
    f_day (day) { },
    f_range (item) {
      return (
        item.west.toFixed(5) +
        ", " +
        item.south.toFixed(5) +
        ", " +
        item.east.toFixed(5) +
        ", " +
        item.north.toFixed(5)
      );
    }
  },
  beforeDestroy () {
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.query();
      }
    }
  }
};
</script>

<style scoped>
.xbsj-localImage .localImageSeaarch,
.xbsj-localImage .localImageDiv {
  /* width: 500px; */
}
.xbsj-localImage .localImageDiv > div {
  margin-top: 10px;
}
.xbsj-localImage .localImageSeaarch > input,
.xbsj-localImage .localImageDiv input {
  width: calc(100% - 78px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-localImage .localImageDiv input {
  background: rgba(143, 143, 143, 0.6);
}
.xbsj-localImage .localImageSeaarchButton {
  width: 54px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
.xbsj-localImage .error {
  color: red;
}
.xbsj-localImage .contentDiv {
  overflow: auto;
  height: calc(100% - 29px);
}
.xbsj-localImage .contentsDiv {
  height: calc(100% - 142px);
}
.xbsj-localImage .dateDiv {
  overflow: hidden;
}
.xbsj-localImage .dateDiv .dateLabel {
  display: block;
  width: 70px;
  height: 14px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  color: #ffffff;
  text-align: center;
  line-height: 14px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.xbsj-localImage .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
}
.xbsj-localImage .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
}
.xbsj-localImage .backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
  position: relative;
  overflow: hidden;
}
.xbsj-localImage .backimg.highlight,
.xbsj-localImage .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-localImage .itemimg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 64px;
  height: 64px;
}
.xbsj-localImage .localLabel {
  display: inline-block;
  width: 54px;
  margin-top: 5px;
  text-align: right;
}
.xbsj-localImage .localDiv {
  display: inline-block;
  width: calc(100% - 56px);
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  margin-top: 5px;
}
.xbsj-localImage .xbsj-model-content-box {
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  height: calc(100% - 10px);
}
.xbsj-localImage .flexul li .localImageName {
  display: inline-block;
  width: 64px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-localImage .flexul li .localImageName .localImageToolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 23px;
  bottom: 30px;
}
.xbsj-localImage .flexul li .localImageName:hover .localImageToolTip {
  visibility: visible;
}
table {
  border: solid black;
  border-width: 0px 1px 1px 0px;
  width: 100%;
}
table td {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
}
table th {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
  font-size: 14px;
}
</style>
