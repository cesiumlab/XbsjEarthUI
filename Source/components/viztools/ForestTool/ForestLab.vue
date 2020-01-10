<template>
  <Window
    :width="500"
    :height="380"
    :floatright="true"
    :title="lang.forestlabtitle"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
    class="xbsj-localModel"
  >
    <!-- <div v-if="selected!=null" class="localModelDiv">
      <div>
        <label class="localLabel">{{lang.serveraddress}}:</label>
        <input v-model="selectedUrl" readonly />
      </div>
    </div>-->
    <!-- 按照日期，按照item 双重遍历 -->
    <div class="contentDiv" :class="contentShow ? 'contentsDiv' : ''">
      <div v-for="days in dayItems" :key="days.day" class="dateDiv">
        <label class="dateLabel">{{days.day}}</label>
        <ul class="flexul">
          <li
            v-for="s in days.services"
            @click="select(s)"
            @contextmenu.prevent="onContexMenu(s, $event)"
            :key="s.id"
          >
            <div class="backimg" :class="{highlight:selected == s}">
              <img class="itemimg" :src="s.thumbnail" />
            </div>
            <div class="localModelName">
              {{s.name}}
              <span class="localModelToolTip">{{s.name}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Window>
</template>
<script>
import languagejs from "./index_locale";
export default {
  props: {
    getBind: Function
  },
  data () {
    return {
      error: "",
      dayItems: [],
      selected: null,
      selectedUrl: "",
      contentShow: false,
      lang: {},
      langs: languagejs
    };
  },
  mounted () {
    this.query();
    this._czmObj = this.getBind();
  },
  methods: {
    _updateServerThumbnail (server, thumbnail) {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .updateLayerThumbnail("lodmodels", server._id, thumbnail)
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

      this.dayItems = [];
      labServer
        .Getlodmodels()
        .then(services => {
          this.error = "";
          for (let i = 0; i < services.length; i++) {
            let s = services[i];
            this._addServices(s);
          }
        })
        .catch(err => {
          this.error = err.message;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    serverUrl (server) {
      let path = server.path;
      let idx0 = path.lastIndexOf("\\");
      let idx1 = path.lastIndexOf("/");
      if (idx0 > 0) {
        path = path.substr(idx0 + 1);
      } else if (idx1 > 0) {
        path = path.substr(idx1 + 1);
      }
      if (path.indexOf(".clt") === path.length - 4) {
        path = "tileset.json";
      }
      var a = document.createElement("A");
      a.href =
        this.$root.$earthUI.labServer.server +
        "lodmodels/" +
        server._id +
        "/" +
        path;
      return a.href;
    },
    close () {
      this.$parent.destroyTool(this);
    },
    cancel () {
      this.close();
    },
    ok () {
      if (!this.selected) {
        this.error = this.lang.selectservice;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        this._czmObj.treeMetas.push({ name: this.selected.name, url: this.serverUrl(this.selected) });
        // this.forestlabList.push({
        //   name: this.selected.name,
        //   address: this.serverUrl(this.selected),
        //   ratio: 1,
        //   color: {
        //     rgba: { r: 255, g: 255, b: 0, a: 1 }
        //   }
        // });
        this.error = "";
      }
      this.close();
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
</style>