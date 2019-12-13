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
    class="xbsj-localModel"
  >
    <div v-if="selected!=null" class="localModelDiv">
      <!-- <label>服务地址:{{serverUrl(selected)}}</label> -->
      <div>
        <label class="localLabel">{{lang.address}}:</label>
        <input v-model="selectedUrl" readonly />
      </div>
    </div>

    <!-- 按照日期，按照item 双重遍历 -->
    <div class="contentDiv" :class="contentShow ? 'contentsDiv' : ''">
      <div class="dateDiv">
        <label class="dateLabel">{{lang.bimlabel}}</label>
        <table border="1" cellpadding="0" cellspacing="0">
          <tr>
            <td>名称</td>
            <td>描述</td>
            <td>用户</td>
            <td>时间</td>
          </tr>
          <tr v-for="(value,index) in bimServices" :key="index" @click="select(value)">
            <td>{{value.name}}</td>
            <td>{{value.desc}}</td>
            <td>{{value.username}}</td>
            <td>{{value.date}}</td>
          </tr>
        </table>
      </div>

      <div class="dateDiv">
        <label class="dateLabel">{{lang.photolabel}}</label>
        <table border="1" cellpadding="0" cellspacing="0">
          <tr>
            <td>名称</td>
            <td>描述</td>
            <td>用户</td>
            <td>时间</td>
          </tr>
          <tr v-for="(value,index) in ptotoServices" :key="index" @click="select(value)">
            <td>{{value.name}}</td>
            <td>{{value.desc}}</td>
            <td>{{value.username}}</td>
            <td>{{value.date}}</td>
          </tr>
        </table>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./model_locale";
export default {
  components: {},
  data () {
    return {
      show: false,
      bimServices: {},
      ptotoServices: {},
      key: "",
      error: "",
      selected: null,
      dayItems: [],
      selectedUrl: "",
      contentShow: false,
      lang: {},
      langs: languagejs
    };
  },
  created () { },
  mounted () { },
  methods: {
    _updateServerThumbnail (server, thumbnail) {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .updateLayerThumbnail("models", server._id, thumbnail)
        .then(data => {
          this.query();
        })
        .catch(err => {
          this.error = err.message;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    onContexMenu (server, event) {
      //弹出菜单
      this.$root.$earthUI.contextMenu.pop([
        {
          text: this.lang.updatethumb,
          keys: "",
          func: () => {
            //调用屏幕截图, 如果成功，那么调用更新
            this.$root.$earth
              .capture(64, 64)
              .then(img => {
                //更新，如果成功，那么刷新页面，否则提示错误
                this._updateServerThumbnail(server, img);
              })
              .catch(err => {
                this.error = err.message;
                this.$root.$earthUI.promptInfo(this.error, "error");
              });
          }
        }
      ]);
    },
    select (s) {
      this.selected = s;
      this.selectedUrl = this.serverUrl(s);
      this.contentShow = true;
      this.error = "";
    },
    _addServices (s) {
      //添加到列表中，并且按照天进行分组
      let day = s.date.substr(0, 10);

      for (let i = 0; i < this.dayItems.length; i++) {
        let days = this.dayItems[i];
        if (days.day == day) {
          days.services.push(s);
          return;
        }
      }
      var newDays = {
        day,
        services: [s]
      };
      this.dayItems.push(newDays);
    },
    query () {
      this.error = "";
      var labServer = this.$root.$earthUI.labServer;

      labServer
        .cloud3dtiles("bim")
        .then(services => {
          this.bimServices = services;
          for (var i = 0; i < this.bimServices.length; i++) {
            this.bimServices[i].type = "bim";
          }
        })
        .catch(err => {
          this.error = err;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });

      labServer
        .cloud3dtiles("photo")
        .then(services => {
          this.photoServices = services;
          for (var i = 0; i < this.photoServices.length; i++) {
            this.photoServices[i].type = "photo";
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
        "/api/3dtiles/" +
        server.type +
        "/" +
        server._id +
        "/tileset.json"
      );
    },
    ok () {
      if (!this.selected) {
        this.error = this.lang.selectservice;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        //添加图层服务
        const tileset = new XE.Obj.Tileset(this.$root.$earth);

        tileset.url = this.serverUrl(this.selected);

        //添加到场景树中
       this.$root.$earthUI.tools.sceneTree.addSceneObject(
          tileset,
          this.selected.name
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
.xbsj-localModel .localModelDiv > div {
  margin-top: 10px;
}
.xbsj-localModel .error {
  color: red;
}
.xbsj-localModel .contentDiv {
  overflow: auto;
  height: calc(100% - 29px);
}
.xbsj-localModel .contentsDiv {
  height: calc(100% - 68px);
}
.xbsj-localModel .dateDiv {
  overflow: hidden;
}
.xbsj-localModel .dateDiv .dateLabel {
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
.xbsj-localModel .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
}
.xbsj-localModel .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
}
.xbsj-localModel .backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
  position: relative;
  overflow: hidden;
}
.xbsj-localModel .backimg.highlight,
.xbsj-localModel .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-localModel .itemimg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 64px;
  height: 64px;
}
.xbsj-localModel .localModelSeaarch > input,
.xbsj-localModel .localModelDiv input {
  width: calc(100% - 78px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-localModel .localModelDiv input {
  background: rgba(143, 143, 143, 0.6);
}
.xbsj-localModel .localModelSeaarchButton {
  width: 53px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
.xbsj-localModel .flexul li .localModelName {
  display: inline-block;
  width: 64px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-localModel .flexul li .localModelName .localModelToolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 14px;
  bottom: 30px;
}
.xbsj-localModel .flexul li .localModelName:hover .localModelToolTip {
  visibility: visible;
}
.xbsj-localModel .dateDiv .dateLabel {
  height: 26px;
  line-height: 26px;
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
