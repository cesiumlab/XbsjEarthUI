<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :width="320"
    :height="300"
    :left="500"
    :top="138"
    :title="lang.title"
  >
    <div class="containbox">
      <div class="leftbox">
        <span @click="dotShow=true, lineShow=false, surfaceShow=false">{{lang.dot}}</span>
        <span @click="lineShow=true, dotShow=false, surfaceShow=false">{{lang.line}}</span>
        <span @click="surfaceShow=true, dotShow=false, lineShow=false">{{lang.surface}}</span>
      </div>
      <div class="rightbox">
        <div>
          <ul v-show="dotShow">
            <li>{{lang.dot}}</li>
          </ul>
        </div>
        <div>
          <ul v-show="lineShow">
            <li @click="Arc">{{lang.arc}}</li>
          </ul>
        </div>
        <div>
          <ul v-show="surfaceShow">
            <li @click="Circle">{{lang.circle}}</li>
            <li @click="Rectangle">{{lang.rectangle}}</li>
            <li @click="CurveFlag">{{lang.curveflag}}</li>
            <li @click="RightAngleFlag">{{lang.rightangleflag}}</li>
          </ul>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      dotShow: true,
      lineShow: false,
      surfaceShow: false,
      langs: {
        zh: {
          dot: "点",
          line: "线",
          surface: "面",
          arc: "圆弧",
          circle: "圆",
          curveflag: "曲面旗标",
          rectangle: "矩形",
          rightangleflag: "直角旗标",
          title: "标绘"
        },
        en: {
          dot: "dot",
          line: "line",
          surface: "surface",
          arc: "arc",
          circle: "circle",
          curveflag: "curveflag",
          rectangle: "rectangle",
          rightangleflag: "rightangleflag",
          title: "Entity"
        }
      },
      lang: undefined
    };
  },
  created() {},
  mounted() {},
  methods: {
    // dotClick() {},
    // 圆弧
    Arc() {
      var Arc = new XE.Obj.Plots.GeoArc(this.$root.$earth);
      Arc.creating = true;
      Arc.isCreating = true;
      Arc.name = "圆弧";
      this.$root.$earthUI.showPropertyWindow(Arc);
    },
    // 圆
    Circle() {
      var Circle = new XE.Obj.Plots.GeoCircle(this.$root.$earth);
      Circle.creating = true;
      Circle.isCreating = true;
      Circle.name = "圆";
      this.$root.$earthUI.showPropertyWindow(Circle);
    },
    // 矩形
    Rectangle() {
      var Rectangle = new XE.Obj.Plots.GeoRectangle(this.$root.$earth);
      Rectangle.creating = true;
      Rectangle.isCreating = true;
      Rectangle.name = "矩形";
      this.$root.$earthUI.showPropertyWindow(Rectangle);
    },
    // 曲面旗标
    CurveFlag() {
      var CurveFlag = new XE.Obj.Plots.GeoCurveFlag(this.$root.$earth);
      CurveFlag.creating = true;
      CurveFlag.isCreating = true;
      CurveFlag.name = "曲面旗标";
      this.$root.$earthUI.showPropertyWindow(CurveFlag);
    },
    // 直角旗标
    RightAngleFlag() {
      var RightAngleFlag = new XE.Obj.Plots.GeoRightAngleFlag(
        this.$root.$earth
      );
      RightAngleFlag.creating = true;
      RightAngleFlag.isCreating = true;
      RightAngleFlag.name = "直角旗标";
      this.$root.$earthUI.showPropertyWindow(RightAngleFlag);
    }
  }
};
</script>

<style scoped>
.containbox {
  display: flex;
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
  float: left;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 30%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
}
.rightbox {
  width: 70%;
  height: 100%;
  float: left;
}
.leftbox span {
  display: block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  padding-left: 10px;
}
.leftbox span:hover {
  background: rgba(0, 0, 0, 0.51);
}
</style>
