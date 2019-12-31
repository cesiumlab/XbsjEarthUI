<template>
  <Window
    :width="480"
    :minWidth="480"
    :height="300"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten" ref="flattenning">
      <div class="flatten">
        <label>{{lang.Pressingtiles}}</label>
        <input
          type="text"
          v-model="connectedTileset"
          @click.stop="showSelect=!showSelect"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton"></button>
        <div class="cutselectbox">
          <div
            v-show="showSelect"
            v-for="c in connections"
            :key="c.tileset.guid"
            @click="toggleConnection(c)"
          >
            <span>{{c.name}}</span>
            <span style="position: absolute;right: 10px;" v-show="c.guid == guid">✔</span>
            <span style="position: absolute;right: 10px;" v-show="c.guid != '' && c.guid!=guid">✘</span>
          </div>
        </div>
      </div>
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="attribute.name" />
      </div>
      <div class="flatten">
        <label>{{lang.wakeng}}</label>
        <XbsjSwitch v-model="dighole"></XbsjSwitch>
      </div>

      <div>
        <label>{{lang.attribute}}</label>

        <div class="flatten-table">
          <table class="item-btn-box">
            <thead>
              <tr>
                <th>{{lang.order}}</th>
                <th>{{lang.height}}</th>
                <th>{{lang.show}}</th>
                <th>{{lang.position}}</th>
                <th>{{lang.edit}}</th>
                <th class="header-add">
                  <button class="flatten-btn add" @click="add"></button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in attribute.arrlist" :key="item.id">
                <td>{{index+1}}</td>
                <td>
                  <XbsjMeterInput v-model="item.height"></XbsjMeterInput>
                </td>
                <td>
                  <XbsjSwitch style="margin-top: 4px;" v-model="item.showHelper"></XbsjSwitch>
                </td>
                <td>
                  <input type="button" class="flatten-btn position" @click="flyto(index)" />
                </td>
                <td>
                  <input
                    type="button"
                    class="flatten-btn edit"
                    :class="{'edit-on':item.edit}"
                    @click="item.edit = !item.edit"
                  />
                </td>
                <td>
                  <input type="button" class="flatten-btn del" @click="del(index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      attribute: {
        name: "",
        arrlist: []
      },
      langs: languagejs,
      dighole: false,
      connections: [],
      connectedTileset: "",
      showSelect: false
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];

    this.updateConnections();

    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      this._disposers.push(
        XE.MVVM.bind(this, "attribute.name", czmObj, "name")
      );
      this._disposers.push(
        XE.MVVM.bind(this, "dighole", czmObj, "flattenDiscard")
      );

      this._disposers.push(
        XE.MVVM.watch(
          () => {
            return [...czmObj.polygons];
          },
          () => {
            const polygons = czmObj.polygons;

            this._polygonDisposers = this._polygonDisposers || [];
            this._polygonDisposers.forEach(d => d());
            this._polygonDisposers.length = 0;

            const arrlist = this.attribute.arrlist;
            arrlist.splice(0, arrlist.length); // vue的数组必须这样清空！

            polygons.forEach((polygon, index) => {
              arrlist.push({
                id: polygon.guid,
                height: polygon.height,
                edit: false,
                showHelper: false
              });
              const currentAttribute = arrlist[index];
              this._polygonDisposers.push(
                XE.MVVM.bind(
                  this,
                  `attribute.arrlist.${index}.height`,
                  polygon,
                  "height"
                )
              );
              this._polygonDisposers.push(
                XE.MVVM.bind(
                  this,
                  `attribute.arrlist.${index}.edit`,
                  polygon,
                  "editing"
                )
              );
              this._polygonDisposers.push(
                XE.MVVM.bind(
                  this,
                  `attribute.arrlist.${index}.showHelper`,
                  polygon,
                  "showHelper"
                )
              );
            });
          },
          {
            fireImmediately: true
          }
        )
      );
    }

    let flattenning = this.$refs.flattenning;
    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    var that = this;
    function handleFileSelect(e) {
      // e.stopPropagation();
      e.preventDefault();
      that._czmObj.polygons.push({});
      that._czmObj.polygons[that._czmObj.polygons.length - 1].creating = false;
      that._czmObj.polygons[that._czmObj.polygons.length - 1].edit = true;

      let obj = e.dataTransfer.getData("obj");
      let arr = [];
      arr = JSON.parse(obj).positions;
      for (var j = 0; j < arr.length; j++) {
        arr[j].pop();
      }
      arr = arr.toString().split(",");
      arr = arr.map(function(el) {
        return +el;
      });
      that._czmObj.polygons[that._czmObj.polygons.length - 1].positions = arr;
      that._czmObj.polygons[that._czmObj.polygons.length - 1].flyTo();
    }

    flattenning.addEventListener("dragover", handleDragOver, false);
    flattenning.addEventListener("drop", handleFileSelect, false);
  },
  computed: {
    name() {
      return this.attribute.name;
    },
    guid() {
      return this.getBind().guid;
    }
  },
  methods: {
    toggleConnection(con) {
      var tileset = con.tileset();

      if (con.guid == this.guid) {
        tileset.xbsjFlattenGuid = "";
      } else {
        if (con.guid != "" && con.guid != this.guid) {
          //弹出提示
          this.$root.$earthUI.confirm(this.lang.confirmOther, () => {
            tileset.xbsjFlattenGuid = this.guid;
            this.updateConnections();
          });
        } else {
          tileset.xbsjFlattenGuid = this.guid;
        }
      }

      this.updateConnections();
      this.showSelect = false;
    },
    updateConnections() {
      //获取当前所有tileset  只需要名称，对象，是否关联三个属性
      var cc = this.$root.$earth.tilesetCollection;

      var connections = [];
      var guid = this.getBind().guid;

      var connectedTileset = undefined;
      var count = 0;
      cc.forEach(t => {
        var con = {
          name: t.name,
          tileset: () => {
            return t;
          },
          guid: t.xbsjFlattenGuid
        };

        if (con.guid == this.guid) {
          if (!connectedTileset) {
            connectedTileset = con.name;
          }
          count++;
        }
        connections.push(con);
      });

      if (count >= 2) {
        connectedTileset += this.lang.other + count + this.lang.count;
      }
      this.connectedTileset = connectedTileset;
      this.connections = connections;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const polygonCollection = this._czmObj;
      if (!polygonCollection) {
        return;
      }
      polygonCollection.polygons.forEach(p => (p.editing = false));
      if (polygonCollection.isCreating) {
        polygonCollection.isCreating = false;
        polygonCollection.destroy();
      }
    },
    ok() {
      this.close();

      const polygonCollection = this._czmObj;
      if (!polygonCollection) {
        return;
      }
      polygonCollection.polygons.forEach(p => (p.editing = false));
      if (polygonCollection.isCreating) {
        polygonCollection.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(polygonCollection);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    },
    add() {
      // TODO(vtxf): 还是得想办法解决Vue数组不能响应增删的问题
      this._czmObj.polygons.push({});
      this._czmObj.polygons[this._czmObj.polygons.length - 1].creating = true;
      console.log(this._czmObj);
    },
    del(index) {
      //弹出提示
      this.$root.$earthUI.confirm("确认删除该压平多边形?", () => {
        this._czmObj.polygons.splice(index, 1);
      });
    },
    edit(index) {
      this._czmObj.polygons[index].editing = !this._czmObj.polygons[index]
        .editing;
    },
    autoHeight(index) {
      // console.log("自动高度函数");
    },
    flyto(index) {
      this._czmObj.polygons[index].flyTo();
    }
  },
  beforeDestroy() {
    // 解绑数据关联
    // this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach(e => e());
    this._disposers.length = 0;
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
.item-btn-box .edit-on {
  background: url(../../../images/flatten/edit_on.png) no-repeat !important;
  background-position: center !important;
}
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
  width: 16.66%;
  text-align: center;
  border-right: 1px solid #000;
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
  height: 100%;
}
.xbsj-flatten > div {
  width: 100%;
  height: 28px;
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
  width: calc(100% - 100px);
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
  width: 80%;
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
</style>