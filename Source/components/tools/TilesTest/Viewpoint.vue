<template>
  <div @mousedown="startMove($event)" @mousemove="onMoving($event)" @mouseup="endMove($event)">
    <div class="content">
      <div class="flatten">
        <div>
          <label style="margin-top: 20px;">{{lang.viewPoint}}</label>
          <div
            class="viewbox"
            @click="clickItem(index,$event)"
            @drop="viewpoint_drop($event)"
            @dragover="viewpoint_dragover($event)"
            @dragleave="viewpoint_dragleave($event)"
          >
            <img
              :src="item.thumbnail"
              @contextmenu.prevent="onContexMenu(index, $event)"
              :disabled="state === lang.stop"
            />
            <label class="xbsj-check">{{item.name}}</label>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <label>{{lang.interval}}</label>
          <input type="text" v-model.number="interval" style="cursor: pointer;" />
          <span>{{lang.ms}}</span>
        </div>
      </div>
      <div class="flatten" style="margin-top: 20px;">
        <label>3dtiles</label>
        <div
          @drop="tileset_drop($event)"
          @dragover="tileset_dragover($event)"
          @dragleave="tileset_dragleave($event)"
        >
          <table border="1" cellpadding="0" cellspacing="0">
            <tr>
              <td>{{lang.order}}</td>
              <td>
                <div class="dragButton" :class="{highlight:tileset_over}">{{lang.nametip}}</div>
              </td>
              <td>{{lang.operation}}</td>
            </tr>
            <tr v-for="(value,index) in tiles" :key="index">
              <td>{{index + 1}}</td>
              <td>{{value.name}}</td>
              <td>
                <input
                  type="button"
                  class="pathfly-btn del"
                  @click="deleteTiles(index)"
                  :disabled="state === lang.stop"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="footer">
      <button
        @click="testStateChange"
        style="margin-right: 20px;"
        :disabled="tiles.length === 0 || item.name === ''"
      >{{state}}</button>
    </div>
  </div>
</template>

<script>
import languagejs from "./locale";

