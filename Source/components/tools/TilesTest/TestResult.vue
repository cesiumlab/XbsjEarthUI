<template>
  <div style="width: 100%;height:100%">
    <div class="flatten">
      <div style="position: relative; z-index: 1; display: inline-block;">
        <input
          type="text"
          v-model="yaxisvalue1"
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
          class="selectInput"
          :disabled="!checked"
        />
        <button class="selectButton2"></button>
        <div class="cutselectbox2" v-show="pinshowPinSelect2">
          <div @click="pinoptionssure2(c)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
      <label class="xbsj-check">
        <input type="checkbox" v-model="checked" />
      </label>
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
      yaxisvalue1: "fps",
      yaxisvalue2: "",
      yaxisvalue: ["fps", ""],
      show: false,
      checked: false,
      selecteddata: false
    };
  },
  watch: {
    viewsResult: function(val, oldVal) {
      this.viewpointresult = val;
      this.getOption(val, []);
    }
  },
  mounted() {},
  methods: {
    setData(results) {
      this.results = results;
      console.log(this.results);
    },
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
      this.yaxisvalue1 = c1;
      this.yaxisvalue[0] = c1;
      this.yaxisvalue[1] = "";
      this.pinshowPinSelect = !this.pinshowPinSelect;
      this.selecteddata = false;
      this.getOption(this.results, this.yaxisvalue);
    },
    pinselectinput() {
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    pinoptionssure2(c2) {
      this.yaxisvalue2 = c2;
      this.yaxisvalue[1] = c2;
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
      this.selecteddata = true;
      this.getOption(this.results, this.yaxisvalue);
    },
    pinselectinput2() {
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
    },
    getOption(viewpointresult, paramdata) {
      var self = this;
      var colorList = [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ];
      var legname = [],
        xdata = [],
        ydata = [],
        ydata2 = [],
        series = [],
        yaxis = [],
        l = viewpointresult.length;
      for (var i = 0; i < l; i++) {
        if (paramdata.length === 0) {
          legname.push(viewpointresult[i].tileset.name + "-fps");
        } else if (paramdata[1] === "") {
          legname.push(viewpointresult[i].tileset.name + "-" + paramdata[0]);
        } else {
          legname.push(viewpointresult[i].tileset.name + "-" + paramdata[0]);
          legname.push(viewpointresult[i].tileset.name + "-" + paramdata[1]);
        }
        ydata = [];
        viewpointresult[i].data.forEach(element => {
          xdata.push(element.time);
          if (paramdata.length === 0) {
            ydata.push(element.fps);
          } else if (paramdata[1] === "") {
            ydata.push(element[paramdata[0]] || element.tileset[paramdata[0]]);
          } else {
            ydata.push(element[paramdata[0]] || element.tileset[paramdata[0]]);
            ydata2.push(element[paramdata[1]] || element.tileset[paramdata[1]]);
          }
          Object.keys(element).forEach(function(key) {
            self.yaxisdata.push(key);
          });
          Object.keys(element.tileset).forEach(function(key) {
            self.yaxisdata.push(key);
          });
        });
        if (paramdata.length === 0) {
          series.push({
            name: viewpointresult[i].tileset.name + "-fps",
            type: "line",
            data: ydata,
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
          yaxis.push({
            type: "value",
            name: "fps",
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
            position: "left",
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
        if (paramdata.length !== 0 && paramdata[1] === "") {
          series.push({
            name: viewpointresult[i].tileset.name + paramdata[0],
            type: "line",
            data: ydata,
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
          yaxis.push({
            type: "value",
            name: paramdata[0],
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
            // position: "left",
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
        if (paramdata.length !== 0 && paramdata[1] !== "") {
          series.push(
            {
              name: viewpointresult[i].tileset.name + paramdata[0],
              type: "line",
              data: ydata,
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
            },
            {
              name: viewpointresult[i].tileset.name + paramdata[1],
              type: "line",
              data: ydata2,
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
            }
          );
          yaxis.push(
            {
              type: "value",
              name: paramdata[0],
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
            },
            {
              type: "value",
              name: paramdata[1],
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
          );
        }
      }
      // console.log(legname);
      // console.log(series);
      // console.log(yaxis);
      xdata = Array.from(new Set(xdata));
      this.yaxisdata = Array.from(new Set(this.yaxisdata));
      this.yaxisdata = this.del(this.yaxisdata, "tileset");
      this.yaxisdata = this.del(this.yaxisdata, "time");
      this.drawLine(legname, xdata, series, yaxis);
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
  width: 262px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.cutselectbox,
.cutselectbox2 {
  width: 272px;
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
  left: 251px;
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
.xbsj-check {
  cursor: pointer;
}
.xbsj-check input {
  display: inline-block !important;
  width: 25px !important;
  height: 25px !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  outline: none !important;
  background: url(../../../images/check.png) no-repeat top center !important;
  background-size: 100% 100% !important;
  cursor: pointer !important;
  vertical-align: middle !important;
  float: right !important;
}
.xbsj-check input:checked {
  position: relative !important;
  background: url(../../../images/check_on.png) no-repeat top center !important;
  background-size: 100% 100% !important;
}
.selectInput {
  cursor: pointer;
}
.selectInput:disabled {
  cursor: not-allowed;
}
</style>