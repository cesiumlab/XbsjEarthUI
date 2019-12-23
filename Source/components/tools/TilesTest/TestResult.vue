<template>
  <div style="width: 100%;height:100%">
    <div class="flatten">
      <div style="position: relative; z-index: 1; display: inline-block;">
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
      <div style="position: relative; display: inline-block; float: right;">
        <input
          type="text"
          v-model="yaxisvalue2"
          @click="pinselectinput2"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton2"></button>
        <div class="cutselectbox2" v-show="pinshowPinSelect2">
          <div @click="pinoptionssure2(c)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
    </div>
    <div :class="[show?'myBarChart':'myBarChart2']" id="mains"></div>
  </div>
</template>
<script>
import languagejs from "./locale";

export default {
  name: "TestResult",
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
      pinshowPinSelect2: false,
      yaxisvalue: "fps",
      yaxisvalue2: "selected",
      legname: [],
      legname1: [],
      legname2: [],
      xdata: [],
      series: [],
      series1: [],
      series2: [],
      ydata: [],
      ydata2: [],
      yaxis: [],
      yaxis1: [],
      yaxis2: [],
      show: false
    };
  },
  watch: {
    viewsResult: function(val, oldVal) {
      this.viewpointresult = val;
      // var self = this;
      this.getOption(val);
    }
  },
  mounted() {},
  methods: {
    resize() {
      if (this.chart) {
        this.show = true;
        this.chart.resize();
      }
    },
    //定义删除的方法，需要传递的参数，一是数组，二是该数组里你想要删除的元素
    del(ary, el) {
      const index = ary.indexOf(el); //找到要删除的元素对应的下标,从0开始
      const delEle = ary.splice(index, 1); //splice为从要删除的元素开始,删除一个,刚好就是删除那个元素
      return ary; //因为splice方法直接对原数组进行改变,所以返回的是删除后的数组
    },
    pinoptionssure(c1) {
      this.yaxisvalue = c1;
      this.pinshowPinSelect = !this.pinshowPinSelect;
      var results = sessionStorage.getItem("result");
      var resultsObj = JSON.parse(results);
      if (this.yaxisvalue == this.yaxisvalue2) return;
      this.getOption2(resultsObj, this.yaxisvalue);
    },
    pinselectinput() {
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    pinoptionssure2(c2) {
      this.yaxisvalue2 = c2;
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
      var results2 = sessionStorage.getItem("result");
      var resultsObj2 = JSON.parse(results2);
      if (this.yaxisvalue2 == this.yaxisvalue) return;
      this.getOption3(resultsObj2, this.yaxisvalue2);
    },
    pinselectinput2() {
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
    },
    getOption(viewpointresult) {
      var self = this;
      var colorList = [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ];
      (this.legname1 = []),
        (this.legname2 = []),
        (this.series1 = []),
        (this.series2 = []),
        (this.yaxis1 = []),
        (this.yaxis2 = []);
      for (var i = 0, l = viewpointresult.length; i < l; i++) {
        this.legname1.push(viewpointresult[i].tileset.name + "-fps");
        this.legname2.push(viewpointresult[i].tileset.name + "-selected");

        (this.ydata = []), (this.ydata2 = []);
        viewpointresult[i].data.forEach(element => {
          this.xdata.push(element.time);
          this.ydata.push(element.fps);
          this.ydata2.push(element.tileset.selected);
          Object.keys(element).forEach(function(key) {
            self.yaxisdata.push(key);
          });
          Object.keys(element.tileset).forEach(function(key) {
            self.yaxisdata.push(key);
          });
        });
        this.series1.push({
          name: viewpointresult[i].tileset.name + "-fps",
          type: "line",
          data: this.ydata,
          yAxisIndex: 0,
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
        this.series2.push({
          name: viewpointresult[i].tileset.name + "-selected",
          type: "line",
          data: this.ydata2,
          yAxisIndex: 1,
          lineStyle: {
            normal: {
              type: "dashed"
            }
          },
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
        this.yaxis1.push({
          type: "value",
          name: "fps",
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
        });
        this.yaxis2.push({
          type: "value",
          name: "selected",
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
        });
      }
      this.legname = this.legname1.concat(this.legname2);
      this.series = this.series1.concat(this.series2);
      console.log(this.series);
      this.yaxis = this.yaxis1.concat(this.yaxis2);
      this.xdata = Array.from(new Set(this.xdata));
      this.yaxisdata = Array.from(new Set(this.yaxisdata));
      this.yaxisdata = this.del(this.yaxisdata, "tileset");
      this.yaxisdata = this.del(this.yaxisdata, "time");
      this.drawLine(this.legname, this.xdata, this.series, this.yaxis);
    },
    getOption2(viewpointresult, yparam) {
      var colorList = [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ];
      (this.series1 = []), (this.legname1 = []), (this.yaxis1 = []);
      for (var j = 0, l = viewpointresult.length; j < l; j++) {
        this.legname1.push(viewpointresult[j].tileset.name + "-" + yparam);

        this.ydata = [];
        viewpointresult[j].data.forEach(element => {
          this.ydata.push(element[yparam] || element.tileset[yparam]);
        });

        this.series1.push({
          name: viewpointresult[j].tileset.name + "-" + yparam,
          type: "line",
          data: this.ydata,
          yAxisIndex: 0,
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
              color: colorList[j]
            }
          }
        });
        this.yaxis1.unshift({
          type: "value",
          name: yparam,
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
        });
        this.yaxis.splice(1, this.yaxis.length - 2);
      }
      yparam = "";
      this.series = this.series1.concat(this.series2);
      this.legname = this.legname1.concat(this.legname2);
      this.yaxis = this.yaxis1.concat(this.yaxis2);
      this.drawLine(this.legname, this.xdata, this.series, this.yaxis);
    },
    getOption3(viewpointresult, yparam2) {
      var colorList = [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ];
      (this.series2 = []), (this.legname2 = []), (this.yaxis2 = []);
      for (var i = 0, l = viewpointresult.length; i < l; i++) {
        this.legname2.push(viewpointresult[i].tileset.name + "-" + yparam2);

        this.ydata2 = [];
        viewpointresult[i].data.forEach(element => {
          this.ydata2.push(element[yparam2] || element.tileset[yparam2]);
        });

        this.series2.push({
          name: viewpointresult[i].tileset.name + "-" + yparam2,
          type: "line",
          data: this.ydata2,
          yAxisIndex: 1,
          lineStyle: {
            normal: {
              type: "dashed"
            }
          },
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
        this.yaxis2.push({
          type: "value",
          name: yparam2,
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
        });
        this.yaxis.splice(1, this.yaxis.length - 2);
      }
      yparam2 = "";
      this.series = this.series1.concat(this.series2);
      this.legname = this.legname1.concat(this.legname2);
      this.yaxis = this.yaxis1.concat(this.yaxis2);
      this.drawLine(this.legname, this.xdata, this.series, this.yaxis);
    },
    /*画图*/
    drawLine(legname, xdata, series, yaxis) {
      // 基于准备好的dom，初始化echarts实例
      let myBarChart = this.$echarts.init(document.getElementById("mains"));
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
        yAxis: yaxis,
        series: series
      });
      this.chart = myBarChart;
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
.myBarChart2 {
  width: 592px;
  height: 292px;
  margin: 0 auto !important;
}
.myBarChart2 > div {
  margin: 0 auto !important;
}
.myBarChart {
  width: 100%;
  height: 100%;
  margin: 0 auto !important;
}
.myBarChart > div {
  margin: 0 auto !important;
}
</style>