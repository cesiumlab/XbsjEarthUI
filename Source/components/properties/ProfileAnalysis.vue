<template>
  <!-- 编辑提示框 -->
  <Window
    ref="win"
    :title="lang.title"
    :width="width"
    :height="240"
    :floatright="true"
    :top="top"
    @cancel="cancel"
    :footervisible="false"
    :resized="resize"
  >
    <div style="width:100%;height:100%;">
      <div class="flatten">
        <div style="float: left;">
          <div style="float: left; margin-bottom: 10px;">
            <label class="label">{{lang.jianju}}:</label>

            <div>
              <XbsjInputNumber v-model="samplinginterval"></XbsjInputNumber>
            </div>
          </div>

          <div class="buttonGroup">
            <button
              class="attitudeEditCameraButton"
              @click="creating =!creating"
              :class="creating?'btncoloron':''"
            >{{lang.creating}}</button>
            <button
              class="attitudeEditCameraButton"
              @click="editing =!editing"
              :class="editing?'btncoloron':''"
            >{{lang.editing}}</button>
          </div>

          <div
            :title="lang.drag"
            class="dragBox"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
          >
            <div class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
          </div>
        </div>
      </div>
      <div class="chartContents" ref="chartContents">
        <div class="myBarChart" ref="mains"></div>
      </div>
    </div>
  </Window>
</template>

