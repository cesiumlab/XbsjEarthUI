<template>
  <Window
    :width="936"
    :minWidth="602"
    :height="590"
    :minHeight="410"
    :top="164"
    :left="500"
    :title="lang.title"
    v-show="show"
    @cancel="cancel"
    :footervisible="false"
    @showclick="showSelect=false"
    class="mainwindow"
    :resized="resize"
  >
    <div style="height: 100%;">
      <div class="tab">
        <ul>
          <li @click="tabShow='1'" :class="{highlight: tabShow=='1'}">{{lang.pathfly}}</li>
          <li @click="tabShow='2'" :class="{highlight: tabShow=='2'}">{{lang.fixedpoint}}</li>
          <li @click="tabShow='3'" :class="{highlight: tabShow=='3'}">{{lang.testresult}}</li>
        </ul>
      </div>
      <div id="tab-content" class="xbsj-flatten">
        <PathFlyTest ref="pathtest" v-show="tabShow == '1'" @testfinished="testFinished"></PathFlyTest>
        <Viewpoint ref="viewpoint" v-show="tabShow == '2'" @testfinished="testFinished"></Viewpoint>
        <TestResult ref="testResult" v-show="tabShow == '3'"></TestResult>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./locale";
import PathFlyTest from "./PathFlyTest";
import Viewpoint from "./Viewpoint";
import TestResult from "./TestResult";
export default {
  components: {
    PathFlyTest,
    Viewpoint,
    TestResult
  },
  data() {
    return {
      lang: {},
      show: false,
      tabShow: "1",
      records: [],
      langs: languagejs
    };
  },
  mounted() {},
  methods: {
    resize() {
      this.$refs.testResult.resize();
    },
    testFinished(results) {
      this.records = results;
      console.log(this.records);
      this.$refs.testResult.setData(this.records);
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.$refs.pathtest.destroy();
      this.$refs.viewpoint.destroy();
      this.show = false;
    }
  }
  // beforeDestroy () {
  //   // 解绑数据关联
  //   this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
  //   this._disposers.forEach(e => e());
  //   this._disposers.length = 0;
  // }
};
</script>

<style scoped>
.xbsj-flatten {
  min-width: 462px;
  height: calc(100% - 68px);
}
.xbsj-flatten > div {
  width: 100%;
  height: 100%;
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
  margin-right: 15px;
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 15px;
  top: 11px;
}
.flatten-box {
  display: flex;
  width: calc(100% - 100px);
  height: 28px;
}
.tab {
  width: 100%;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
}
.tab ul li:nth-child(1) {
  margin-left: 18px;
}
.tab ul li {
  list-style: none;
  float: left;
  width: 82px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  line-height: 28px;
}
.tab ul .highlight,
.tab ul li:hover {
  background: #000;
}
</style>
