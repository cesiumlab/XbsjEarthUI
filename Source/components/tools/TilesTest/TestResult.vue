<template>
  <div style="width: 100%;height:100%">
    <div class="flatten">
      <div style="position: relative; z-index: 1; display: inline-block;">
        <input
          type="text"
          v-model="yaxisdata[yaxisvalue1]"
          @click="pinselectinput"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton"></button>
        <div class="cutselectbox" v-show="pinshowPinSelect">
          <div @click="pinoptionssure(index)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
      <div style="position: relative; display: inline-block; float: right;">
        <input
          type="text"
          v-model="yaxisdata[yaxisvalue2]"
          @click="pinselectinput2"
          readonly
          class="selectInput"
          :disabled="!checked"
        />
        <button class="selectButton2"></button>
        <div class="cutselectbox2" v-show="pinshowPinSelect2">
          <div @click="pinoptionssure2(index)" v-for="(c,index) in yaxisdata" :key="index">
            <span>{{c}}</span>
          </div>
        </div>
      </div>
      <label class="xbsj-check">
        <input type="checkbox" v-model="checked" />
      </label>
    </div>
    <div id="chartContainer" style="width:100%;height:100%;">
      <div class="myBarChart" id="mains"></div>
    </div>
  </div>
</template>
<script>
import languagejs from "./locale";

export default {
  name: "TestResult",
  data() {
    return {
      viewpointresult: [],
      chart: null,
      yaxisdata: [],
      pinshowPinSelect: false,
      pinshowPinSelect2: false,
      yaxisvalue1: 0,
      yaxisvalue2: 1,
      yaxisvalue: ["fps", ""],
      checked: false,
      colorList: [
        "rgba(191,255,91,0.9)",
        "rgba(255,121,91,0.9)",
        "rgba(255,175,91,0.9)",
        "rgba(91,127,255,0.9)",
        "rgba(91,192,255,0.9)"
      ]
    };
  },
  mounted() {},
  watch: {
    checked() {
      this.getOption();
    }
  },
  methods: {
    setData(results) {
      this.viewpointresult = results;
      this.yaxisvalue = [];
      for (var key in this.viewpointresult[0].data[0]) {
        if (
          typeof this.viewpointresult[0].data[0][key] !== "function" &&
          key !== "time"
        )
          this.yaxisdata.push(key);
      }
      this.getOption();
    },
    resize() {
      if (this._chart) {
        document.getElementById("mains").style.width = document.getElementById(
          "chartContainer"
        ).style.width;
        document.getElementById("mains").style.height = document.getElementById(
          "chartContainer"
        ).style.height;
        this._chart.resize();
      }
    },
    pinoptionssure(c1) {
      this.yaxisvalue1 = c1;
      this.pinshowPinSelect = !this.pinshowPinSelect;
      this.getOption();
    },
    pinselectinput() {
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    pinoptionssure2(c2) {
      this.yaxisvalue2 = c2;
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
      this.getOption();
    },
    pinselectinput2() {
      this.pinshowPinSelect2 = !this.pinshowPinSelect2;
    },
    getOption() {
      var self = this;
      var legname = [];
      var xdata = [];
      var yaxis = [];
      var series = [];
      yaxis.push({
        type: "value",
        name: this.yaxisdata[this.yaxisvalue1],
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
          },
          // yAxis.axisLabel.margin：刻度标签与轴线之间的距离。默认值是8，可以改小一点。不过本来的值已经很小了，这个没多大作用。
          margin: 2
          // yAxis.axisLabel.formatter：刻度标签的内容格式器，支持字符串模板和回调函数两种形式。比如可以设置太长了换行之类的。
          // formatter: function(value, index) {
          //   if (value >= 10000 && value < 10000000) {
          //     value = value / 10000 + "万";
          //   } else if (value >= 10000000) {
          //     value = value / 10000000 + "千万";
          //   }
          //   return value;
          // }
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
      if (this.checked) {
        yaxis.push({
          type: "value",
          name: this.yaxisdata[this.yaxisvalue2],
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
            },
            // yAxis.axisLabel.margin：刻度标签与轴线之间的距离。默认值是8，可以改小一点。不过本来的值已经很小了，这个没多大作用。
            margin: 2
            // yAxis.axisLabel.formatter：刻度标签的内容格式器，支持字符串模板和回调函数两种形式。比如可以设置太长了换行之类的。
            // formatter: function(value, index) {
            //   if (value >= 10000 && value < 10000000) {
            //     value = value / 10000 + "万";
            //   } else if (value >= 10000000) {
            //     value = value / 10000000 + "千万";
            //   }
            //   return value;
            // }
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
      for (var i = 0; i < this.viewpointresult.length; i++) {
        var ydata1 = [];
        var ydata2 = [];
        xdata = [];
        this.viewpointresult[i].data.forEach(element => {
          xdata.push(element.time);
          ydata1.push(element[this.yaxisdata[this.yaxisvalue1]]);
          if (this.checked) {
            ydata2.push(element[this.yaxisdata[this.yaxisvalue2]]);
          }
        });

        var seriesname =
          this.viewpointresult[i].tileset.name +
          "-" +
          this.yaxisdata[this.yaxisvalue1];
        legname.push(seriesname);
        series.push({
          name: seriesname,
          type: "line",
          data: ydata1,
          yAxisIndex: 0,
          label: {
            normal: {
              show: true,
              // position: "inside",
              color: "#fff"
            }
          },
          itemStyle: {
            normal: {
              color: this.colorList[i]
            }
          }
        });

        if (this.checked) {
          var seriesname2 =
            this.viewpointresult[i].tileset.name +
            "-" +
            this.yaxisdata[this.yaxisvalue2];
          legname.push(seriesname2);
          series.push({
            name: seriesname2,
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
                // position: "inside"
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: this.colorList[i]
              }
            }
          });
        }
      }

      this.drawLine(legname, xdata, series, yaxis);
    },
    /*画图*/
    drawLine(legname, xdata, series, yaxis) {
      if (this._chart) {
        this._chart.dispose();
      }
      // 基于准备好的dom，初始化echarts实例
      this._chart = this.$echarts.init(document.getElementById("mains"));
      // 绘制折线图图表
      this._chart.setOption({
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
        // grid.left：grid 组件离容器左侧的距离。默认值是10%。
        grid: {
          left: 120,
          right: 120
        },
        series: series
      });
      // = myBarChart;
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
.myBarChart {
  width: 926px;
  height: 472px;
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