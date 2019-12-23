<template>
  <div>
    <div class="flatten">
      <div style="position: absolute; z-index: 1;">
        <input
          type="text"
          v-model="yaxisvalue"
          @click="pinselectinput"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton"></button>
        <div class="cutselectbox" v-show="pinshowPinSelect">
          <div @click="pinoptionssure(c)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="myBarChart" id="mains"></div>
    <!-- <div class="flatten">
      <div style="position: absolute; right: 6px; top: 44px;  z-index: 1;">
        <input
          type="text"
          v-model="yaxisvalue"
          @click="pinselectinput"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton2"></button>
        <div class="cutselectbox2" v-show="pinshowPinSelect">
          <div @click="pinoptionssure(c)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
import languagejs from "./locale";

export default {
  name: "TestResult",
  // props: ["viewsResult", "viewsWidth", "viewsHeight"],
  props: {
    viewsResult: {
      type: Array,
      default: () => {
        return [];
      }
    },
    viewsWidth: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    viewsHeight: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {
      viewpointresult: [],
      chart: null,
      yaxisdata: [],
      pinshowPinSelect: false,
      yaxisvalue: "fps",
      yaxisvalues: ""
    };
  },
  watch: {
    // yaxisvalue: function(val, oldVal) {
    //   this.yaxisvalues = val;
    // },
    viewsResult: function(val, oldVal) {
      this.viewpointresult = val;
      // console.log(this.viewpointresult);
      // var self = this;
      this.getOption(val);
    }
    // viewsWidth: function(val, oldVal) {
    //   console.log(val);
    //   var mains = document.getElementById("mains");
    //   mains.style.width = val + "px";
    // },
    // viewsHeight: function(val, oldVal) {
    //   console.log(val);
    //   var mains = document.getElementById("mains");
    //   mains.style.height = val + "px";
    // }
  },
  mounted() {
    // console.log(this.viewsWidth);
    // var mains = document.getElementById("mains");
    // mains.style.width = this.viewsWidth + "px";
    // mains.style.height = this.viewsHeight + "px";
    // this.chart = this.$echarts.init(
    //   document.getElementsByClassName("myBarChart")[0]
    // );
    // this.chart.resize();
  },
  methods: {
    //定义删除的方法，需要传递的参数，一是数组，二是该数组里你想要删除的元素
    del(ary, el) {
      const index = ary.indexOf(el); //找到要删除的元素对应的下标,从0开始
      const delEle = ary.splice(index, 1); //splice为从要删除的元素开始,删除一个,刚好就是删除那个元素
      return ary; //因为splice方法直接对原数组进行改变,所以返回的是删除后的数组
    },
    pinoptionssure(c) {
      this.yaxisvalue = c;
      this.pinshowPinSelect = !this.pinshowPinSelect;
      var results = sessionStorage.getItem("result");
      // var results2 = JSON.stringify(results);
      var resultsObj = JSON.parse(results);
      // console.log(typeof resultsObj);
      // console.log(resultsObj);
      this.getOption(resultsObj, c);
    },
    pinselectinput() {
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    getOption(viewpointresult, yparam) {
      var self = this;
      var legname = [],
        xdata = [],
        series = [],
        ydata = [];
      var colorList = [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ];
      for (var i = 0, l = viewpointresult.length; i < l; i++) {
        legname.push(viewpointresult[i].tileset.name);
        ydata = [];
        viewpointresult[i].data.forEach(element => {
          xdata.push(element.time);
          if (yparam === undefined) {
            ydata.push(element.fps);
          } else {
            ydata.push(element[yparam] || element.tileset[yparam]);
          }
          Object.keys(element).forEach(function(key) {
            self.yaxisdata.push(key);
          });
          Object.keys(element.tileset).forEach(function(key) {
            self.yaxisdata.push(key);
          });
        });
        series.push({
          name: viewpointresult[i].tileset.name,
          type: "line",
          data: ydata,
          label: {
            normal: {
              show: true,
              position: "inside"
            }
          },
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: colorList[i]
            }
          }
        });
      }
      // console.log(legname);
      // console.log(xdata);
      // console.log(series);
      xdata = Array.from(new Set(xdata));
      this.yaxisdata = Array.from(new Set(this.yaxisdata));
      this.yaxisdata = this.del(this.yaxisdata, "tileset");
      this.yaxisdata = this.del(this.yaxisdata, "time");
      // console.log(this.yaxisdata);
      this.drawLine(legname, xdata, series);
    },
    /*画图*/
    drawLine(legname, xdata, series) {
      // 基于准备好的dom，初始化echarts实例
      let myBarChart = this.$echarts.init(
        document.getElementsByClassName("myBarChart")[0]
      );
      // 绘制柱状图图表
      myBarChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legname,
          textStyle: {
            color: "rgba(255,255,255,1)"
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: xdata,
            axisLabel: {
              interval: 0,
              rotate: 40,
              textStyle: {
                color: "rgba(255,255,255,1)" //坐标值得具体的颜色
              }
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "rgba(255,255,255,1)", //坐标线的颜色
                width: "3" //坐标线的宽度
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "rgba(255,255,255,1)", //坐标线的颜色
                width: "3"
              }
            },
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,1)" //坐标值得具体的颜色
              }
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,1)"],
                width: 2,
                type: "solid"
              }
            }
          }
        ],
        series: series
      });
      // 根据窗口的大小变动图表;
      window.onresize = function() {
        myBarChart.resize();
        //myChart1.resize();    //若有多个图表变动，可多写
      };
    }
  }
};
</script>
<style scoped>
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: 100px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.cutselectbox,
.cutselectbox2 {
  width: 110px;
  height: 200px;
  background: rgba(138, 138, 138, 1);
  position: absolute;
  /* left: 92px; */
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox2 {
  right: 0;
}
.cutselectbox div,
.cutselectbox2 div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover,
.cutselectbox2 div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span,
.cutselectbox2 span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}
.selectButton,
.selectButton2 {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  /* margin-right: 15px; */
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  /* right: 98px; */
  left: 90px;
  top: 11px;
}
.selectButton2 {
  right: 0;
}
.myBarChart {
  width: 592px;
  height: 292px;
  margin: 0 auto !important;
}
.myBarChart > div {
  margin: 0 auto !important;
}
</style>