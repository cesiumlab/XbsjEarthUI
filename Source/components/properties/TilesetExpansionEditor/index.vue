<template>
  <Window
    :width="558"
    :minWidth="480"
    :height="382"
    :title="title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten" ref="flattenning">
      <!-- 偏移倍率 -->
      <div class="flatten">
        <label class="xbsj-label">{{lang.offsetrate}}</label>
        <div class="field">
          <XbsjSlider :min="0" :max="100" :step="1" showTip="always" v-model="offsetratevalue"></XbsjSlider>
        </div>
        <div style="background:none; float: right;">
          <button v-show="!playing" class="playButton" @click="playClick"></button>
          <button v-show="playing" class="suspendButton" @click="suspendClick"></button>
        </div>
      </div>
      <div>
        <div class="flatten-table">
          <table class="item-btn-box">
            <thead>
              <tr>
                <th>{{lang.order}}</th>
                <th>{{lang.condition}}</th>
                <th>{{lang.basevalue}}</th>
                <!-- <th>{{lang.edit}}</th> -->
                <th class="header-add">
                  <button class="flatten-btn add" @click="add"></button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in styleList" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <input v-model="item.condition" />
                </td>
                <td>
                  <input type="text" style="width: 20%; margin-right: 8px;" v-model.number="item.x" />
                  <input type="text" style="width: 20%; margin-right: 8px;" v-model.number="item.y" />
                  <input type="text" style="width: 20%;" v-model.number="item.z" />
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

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      styleList: [],
      editShow: false,
      editvalues: [],
      offsetratevalue: 1,
      playing: false,
      plays: true,
      play: "",
      langs: {
        zh: {
          title: "模型展开窗口",
          offsetrate: "偏移倍率",
          order: "序号",
          condition: "条件",
          basevalue: "基础偏移值",
          edit: "编辑"
        },
        en: {
          title: "Model Expansion",
          offsetrate: "offsetrate",
          order: "Order",
          condition: "condition",
          basevalue: "Basevalue",
          edit: "Edit"
        }
      },
      lang: undefined
    };
  },
  watch: {
    styleList: {
      handler(n, o) {
        this.updateStyle();
      },
      deep: true // 可以深度检测到 styleList 对象的属性值的变化
    },
    offsetratevalue() {
      this.updateStyle();
    }
  },
  created() {},
  mounted() {
    this.styleList.splice(0, this.styleList.length); // vue的数组必须这样清空！
  },
  computed: {
    title() {
      var b = this.getBind();
      if (!b) return this.lang.title;

      return this.lang.title + "  [" + b.name + "]";
    }
  },
  methods: {
    playClick() {
      this.playing = !this.playing;
      this.play = setInterval(() => {
        if (this.plays) {
          this.offsetratevalue += 1;
        } else {
          this.offsetratevalue -= 1;
        }
        if (this.offsetratevalue > 100) {
          this.plays = false;
        }
        if (this.offsetratevalue < 0) {
          this.plays = true;
        }
      }, 100);
    },
    suspendClick() {
      this.playing = !this.playing;
      clearInterval(this.play);
    },
    updateStyle() {
      var editvalues = [];
      this.styleList.forEach(element => {
        var editvalue =
          '["$' +
          element.condition +
          '", "vec3(' +
          element.x * this.offsetratevalue +
          "," +
          element.y * this.offsetratevalue +
          "," +
          element.z * this.offsetratevalue +
          ')"]';
        editvalues.push(editvalue);
      });
      var style = "var style = {  xbsjPositionOffset: {  conditions: [";
      (style += editvalues + ","),
        (style += ' ["true", "vec3(0,0,0)"] ]}    }');
      //   console.log(style);

      this.getBind().xbsjStyle = style;
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.styleList.splice(0, this.styleList.length);
      this.getBind().xbsjStyle = "";
      this.close();
    },
    ok() {
      this.close();
    },
    add() {
      var l = this.styleList.length;
      if (l == 0) {
        this.styleList.push({
          condition: "{Layer} === 0",
          x: 0,
          y: 0,
          z: 1
        });
      } else {
        var x, y, z;
        if (this.styleList[l - 1].x !== 0) {
          x = this.styleList[l - 1].x + 1;
        } else {
          x = this.styleList[l - 1].x;
        }
        if (this.styleList[l - 1].y !== 0) {
          y = this.styleList[l - 1].y + 1;
        } else {
          y = this.styleList[l - 1].y;
        }
        if (this.styleList[l - 1].z !== 0) {
          z = this.styleList[l - 1].z + 1;
        } else {
          z = this.styleList[l - 1].z;
        }
        this.styleList.push({
          condition: this.styleList[l - 1].condition,
          x: x,
          y: y,
          z: z
        });
      }
    },
    del(index) {
      //弹出提示
      this.$root.$earthUI.confirm("确认删除该条件?", () => {
        this.styleList.splice(index, 1);
      });
    },
    edit(item) {
      //   this.$root.$earthUI.showPropertyWindow(item, {
      //     component: "TilesetExpansionPrp"
      //   });
    }
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
.item-btn-box thead tr th:nth-child(3) {
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