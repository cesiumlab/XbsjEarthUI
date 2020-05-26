<template>
  <Window
    :width="500"
    :height="480"
    :floatright="true"
    :title="lang.addpointtitle"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <div class="flatten-flex">
        <label>{{lang.pointCount}}： {{pointCount}}</label>
        <div
          @dragover="dragOver"
          @drop="drop"
          @dragleave="dragLeave"
          class="dragButton"
          :class="{highlight:drag_over}"
          :title="lang.drag"
        >{{lang.dragcontent}}</div>
      </div>
      <!-- 随机朝向 -->
      <div class="flatten-flex">
        <label>{{lang.rotation}}</label>
        <div class="flatten-box">
          <input type="text" class="scaleInput" v-model.number="lodmodel.rotation.min" />
          <input type="text" class="scaleInput" v-model.number="lodmodel.rotation.max" />
        </div>
      </div>
      <!-- 随机大小 -->
      <div class="flatten-flex">
        <label>{{lang.scale}}</label>
        <div class="flatten-box">
          <input type="text" class="scaleInput" v-model.number="lodmodel.scale.min" />
          <input type="text" class="scaleInput" v-model.number="lodmodel.scale.max" />
        </div>
      </div>
      <div>
        <label class="xbsj-label">{{lang.Lodmodelprobabilitytable}}:</label>
        <div class="flatten-table">
          <table class="item-btn-box">
            <thead>
              <tr>
                <th>{{lang.order}}</th>
                <th>{{lang.treename}}</th>
                <th>{{lang.ratio}}</th>
                <th>{{lang.color}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in treeList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.name}}</td>
                <td>
                  <input type="text" v-model.number="item.ratio" />
                </td>
                <td>
                  <XbsjColorButton v-model="item.color"></XbsjColorButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <div class="flatten-flex">
        <XbsjCheckBox v-model="getHeightFromTerrain"></XbsjCheckBox>
        <XbsjCheckBox v-model="getHeightFromTileset"></XbsjCheckBox>
      </div>-->
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
      lang: {},
      treeList: [],
      drag_over: false,
      pointDataId: null,
      pointCount: 0,
      lodmodel: {
        rotation: {
          min: 0,
          max: 360
        },
        scale: {
          min: 1,
          max: 1
        }
      },
      langs: languagejs,
      treeColorUI: [{
        rgba: {
          r: 255,
          g: 255,
          b: 0,
          a: 1
        }
      }, {
        rgba: {
          r: 255,
          g: 0,
          b: 0,
          a: 1
        }
      }, {
        rgba: {
          r: 255,
          g: 0,
          b: 255,
          a: 1
        }
      }, {
        rgba: {
          r: 0,
          g: 255,
          b: 255,
          a: 1
        }
      }, {
        rgba: {
          r: 0,
          g: 255,
          b: 0,
          a: 1
        }
      }, {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      }, {
        rgba: {
          r: 126,
          g: 0,
          b: 255,
          a: 1
        }
      }, {
        rgba: {
          r: 0,
          g: 126,
          b: 255,
          a: 1
        }
      }, {
        rgba: {
          r: 126,
          g: 255,
          b: 0,
          a: 1
        }
      }, {
        rgba: {
          r: 255,
          g: 126,
          b: 0,
          a: 1
        }
      }],
      creating: true,
      // getHeightFromTerrain: false,
      // getHeightFromTileset: false
    };
  },
  created () { },

  mounted () {
    // 数据关联
    this._points = [];
    this._disposers = this._disposers || [];
    this._czmObj = this.getBind();
    this._renderPoints = new XE.Obj.Points(this.$root.$earth);
    this._temPin = new XE.Obj.Model(this.$root.$earth);
    this._temPin.positionPicking = true;
    this._temPin.creating = true;
    this._disposers.push(
      XE.MVVM.bind(this, "creating", this._temPin, "creating")
    );
    this.initPointData();
    this.updateUITreeList();
    this._disposers.push(
      this._uw = XE.MVVM.watch(() => {
        return JSON.stringify(this._czmObj.treeMetas);
      }, () => {
        this.updateUITreeList();
      })
    )

    let self = this;
    var czm = this.$root.$earth.czm;
    var handler = new Cesium.ScreenSpaceEventHandler(czm.viewer.scene.canvas);
    handler.setInputAction(function (movement) {
      var pick = czm.viewer.scene.pick(movement.position);
      if (Cesium.defined(pick) && Cesium.defined(pick.primitive._index)) {
        self._points.splice(pick.primitive._index, 1);
        self.updateRender();
      }
      self.creating = true;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    handler.setInputAction(function (movement) {
      if (!self.creating) {
        self.addPointPosition(self._temPin.xbsjPosition);
        self.updateRender();
        self.creating = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  computed: {},
  watch: {
    // creating (v) {
    //   if (!v) {
    //     this.addPointPosition(this._temPin.xbsjPosition);
    //     this.updateRender();
    //   }
    //   this.creating = true;
    // },
    treeList: {
      handler (n, o) {
        this.updateRender();
      },
      deep: true // 可以深度检测到 styleList 对象的属性值的变化
    }
  },
  methods: {
    updateUITreeList () {
      var newTreelist = [];

      this._czmObj.treeMetas.forEach((value, index) => {
        newTreelist.push({
          name: value.name,
          ratio: index < this.treeList.length ? this.treeList[index].ratio : 1,
          color: index < this.treeList.length ? this.treeList[index].color : this.treeColorUI[index % this.treeColorUI.length]
        });
      });

      this.treeList = newTreelist;
    },
    initPointData () {
      var labServer = this.$root.$labServer;
      var self = this;
      if (this._czmObj.treeDataUrl) {
        var id = this._czmObj.treeDataUrl.substring(this._czmObj.treeDataUrl.lastIndexOf('/') + 1);
        labServer.getAssets(id).then(result => {
          if (result.length) {
            self._points = result;
            self.pointDataId = id;
            self.updateRender();
          }
        })
          .catch(err => {
            console.log(err)
          });
      }
    },
    addPointDataAndRotation (point, rotationRandom) {
      // 更新点位
      var newPoint = {};
      newPoint.position = point.position;
      newPoint.type = this.getType();
      var scale = Math.random() * (this.lodmodel.scale.max - this.lodmodel.scale.min) + this.lodmodel.scale.min;
      newPoint.scale = [scale, scale, scale];
      if (rotationRandom) {
        point.rotation[0] += ((Math.random() *
          (this.lodmodel.rotation.max - this.lodmodel.rotation.min) +
          this.lodmodel.rotation.min) *
          Math.PI) /
          180;
      }
      newPoint.rotation = point.rotation;
      newPoint.id = "id" + this._points.length,
        this._points.push(newPoint);
    },
    addPointPosition (position) {
      // 更新点位
      var newPoint = {};
      newPoint.position = [position[0], position[1], position[2]];
      newPoint.type = this.getType();
      var scale = Math.random() * (this.lodmodel.scale.max - this.lodmodel.scale.min) + this.lodmodel.scale.min;
      newPoint.scale = [scale, scale, scale];
      newPoint.rotation = [
        ((Math.random() *
          (this.lodmodel.rotation.max - this.lodmodel.rotation.min) +
          this.lodmodel.rotation.min) *
          Math.PI) /
        180,
        0,
        0
      ];
      newPoint.id = "id" + this._points.length,
        this._points.push(newPoint);
    },
    updateRender () {
      // 更新渲染
      var renderPoints = [];
      this._points.forEach((point) => {
        var color = this.treeList[point.type].color.rgba;
        renderPoints.push({
          position: point.position,
          color: [
            color.r / 255.0,
            color.g / 255.0,
            color.b / 255.0,
            color.a
          ]
        });
      })
      this._renderPoints.points = renderPoints;
      this.pointCount = this._renderPoints.points.length;
    },
    updateStyle (v) {
      this.$forceUpdate();
    },
    select (index) {
      alert(index);
    },
    getType () {
      var sum_all = 0;
      for (var i = 0; i < this.treeList.length; i++) {
        sum_all += this.treeList[i].ratio;
      }
      var random = Math.random() * sum_all;
      var sum_current = 0;
      for (var i = 0; i < this.treeList.length; i++) {
        sum_current += this.treeList[i].ratio;
        if (random <= sum_current) {
          return i;
        }
      }
      return 0;
    },
    //拖拽移动上面
    dragOver (e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (
        (czmObj && czmObj.position !== undefined) ||
        czmObj.xbsjPosition !== undefined ||
        czmObj.positions !== undefined
      ) {
        e.dataTransfer.dropEffect = "copy";
        this.drag_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    dragLeave () {
      this.drag_over = false;
    },
    //拖拽放置
    drop (e) {
      this.drag_over = false;
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (!czmObj) {
        return;
      } else if (czmObj.position !== undefined) {
        this.addPointPosition(czmObj.position);
        this.updateRender();
      } else if (czmObj.xbsjPosition !== undefined) {
        this.addPointPosition(czmObj.xbsjPosition);
        this.updateRender();
      } else if (czmObj.xbsjType === "Polygon" || (czmObj._polygon !== undefined && czmObj.positions !== undefined)) {
        this.$root.$earthUI.showPropertyWindow({
          czmObj: czmObj,
          callback: (points) => {
            points.forEach(e => {
              this.addPointPosition(e);
            })
            this.updateRender();
          }
        }, {
          component: "FacePlate"
        });
      } else if (czmObj._polyline !== undefined && czmObj.positions !== undefined) {
        this.$root.$earthUI.showPropertyWindow({
          czmObj: czmObj,
          callback: (points, rotationRandom) => {
            points.forEach(e => {
              this.addPointDataAndRotation(e, rotationRandom);
            })
            this.updateRender();
          }
        }, {
          component: "LinearPanel"
        });
      }
    },
    close () {
      this._temPin.creating = false;
      this._temPin.destroy();
      this._renderPoints.destroy();
      this.$parent.destroyTool(this);
    },
    cancel () {
      this.$root.$earthUI.confirm(this.lang.confirm, () => {
        this.close();
      });
    },
    ok () {
      let self = this;
      this.submitPositions();
      this.close();
    },
    async submitPositions () {
      var labServer = this.$root.$labServer;
      var data = new FormData();
      if (this.pointDataId) {
        data.append("id", this.pointDataId);
      }
      data.append("type", "application/json");
      data.append("data", JSON.stringify(this._points));
      let self = this;
      labServer
        .addAssets(data)
        .then(data => {
          self._czmObj.treeDataUrl = labServer.server + './assets/' + data.id;
          self._czmObj.reload();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  beforeDestroy () {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach(e => e());
    this._disposers.length = 0;
    this._uw = this._uw && this._uw();
  }
};
</script>

<style scoped>
.header-add .add {
  background: url(../../../images/flatten/add.png) no-repeat;
  background-position: center;
  border-left: none !important;
}
.header-add .add:focus {
  outline: none;
}

.item-btn-box input {
  float: left;
}
.item-btn-box .del {
  background: url(../../../images/flatten/del.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .edit {
  background: url(../../../images/flatten/edit.png) no-repeat !important;
  background-position: center !important;
}
/* .item-btn-box .edit:hover {
  background: url(../../../images/flatten/edit_on.png) no-repeat !important;
  background-position: center !important;
} */
.item-btn-box .position {
  background: url(../../../images/flatten/position.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .autoheight {
  background: url(../../../images/flatten/autoheight.png) no-repeat !important;
  background-position: center !important;
}
.flatten-btn {
  background: none;
  border: none;
  width: 100%;
  height: 34px;
  /* border-left: 1px solid black; */
  margin-top: -1px;
  cursor: pointer;
}
.flatten-btn:focus {
  outline: none;
}
.item-btn-box {
  width: 100%;
  padding-top: 1px;
  border: 1px solid #000;
  border-collapse: collapse;
}
.item-btn-box thead tr {
  border-bottom: 1px solid #000;
}

.item-btn-box thead tr th {
  text-align: center;
  border-right: 1px solid #000;
}
.item-btn-box thead tr th:nth-child(1) {
  width: 30px;
}
.item-btn-box thead tr th:nth-child(2) {
  width: 200px;
}
.item-btn-box tbody tr td {
  border-right: 1px solid #000;
  text-align: center;
}
.item-btn-box tbody tr {
  border-top: 1px solid #000;
}

.iteminput {
  width: 72px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin: 2px;
}
.item-order {
  width: 51px;
  height: 34px;
  text-align: center;
  line-height: 30px;
  border-right: none !important;
  border-top: none !important;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
}
.header-add {
  width: 61px;
  height: 30px;
  /* border-bottom: none !important; */
}
.falatten-body-item div {
  float: left;
}
.header-content {
  width: 264px;
  height: 30px;
  border-left: none !important;
  border-right: none !important;
}
.flatten-table-header {
  width: 100%;
  height: 30px;
}
.flatten-table-header .border {
  float: left;
}
.flatten-table-order {
  width: 51px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  /* border-bottom: none !important; */
}
.xbsj-flatten {
  min-width: 462px;
  height: calc(100% - 15px);
}
.xbsj-flatten > div {
  width: 100%;
  height: 28px;
  margin-top: 15px;
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
  width: calc(100% - 124px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.xbsj-flatten .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.xbsj-flatten .attributePlay .playspan {
  display: inline-block;
  width: 17px;
  height: 20px;
  background: url(../../../images/play.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributePlay .suspendspan {
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(../../../images/suspend.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributeLocation input,
.xbsj-flatten .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-right: 6px;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.flatten-table {
  display: inline-block;
  width: 100%;
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

.cutselectbox {
  width: calc(100% - 102px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 78px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}

.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  outline: none;
  position: absolute;
  right: 15px;
  top: 16px;
}
td input {
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 0 10px 0 10px;
  width: calc(100% - 20px);
}
.flatten {
  margin-top: 20px;
}
.field {
  /* padding-left: 8px; */
  display: inline-block;
  width: calc(100% - 184px);
  margin-top: 11px;
}
.playButton {
  background: url(../../../images/play.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
  cursor: pointer;
}
.suspendButton {
  background: url(../../../images/suspend.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
  cursor: pointer;
}
.scaleInput {
  width: 21%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 5px;
  outline: none;
  margin-right: 20px;
}
.dragButton {
  display: inline-block;
  width: 174px;
  height: 25px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: 174px 25px;
  text-align: center;
  line-height: 25px;
  margin-left: 74px;
  left: 140px;
  position: absolute;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: 174px 25px;
  color: #1fffff;
}
</style>
