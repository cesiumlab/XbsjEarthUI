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
        <!-- Pin -->
        <div class="xbsj-item-btnbox ml20" @click="pinbtn" title="创建Pin">
          <div class="xbsj-item-btn pinbutton"></div>
          <span class="xbsj-item-name">{{lang.pin}}</span>
        </div>
        <!-- 路径 -->
        <div class="xbsj-item-btnbox" @click="pathbtn" title="路径">
          <div class="xbsj-item-btn pathbutton"></div>
          <span class="xbsj-item-name">{{lang.path}}</span>
        </div>
        <!-- 折线 -->
        <div class="xbsj-item-btnbox" @click="polylinebtn" title="折线">
          <div class="xbsj-item-btn linebutton"></div>
          <span class="xbsj-item-name">{{lang.line}}</span>
        </div>

        <!-- 模型 -->
        <div class="xbsj-item-btnbox" @click="createmodelbtn">
          <div class="xbsj-item-btn modelbutton"></div>
          <span class="xbsj-item-name">{{lang.createmodel}}</span>
        </div>

        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn spotbutton"></div>
          <span class="xbsj-item-name">{{lang.spot}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn facebutton"></div>
          <span class="xbsj-item-name">{{lang.face}}</span>
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
        </div>
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.model}}</span>
        <div class="xbsj-item-btnbox ml20" @click="createPlane">
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
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn more"></div>
          <span class="xbsj-item-name">{{lang.more}}</span>
        </div>
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.senior}}</span>
        <div class="xbsj-item-btnbox ml20">
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
        </div>
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
    // 打开常规更多弹窗
    routineMore() {
      // console.log(this.$refs);
      this.$refs.plottingMore.show = !this.$refs.plottingMore.show;
    },
    //创建树模型
    createTree() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "../../../../../Apps/assets/shu.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "树";
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建汽车模型
    createCar() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "../../../../../Apps/assets/gongjiao.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "汽车";
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 创建飞机模型
    createPlane() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.url = "../../../../../Apps/assets/feiji.glb";
      Model.creating = true;
      Model.isCreating = true;
      Model.name = "飞机";
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开模型属性窗口
    createmodelbtn() {
      var Model = new XE.Obj.Model(this.$root.$earth);
      Model.name = "Model属性窗口";
      Model.isCreating = true;
      Model.creating = true;
      this.$root.$earthUI.showPropertyWindow(Model);
    },
    // 打开path属性窗口
    pathbtn() {
      var Path = new XE.Obj.Path(this.$root.$earth);
      Path.name = "Path路径属性窗口";
      Path.positionPicking = true;
      Path.isCreating = true;
      Path.creating = true;
      this.$root.$earthUI.showPropertyWindow(Path);
    },
    // 打开pin属性窗口
    pinbtn() {
      var Pin = new XE.Obj.Pin(this.$root.$earth);
      Pin.name = "Pin 属性窗口";
      Pin.positionPicking = true;
      Pin.isCreating = true;
      Pin.creating = true;
      this.$root.$earthUI.showPropertyWindow(Pin);
    },
    // 打开polyLine折线
    polylinebtn() {
      var Polyline = new XE.Obj.Polyline(this.$root.$earth);
      console.log(Polyline);
      Polyline.name = "polyLine折线属性窗口";
      Polyline.positionPicking = true;
      Polyline.isCreating = true;
      Polyline.creating = true;
      this.$root.$earthUI.showPropertyWindow(Polyline);
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

