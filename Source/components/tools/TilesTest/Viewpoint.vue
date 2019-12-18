<template>
  <div
    style="height: 100%;"
    @mousedown="startMove($event)"
    @mousemove="onMoving($event)"
    @mouseup="endMove($event)"
  >
    <div class="flatten">
      <div style="position: relative;">
        <label>{{lang.viewPoint}}</label>
        <div
          @click="clickItem(index,$event)"
          @drop="viewpoint_drop($event)"
          @dragover="viewpoint_dragover($event)"
          @dragleave="viewpoint_dragleave($event)"
        >
          <img
            :src="item.thumbnail"
            class="xbsj-cameraview-img"
            @contextmenu.prevent="onContexMenu(index, $event)"
          />
          <label class="xbsj-check">{{item.name}}</label>
        </div>
      </div>
      <div style="position: relative;top:100px;">
        <label>{{lang.interval}}</label>
        <input type="text" v-model.number="interval" style="cursor: pointer;" />
      </div>
    </div>

    <div
      @drop="tileset_drop($event)"
      @dragover="tileset_dragover($event)"
      @dragleave="tileset_dragleave($event)"
    >
      <table border="1" cellpadding="0" cellspacing="0">
        <tr>
          <td>序号</td>
          <td>名称</td>
          <td>操作</td>
        </tr>
        <tr v-for="(value,index) in tiles" :key="index">
          <td>{{index + 1}}</td>
          <td>{{value.name}}</td>
          <button @click="deleteTiles(index)">删除</button>
        </tr>
      </table>
    </div>

    <button @click="startTest">开始执行</button>
    <button @click="stopTest">停止</button>
  </div>
</template>

<script>
import languagejs from "./locale";

export default {
  name: 'Viewpoint',
  data () {
    return {
      lang: {},
      tiles: [],
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
        name: '',
        thumbnail: ''
      }
    };
  },
  methods: {
    startTest () {
      for (var i = 0; i < this.tiles.length; i++) {
        this.$root.$earth.getObject(this.tiles[i].id).enabled = false;
      }
      this.currentTilesetIndex = 0;
      this.results = [];
      this.testSingleTileset();
    },
    stopTest () {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.$emit('testfinished', this.results);
    },
    testSingleTileset () {
      let self = this;
      let earth = this.$root.$earth;
      earth.cameraViewManager.globe.flyTo().then(() => {
        var tileset = earth.getObject(self.tiles[self.currentTilesetIndex].id);
        self._tileset = new XE.Obj.Tileset(self.$root.$earth);
        self._tileset.xbsjFromJSON(tileset.toJSON());
        self._tileset.enabled = true;
        self._tileset._tileset.allTilesLoaded.addEventListener(() => {
          self.testNextTileset();
        });
        self._tileset._tileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
          self.numberOfPendingRequests = numberOfPendingRequests;
          self.numberOfTilesProcessing = numberOfTilesProcessing;
        });
        self.results.push({});
        self.tilesetRecord = self.results[self.results.length - 1];
        self.tilesetRecord.tileset = self._tileset.toJSON();
        self.tilesetRecord.date = [];
        self.resultIndex = 1;
        self.startTimeout();
        self._viewpoint.flyTo();
      });
    },
    testNextTileset () {
      this.currentTilesetIndex++;
      this._tileset.destroy();
      if (this.currentTilesetIndex === this.tiles.length) {
        this.stopTest();
        return;
      }
      this.testSingleTileset();
    },
    startTimeout () {
      let self = this
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.intervalId = setInterval(() => {
        self.record();
      }, this.interval
      );
    },
    record () {
      var record = {};
      record.time = this.resultIndex * this.interval;
      record.fps = this.$root.$earth.status.fps;
      record.numberOfPendingRequests = this.numberOfPendingRequests;
      record.numberOfTilesProcessing = this.numberOfTilesProcessing;
      record.tileset = this._tileset._tileset.statistics;
      this.tilesetRecord.date.push(record);
      this.resultIndex++;
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
      if (czmObj && czmObj.xbsjType === 'Tileset') {
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
      if (czmObj && czmObj.xbsjType === 'Tileset') {
        this.tiles.push({ id: czmObj.xbsjGuid, name: czmObj.name });
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
        this._viewpoint = this.$root.$earth.cameraViewManager.views[parseInt(index)];
        this.item.name = this._viewpoint.name;
        this.item.thumbnail = this._viewpoint.thumbnail;
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
    }
  }
};
</script>

<style scoped>
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
.border {
  border: 1px solid black;
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
  height: 160px;
  margin-top: 10px;
}
.xbsj-flatten label {
  float: left;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 150px);
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
  /* height: calc(100% - 29px); */
}
.contentsDiv {
  height: calc(100% - 142px);
}
.xbsj-cameraview-img {
  margin: 3px;
  border-radius: 10px;
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: absolute;
}
</style>