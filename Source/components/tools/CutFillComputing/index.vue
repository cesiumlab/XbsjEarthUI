<template>
  <Window
    :title="lang.title"
    :width="281"
    :height="225"
    :left="900"
    @cancel="show=false"
    v-show="show"
    :footervisible="false"
  >
    <div v-if="status==='completed' || computing">
      <button class="xbsj-button" @click="buttonClick">{{buttonText}}</button>
    </div>

    <div v-if="status==='completed'">
      <span>{{lang.results}}</span>
      <br />
      <span>{{lang.gridWidth}}{{ results.gridWidth.toFixed(2) }} m</span>
      <br />
      <span>{{lang.area}}{{ results.area.toFixed(2) }} ㎡</span>
      <br />
      <span>{{lang.cut}}{{ results.cut.toFixed(2) }} m³</span>
      <br />
      <span>{{lang.fill}}{{ results.fill.toFixed(2) }} m³</span>
      <br />
      <span>{{lang.total}}{{ results.total.toFixed(2) }} m³</span>
      <br />
    </div>
    <div v-else-if="status==='cancelled'">
      <span>意外终止！请重新开始！</span><br />
      <button class="xbsj-button" @click="buttonClick">{{buttonText}}</button>
      <br />
    </div>
    <div v-else-if="computing">
      <span>{{lang.progress}}{{ (progress * 100).toFixed(1) }}%</span>
      <br />
    </div>
    <div v-else>
      <span>{{lang.tooltip}}</span>
      <div class="field">{{lang.gridWidth}}</div>
      <XbsjMeterInput v-model.number="gridWidth" class="gridWidth"></XbsjMeterInput>
    </div>
  </Window>
</template>
<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          title: "挖填方分析",
          start: "开始分析",
          reStart: "重新开始",
          cancelComputing: "取消计算",
          tooltip: "使用鼠标在模型数据上绘制待分析的多边形区域",
          gridWidth: "采样间距:",
          results: "计算结果:",
          progress: "计算进度:",
          area: "总面积:",
          cut: "挖方:",
          fill: "填方:",
          total: "挖填方:"
        },
        en: {
          title: "Cut&Fill Volume",
          start: "Start",
          reStart: "ReStart",
          cancelComputing: "Cancle Compute",
          tooltip: "draw polygon on 3dtiles model",
          gridWidth: "Sample Grid Width:",
          results: "Results:",
          progress: "Progress:",
          area: "Area:",
          cut: "Cut Volume:",
          fill: "Fill Volume:",
          total: "Total Volume:"
        }
      },
      show: true,
      enabled: false,
      status: "",
      progress: 0.0,
      computing: false,
      gridWidth: 1.0,
      results: {
        gridWidth: 0.0,
        area: 0.0,
        cut: 0.0,
        fill: 0.0,
        total: 0.0
      },
      lang: undefined
    };
  },
  computed: {
    buttonText() {
      //如果正在计算，返回取消计算
      if (this.computing) {
        return this.lang.cancelComputing;
      }
      //如果计算结束，返回重新开始
      if (this.status == "completed") {
        return this.lang.reStart;
      }
      //返回开始计算
      return this.lang.start;
    },
    statusText() {
      const ss = ["initial", "running", "completed", "cancelled"];
      const chinese = ["初始状态", "正在运行", "已完成", "已取消"];
      return chinese[ss.indexOf(this.status)];
    }
  },
  created() {
    
  },
  mounted() {
    const bind = XE.MVVM.bind;
    this._cutFillComputing = this.$root.$earth.analyzation.cutFillComputing;

    this._disposers = this._disposers || [];
    const props = [
      "enabled",
      "status",
      "progress",
      "computing",
      "gridWidth",
      "results.gridWidth",
      "results.area",
      "results.cut",
      "results.fill",
      "results.total"
    ];
    props.forEach(p => {
      this._disposers.push(bind(this, p, this._cutFillComputing, p));
    });
  },
  methods: {
    buttonClick() {
      //清空结果 停止
      this._cutFillComputing.clearResults();
      this._cutFillComputing.enabled = false;
      //下一个帧再次开始
      this.$nextTick(() => {
        this._cutFillComputing.enabled = true;
      });
    }
  },
  watch: {
    show(v) {
      if (v) {
        this._cutFillComputing.enabled = true;
      } else {
        this._cutFillComputing.clearResults();
        this._cutFillComputing.enabled = false;
      }
    }
  },
  beforeDestroy() {
    this._disposers.forEach(d => d());
    this._disposers.length = 0;
  }
};
</script>
<style scoped>
.gridWidth {
  width: 80px;
  float: left;
}
.field {
  float: left;
  line-height: 30px;
  margin-right: 10px;
}
</style>

