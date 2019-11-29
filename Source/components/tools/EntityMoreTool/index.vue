<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :width="396"
    :height="345"
    :min-width="396"
    :left="500"
    :top="138"
    :title="lang.title"
  >
    <div class="containbox">
      <div class="leftbox">
        <XbsjVirtualTree
          ref="vtree"
          :tree="tree"
          @on-click="itemClick"
          :checkBoxShow="checkBoxShow"
        ></XbsjVirtualTree>
      </div>
      <div class="rightbox">
        <div>
          <ul v-show="dotShow">
            <li @click="Pinbtn">{{lang.pin}}</li>
            <li @click="Pinpicturebtn">{{lang.pinpicturebtn}}</li>
            <li @click="Pindivbtn">{{lang.pindivbtn}}</li>
          </ul>
        </div>
        <div>
          <ul v-show="lineShow">
            <li @click="Path">{{lang.path}}</li>
            <li @click="Polyline">{{lang.polyline}}</li>
            <li @click="SolidLine">{{lang.solidline}}</li>
            <li @click="DotLine">{{lang.dotline}}</li>
            <li @click="ArrowLine">{{lang.arrowline}}</li>
            <li @click="ODLine">{{lang.odline}}</li>
            <li @click="CurveArrow">{{lang.curvearrow}}</li>
            <li @click="PolylineArrow">{{lang.polylinearrow}}</li>
            <li @click="SectorSearch">{{lang.sectorsearch}}</li>
            <li @click="Arc">{{lang.arc}}</li>
            <li @click="Bezier2">{{lang.bezier2}}</li>
            <li @click="Bezier3">{{lang.bezier3}}</li>
            <!-- <li @click="ParallelSearch">{{lang.parallelsearch}}</li> -->
          </ul>
        </div>
        <div>
          <ul v-show="surfaceShow">
            <li @click="Circle">{{lang.circle}}</li>
            <li @click="Rectangle">{{lang.rectangle}}</li>
            <li @click="TriFlag">{{lang.triflag}}</li>
            <li @click="CurveFlag">{{lang.curveflag}}</li>
            <li @click="RightAngleFlag">{{lang.rightangleflag}}</li>
            <li @click="DoubleArrow">{{lang.doublearrow}}</li>
            <li @click="Polygon">{{lang.polygon}}</li>
            <li @click="Sector">{{lang.sector}}</li>
          </ul>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./locale";