<script>
import { getDisAndLabelPos } from "../utils/measure";
export default {
  props: {
    getBind: Function
  },
  data () {
    return {
      langs: {
        zh: {
          title: "剖面分析",
          creating: "创建",
          editing: "编辑",
          drag: "拖拽",
          dragcontent: "请把对象拖到这里",
          jianju: "采样间隔"
        },
        en: {
          title: "Profile analysis",
          creating: "creating",
          editing: "editing",
          drag: "drag",
          dragcontent: "Drag the object here",
          jianju: "sampling interval"
        }
      },
      lang: undefined,
      samplinginterval: 0,
      creating: true,
      editing: false,
      drag_over: false,
      top: window.innerHeight - 271,
      width: window.innerWidth
    };
  },
  created () {
    // var lang = this.$root.language;
    // this.lang = this.langs[lang];
  },
  mounted () {
    //获取绑定的view
    this.samplinginterval = 0;
    this._labels = [];
    this._temGeometry = [];
    this._creating = [];
    this._disGroud = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
    this._disGroud.creating = true;

    this._creating.push(
      XE.MVVM.bind(this, "creating", this._disGroud, "creating")
    );
    this._creating.push(
      XE.MVVM.bind(this, "editing", this._disGroud, "editing")
    );
    this._creating.push(
      XE.MVVM.watch(
        () => ({
          positions: [...this._disGroud.positions]
        }),
        () => {
          this.updateMeasure(this._disGroud.positions);
        }
      )
    );
    // 基于准备好的dom，初始化echarts实例
    this._chart = this.$echarts.init(this.$refs.mains);
  },
  watch: {
    samplinginterval (v) {
      this.updateMeasure(this._disGroud.positions);
    },
    editing (v) {
      if (this._temGeometry) {
        this._temGeometry.forEach(e => {
          e.destroy();
        });
        this._temGeometry = [];
      }
    },
    creating (v) {
      if (v == false) {
        // this._creating = [];
        let self = this;
        if (this._labels.length > 0) {
          // this._labels.forEach(l => {
          //   self._temGeometry.push(l);
          // });
          // this._labels = [];
          this.measurementType = "NONE";
        }
        if (this.areaGroudInterval == 0) {
          this.areaGroudInterval = this.temAreaGroudInterval;
        }

        // console.log(result);
        this.drawLine();
      } else {
        if (this._temGeometry) {
          this._temGeometry.forEach(e => {
            e.destroy();
          });
          this._temGeometry = [];
        }
      }
    }
  },
  methods: {
    updateMeasure (p) {
      this._labels.forEach(l => l.destroy());
      this._labels = [];
      if (p.length > 1) {
        var it = this.samplinginterval;
        var result = getDisAndLabelPos(p, it, this.$root.$earth);
        if (!result) {
          return;
        }
        this._result = result;
        var labels = result.label;

        labels.forEach(l => {
          var lb = this.createLabel(l);
          this._labels.push(lb);
        });
        this.drawLine();
      }
    },
    createLabel (option) {
      let p = new XE.Obj.Plots.GeoPin(this.$root.$earth);
      p.innerHTML =
        '<div style="cursor:pointer;position: absolute;width:300px;left:6px; line-height:15px;color: white;">'
        + '<span style=\"padding:2px;border-radius: 2px;text-stroke:2px #000;font-size: 14px;color:#ffffff;background-color: rgba(50,50,50,0.5)\">'
        + option.dis + "</span></div>"; //-webkit-text-stroke:0.6px #000;
      p.position = option.pos;
      p._pin.show = false;

      return p;
    },
    resize () {
      if (this._chart) {
        this.$refs.mains.style.width = this.$refs.chartContents.style.width;
        this.$refs.mains.style.height = this.$refs.chartContents.style.height;
        this._chart.resize();
      }
    },
    /*画图*/
    drawLine () {
      // 绘制柱状图图表
      let resultdata = this._result.sample,
        xdata = [],
        ydata = [],
        data = {},
        min,
        max;
      resultdata.forEach(element => {
        xdata.push(element.distance);
        ydata.push(Number(element.height.toFixed(2)));
      });

      this._chart.setOption({
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
          position: function (point, params, dom, rect, size) {
            //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小;
            var x = point[0]; //
            var y = point[1];
            var viewWidth = size.viewSize[0];
            var viewHeight = size.viewSize[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            var posX = 0; //x坐标位置
            var posY = 0; //y坐标位置

            if (x < boxWidth) {
              //左边放不开
              posX = 5;
            } else {
              //左边放的下
              posX = x - boxWidth;
            }

            if (y < boxHeight) {
              //上边放不开
              posY = 5;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          },
          formatter (params) {
            const item = params[0];
            // console.log(item);
            item.data = resultdata[item.dataIndex];
            return (
              "<span>所在位置 " +
              item.data.longitude.toFixed(6) +
              "°," +
              item.data.latitude.toFixed(6) +
              "°</span><br/><span>距起点 " +
              item.name +
              "米</span><br/>" +
              item.seriesName +
              " " +
              "<span style='color:rgb(255, 70, 131);font-weight:bold;'>" +
              item.value +
              "米</span>"
            );
          }
        },
        // title: {
        //   left: "center",
        //   text: "大数据量面积图"
        // },
        grid: {
          left: 50, //距离左边的距离
          right: 25, //距离右边的距离
          bottom: 60, //距离下边的距离
          top: 25 //距离上边的距离
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: xdata,
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "rgba(255,255,255,1)" //坐标值得具体的颜色
            },
            formatter: "{value} 米"
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "rgb(255, 70, 131)", //坐标线的颜色
              width: "2" //坐标线的宽度
            },
            // onZero: false,
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          // boundaryGap: [0, "100%"],
          // minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
          // axisLine: {
          //   lineStyle: {
          //     type: "solid",
          //     color: "rgba(85,85,85,0.6)", //坐标线的颜色
          //     width: "2"
          //   }
          // },
          max: function (value) {
            return value.max;
          },
          min: function (value) {
            return value.min;
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "rgba(255,255,255,1)" //坐标值得具体的颜色
            },
            formatter: "{value} 米"
          },
          axisTick: {
            show: false
          },
          //网格样式
          splitLine: {
            show: true
          }
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: "高程值",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 70, 131)"
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: ydata
          }
        ]
      });
    },
    //拖拽移动上面
    dragOver (e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions !== undefined) {
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
      if (czmObj && czmObj.positions !== undefined) {
        // this._czmObj.creating = false;
        this.$root.$earthUI.getCzmObjectPositionFromDrag(
          czmObj,
          this._disGroud
        );
        this._disGroud.creating = false;
      }
    },
    cancel () {
      this._creating.forEach(d => d());
      this._disGroud.destroy();
      this._disGroud = null;
      if (this._temGeometry) {
        this._temGeometry.forEach(e => {
          e.destroy();
        });
        this._temGeometry = [];
      }
      if (this._labels) {
        this._labels.forEach(e => {
          e.destroy();
        });
        this._labels = [];
      }

      this.$parent.destroyTool(this);
    }
  }
};
</script>
<style scoped>
.flatten {
  height: 40px;
  float: left;
}
.flatten label {
  float: left;
  min-width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.myBarChart {
  width: 100%;
  height: 100%;
  margin: 0 auto !important;
}
.myBarChart > div {
  margin: 0 auto !important;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.attitudeEditCameraButton {
  color: #dddddd;
}
.btncoloron {
  color: #1fffff !important;
}
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
.attitudeEditCameraButton {
  display: inline-block;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  /* margin-top: 10px; */
}
.xbsj-videoAttribute .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.buttonGroup div .playButton {
  background: url(../../images/play.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.buttonGroup div .suspendButton {
  background: url(../../images/suspend.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.dragButton {
  /* display: inline-block; */
  width: 120px;
  height: 25px;
  /* margin-left: 18px; */
  background: url(../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
  float: left;
  margin-top: 10px;
}

.dragButton.highlight {
  background: url(../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.chartContents {
  float: left;
  width: calc(100% - 146px);
  height: 100%;
}
</style>

