<template>
  <div class="xbsj-template">
    <div
      class="xbsj-list"
      ref="container"
      @mousedown="startMove($event)"
      @mousemove="onMoving($event)"
      @mouseup="endMove($event)"
    >
      <div class="xbsj-list-item">
        <!-- 视域分析 -->
        <span class="xbsj-list-name">{{lang.visualization}}</span>

        <!-- 通视分析 -->
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn visibilitybutton"></div>
          <span class="xbsj-item-name">{{lang.visibility}}</span>
        </div>-->
        <!-- 模型压平 -->
        <div class="xbsj-item-btnbox" @click="startFlattenning" title="创建压平面">
          <div class="xbsj-item-btn flattenbutton"></div>
          <span class="xbsj-item-name">{{lang.flatten}}</span>
        </div>
        <!-- 水淹分析 -->
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn floodingbutton"></div>
          <span class="xbsj-item-name">{{lang.flooding}}</span>
        </div>-->
        <!-- 视频融合 -->
        <div class="xbsj-item-btnbox" @click="startCameraVideo" title="以当前相机姿态创建新的视频融合">
          <div class="xbsj-item-btn videofusionbutton"></div>
          <span class="xbsj-item-name">{{lang.videofusion}}</span>
        </div>
        <!-- 剖切 -->
        <div class="xbsj-item-btnbox" @click="startClipping" title="创建剖切面">
          <div class="xbsj-item-btn sectioningbutton"></div>
          <span class="xbsj-item-name">{{lang.sectioning}}</span>
        </div>
        <!-- 挖坑 -->
        <!-- <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn potholingbutton"></div>
          <span class="xbsj-item-name">{{lang.potholing}}</span>
        </div>-->
        <!-- 可视域 -->
        <div class="xbsj-item-btnbox ml20" @click="startViewshed" title="以当前相机姿态创建新的视域分析">
          <div class="xbsj-item-btn visualbutton"></div>
          <span class="xbsj-item-name">{{lang.visual}}</span>
        </div>
        <!-- 水面 -->
        <div class="xbsj-item-btnbox" @click="startWater" title="创建水面">
          <div class="xbsj-item-btn waterbutton"></div>
          <span class="xbsj-item-name">{{lang.water}}</span>
        </div>
        <!-- 模型展开 -->
        <div
          class="xbsj-item-btnbox"
          title="模型展开"
          @drop="modelexpansion_drop($event)"
          @dragover="modelexpansion_dragover($event)"
          @dragleave="modelexpansion_dragleave($event)"
        >
          <div class="xbsj-item-btn">
            <button
              class="stylebutton"
              :disabled="!enabled"
              :class="{highlight:modelexpansion_over}"
              @click="expansionEditor()"
            ></button>
          </div>
          <span class="xbsj-item-name">{{lang.expansion}}</span>
        </div>
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.measure}}</span>

        <div class="xbsj-item-btnbox ml20" @click="measurementType='POINT'">
          <div
            class="xbsj-item-btn pointbutton"
            :class="measurementType === 'POINT' ? 'pointbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.point}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="measurementType='SPACE_DISTANCE'">
          <div
            class="xbsj-item-btn distancebutton"
            :class="measurementType === 'SPACE_DISTANCE' ? 'distancebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.distance}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="measurementType='TRIANGLE_DISTANCE'">
          <div
            class="xbsj-item-btn heightbutton"
            :class="measurementType === 'TRIANGLE_DISTANCE' ? 'heightbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.height}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="measurementType='SPACE_AREA'">
          <div
            class="xbsj-item-btn areabutton"
            :class="measurementType === 'SPACE_AREA' ? 'areabuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.area}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="disGroudMeasure()">
          <div
            class="xbsj-item-btn disGroudbutton"
            :class="measurementType === 'SPACE_DIS_GROUD' ? 'disGroudbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.disGroud}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="areaGroudMeasure()">
          <div
            class="xbsj-item-btn areabutton"
            :class="measurementType === 'SPACE_AREA_GROUD' ? 'areaGroudbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.areaGroud}}</span>
        </div>
        <!-- <div class="xbsj-item-btnbox" @click="cutFillEnabled=!cutFillEnabled"> -->
        <div class="xbsj-item-btnbox" @click="cutFillComputingShow=!cutFillComputingShow">
          <div class="xbsj-item-btn volumebutton" :class="{highlight:cutFillComputingShow}"></div>
          <span class="xbsj-item-name">{{lang.volume}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="clearResults">
          <div class="xbsj-item-btn resetbutton"></div>
          <span class="xbsj-item-name">{{lang.reset}}</span>
        </div>
        <!-- <div class="xbsj-item-btnbox" @click="showgeology">
          <div class="xbsj-item-btn resetbutton"></div>
          <span class="xbsj-item-name">地质</span>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";
import { getDisAndLabelPos } from './measure';
export default {
  data () {
    return {
      lang: {},
      measurementType: "NONE",
      cutFillComputingShow: false,
      langs: languagejs,
      enabled: false,
      modelexpansion_over: false,
      measuring: false,
      interval: 0,
      temInterval: 0
    };
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this._disposers = this._disposers || [];
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "measurementType",
          this.$root.$earth.analyzation,
          "measurement.type"
        )
      );
      this._unBinds = [];
      this._unBinds.push(
        XE.MVVM.watch(() => {
          const csn = this.$root.$earth.sceneTree.currentSelectedNode;
          if (csn && csn.czmObject && csn.czmObject instanceof XE.Obj.Tileset) {
            this.setTileset(csn.czmObject);
          } else {
            this.setTileset(undefined);
          }
        })
      );
      this._labels = [];
      this._temGeometry = [];
    });
  },
  beforeDestroy () {
    this._disposers.forEach(d => d());
  },
  watch: {
    measuring (v) {
      if (v == false) {
        this._creating.forEach(d => d());
        let self = this;
        this._labels.forEach(l => {
          self._temGeometry.push(l);
        })
        this._labels = [];
        this.measurementType = "NONE";
        if (this.interval == 0) {
          this.interval = this.temInterval;
        }
      }
    },
    measurementType (v) {
      if (this._disGroud && this.measurementType !== "SPACE_DIS_GROUD") {
        this._disGroud.creating = false;
      }
      if (this._areaGroud && this.measurementType !== "SPACE_AREA_GROUD") {
        this._areaGroud.creating = false;
      }
    }
  },
  methods: {
    areaGroudMeasure () {
      if (this.measurementType !== "SPACE_AREA_GROUD") {
        this._areaGroud = new XE.Obj.CustomPrimitiveExt.Image(this.$root.$earth);
        this._areaGroud.isCreating = true;
        this._areaGroud.creating = true;
        this._areaGroud.imageUrl = null;

        this._creating = [];
        this._creating.push(XE.MVVM.bind(
          this,
          "measuring",
          this._areaGroud,
          "creating"
        ));
        this._creating.push(XE.MVVM.watch(() => ({
          positions: [...this._areaGroud.positions],
        }), () => {
          this.updateMeasure(this._areaGroud.positions);
        }));

        this._temGeometry.push(this._areaGroud);
        this.measurementType = "SPACE_AREA_GROUD";
      }
    },
    disGroudMeasure () {
      this.interval = 0;
      this.temInterval = 0;
      if (this.measurementType !== "SPACE_DIS_GROUD") {
        this._disGroud = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
        this._disGroud.creating = true;
        this._creating = [];
        this._creating.push(XE.MVVM.bind(
          this,
          "measuring",
          this._disGroud,
          "creating"
        ));
        this._creating.push(XE.MVVM.watch(() => ({
          positions: [...this._disGroud.positions],
        }), () => {
          this.updateMeasure(this._disGroud.positions);
        }));

        this._temGeometry.push(this._disGroud);
        this.measurementType = "SPACE_DIS_GROUD";
      }
    },
    updateMeasure (p) {
      if (p.length > 1) {
        var it = this.interval;
        var result = getDisAndLabelPos(p, it, this.$root.$earth);
        if (!result) {
          return;
        }
        this.temInterval = result.interval;
        var labels = result.label;
        this._labels.forEach(l => l.destroy());
        this._labels = [];
        labels.forEach(l => {
          var lb = this.createLabel(l);
          this._labels.push(lb);
        });
      }
    },
    createLabel (option) {
      let p = new XE.Obj.Pin(this.$root.$earth);
      p.position = option.pos;
      p.pinBuilder.extText = option.dis;
      p.scale = 0.0001;
      return p;
    },
    setTileset (tileset) {
      if (this._tileset !== tileset) {
        this._tileset = tileset;
      }

      this.enabled = !!this._tileset;
    },
    startCameraVideo () {
      var demoVideo =
        XE.HTML.getScriptBaseUrl("XbsjEarthUI") + "/assets/demo.mp4";
      // 视频融合
      var cameraVideo = new XE.Obj.CameraVideo(this.$root.$earth);
      cameraVideo.setPositionWithCurrentCamera();
      cameraVideo.videoUrl = demoVideo;
      cameraVideo.far = 50;
      cameraVideo.name = "未命名视频融合";
      cameraVideo.isCreating = true;

      this.$root.$earthUI.showPropertyWindow(cameraVideo);
    },
    startViewshed () {
      var viewshed = new XE.Obj.Viewshed(this.$root.$earth);
      viewshed.setPositionWithCurrentCamera();
      viewshed.far = 50;
      viewshed.name = "未命名视域分析";
      viewshed.isCreating = true;

      this.$root.$earthUI.showPropertyWindow(viewshed);
    },
    startFlattenning () {
      var flattenedPolygons = new XE.Obj.FlattenedPolygonCollection(
        this.$root.$earth
      );
      flattenedPolygons.name = "未命名压平组";
      flattenedPolygons.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(flattenedPolygons);
    },
    startClipping () {
      var clippingPlane = new XE.Obj.ClippingPlane(this.$root.$earth);
      clippingPlane.name = "未命名剖切面";
      clippingPlane.positionPicking = true;
      clippingPlane.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(clippingPlane);
    },
    startWater () {
      var water = new XE.Obj.Water(this.$root.$earth);
      water.name = "未命名水面";
      water.isCreating = true;
      water.positionPicking = true;
      water.creating = true;
      this.$root.$earthUI.showPropertyWindow(water);
    },
    expansionEditor () {
      //显示模型编辑器
      this.$root.$earthUI.showPropertyWindow(this._tileset, {
        component: "TilesetExpansionEditor"
      });
    },
    modelexpansion_dragover (e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj instanceof XE.Obj.Tileset) {
        e.dataTransfer.dropEffect = "copy";
        this.modelexpansion_over = true;
        this.enabled = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    modelexpansion_dragleave () {
      this.modelexpansion_over = false;
      const csn3 = this.$root.$earth.sceneTree.currentSelectedNode;
      if (csn3 && csn3.czmObject && csn3.czmObject instanceof XE.Obj.Tileset) {
        this.enabled = true;
      } else {
        this.enabled = false;
      }
    },
    modelexpansion_drop (e) {
      this.modelexpansion_over = false;
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (czmObj && czmObj instanceof XE.Obj.Tileset) {
        //显示面板
        this.$root.$earthUI.showPropertyWindow(czmObj, {
          component: "TilesetExpansionEditor"
        });
        this._czmObj = czmObj;
        const csn2 = this.$root.$earth.sceneTree.currentSelectedNode;
        if (
          csn2 &&
          csn2.czmObject &&
          csn2.czmObject instanceof XE.Obj.Tileset
        ) {
          this.enabled = true;
        } else {
          this.enabled = false;
        }
      }
    },
    clearResults () {
      this.$root.$earth.analyzation.measurement.clearResults();
      this.$root.$earth.analyzation.cutFillComputing.clearResults();
      if (this._temGeometry) {
        this._temGeometry.forEach(e => {
          e.destroy();
        });
      }
    },
    startMove (event) {
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
    onMoving (event) {
      //获取鼠标和为开始位置的插值，滚动滚动条
      if (!this.moving) return;

      var dom = this.$refs.container;
      var wleft = dom.scrollLeft - event.movementX;
      if (wleft >= 0 && wleft <= dom.scrollWidth - dom.clientWidth) {
        dom.scrollLeft = wleft;
      }
    },
    endMove (envent) {
      this.moving = false;
    }
  }
};
</script>

<style>
.visualbutton {
  background: url(../../../../images/visual.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.visualbutton:hover {
  background: url(../../../../images/visual_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.visibilitybutton {
  background: url(../../../../images/visibility.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.visibilitybutton:hover {
  background: url(../../../../images/visibility_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.visualbuttonActive {
  background: url(../../../../images/visual_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.flattenbutton {
  background: url(../../../../images/flatten.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.flattenbutton:hover {
  background: url(../../../../images/flatten_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.floodingbutton {
  background: url(../../../../images/flooding.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.floodingbutton:hover {
  background: url(../../../../images/flooding_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.videofusionbutton {
  background: url(../../../../images/videofusion.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.videofusionbutton:hover {
  background: url(../../../../images/videofusion_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.sectioningbutton {
  background: url(../../../../images/sectioning.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.sectioningbutton:hover {
  background: url(../../../../images/sectioning_on.png) no-repeat;
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
.potholingbutton {
  background: url(../../../../images/potholing.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.potholingbutton:hover {
  background: url(../../../../images/potholing_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pointbutton {
  background: url(../../../../images/point.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pointbutton:hover {
  background: url(../../../../images/point_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pointbuttonActive {
  background: url(../../../../images/point_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.distancebutton {
  background: url(../../../../images/distance.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.distancebutton:hover {
  background: url(../../../../images/distance_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.distancebuttonActive {
  background: url(../../../../images/distance_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.heightbutton {
  background: url(../../../../images/height.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.heightbutton:hover {
  background: url(../../../../images/height_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.heightbuttonActive {
  background: url(../../../../images/height_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areabutton {
  background: url(../../../../images/area.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areabutton:hover {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areabuttonActive {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.disGroudbutton {
  background: url(../../../../images/area.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.disGroudbutton:hover {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.disGroudbuttonActive {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areaGroudbutton {
  background: url(../../../../images/area.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areaGroudbutton:hover {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.areaGroudbuttonActive {
  background: url(../../../../images/area_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.volumebutton {
  background: url(../../../../images/volume.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.volumebutton.highlight,
.volumebutton:hover {
  background: url(../../../../images/volume_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.volumebuttonActive {
  background: url(../../../../images/volume_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.resetbutton {
  background: url(../../../../images/reset.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.resetbutton:hover {
  background: url(../../../../images/reset_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.stylebutton {
  background: url(../../../../images/style.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.stylebutton.highlight,
.stylebutton:hover {
  background: url(../../../../images/style_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.stylebutton:disabled {
  background: url(../../../../images/style_disabled.png) no-repeat;
  background-size: contain;
  cursor: not-allowed;
}
.stylebutton {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
</style>

