<template>
  <!-- 编辑提示框 -->
  <Window
    ref="win"
    :title="lang.title"
    :width="1412"
    :height="210"
    :floatright="true"
    :top="138"
    @cancel="cancel"
    :footervisible="false"
    :resized="resize"
  >
    <div style="width:100%;height:100%;">
      <div class="flatten">
        <div style="float: left;">
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
        <!-- <div style="float: left;">
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
        </div>-->
        <div class="myBarChart" ref="mains"></div>
      </div>
    </div>
  </Window>
</template>

<script>
export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      langs: {
        zh: {
          title: "剖面分析",
          creating: "创建",
          editing: "编辑",
          drag: "拖拽",
          dragcontent: "请把对象拖到这里"
        },
        en: {
          title: "Profile analysis",
          creating: "creating",
          editing: "editing",
          drag: "drag",
          dragcontent: "Drag the object here"
        }
      },
      lang: undefined,
      interval: 0,
      creating: true,
      editing: false,
      drag_over: false
    };
  },
  created() {
    // var lang = this.$root.language;
    // this.lang = this.langs[lang];
  },
  mounted() {
    //获取绑定的view
    let result = this.getBind();
    // console.log(result);
    let resultdata = result.sample,
      xdata = [],
      ydata = [],
      data = {};
    resultdata.forEach(element => {
      xdata.push(element.distance);
      ydata.push(element.height);
    });
    this.drawLine(resultdata, xdata, ydata);
  },
  methods: {
    resize() {
      if (this._chart) {
        this.$refs.mains.style.width = this.$refs.chartContents.style.width;
        this.$refs.mains.style.height = this.$refs.chartContents.style.height;
        this._chart.resize();
      }
    },
    /*画图*/
    drawLine(resultdata, xdata, ydata) {
      // 基于准备好的dom，初始化echarts实例
      this._chart = this.$echarts.init(this.$refs.mains);
      // 绘制柱状图图表

      this._chart.setOption({
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          },
          position: function(point, params, dom, rect, size) {
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
          formatter(params) {
            const item = params[0];
            // console.log(item);
            item.data = resultdata[item.dataIndex];
            return (
              "<span>所在位置 " +
              item.data.longitude +
              "," +
              item.data.latitude +
              "</span><br/><span>距起点 " +
              item.name +
              "</span><br/>" +
              item.seriesName +
              " " +
              "<span style='color:rgb(255, 70, 131);font-weight:bold;'>" +
              item.value +
              "</span>"
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
          bottom: 25, //距离下边的距离
          top: 25 //距离上边的距离
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xdata,
          show: false,
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
              color: "rgb(255, 70, 131)", //坐标线的颜色
              width: "2" //坐标线的宽度
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
          // axisLine: {
          //   lineStyle: {
          //     type: "solid",
          //     color: "rgba(85,85,85,0.6)", //坐标线的颜色
          //     width: "2"
          //   }
          // },
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
            // lineStyle: {
            //   color: ["rgba(85,85,85,0.6)"],
            //   width: 2,
            //   type: "solid"
            // }
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
    dragOver(e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions !== undefined) {
        e.dataTransfer.dropEffect = "copy";
        this.drag_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    dragLeave() {
      this.drag_over = false;
    },
    //拖拽放置
    drop(e) {
      this.drag_over = false;
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions !== undefined) {
        this._czmObj.creating = false;
        this.$root.$earthUI.getCzmObjectPositionFromDrag(czmObj, this._czmObj);
      }
    },
    cancel() {
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

.buttonGroup {
  display: inline-block;
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
  display: block;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
  margin-top: 20px;
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
  margin-top: 20px;
}

.dragButton.highlight {
  background: url(../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
.chartContents {
  float: left;
  width: calc(100% - 120px);
  height: 100%;
}
</style>

