<template>
  <!-- box -->
  <div class="xbsj-template">
    <div
      class="xbsj-list"
      ref="container"
      @mousedown="startMove($event)"
      @mousemove="onMoving($event)"
      @mouseup="endMove($event)"
    >
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.plotlibrary}}</span>
        <!-- 在线 -->
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn onlinebutton"
            @click="OnlineSymbolShow=!OnlineSymbolShow"
            :class="{highlight:OnlineSymbolShow}"
          ></div>
          <span class="xbsj-item-name">{{lang.online}}</span>
        </div>
        <!-- Lab内置 -->
        <div class="xbsj-item-btnbox" @click="LabSymbolShow=!LabSymbolShow">
          <div class="xbsj-item-btn localhostbutton" :class="{highlight:LabSymbolShow}"></div>
          <span class="xbsj-item-name">{{lang.localhost}}</span>
        </div>
        <!-- 自定义 -->
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn symbolbutton"
            @click="CustomSymbolShow=!CustomSymbolShow"
            :class="{highlight:CustomSymbolShow}"
          ></div>
          <span class="xbsj-item-name">{{lang.custom}}</span>
        </div>
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.routine}}</span>
        <!-- 图标点 -->
        <div class="xbsj-item-btnbox ml20" @click="pinbtn" title="图标点">
          <div class="xbsj-item-btn pinbutton"></div>
          <span class="xbsj-item-name">{{lang.pin}}</span>
        </div>
        <!-- 图片 -->
        <!-- <div class="xbsj-item-btnbox ml20" @click="pinpicturebtn" title="图片">
          <div class="xbsj-item-btn pinpicbutton"></div>
          <span class="xbsj-item-name">{{lang.pinpicturebtn}}</span>
        </div>-->
        <!-- div图标 -->
        <!-- <div class="xbsj-item-btnbox ml20" @click="pindivbtn" title="div图标">
          <div class="xbsj-item-btn pindivbutton"></div>
          <span class="xbsj-item-name">{{lang.pindivbtn}}</span>
        </div>-->
        <!-- 折线 -->
        <!-- <div class="xbsj-item-btnbox" @click="polylinebtn" title="折线">
          <div class="xbsj-item-btn linebutton"></div>
          <span class="xbsj-item-name">{{lang.line}}</span>
        </div>-->
        <div class="xbsj-item-btnbox" @click="Polyline">
          <div class="xbsj-item-btn linebutton"></div>
          <span class="xbsj-item-name">{{lang.line}}</span>
        </div>

        <!-- 矩形 -->
        <div class="xbsj-item-btnbox" @click="rectangle">
          <div class="xbsj-item-btn rectanglebutton"></div>
          <span class="xbsj-item-name">{{lang.rectangle}}</span>
        </div>

        <!-- 圆 -->
        <div class="xbsj-item-btnbox" @click="circle">
          <div class="xbsj-item-btn circlebutton"></div>
          <span class="xbsj-item-name">{{lang.circle}}</span>
        </div>

        <!-- 曲线 -->
        <!-- <div class="xbsj-item-btnbox" @click="curvebtn">
          <div class="xbsj-item-btn curvedarrow"></div>
          <span class="xbsj-item-name">{{lang.curve}}</span>
        </div>-->

        <!-- 曲线箭头 -->
        <!-- <div class="xbsj-item-btnbox" @click="curvedarrowbtn">
          <div class="xbsj-item-btn curvedarrow"></div>
          <span class="xbsj-item-name">{{lang.curvedarrow}}</span>
        </div>-->

        <!-- 折线箭头 -->
        <!-- <div class="xbsj-item-btnbox" @click="PolylineArrow">
          <div class="xbsj-item-btn PolylineArrow"></div>
          <span class="xbsj-item-name">{{lang.PolylineArrow}}</span>
        </div>-->
        <!-- 扇区搜索 -->
        <!-- <div class="xbsj-item-btnbox" @click="SectorSearch">
          <div class="xbsj-item-btn Searchbutton"></div>
          <span class="xbsj-item-name">{{lang.SectorSearch}}</span>
        </div>-->
        <!-- 三角旗帜 -->
        <!-- <div class="xbsj-item-btnbox" @click="TriFlag">
          <div class="xbsj-item-btn TriFlag"></div>
          <span class="xbsj-item-name">{{lang.TriFlag}}</span>
        </div>-->
        <!-- 双箭头 -->
        <div class="xbsj-item-btnbox" @click="DoubleArrow">
          <div class="xbsj-item-btn DoubleArrow"></div>
          <span class="xbsj-item-name">{{lang.DoubleArrow}}</span>
        </div>
        <!-- 多边形 -->
        <!-- <div class="xbsj-item-btnbox" @click="Polygon">
          <div class="xbsj-item-btn facebutton"></div>
          <span class="xbsj-item-name">{{lang.face}}</span>
        </div>-->
        <!-- 多边形 -->
        <div class="xbsj-item-btnbox" @click="PolygonStretch">
          <div class="xbsj-item-btn facebutton"></div>
          <span class="xbsj-item-name">{{lang.polygonStretch}}</span>
        </div>
        <!-- 单体化 -->
        <div class="xbsj-item-btnbox" @click="ClassificationPolygon">
          <div class="xbsj-item-btn classificationpolygonbutton"></div>
          <span class="xbsj-item-name">{{lang.classificationpolygon}}</span>
        </div>
        <!-- 平尾箭头 -->
        <div class="xbsj-item-btnbox" @click="FlatArrow">
          <div class="xbsj-item-btn flatArrowbutton"></div>
          <span class="xbsj-item-name">{{lang.flatarrow}}</span>
        </div>
        <!-- 粒子 -->
        <div class="xbsj-item-btnbox" @click="ParticleSystem">
          <div class="xbsj-item-btn particleSystembutton"></div>
          <span class="xbsj-item-name">{{lang.particlesystem}}</span>
        </div>
        <!-- 粒子烟火 -->
        <div class="xbsj-item-btnbox" @click="ParticleSystemFireWork">
          <div class="xbsj-item-btn particleSystemFireWorkbutton"></div>
          <span class="xbsj-item-name">{{lang.ParticleSystemFireWork}}</span>
        </div>
        <!-- 粒子喷射 -->
        <div class="xbsj-item-btnbox" @click="ParticleSystemTails">
          <div class="xbsj-item-btn particleSystemTailsbutton"></div>
          <span class="xbsj-item-name">{{lang.ParticleSystemTails}}</span>
        </div>
        <!-- 平滑多边形 -->
        <div class="xbsj-item-btnbox" @click="GeoSmoothPolygon">
          <div class="xbsj-item-btn smoothPolygonbutton"></div>
          <span class="xbsj-item-name">{{lang.GeoSmoothPolygon}}</span>
        </div>
        <!-- 标绘更多 -->
        <!-- <div class="xbsj-item-btnbox" @click="EntityMoreShow=!EntityMoreShow">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>-->

        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn spotbutton"></div>
          <span class="xbsj-item-name">{{lang.spot}}</span>
        </div>

        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn charactersbutton"></div>
          <span class="xbsj-item-name">{{lang.characters}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn globebutton"></div>
          <span class="xbsj-item-name">{{lang.globe}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn Cylinderbutton"></div>
          <span class="xbsj-item-name">{{lang.Cylinder}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn casebutton"></div>
          <span class="xbsj-item-name">{{lang.case}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="routineMore">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>-->
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.solid}}</span>
        <!-- 立方体 -->
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn cubebutton"></div>
          <span class="xbsj-item-name">{{lang.cube}}</span>
        </div>-->
        <!-- 球体 -->
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn spherebutton"></div>
          <span class="xbsj-item-name">{{lang.sphere}}</span>
        </div>-->
        <!-- 模型 -->
        <div class="xbsj-item-btnbox" @click="createPlane">
          <div class="xbsj-item-btn modelbutton"></div>
          <span class="xbsj-item-name">{{lang.model}}</span>
        </div>
        <!-- 多边形贴图 -->
        <div class="xbsj-item-btnbox" @click="PolygonImageShow">
          <div class="xbsj-item-btn polygonimagebutton"></div>
          <span class="xbsj-item-name">{{lang.polygonImage}}</span>
        </div>
      </div>
      <!-- <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.model}}</span>

        <div class="xbsj-item-btnbox" @click="createPlane">
          <div class="xbsj-item-btn planebutton"></div>
          <span class="xbsj-item-name">{{lang.plane}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn characterbutton"></div>
          <span class="xbsj-item-name">{{lang.character}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="createTree">
          <div class="xbsj-item-btn treebutton"></div>
          <span class="xbsj-item-name">{{lang.tree}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="createCar">
          <div class="xbsj-item-btn carbutton"></div>
          <span class="xbsj-item-name">{{lang.car}}</span>
        </div>
        模型更多
        <div class="xbsj-item-btnbox ml20" @click="createmodelbtn">
          <div class="xbsj-item-btn modelbutton"></div>
          <span class="xbsj-item-name">{{lang.createmodel}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>
      </div>-->
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.senior}}</span>
        <!-- 路径 -->
        <div class="xbsj-item-btnbox" @click="pathbtn" title="路径">
          <div class="xbsj-item-btn pathbutton"></div>
          <span class="xbsj-item-name">{{lang.path}}</span>
        </div>
        <!-- 带杆文字 -->
        <!-- <div class="xbsj-item-btnbox" title="带杆文字">
          <div class="xbsj-item-btn barwritebutton"></div>
          <span class="xbsj-item-name">{{lang.barwrite}}</span>
        </div>-->
        <!-- 扩散面 -->
        <!-- <div class="xbsj-item-btnbox" title="扩散面">
          <div class="xbsj-item-btn pathbutton"></div>
          <span class="xbsj-item-name">{{lang.diffusionsurface}}</span>
        </div>-->
        <!-- OD线 -->
        <!-- <div class="xbsj-item-btnbox" @click="odLine" title="OD线">
          <div class="xbsj-item-btn odbutton"></div>
          <span class="xbsj-item-name">{{lang.odLine}}</span>
        </div>-->
        <!-- 扫描线 -->
        <!-- <div class="xbsj-item-btnbox ml20" @click="scanLineBtn">
          <div class="xbsj-item-btn radarbutton"></div>
          <span class="xbsj-item-name">{{lang.Scanline}}</span>
        </div>-->
        <!-- 管道 -->
        <!-- <div class="xbsj-item-btnbox ml20" @click="tubeBtn">
          <div class="xbsj-item-btn tubebutton"></div>
          <span class="xbsj-item-name">{{lang.tube}}</span>
        </div>-->
        <!-- 自定义图元 -->
        <!-- <div class="xbsj-item-btnbox ml20" @click="customPrimitiveBtn">
          <div class="xbsj-item-btn customprimitivebutton"></div>
          <span class="xbsj-item-name">{{lang.CustomPrimitive}}</span>
        </div>-->
        <!-- 道路 -->
        <div class="xbsj-item-btnbox ml20" @click="roadBtn">
          <div class="xbsj-item-btn roadbutton"></div>
          <span class="xbsj-item-name">{{lang.road}}</span>
        </div>
        <!-- 挡土墙 -->
        <div class="xbsj-item-btnbox ml20" @click="wallBtn">
          <div class="xbsj-item-btn wallbutton"></div>
          <span class="xbsj-item-name">{{lang.wall}}</span>
        </div>
        <!-- 填充面 -->
        <div class="xbsj-item-btnbox ml20" @click="surfaceBtn">
          <div class="xbsj-item-btn surfacebutton"></div>
          <span class="xbsj-item-name">{{lang.surface}}</span>
        </div>
        <!-- 立面贴图 -->
        <div class="xbsj-item-btnbox ml20" @click="groundImageBtn">
          <div class="xbsj-item-btn groundimagebutton"></div>
          <span class="xbsj-item-name">{{lang.groundimage}}</span>
        </div>
        <!-- <div class="xbsj-item-btnbox ml20">
          <div class="xbsj-item-btn odbutton"></div>
          <span class="xbsj-item-name">{{lang.od}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn waterbutton"></div>
          <span class="xbsj-item-name">{{lang.water}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn haplochromatization"></div>
          <span class="xbsj-item-name">{{lang.haplochromatization}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn particlebutton"></div>
          <span class="xbsj-item-name">{{lang.particle}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn singlearrowbutton"></div>
          <span class="xbsj-item-name">{{lang.singlearrow}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn doublearrowbutton"></div>
          <span class="xbsj-item-name">{{lang.doublearrow}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn radarbutton"></div>
          <span class="xbsj-item-name">{{lang.radar}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn ribbonbutton"></div>
          <span class="xbsj-item-name">{{lang.ribbon}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>-->
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.algorithm}}</span>
        <!-- 抛物插值 -->
        <div
          class="xbsj-item-btnbox ml20"
          ref="parabolicBtn"
          @click="parabolicBtn"
          @drop="parabolic_drop($event)"
          @dragover="parabolic_dragover($event)"
          @dragleave="parabolic_dragleave($event)"
        >
          <div
            class="xbsj-item-btn parabolicbtn"
            :class="{highlight:parabolic_over||parabolicShow}"
          ></div>
          <span class="xbsj-item-name">{{lang.parabolic}}</span>
        </div>

        <!-- ODLines -->
        <div class="xbsj-item-btnbox ml20" ref="odlinesbtn" @click="createODlines">
          <div class="xbsj-item-btn odlinesbtn"></div>
          <span class="xbsj-item-name">ODLines</span>
        </div>
      </div>
    </div>
    <PlottingMore ref="plottingMore"></PlottingMore>
    <Parabolic ref="parabolic" v-show="parabolicShow"></Parabolic>
  </div>
</template>

<script>
import languagejs from "./index_locale";
import PlottingMore from "./PlottingMore/index";
import Parabolic from "./Parabolic";
import { addOutterEventListener } from "../../../utils/xbsjUtil";
export default {
  components: {
    PlottingMore,
    Parabolic
  },
  data() {
    return {
      selectlist: false,
      lang: {},
      langs: languagejs,
      PlottingShow: false,
      EntityMoreShow: false,
      OnlineSymbolShow: false,
      LabSymbolShow: false,
      CustomSymbolShow: false,
      show: true,
      popup: "",
      parabolicShow: false,
      parabolic_over: false,
      odlines_over: false
    };
  },
  created() {},
  mounted() {
    //给所有popup的el上添加外部事件
    Object.keys(this.$refs).forEach(key => {
      addOutterEventListener(this.$refs[key].$el, "mousedown", el => {
        let comp = this.getPopupComp();
        if (comp && comp.$el === el) {
          if (typeof comp.show == "function") {
            comp.show(false);
          }
          this.popup = "";
        }
      });
    });

    //console.log(this.$root.$earthUI);
    this.$parent.$on("hidePopup", () => {
      this.showPopup(false);
      this.popup = "";
    });
  },
  methods: {
    // 多边形
    Polygon() {
      var Polygon = new XE.Obj.Plots.GeoPolygon(this.$root.$earth);
      // console.log(Polygon);
      Polygon.creating = true;
      Polygon.isCreating = true;
      Polygon.name = "多边形";
      this.$root.$earthUI.showPropertyWindow(Polygon);
    },
    // 圆弧
    Arc() {
      var Arc = new XE.Obj.Plots.GeoArc(this.$root.$earth);
      Arc.creating = true;
      Arc.isCreating = true;
      Arc.name = "圆弧";
      this.$root.$earthUI.showPropertyWindow(Arc);
    },
    //双箭头
    DoubleArrow() {
      var DoubleArrow = new XE.Obj.Plots.GeoDoubleArrow(this.$root.$earth);
      // console.log(DoubleArrow);
      DoubleArrow.creating = true;
      DoubleArrow.isCreating = true;
      DoubleArrow.name = "双箭头";
      this.$root.$earthUI.showPropertyWindow(DoubleArrow);
    },
    //三角旗帜
    TriFlag() {
      var TriFlag = new XE.Obj.Plots.GeoTriFlag(this.$root.$earth);
      // console.log(TriFlag);
      TriFlag.creating = true;
      TriFlag.isCreating = true;
      TriFlag.name = "三角旗帜";
      this.$root.$earthUI.showPropertyWindow(TriFlag);
    },
    //打开扇形搜索
    SectorSearch() {
      var SectorSearch = new XE.Obj.Plots.GeoSectorSearch(this.$root.$earth);
      // console.log(SectorSearch);
      SectorSearch.creating = true;
      SectorSearch.isCreating = true;
      SectorSearch.name = "扇形搜索";
      this.$root.$earthUI.showPropertyWindow(SectorSearch);
    },
    // 打开折线弹窗
    Polyline() {
      var Polyline = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
      // console.log(Polyline);
      Polyline.creating = true;
      Polyline.isCreating = true;
      Polyline.name = "折线";
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 打开折线箭头弹窗
    PolylineArrow() {
      var PolylineArrow = new XE.Obj.Plots.GeoPolylineArrow(this.$root.$earth);
      // console.log(PolylineArrow);
      PolylineArrow.creating = true;
      PolylineArrow.isCreating = true;
      PolylineArrow.name = "折线箭头";
      this.$root.$earthUI.showPropertyWindow(PolylineArrow);
    },
    // 打开矩形弹窗
    rectangle() {
      var Rectangle = new XE.Obj.Plots.GeoRectangle(this.$root.$earth);
      Rectangle.creating = true;
      Rectangle.isCreating = true;
      Rectangle.name = "矩形";
      this.$root.$earthUI.showPropertyWindow(Rectangle);
    },
    // 打开圆弹窗
    circle() {
      var Circle = new XE.Obj.Plots.GeoCircle(this.$root.$earth);
      Circle.creating = true;
      Circle.isCreating = true;
      Circle.name = "圆";
      this.$root.$earthUI.showPropertyWindow(Circle);
    },
    //打开曲线弹窗
    curvebtn() {
      var GeoCurve = new XE.Obj.Plots.GeoCurve(this.$root.$earth);
      // console.log(GeoCurveArrow);
      GeoCurve.creating = true;
      GeoCurve.isCreating = true;
      GeoCurve.name = "曲线";
      this.$root.$earthUI.showPropertyWindow(GeoCurve);
    },
    //打开曲线箭头弹窗
    curvedarrowbtn() {
      var GeoCurveArrow = new XE.Obj.Plots.GeoCurveArrow(this.$root.$earth);
      // console.log(GeoCurveArrow);
      GeoCurveArrow.creating = true;
      GeoCurveArrow.isCreating = true;
      GeoCurveArrow.name = "曲线箭头";
      this.$root.$earthUI.showPropertyWindow(GeoCurveArrow);
    },
    // 打开常规更多弹窗
    routineMore() {
      // console.log(this.$refs);
      this.$refs.plottingMore.show = !this.$refs.plottingMore.show;
    },
    //创建树模型
    createTree() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "./assets/shu.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "树";
      Model.distanceDisplayCondition = [0, 5000];
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建汽车模型
    createCar() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "./assets/gongjiao.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "汽车";
      Model.distanceDisplayCondition = [0, 5000];
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建飞机模型
    createPlane() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      // console.log(Model);
      Model.url = "./assets/feiji.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "模型";
      Model.distanceDisplayCondition = [0, 5000];
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开模型属性窗口
    createmodelbtn() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.name = "模型";
      Model.distanceDisplayCondition = [0, 5000];
      Model.isCreating = true;
      Model.creating = true;
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开path属性窗口
    pathbtn() {
      var Path = new XE.Obj.Path(this.$root.$earth);
      Path.name = "路径动画";
      Path.positionPicking = true;
      Path.isCreating = true;
      Path.creating = true;
      this.$root.$earthUI.showPropertyWindow(Path);
    },
    // 打开pin属性窗口
    pinbtn() {
      var Pin = new XE.Obj.Pin(this.$root.$earth);
      // Pin.ctrtype = "PinTool";
      Pin.name = "图标点";
      Pin.positionPicking = true;
      Pin.isCreating = true;
      Pin.creating = true;
      // console.log(Pin);
      this.$root.$earthUI.showPropertyWindow(Pin);
    },
    pindivbtn() {
      var PinDivTool = new XE.Obj.Plots.GeoPin(this.$root.$earth);
      // PinDivTool.ctrtype = "PinDivTool";
      PinDivTool.name = "div图标";
      PinDivTool.isCreating = true;
      PinDivTool.creating = true;
      PinDivTool._pin.show = false;
      this.$root.$earthUI.showPropertyWindow(PinDivTool);
    },
    pinpicturebtn() {
      var PinPictureTool = new XE.Obj.Pin(this.$root.$earth);
      // PinPictureTool.ctrtype = "PinPictureTool";
      PinPictureTool.name = "图片";
      PinPictureTool.imageUrl = "./assets/earth.png";
      PinPictureTool.positionPicking = true;
      PinPictureTool.isCreating = true;
      PinPictureTool.creating = true;
      this.$root.$earthUI.showPropertyWindow(PinPictureTool);
    },
    // OD线
    odLine() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "OD线";
      Polyline.material.type = "XbsjODLineMaterial";
      Polyline.allowPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
    // 打开polyLine折线
    // polylinebtn() {
    //   var Polyline = new XE.Obj.Polyline(this.$root.$earth);
    //   Polyline.name = "折线";
    //   Polyline.allowPicking = true;
    //   Polyline.isCreating = true;
    //   Polyline.creating = true;
    //   this.$root.$earthUI.showPropertyWindow(Polyline);
    // },
    //打开扫描线-动画
    scanLineBtn() {
      var Scanline = new XE.Obj.Scanline(this.$root.$earth);
      Scanline.name = "扫描线";
      Scanline.creating = true;
      Scanline.isCreating = true;
      Scanline.playing = true;
      // console.log(Scanline);
      this.$root.$earthUI.showPropertyWindow(Scanline);
    },
    //打开自定义图元-动画
    customPrimitiveBtn() {
      var CustomPrimitive = new XE.Obj.CustomPrimitive(this.$root.$earth);
      CustomPrimitive.name = "自定义图元";
      CustomPrimitive.autoRegisterEditing = true;

      CustomPrimitive.isCreating = true;
      CustomPrimitive.creating = true;
      // console.log(CustomPrimitive);
      this.$root.$earthUI.showPropertyWindow(CustomPrimitive);
    },
    //多边形贴图
    PolygonImageShow() {
      if (!this.$root.$earth.terrainEffect.depthTest) {
        this.$root.$earthUI.promptInfo(
          "使用此功能需要打开深度检测，已为您自动打开！",
          "warning"
        );
        this.$root.$earth.terrainEffect.depthTest = true;
      }
      var customPrimitive = new XE.Obj.CustomPrimitiveExt.Image(
        this.$root.$earth
      );
      customPrimitive.name = "自定义图元";
      customPrimitive.isCreating = true;
      customPrimitive.creating = true;
      customPrimitive.imageUrl = "./assets/earth.png";
      this.$root.$earthUI.showPropertyWindow(customPrimitive);
    },
    //多边形拉伸
    PolygonStretch() {
      var polygonStretch = new XE.Obj.Polygon(this.$root.$earth);
      polygonStretch.name = "多边形";
      polygonStretch.isCreating = true;
      polygonStretch.creating = true;
      // console.log(polygonStretch);
      this.$root.$earthUI.showPropertyWindow(polygonStretch);
    },
    //平尾箭头
    FlatArrow() {
      var flatArrow = new XE.Obj.Plots.GeoArrow(this.$root.$earth);
      flatArrow.name = "平尾箭头";
      flatArrow.isCreating = true;
      flatArrow.creating = true;
      // console.log(flatArrow);
      this.$root.$earthUI.showPropertyWindow(flatArrow);
    },
    //粒子
    ParticleSystem() {
      var particleSystem = new XE.Obj.Plots.ParticleSystem(this.$root.$earth);
      particleSystem.name = "粒子";
      particleSystem.isCreating = true;
      particleSystem.creating = true;
      // console.log(particleSystem);
      particleSystem.image = "./assets/smoke.png";
      this.$root.$earthUI.showPropertyWindow(particleSystem);
    },
    //粒子烟火
    ParticleSystemFireWork() {
      var particleSystemFireWork = new XE.Obj.Plots.ParticleSystemFireWork(
        this.$root.$earth
      );
      particleSystemFireWork.name = "粒子烟火";
      particleSystemFireWork.isCreating = true;
      particleSystemFireWork.creating = true;
      // console.log(particleSystemFireWork);
      this.$root.$earthUI.showPropertyWindow(particleSystemFireWork);
    },
    //粒子喷射
    ParticleSystemTails() {
      var particleSystemTails = new XE.Obj.Plots.ParticleSystemTails(
        this.$root.$earth
      );
      particleSystemTails.name = "粒子喷射";
      particleSystemTails.isCreating = true;
      particleSystemTails.creating = true;
      console.log(particleSystemTails);
      this.$root.$earthUI.showPropertyWindow(particleSystemTails);
    },
    //平滑多边形
    GeoSmoothPolygon() {
      var geoSmoothPolygon = new XE.Obj.Plots.GeoSmoothPolygon(
        this.$root.$earth
      );
      geoSmoothPolygon.name = "平滑多边形";
      geoSmoothPolygon.isCreating = true;
      geoSmoothPolygon.creating = true;
      console.log(geoSmoothPolygon);
      this.$root.$earthUI.showPropertyWindow(geoSmoothPolygon);
    },
    //单体化
    ClassificationPolygon() {
      var classificationPolygon = new XE.Obj.ClassificationPolygon(
        this.$root.$earth
      );
      classificationPolygon.name = "单体化";
      classificationPolygon.isCreating = true;
      classificationPolygon.creating = true;
      // console.log(classificationPolygon);
      this.$root.$earthUI.showPropertyWindow(classificationPolygon);
    },
    // 道路
    roadBtn() {
      var road = new XE.Obj.Road(this.$root.$earth);
      road.name = "道路";
      road.autoRegisterEditing = true;

      road.isCreating = true;
      road.creating = true;
      // console.log(road);
      this.$root.$earthUI.showPropertyWindow(road);
    },
    // 挡土墙
    wallBtn() {
      var wall = new XE.Obj.Wall(this.$root.$earth);
      wall.name = "挡土墙";
      wall.autoRegisterEditing = true;

      wall.isCreating = true;
      wall.creating = true;
      // console.log(wall);
      this.$root.$earthUI.showPropertyWindow(wall);
    },
    // 填充面
    surfaceBtn() {
      var surface = new XE.Obj.Surface(this.$root.$earth);
      surface.name = "填充面";
      surface.autoRegisterEditing = true;

      surface.isCreating = true;
      surface.creating = true;
      // console.log(surface);
      this.$root.$earthUI.showPropertyWindow(surface);
    },
    // 贴地图像
    groundImageBtn() {
      var groundimage = new XE.Obj.GroundImage(this.$root.$earth);
      groundimage.name = "贴地图像";
      groundimage.autoRegisterEditing = true;

      groundimage.isCreating = true;
      groundimage.creating = true;
      groundimage.imageUrls = ["./assets/logo.png"];
      console.log(groundimage);
      this.$root.$earthUI.showPropertyWindow(groundimage);
    },

    getCzmObjectFromDrag(dataTransfer) {
      for (let i = 0; i < dataTransfer.types.length; i++) {
        var t = dataTransfer.types[i];
        if (!t) continue;
        if (t.startsWith("_czmobj_")) {
          let guid = t.substring(8);

          return this.$root.$earth.getObject(guid);
        }
      }
      return undefined;
    },
    parabolicBtn() {
      //此按钮只隐藏
      this.parabolicShow = false;
      this._czmObj = undefined;
    },
    parabolic_dragover(e) {
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions && czmObj.positions.length > 1) {
        e.dataTransfer.dropEffect = "copy";
        this.parabolic_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    parabolic_dragleave() {
      this.parabolic_over = false;
    },
    parabolic_drop(e) {
      this.parabolic_over = false;
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj.positions && czmObj.positions.length > 1) {
        //显示面板
        var p = this.$refs.parabolicBtn.parentElement;
        var t = this.$refs.parabolic.$el;
        t.style.left = p.offsetLeft + 20 + "px";
        t.style.top = p.offsetTop + 80 + "px";
        this.parabolicShow = true;

        this._czmObj = czmObj;
      }
    },
    collectODLines(sn) {
      let ret = [];

      let timeDuration = 5.0;
      let moveBaseDuration = 4.0;

      if (sn == undefined) sn = this.$root.$earth.sceneTree.currentSelectedNode;

      if (!sn) return ret;

      if (sn.czmObject) {
        let czmobj = sn.czmObject;

        if (czmobj.positions && czmobj.positions.length > 1) {
          var obj = {
            positions: [],
            color: czmobj.color ? [...czmobj.color] : [1, 1, 0, 1],
            width: czmobj.width ? czmobj.width : 3,
            startTime: timeDuration * Math.random(),
            duration: moveBaseDuration + 1.0 * Math.random()
          };
          // var positions=[];
          czmobj.positions.map(e => {
            obj.positions.push([...e]);
          });
          //obj.posititons.push(positions);
          ret.push(obj);
        }
      } else if (sn.children) {
        //递归收集子
        for (let i = 0; i < sn.children.length; i++) {
          let c = sn.children[i];
          let r = this.collectODLines(c);
          if (r && r.length > 0) {
            ret = ret.concat(r);
          }
        }
      }

      return ret;
    },
    createODlines() {
      var ret = this.collectODLines();
      if (!ret || ret.length == 0) {
        this.$root.$earthUI.promptInfo(
          "请选中一条折线或者包含折线的目录",
          "error"
        );
        return;
      }
      var odlines = new XE.Obj.ODLines(this.$root.$earth);
      odlines.evalString = "p.playing = true;";
      odlines.data = ret;
      odlines.timeDuration = 10;
      odlines.playing = true;
      odlines.name = "ODLines";
      const sceneObject = new XE.SceneTree.Leaf(odlines);
      this.$root.$earthUI.addSceneObject(sceneObject);
    },
    createParabolic(minDistance, heightRatio) {
      if (
        this._czmObj &&
        this._czmObj.positions &&
        this._czmObj.positions.length > 1
      ) {
        const cartesians = Cesium.xbsjCreateTransmitPolyline(
          [...this._czmObj.positions[0]],
          [...this._czmObj.positions[1]],
          minDistance,
          heightRatio
        );
        const poss = cartesians.map(ee => {
          const carto = Cesium.Cartographic.fromCartesian(ee);
          return [carto.longitude, carto.latitude, carto.height];
        });

        var polyline = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);

        polyline.creating = false;
        polyline.isCreating = false;
        polyline.name = "抛物线";
        polyline.positions = poss;
        polyline.ground = false;

        if (this._czmObj.color) {
          polyline.color = [...this._czmObj.color];
        }
        if (this._czmObj.width) {
          polyline.width = this._czmObj.width;
        }

        const sceneObject = new XE.SceneTree.Leaf(polyline);
        this.$root.$earthUI.addSceneObject(sceneObject);

        this._czmObj = undefined;
        this.parabolicShow = false;
      }
    },
    //打开管道-动画
    tubeBtn() {
      var Tube = new XE.Obj.CustomPrimitiveExt.Tube(this.$root.$earth);
      Tube.name = "管道";
      Tube.isCreating = true;
      Tube.creating = true;
      console.log(Tube);
      this.$root.$earthUI.showPropertyWindow(Tube);
    },
    getPopupComp() {
      if (this.$refs.hasOwnProperty(this.popup)) {
        return this.$refs[this.popup];
      } else {
        return undefined;
      }
    },
    showPopup(v) {
      let comp = this.getPopupComp();
      if (comp && typeof comp.show == "function") {
        comp.show(v);
      }
      return comp;
    },
    togglePopup(p, event) {
      //调用上一个组件的隐藏
      this.showPopup(false);

      this.popup = this.popup == p ? "" : p;

      //调用当前组件的显示
      let curComp = this.showPopup(true);
      if (!curComp) return;
      if (this.popup == "" || !event) return;
      try {
        //基于现在UI结构强行计算的
        let el = curComp.$el;
        // el.style.left =
        //   event.target.offsetLeft +
        //   event.target.offsetParent.offsetLeft -
        //   40 +
        //   "px";
        el.style.left = event.clientX - 40 + "px";
        el.style.top =
          event.target.offsetTop +
          event.target.offsetParent.offsetTop +
          44 +
          "px";
      } catch (ex) {
        console.log(ex);
      }
    },
    startMove(event) {
      //如果事件的目标不是本el 返回
      if (
        event.target.parentElement !== this.$refs.container &&
        event.target.parentElement.parentElement !== this.$refs.container
      ) {
        this.moving = false;
        return;
      }
      this.moving = true;
    },
    onMoving(event) {
      //获取鼠标和为开始位置的插值，滚动滚动条
      if (!this.moving) return;

      var dom = this.$refs.container;
      var wleft = dom.scrollLeft - event.movementX;
      if (wleft >= 0 && wleft <= dom.scrollWidth - dom.clientWidth) {
        dom.scrollLeft = wleft;
      }
    },
    endMove(envent) {
      this.moving = false;
    }
  }
};
</script>

<style scoped>
.DoubleArrow {
  background: url(../../../../images/doublearrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.DoubleArrow:hover {
  background: url(../../../../images/doublearrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.TriFlag {
  background: url(../../../../images/TriFlag.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.TriFlag:hover {
  background: url(../../../../images/TriFlag_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

/* .SectorSearch {
  background: url(../../../../images/SectorSearch.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.SectorSearch:hover {
  background: url(../../../../images/SectorSearch_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
} */

.PolylineArrow {
  background: url(../../../../images/PolylineArrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.PolylineArrow:hover {
  background: url(../../../../images/PolylineArrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.curvedarrow {
  background: url(../../../../images/CurveArrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.curvedarrow:hover {
  background: url(../../../../images/CurveArrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.modelbutton {
  background: url(../../../../images/createmodel.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.modelbutton:hover {
  background: url(../../../../images/createmodel_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.pathbutton {
  background: url(../../../../images/path.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pathbutton:hover {
  background: url(../../../../images/path_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pinbutton {
  background: url(../../../../images/pin.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pinbutton:hover {
  background: url(../../../../images/pin_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pinpicbutton {
  background: url(../../../../images/pinpic.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pinpicbutton:hover {
  background: url(../../../../images/pinpic_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pindivbutton {
  background: url(../../../../images/pindiv.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pindivbutton:hover {
  background: url(../../../../images/pindiv_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.Searchbutton {
  background: url(../../../../images/GeoSectorSearch.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.Searchbutton:hover {
  background: url(../../../../images/GeoSectorSearch_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.spotbutton {
  background: url(../../../../images/spot.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.spotbutton:hover {
  background: url(../../../../images/spot_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.linebutton {
  background: url(../../../../images/line.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.linebutton:hover {
  background: url(../../../../images/line_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.facebutton {
  background: url(../../../../images/face.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.facebutton:hover {
  background: url(../../../../images/face_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.flatArrowbutton {
  background: url(../../../../images/flatarrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.flatArrowbutton:hover {
  background: url(../../../../images/flatarrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.smoothPolygonbutton {
  background: url(../../../../images/smoothPolygon.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.smoothPolygonbutton:hover {
  background: url(../../../../images/smoothPolygon_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystembutton {
  background: url(../../../../images/particlesystem.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystembutton:hover {
  background: url(../../../../images/particlesystem_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystemFireWorkbutton {
  background: url(../../../../images/particleSystemFireWork.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystemFireWorkbutton:hover {
  background: url(../../../../images/particleSystemFireWork_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystemTailsbutton {
  background: url(../../../../images/particleSystemTails.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particleSystemTailsbutton:hover {
  background: url(../../../../images/particleSystemTails_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.polygonimagebutton {
  background: url(../../../../images/polygonimage.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.polygonimagebutton:hover {
  background: url(../../../../images/polygonimage_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.classificationpolygonbutton {
  background: url(../../../../images/classificationpolygon.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.classificationpolygonbutton:hover {
  background: url(../../../../images/classificationpolygon_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.charactersbutton {
  background: url(../../../../images/characters.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.charactersbutton:hover {
  background: url(../../../../images/characters_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globebutton {
  background: url(../../../../images/globe.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globebutton:hover {
  background: url(../../../../images/globe_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.Cylinderbutton {
  background: url(../../../../images/Cylinder.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.Cylinderbutton:hover {
  background: url(../../../../images/Cylinder_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.casebutton {
  background: url(../../../../images/case.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.casebutton:hover {
  background: url(../../../../images/case_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.more {
  background: url(../../../../images/more.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.more:hover {
  background: url(../../../../images/more_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.planebutton {
  background: url(../../../../images/plane.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.planebutton:hover {
  background: url(../../../../images/plane_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.characterbutton {
  background: url(../../../../images/character.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.characterbutton:hover {
  background: url(../../../../images/character_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.treebutton {
  background: url(../../../../images/tree.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.treebutton:hover {
  background: url(../../../../images/tree_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.carbutton {
  background: url(../../../../images/car.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.carbutton:hover {
  background: url(../../../../images/car_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.waterbutton {
  background: url(../../../../images/water.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.waterbutton:hover {
  background: url(../../../../images/water_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.haplochromatization {
  background: url(../../../../images/haplochromatization.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.haplochromatization:hover {
  background: url(../../../../images/haplochromatization_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particlebutton {
  background: url(../../../../images/particle.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.particlebutton:hover {
  background: url(../../../../images/particle_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.singlearrowbutton {
  background: url(../../../../images/singlearrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.singlearrowbutton:hover {
  background: url(../../../../images/singlearrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.doublearrowbutton {
  background: url(../../../../images/doublearrow.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.doublearrowbutton:hover {
  background: url(../../../../images/doublearrow_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.radarbutton {
  background: url(../../../../images/radar.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.radarbutton:hover {
  background: url(../../../../images/radar_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.ribbonbutton {
  background: url(../../../../images/ribbon.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.ribbonbutton:hover {
  background: url(../../../../images/ribbon_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.odbutton {
  background: url(../../../../images/od.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.odbutton:hover {
  background: url(../../../../images/od_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.onlinebutton {
  background: url(../../../../images/online.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.onlinebutton.highlight,
.onlinebutton:hover {
  background: url(../../../../images/online_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.localhostbutton {
  background: url(../../../../images/localhost.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.localhostbutton.highlight,
.localhostbutton:hover {
  background: url(../../../../images/localhost_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.symbolbutton {
  background: url(../../../../images/symbol.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.symbolbutton.highlight,
.symbolbutton:hover {
  background: url(../../../../images/symbol_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.rectanglebutton {
  background: url(../../../../images/rectangle.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.rectanglebutton.highlight,
.rectanglebutton:hover {
  background: url(../../../../images/rectangle_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.circlebutton {
  background: url(../../../../images/circle.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.circlebutton.highlight,
.circlebutton:hover {
  background: url(../../../../images/circle_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.cubebutton {
  background: url(../../../../images/cube.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.cubebutton.highlight,
.cubebutton:hover {
  background: url(../../../../images/cube_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.spherebutton {
  background: url(../../../../images/sphere.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.spherebutton.highlight,
.spherebutton:hover {
  background: url(../../../../images/sphere_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.barwritebutton {
  background: url(../../../../images/barwrite.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.barwritebutton.highlight,
.barwritebutton:hover {
  background: url(../../../../images/barwrite_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.odbutton {
  background: url(../../../../images/od.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.odbutton.highlight,
.odbutton:hover {
  background: url(../../../../images/od_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.tubebutton {
  background: url(../../../../images/tube.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.tubebutton.highlight,
.tubebutton:hover {
  background: url(../../../../images/tube_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.customprimitivebutton {
  background: url(../../../../images/customprimitive.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.customprimitivebutton.highlight,
.customprimitivebutton:hover {
  background: url(../../../../images/customprimitive_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.roadbutton {
  background: url(../../../../images/road.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.roadbutton.highlight,
.roadbutton:hover {
  background: url(../../../../images/road_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.wallbutton {
  background: url(../../../../images/wall.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.wallbutton.highlight,
.wallbutton:hover {
  background: url(../../../../images/wall_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.surfacebutton {
  background: url(../../../../images/fillsurface.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.surfacebutton.highlight,
.surfacebutton:hover {
  background: url(../../../../images/fillsurface_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.groundimagebutton {
  background: url(../../../../images/groundimage.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.groundimagebutton.highlight,
.groundimagebutton:hover {
  background: url(../../../../images/groundimage_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.parabolicbtn {
  background: url(../../../../images/parabolic.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.parabolicbtn.highlight {
  background: url(../../../../images/parabolic_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.odlinesbtn {
  background: url(../../../../images/odlines.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.odlinesbtn.highlight .odlinesbtn:hover {
  background: url(../../../../images/odlines_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
</style>

