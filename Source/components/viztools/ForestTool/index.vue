<template>
  <Window
    :width="500"
    :height="380"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <!-- 点位数据源地址 -->
      <div class="flatten">
        <label>{{lang.pointaddress}}:</label>
        <input style="float:left;" type="text" v-model="forest.treeDataUrl" />
      </div>

      <div class="flatten-flex">
        <!-- 编辑按钮 -->
        <div class="buttonGroup">
          <label class="xbsj-label"></label>
          <!-- 添加点位 -->
          <button
            class="attitudeEditCameraButton"
            style="margin-left: 36px;"
            @click="addPointClick"
          >{{lang.addpoint}}</button>
          <!-- 选择 -->
          <!-- <button class="attitudeEditCameraButton">{{lang.select}}</button> -->
          <!-- 删除 -->
          <!-- <button class="attitudeEditCameraButton">{{lang.delete}}</button> -->
          <!-- 修改 -->
          <!-- <button class="attitudeEditCameraButton">{{lang.edit}}</button> -->
        </div>
      </div>

      <div>
        <label class="xbsj-label">{{lang.lodmodelurl}}:</label>
        <div class="flatten-table">
          <table class="item-btn-box">
            <thead>
              <tr>
                <th>{{lang.order}}</th>
                <th>{{lang.name}}</th>
                <th>{{lang.address}}</th>
                <th class="header-add">
                  <!-- <span class="flatten-btn add" @click="add"></span> -->
                  <span class="flatten-btn add" @click="addLab"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in modelList" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <input type="text" v-model="item.name" />
                </td>
                <td>
                  <input type="text" v-model="item.address" />
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
  data () {
    return {
      lang: {},
      modelList: [],
      forest: {
        treeDataUrl: ""
      },
      langs: languagejs
    };
  },
  created () { },
  mounted () {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();

    if (czmObj) {
      this._czmObj = czmObj;
      // console.log(this._czmObj);
      const bindData = {
        treeDataUrl: "forest.treeDataUrl"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
      this.updateUITreeList();
      this._disposers.push(
        this._uw = XE.MVVM.watch(() => {
          return JSON.stringify(this._czmObj.treeMetas);
        }, () => {
          this.updateUITreeList();
        })
      );
    }
  },
  computed: {},
  watch: {
    modelList: {
      handler (n, o) {
        console.log(n);
        console.log(o);
        this.updateTreeMetaList();
      },
      deep: true // 可以深度检测到 styleList 对象的属性值的变化
    },
  },
  methods: {
    updateTreeMetaList () {
      for (var i = 0; i < this.modelList.length; i++) {
        this._czmObj.treeMetas[i].name = this.modelList[i].name;
        this._czmObj.treeMetas[i].url = this.modelList[i].address;
      }
    },
    updateUITreeList () {
      this.modelList.splice(0, this.modelList.length);
      this._czmObj.treeMetas.forEach((value, index) => {
        this.modelList.push({
          name: value.name,
          address: value.url
        });
      });
    },
    add () {
      this.modelList.push({
        name: "",
        address: "",
        ratio: 1,
        color: {
          rgba: { r: 255, g: 255, b: 0, a: 1 }
        }
      });
    },
    del (index) {
      //弹出提示
      this.$root.$earthUI.confirm("确认删除该模型库地址?", () => {
        // this.modelList.splice(index, 1);
        this._czmObj.treeMetas.splice(index, 1);
      });
    },
    updateModelUrl () {
      var updatevalues = [];
      this.modelList.forEach(element => {
        updatevalues.push(element.address);
      });
      // console.log(updatevalues);
      this._czmObj.treeMetaUrls = updatevalues;
    },
    addPointClick () {
      if (this.modelList.length == 0) {
        this.$root.$earthUI.promptInfo("没有添加树种模型！", "warning");
        return;
      }
      this.$root.$earthUI.showPropertyWindow(this._czmObj, {
        component: "AddPoint"
      });
    },
    addLab () {
      this.$root.$earthUI.showPropertyWindow(this._czmObj, {
        component: "ForestLab"
      });
    },
    close () {
      this.$parent.destroyTool(this);
    },
    cancel () {
      this.$root.$earthUI.confirm(this.lang.confirm, () => {
        this.modelList.splice(0, this.modelList.length);
        this.close();
        const forestToolObj = this._czmObj;
        if (!forestToolObj) {
          return;
        }
        forestToolObj.positionEditing = false;
        if (forestToolObj.isCreating) {
          forestToolObj.isCreating = false;
          forestToolObj.destroy();
        }
      });
    },
    ok () {
      this.close();
      const forestToolObj = this._czmObj;
      forestToolObj.editing = false;
      if (!forestToolObj) {
        return;
      }
      forestToolObj.positionEditing = false;
      forestToolObj.twoPostionsEditing = false;
      if (forestToolObj.isCreating) {
        forestToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(forestToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
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
.attitudeEditCameraButton {
  display: block;
  float: left;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  margin-right: 20px;
}
.header-add .add {
  background: url(../../../images/flatten/add.png) no-repeat;
  background-position: center;
  border-left: none !important;
  display: inline-block;
  width: 20px;
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
</style>