export default {
  name: "Viewpoint",
  data () {
    return {
      lang: {},
      state: "",
      tiles: [],
      tileset_over: false,
      langs: languagejs,
      currentTilesetIndex: 0,
      resultIndex: 1,
      interval: 500,
      intervalId: null,
      tilesetRecord: null,
      numberOfPendingRequests: 0,
      numberOfTilesProcessing: 0,
      results: [],
      item: {
        name: "",
        thumbnail: ""
      }
    };
  },
  mounted () {
    this.state = this.lang.start;
  },
  methods: {
    testStateChange () {
      if (this.state === this.lang.start) {
        this.startTest();
      } else {
        this.stopTest();
      }
    },
    startTest () {
      for (var i = 0; i < this.tiles.length; i++) {
        this.$root.$earth.getObject(this.tiles[i].id).enabled = false;
      }
      this.currentTilesetIndex = 0;
      this.results = [];
      this.testSingleTileset();
      this.state = this.lang.stop;
    },
    stopTest () {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.$emit("testfinished", this.results);
      this.state = this.lang.start;
    },
    testSingleTileset () {
      let self = this;
      let earth = this.$root.$earth;
      // this._viewpoint.duration = 0;
      earth.cameraViewManager.globe.flyTo().then(() => {
        self._tileset = new XE.Obj.Tileset(self.$root.$earth);
        self._tileset.xbsjFromJSON(
          this.tiles[this.currentTilesetIndex].content
        );
        self._tileset.enabled = true;
        self._tileset._tileset.allTilesLoaded.addEventListener(() => {
          self.testNextTileset();
        });
        self._tileset._tileset.loadProgress.addEventListener(function (
          numberOfPendingRequests,
          numberOfTilesProcessing
        ) {
          self.numberOfPendingRequests = numberOfPendingRequests;
          self.numberOfTilesProcessing = numberOfTilesProcessing;
        });
        self.results.push({});
        self.tilesetRecord = self.results[self.results.length - 1];
        self.tilesetRecord.tileset = self._tileset.toJSON();
        self.tilesetRecord.data = [];
        self.resultIndex = 1;
        self.startTimeout();
        self._viewpoint.flyTo();
      });
    },
    testNextTileset () {
      this.currentTilesetIndex++;
      this._tileset.destroy();
      this._tileset = null;
      if (this.currentTilesetIndex === this.tiles.length) {
        this.stopTest();
        return;
      }
      this.testSingleTileset();
    },
    startTimeout () {
      let self = this;
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.intervalId = setInterval(() => {
        self.record();
      }, this.interval);
    },
    record () {
      if (this._tileset && this._tileset._tileset) {
        var record = {};
        record.time = this.resultIndex * this.interval;
        record.fps = this.$root.$earth.status.fps;
        record.numberOfPendingRequests = this.numberOfPendingRequests;
        record.numberOfTilesProcessing = this.numberOfTilesProcessing;
        for (var p in this._tileset._tileset.statistics) {
          record[p] = this._tileset._tileset.statistics[p];
        }
        // record.tileset = this._tileset._tileset.statistics;
        this.tilesetRecord.data.push(record);
        this.resultIndex++;
      }
    },
    getCzmObjectFromDrag (dataTransfer) {
      for (let i = 0; i < dataTransfer.types.length; i++) {
        var t = dataTransfer.types[i];
        if (!t) continue;
        if (t.startsWith("_czmobj_")) {
          let guid = t.substring(8);

          return this.$root.$earth.getObject(guid);
        }
      }
      return undefined;
    },
    tileset_dragover (e) {
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        czmObj.xbsjType === "Tileset" &&
        this.state === this.lang.start
      ) {
        e.dataTransfer.dropEffect = "copy";
        this.tileset_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    tileset_dragleave () {
      this.tileset_over = false;
    },
    tileset_drop (e) {
      this.tileset_over = false;
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.xbsjType === "Tileset") {
        var content = czmObj.toJSON();
        for (var i = 0; i < this.tiles.length; i++) {
          if (
            JSON.stringify(this.tiles[i].content) === JSON.stringify(content)
          ) {
            this.$root.$earthUI.promptInfo(this.lang.exist3dtiles, "info");
            return;
          }
        }
        this.tiles.push({
          id: czmObj.xbsjGuid,
          name: czmObj.name,
          content: content
        });
      }
    },
    deleteTiles (index) {
      this.tiles.splice(index, 1);
    },
    viewpoint_dragover (e) {
      e.preventDefault();
      if (e.dataTransfer.types.indexOf("_view") >= 0) {
        e.dataTransfer.dropEffect = "copy";
        this.tileset_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    viewpoint_dragleave () {
      this.tileset_over = false;
    },
    viewpoint_drop (e) {
      e.preventDefault();
      if (this.tileset_over) {
        let index = e.dataTransfer.getData("_view");
        let self = this;
        this.$root.$earth.cameraViewManager.newView().then(view => {
          view.xbsjFromJSON(self.$root.$earth.cameraViewManager.views[
            parseInt(index)
          ].toJSON());
          view.duration = 0;
          self._viewpoint = view;
          self.item.name = this._viewpoint.name;
          self.item.thumbnail = this._viewpoint.thumbnail;
        });
      }
      this.tileset_over = false;
    },
    startMove (event) {
      //如果事件的目标不是本el 返回
      if (
        event.target.parentElement !== this.$refs.container &&
        event.target.parentElement.parentElement !== this.$refs.container
      ) {
        this.moving = false;
        return;
      }
      this.moving = true;
    },
    onMoving (event) {
      //获取鼠标和为开始位置的插值，滚动滚动条
      if (!this.moving) return;

      var dom = this.$refs.container;
      var wleft = dom.scrollLeft - event.movementX;
      if (wleft >= 0 && wleft <= dom.scrollWidth - dom.clientWidth) {
        dom.scrollLeft = wleft;
      }
    },
    endMove (envent) {
      this.moving = false;
    },
    destroy () {
      if (this._tileset) {
        this._tileset.destroy();
        this._tileset = null;
      }
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: calc(100% - 50px) !important;
  overflow: auto;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
  outline: none;
}
button:focus {
  outline: none !important;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.select-ul {
  width: 80%;
  padding-left: 8px;
  margin-left: calc(10% + 23px);
  background: rgba(138, 138, 138, 1);
  z-index: 9999;
  position: relative;
}
.xbsj-flatten {
  min-width: 400px;
}
.xbsj-flatten > div {
  width: 100%;
  margin-top: 10px;
  margin-top: 30px;
}
.xbsj-flatten label {
  float: left;
  min-width: 50px;
  height: 28px;
  line-height: 30px;
  text-align: right;
  margin-left: 40px;
  margin-right: 12px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 200px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.flatten-box {
  display: flex;
  width: calc(100% - 100px);
  height: 28px;
}
.tab span {
  display: inline-block;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  background: rgba(0, 0, 0, 0.5);
  margin-right: 20px;
  cursor: pointer;
}
.tab span:hover {
  background: #000;
}
.contentDiv {
  overflow: auto;
}
.contentsDiv {
  height: calc(100% - 142px);
}
.viewbox {
  display: inline-block;
  width: 72px;
  height: 100px;
  border-radius: 5px;
}
.viewbox img {
  width: 100%;
  height: 72px;
  border-radius: 5px;
  vertical-align: middle;
}
.viewbox .xbsj-check {
  width: 100%;
  height: 28px;
  text-align: center;
  line-height: 28px;
  margin-left: 0px;
}
.viewspan {
  display: inline-block;
  width: 60px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  margin-left: 10px;
}
table {
  border: solid #2b2b2b;
  border-width: 0px 2px 2px 0px;
  width: calc(100% - 190px);
}
table td {
  border: solid #2b2b2b;
  border-width: 2px 0px 0px 2px;
  text-align: center;
}
table tr {
  border: solid #2b2b2b;
  border-width: 2px 0px 0px 2px;
  text-align: center;
  font-size: 14px;
  height: 28px;
}
table td:nth-child(1),
table td:nth-child(3) {
  width: 46px;
}
.pathfly-btn {
  background: none;
  border: none;
  width: 100%;
  height: 34px;
  margin-top: -1px;
  cursor: pointer;
}
.pathfly-btn:focus {
  outline: none;
}
.del {
  background: url(../../../images/flatten/del.png) no-repeat !important;
  background-position: center !important;
}
.footer {
  width: 100%;
  height: 45px;
  border-top: 4px solid rgba(0, 0, 0, 0.4);
}
.footer button {
  display: inline-block;
  width: 74px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 8px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #ffffff;
  float: right;
}
.footer button:hover {
  color: #1fffff;
}
.dragButton {
  display: inline-block;
  width: 150px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: 100% 100%;
  text-align: center;
  line-height: 25px;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: 100% 100%;
  color: #1fffff;
}
</style>