export default {
  data() {
    return {
      show: true,
      dotShow: true,
      lineShow: false,
      surfaceShow: false,
      tree: [],
      lang: {},
      langs: languagejs,
      checkBoxShow: false
    };
  },
  created() {},
  mounted() {
    this.tree = [
      {
        title: this.lang.entityclassic,
        expand: true,
        checkStatus: "checked",
        children: [
          {
            id: 1,
            title: this.lang.dot,
            expand: false,
            checkStatus: "checked",
            dotShows: true
          },
          {
            id: 2,
            title: this.lang.line,
            expand: false,
            checkStatus: "checked",
            lineShows: true
          },
          {
            id: 3,
            title: this.lang.surface,
            expand: false,
            checkStatus: "checked",
            surfaceShows: true
          }
        ]
      }
    ];
  },
  methods: {
    itemClick(item) {
      // console.log(item);
      if (item.item.dotShows) {
        this.dotShow = true;
        this.lineShow = false;
        this.surfaceShow = false;
      }
      if (item.item.lineShows) {
        this.dotShow = false;
        this.lineShow = true;
        this.surfaceShow = false;
      }
      if (item.item.surfaceShows) {
        this.dotShow = false;
        this.lineShow = false;
        this.surfaceShow = true;
      }
    },
    // 内置图标
    Pinbtn() {
      var Pin = new XE.Obj.Pin(this.$root.$earth);
      Pin.ctrtype = "PinTool";
      Pin.name = "内置图标";
      Pin.positionPicking = true;
      Pin.isCreating = true;
      Pin.creating = true;
      this.$root.$earthUI.showPropertyWindow(Pin);
    },
    // 外置图标
    Pinpicturebtn() {
      var PinPictureTool = new XE.Obj.Pin(this.$root.$earth);
      PinPictureTool.name = "外置图标";
      PinPictureTool.positionPicking = true;
      PinPictureTool.isCreating = true;
      PinPictureTool.creating = true;
      this.$root.$earthUI.showPropertyWindow(PinPictureTool);
    },
    // div图标
    Pindivbtn() {
      var PinDivTool = new XE.Obj.Plots.GeoPin(this.$root.$earth);
      PinDivTool.ctrtype = "PinDivTool";
      PinDivTool.name = "div图标";
      PinDivTool.isCreating = true;
      PinDivTool.creating = true;
      PinDivTool._pin.show = false;
      this.$root.$earthUI.showPropertyWindow(PinDivTool);
    },
    // 路径
    Path() {
      var Path = new XE.Obj.Path(this.$root.$earth);
      Path.name = "路径";
      Path.positionPicking = true;
      Path.isCreating = true;
      Path.creating = true;
      this.$root.$earthUI.showPropertyWindow(Path);
    },
    // 折线
    Polyline() {
      var Polyline = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
      Polyline.creating = true;
      Polyline.isCreating = true;
      Polyline.name = "折线";
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 实线
    SolidLine() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "实线";
      Polyline.allowPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 虚线
    DotLine() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "虚线";
      Polyline.material.type = "XbsjPolylineDashMaterial";
      Polyline.allowPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 箭头线
    ArrowLine() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "箭头线";
      Polyline.material.type = "XbsjPolylineArrowMaterial";
      Polyline.allowPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // OD线
    ODLine() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "OD线";
      Polyline.material.type = "XbsjODLineMaterial";
      Polyline.allowPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 曲线箭头
    CurveArrow() {
      var GeoCurveArrow = new XE.Obj.Plots.GeoCurveArrow(this.$root.$earth);
      GeoCurveArrow.creating = true;
      GeoCurveArrow.isCreating = true;
      GeoCurveArrow.name = "曲线箭头";
      this.$root.$earthUI.showPropertyWindow(GeoCurveArrow);
    },
    // 折线箭头
    PolylineArrow() {
      var PolylineArrow = new XE.Obj.Plots.GeoPolylineArrow(this.$root.$earth);
      PolylineArrow.creating = true;
      PolylineArrow.isCreating = true;
      PolylineArrow.name = "折线箭头";
      this.$root.$earthUI.showPropertyWindow(PolylineArrow);
    },
    // 扇形搜索
    SectorSearch() {
      var SectorSearch = new XE.Obj.Plots.GeoSectorSearch(this.$root.$earth);
      SectorSearch.creating = true;
      SectorSearch.isCreating = true;
      SectorSearch.name = "扇形搜索";
      this.$root.$earthUI.showPropertyWindow(SectorSearch);
    },
    // 圆弧
    Arc() {
      var Arc = new XE.Obj.Plots.GeoArc(this.$root.$earth);
      Arc.creating = true;
      Arc.isCreating = true;
      Arc.name = "圆弧";
      this.$root.$earthUI.showPropertyWindow(Arc);
    },
    // 贝塞尔2次曲线
    Bezier2() {
      var Bezier2 = new XE.Obj.Plots.GeoBezier2(this.$root.$earth);
      Bezier2.creating = true;
      Bezier2.isCreating = true;
      Bezier2.name = "贝塞尔2次曲线";
      this.$root.$earthUI.showPropertyWindow(Bezier2);
    },
    // 贝塞尔3次曲线
    Bezier3() {
      var Bezier3 = new XE.Obj.Plots.GeoBezier3(this.$root.$earth);
      Bezier3.creating = true;
      Bezier3.isCreating = true;
      Bezier3.name = "贝塞尔3次曲线";
      this.$root.$earthUI.showPropertyWindow(Bezier3);
    },
    // 平行搜寻区
    // ParallelSearch() {
    //   var ParallelSearch = new XE.Obj.Plots.GeoParallelSearch(
    //     this.$root.$earth
    //   );
    //   ParallelSearch.creating = true;
    //   ParallelSearch.isCreating = true;
    //   ParallelSearch.name = "平行搜寻区";
    //   this.$root.$earthUI.showPropertyWindow(ParallelSearch);
    // },
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
    // 三角旗标
    TriFlag() {
      var TriFlag = new XE.Obj.Plots.GeoTriFlag(this.$root.$earth);
      TriFlag.creating = true;
      TriFlag.isCreating = true;
      TriFlag.name = "三角旗标";
      this.$root.$earthUI.showPropertyWindow(TriFlag);
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
    },
    // 双箭头
    DoubleArrow() {
      var DoubleArrow = new XE.Obj.Plots.GeoDoubleArrow(this.$root.$earth);
      DoubleArrow.creating = true;
      DoubleArrow.isCreating = true;
      DoubleArrow.name = "双箭头";
      this.$root.$earthUI.showPropertyWindow(DoubleArrow);
    },
    // 多边形
    Polygon() {
      var Polygon = new XE.Obj.Plots.GeoPolygon(this.$root.$earth);
      Polygon.creating = true;
      Polygon.isCreating = true;
      Polygon.name = "多边形";
      this.$root.$earthUI.showPropertyWindow(Polygon);
    },
    // 扇形
    Sector() {
      var Sector = new XE.Obj.Plots.GeoSector(this.$root.$earth);
      Sector.creating = true;
      Sector.isCreating = true;
      Sector.name = "扇形";
      this.$root.$earthUI.showPropertyWindow(Sector);
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
  width: 82px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 36%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
}
.rightbox {
  width: 64%;
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
