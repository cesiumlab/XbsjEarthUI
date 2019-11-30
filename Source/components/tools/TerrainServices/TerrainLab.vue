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
    :title="lang.localtitle"
    class="xbsj-localTerrain"
  >
    <div class="localTerrainSeaarch">
      <input v-model="key" @keyup.enter="query" />
      <button @click="query" class="localTerrainSeaarchButton">{{lang.search}}</button>
      <!-- <label v-show="error!=''" class="error">{{error}}</label> -->
    </div>
    <div v-if="selected!=null" class="localTerrainDiv">
      <div>
        <!-- <label>服务地址:{{serverUrl(selected)}}</label> -->
        <label class="localLabel">{{lang.address}}:</label>
        <input v-model="selectedUrls" readonly />
      </div>
      <div>
        <!-- <label>最大级别:{{selected.maxzoom}}</label> -->
        <label class="localLabel">{{lang.maxzoom}}:</label>
        <input v-model="selectedMaxzoom" readonly />
      </div>
      <div>
        <!-- <label>地理范围:{{selected|f_range}}</label> -->
        <label class="localLabel">{{lang.dilifanwei}}:</label>
        <input :value="selected|f_range" readonly />
      </div>
    </div>

    <!-- 按照日期，按照item 双重遍历 -->
    <div class="contentDiv" :class="contentShow ? 'contentsDiv' : ''">
      <div v-for="days in dayItems" :key="days.day" class="dateDiv">
        <label class="dateLabel">{{days.day}}</label>
        <ul class="flexul">
          <li
            v-for="s in days.services"
            @click="select(s)"
            @contextmenu.prevent="onContexMenu(s, $event)"
            :key="s.name"
          >
            <div class="backimg" :class="{highlight:selected == s}">
              <img class="itemimg" :src="s.thumbnail" />
            </div>
            <!-- <span>{{s.name}}</span> -->
            <div class="localTerrainName">
              {{s.name}}
              <span class="localTerrainToolTip">{{s.name}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./terrain_locale";
export default {
  components: {},
  data() {
    return {
      show: false,
      key: "",
      error: "",
      selected: null,
      dayItems: [],
      selectedUrls: "",
      selectedMaxzoom: Number,
      contentShow: false,
      lang: {},
      langs: languagejs
    };
  },
  created() {
    
  },
  mounted() {},
  methods: {
    _updateServerThumbnail(server, thumbnail) {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .updateLayerThumbnail("terrains", server._id, thumbnail)
        .then(data => {
          this.query();
        })
        .catch(err => {
          this.error = err.message;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    onContexMenu(server, event) {
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
    select(s) {
      this.selected = s;
      this.selectedUrls = this.serverUrl(s);
      this.selectedMaxzoom = this.selected.maxzoom;
      this.contentShow = true;
      this.error = "";
    },
    _addServices(s) {
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
    query() {
      this.error = "";
      var labServer = this.$root.$earthUI.labServer;

      this.dayItems = [];
      labServer
        .terrainLayers(this.key)
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
    serverUrl(server) {
      var a = document.createElement('A');
      a.href = this.$root.$earthUI.labServer.server + "terrain/" + server._id;
      return a.href;
    },
    ok() {
      if (!this.selected) {
        this.error = this.lang.selectservice;
        this.$root.$earthUI.promptInfo(this.error, "error");
      } else {
        var terrain = new XE.Obj.Terrain(this.$root.$earth);
        terrain.xbsjTerrainProvider = {
          type: "XbsjCesiumTerrainProvider",
          XbsjCesiumTerrainProvider: {
            url: this.serverUrl(this.selected),
            requestVertexNormals: true,
            requestWaterMask: true
          }
        };

        terrain.rectangle = [
          (this.selected.west * Math.PI) / 180,
          (this.selected.south * Math.PI) / 180,
          (this.selected.east * Math.PI) / 180,
          (this.selected.north * Math.PI) / 180
        ];

        //添加到场景树中
        this.$root.$earthUI.tools.sceneTree.addSceneObject(
          terrain,
          this.selected.name
        );

        this.show = false;
        this.error = "";
      }
    }
  },
  computed: {},
  filters: {
    f_day(day) {},
    f_range(item) {
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
  beforeDestroy() {
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
  },
  watch: {
    show(v) {
      if (v) {
        this.query();
      }
    }
  }
};
</script>

<style scoped>
.xbsj-localTerrain .error {
  color: red;
}
.xbsj-localTerrain .contentDiv {
  overflow: auto;
  height: calc(100% - 29px);
}
.xbsj-localTerrain .contentsDiv {
  height: calc(100% - 142px);
}
.xbsj-localTerrain .dateDiv {
  overflow: hidden;
}
.xbsj-localTerrain .dateDiv .dateLabel {
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
.xbsj-localTerrain .flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
}
.xbsj-localTerrain .flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
}
.xbsj-localTerrain .backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
  position: relative;
  overflow: hidden;
}
.xbsj-localTerrain .backimg.highlight,
.xbsj-localTerrain .backimg:hover {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-localTerrain .itemimg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 64px;
  height: 64px;
}
.xbsj-localTerrain .localLabel {
  display: inline-block;
  width: 54px;
  margin-top: 5px;
  text-align: right;
}
.xbsj-localTerrain .localDiv {
  display: inline-block;
  width: calc(100% - 56px);
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  margin-top: 5px;
}
.xbsj-localTerrain .flexul li .localTerrainName {
  display: inline-block;
  width: 64px;
  text-align: center;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xbsj-localTerrain .flexul li .localTerrainName .localTerrainToolTip {
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
.xbsj-localTerrain .flexul li .localTerrainName:hover .localTerrainToolTip {
  visibility: visible;
}
.xbsj-localTerrain .localTerrainDiv > div {
  margin-top: 10px;
}
.xbsj-localTerrain .localTerrainSeaarch > input,
.xbsj-localTerrain .localTerrainDiv input {
  width: calc(100% - 78px);
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 0 5px;
}
.xbsj-localTerrain .localTerrainDiv input {
  background: rgba(143, 143, 143, 0.6);
}
.xbsj-localTerrain .localTerrainSeaarchButton {
  width: 54px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
}
</style>
