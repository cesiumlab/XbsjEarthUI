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
        <span class="xbsj-list-name">{{lang.routine}}</span>
        <!-- 内置图标 -->
        <div class="xbsj-item-btnbox ml20" @click="pinbtn" title="内置图标">
          <div class="xbsj-item-btn pinbutton"></div>
          <span class="xbsj-item-name">{{lang.pin}}</span>
        </div>
        <!-- 外置图标 -->
        <div class="xbsj-item-btnbox ml20" @click="pinpicturebtn" title="外置图标">
          <div class="xbsj-item-btn pinpicbutton"></div>
          <span class="xbsj-item-name">{{lang.pinpicturebtn}}</span>
        </div>
        <!-- div图标 -->
        <div class="xbsj-item-btnbox ml20" @click="pindivbtn" title="div图标">
          <div class="xbsj-item-btn pindivbutton"></div>
          <span class="xbsj-item-name">{{lang.pindivbtn}}</span>
        </div>

        <!-- 路径 -->
        <div class="xbsj-item-btnbox" @click="pathbtn" title="路径">
          <div class="xbsj-item-btn pathbutton"></div>
          <span class="xbsj-item-name">{{lang.path}}</span>
        </div>
        <!-- 折线 -->
        <!-- <div class="xbsj-item-btnbox" @click="polylinebtn" title="折线">
          <div class="xbsj-item-btn linebutton"></div>
          <span class="xbsj-item-name">{{lang.line}}</span>
        </div>-->
        <div class="xbsj-item-btnbox" @click="Polyline">
          <div class="xbsj-item-btn linebutton"></div>
          <span class="xbsj-item-name">{{lang.line}}</span>
        </div>

        <!-- 曲线箭头 -->
        <div class="xbsj-item-btnbox" @click="curvedarrowbtn">
          <div class="xbsj-item-btn curvedarrow"></div>
          <span class="xbsj-item-name">{{lang.curvedarrow}}</span>
        </div>

        <!-- 折线箭头 -->
        <div class="xbsj-item-btnbox" @click="PolylineArrow">
          <div class="xbsj-item-btn PolylineArrow"></div>
          <span class="xbsj-item-name">{{lang.PolylineArrow}}</span>
        </div>
        <!-- 扇区搜索 -->
        <div class="xbsj-item-btnbox" @click="SectorSearch">
          <div class="xbsj-item-btn Searchbutton"></div>
          <span class="xbsj-item-name">{{lang.SectorSearch}}</span>
        </div>
        <!-- 三角旗帜 -->
        <div class="xbsj-item-btnbox" @click="TriFlag">
          <div class="xbsj-item-btn TriFlag"></div>
          <span class="xbsj-item-name">{{lang.TriFlag}}</span>
        </div>
        <!-- 双箭头 -->
        <div class="xbsj-item-btnbox" @click="DoubleArrow">
          <div class="xbsj-item-btn DoubleArrow"></div>
          <span class="xbsj-item-name">{{lang.DoubleArrow}}</span>
        </div>
        <!-- 多边形 -->
        <div class="xbsj-item-btnbox" @click="Polygon">
          <div class="xbsj-item-btn facebutton"></div>
          <span class="xbsj-item-name">{{lang.face}}</span>
        </div>

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
        <span class="xbsj-list-name">{{lang.model}}</span>

        <div class="xbsj-item-btnbox" @click="createPlane">
          <div class="xbsj-item-btn planebutton"></div>
          <span class="xbsj-item-name">{{lang.plane}}</span>
        </div>
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn characterbutton"></div>
          <span class="xbsj-item-name">{{lang.character}}</span>
        </div>-->
        <div class="xbsj-item-btnbox" @click="createTree">
          <div class="xbsj-item-btn treebutton"></div>
          <span class="xbsj-item-name">{{lang.tree}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="createCar">
          <div class="xbsj-item-btn carbutton"></div>
          <span class="xbsj-item-name">{{lang.car}}</span>
        </div>
        <!-- 模型更多 -->
        <div class="xbsj-item-btnbox ml20" @click="createmodelbtn">
          <div class="xbsj-item-btn modelbutton"></div>
          <span class="xbsj-item-name">{{lang.createmodel}}</span>
        </div>
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>-->
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.animation}}</span>
        <div class="xbsj-item-btnbox ml20" @click="scanLineBtn">
          <div class="xbsj-item-btn radarbutton"></div>
          <span class="xbsj-item-name">{{lang.Scanline}}</span>
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
    </div>
    <PlottingMore ref="plottingMore"></PlottingMore>
  </div>
</template>

<script>
import languagejs from "./index_locale";
import PlottingMore from "./PlottingMore/index";
export default {
  components: {
    PlottingMore
  },
  data() {
    return {
      selectlist: false,
      lang: {},
      langs: languagejs,
      PlottingShow: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 多边形
    Polygon() {
      var Polygon = new XE.Obj.Plots.GeoPolygon(this.$root.$earth);
      console.log(Polygon);
      Polygon.creating = true;
      Polygon.isCreating = true;
      Polygon.name = "多边形";
      this.$root.$earthUI.showPropertyWindow(Polygon);
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
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建汽车模型
    createCar() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "./assets/gongjiao.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "汽车";
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建飞机模型
    createPlane() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "./assets/feiji.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "飞机";
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开模型属性窗口
    createmodelbtn() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.name = "模型";
      Model.isCreating = true;
      Model.creating = true;
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开path属性窗口
    pathbtn() {
      var Path = new XE.Obj.Path(this.$root.$earth);
      Path.name = "路径";
      Path.positionPicking = true;
      Path.isCreating = true;
      Path.creating = true;
      this.$root.$earthUI.showPropertyWindow(Path);
    },
    // 打开pin属性窗口
    pinbtn() {
      var Pin = new XE.Obj.Pin(this.$root.$earth);
      Pin.ctrtype = "PinTool";
      Pin.name = "内置图标";
      Pin.positionPicking = true;
      Pin.isCreating = true;
      Pin.creating = true;
      // console.log(Pin);
      this.$root.$earthUI.showPropertyWindow(Pin);
    },
    pindivbtn() {
      var PinDivTool = new XE.Obj.Plots.GeoPin(this.$root.$earth);
      PinDivTool.ctrtype = "PinDivTool";
      PinDivTool.name = "div图标";
      PinDivTool.isCreating = true;
      PinDivTool.creating = true;
      PinDivTool._pin.show = false;
      this.$root.$earthUI.showPropertyWindow(PinDivTool);
    },
    pinpicturebtn() {
      var PinPictureTool = new XE.Obj.Pin(this.$root.$earth);
      PinPictureTool.ctrtype = "PinPictureTool";
      PinPictureTool.name = "外置图标";
      PinPictureTool.positionPicking = true;
      PinPictureTool.isCreating = true;
      PinPictureTool.creating = true;
      this.$root.$earthUI.showPropertyWindow(PinPictureTool);
    },
    // 打开polyLine折线
    polylinebtn() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      Polyline.name = "折线";
      Polyline.positionPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
    },
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

<style>
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
</style>

