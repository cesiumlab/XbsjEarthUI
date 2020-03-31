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
          <div class="xbsj-item-btn disGroudbutton"></div>
          <span class="xbsj-item-name">{{lang.disGroud}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="areaGroudMeasure()">
          <div
            class="xbsj-item-btn areaGroudbutton"
            :class="measurementType === 'SPACE_AREA_GROUD' ? 'areaGroudbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.areaGroud}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="angleMeasure()">
          <div
            class="xbsj-item-btn anglebutton"
            :class="measurementType === 'SPACE_ANGLE' ? 'anglebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.angle}}</span>
        </div>

        <!-- 通视 -->
        <div class="xbsj-item-btnbox" @click="startIntervisible()">
          <div
            class="xbsj-item-btn anglebutton"
            :class="measurementType === 'SPACE_Intervisible' ? 'intervisiblebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.intervisible}}</span>
        </div>

        <!-- 圆形通视 -->
        <div class="xbsj-item-btnbox" @click="circleIntervisible()">
          <div
            class="xbsj-item-btn anglebutton"
            :class="measurementType === 'SPACE_Circle_Intervisible' ? 'circleIntervisiblebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.circleIntervisible}}</span>
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
import { getPickRay } from "../../../utils/measure"
export default {
  data () {
    return {
      lang: {},
      measurementType: "NONE",
      cutFillComputingShow: false,
      profileAnalysisShow: false,
      langs: languagejs,
      enabled: false,
      modelexpansion_over: false,
      measuring: false,
      areaGroud: 0,
      areaGroudinterval: 0,
      temAreaGroudinterval: 0
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
      this._creating = [];
    });
  },
  beforeDestroy () {
    this._disposers.forEach(d => d());
  },
  watch: {
    measuring (v) {
      if (v == false) {
        if (this.measurementType === "SPACE_Circle_Intervisible") {
          this._circle.positions[0][2] += 0.5;
          for (var i = 0; i < this._circle._polygonPositions.length; i += 3) {
            var pos = this._circle._polygonPositions[i];
            if (pos[2] === this._circle.positions[1][2]) {
              pos[2] = this._circle.positions[0][2];
            }
            var p = getPickRay(this._circle.positions[0], pos, this.$root.$earth);
            if (p) {
              var mid = [p.longitude, p.latitude, p.height];
              var line1 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line1.ground = false;
              line1.width = 2;
              var line2 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line2.ground = false;
              line2.width = 2;

              line1.positions = [[...this._circle.positions[0]], mid];
              line2.positions = [mid, [...pos]];
              line2.color = [1, 0, 0, 1];
              this._temGeometry.push(line1);
              this._temGeometry.push(line2);

            } else {
              var line1 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line1.ground = false;
              line1.width = 2;

              line1.positions = [[...this._circle.positions[0]], [...pos]];
              this._temGeometry.push(line1);
            }
            this._circle.creating = false;
            this._circle.destroy();
            this.measurementType = "NONE";
          }
        }
        this.updateCreatingBind();
      }
    },
    measurementType (v) {
      if (this._areaGroud && this.measurementType !== "SPACE_AREA_GROUD") {
        this._areaGroud.creating = false;
      }
    }
  },
  methods: {
    circleIntervisible () {
      if (this.measurementType !== "SPACE_Circle_Intervisible") {
        this._circle = new XE.Obj.Plots.GeoCircle(this.$root.$earth);
        this._circle.isCreating = true;
        this._circle.creating = true;
        this._circle.ground = false;
        this.updateCreatingBind();
        let self = this;
        this._creating.push(XE.MVVM.bind(
          this,
          "measuring",
          this._circle,
          "creating"
        ));

        this.measurementType = "SPACE_Circle_Intervisible";
      }
    },
    startIntervisible () {
      if (this.measurementType !== "SPACE_Intervisible") {
        this.updateCreatingBind();
        this._intervisible = new XE.Obj.Polyline(this.$root.$earth);
        this._intervisible.isCreating = true;
        this._intervisible.creating = true;
        this._intervisible.ground = false;
        let self = this;
        this._creating.push(XE.MVVM.watch(() => ({
          positions: [...this._intervisible.positions],
        }), () => {
          if (self._intervisible.positions.length > 2) {
            this._intervisible.positions[0][2] += 0.5;
            var p = getPickRay(self._intervisible.positions[0], self._intervisible.positions[1], this.$root.$earth);
            if (p) {
              var mid = [p.longitude, p.latitude, p.height];
              var line1 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line1.ground = false;
              var line2 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line2.ground = false;
              line1.positions = [[...self._intervisible.positions[0]], mid];
              line2.positions = [mid, [...self._intervisible.positions[1]]];
              line2.color = [1, 0, 0, 1];
              self._temGeometry.push(line1);
              self._temGeometry.push(line2);

            } else {
              var line1 = new XE.Obj.Plots.GeoPolyline(this.$root.$earth);
              line1.ground = false;
              line1.positions = [[...self._intervisible.positions[0]], [...self._intervisible.positions[1]]];
              self._temGeometry.push(line1);
            }
            self._intervisible.creating = false;
            self._intervisible.destroy();
            self.measurementType = "NONE";
          }
        }));

        this._temGeometry.push(this._intervisible);
        this.measurementType = "SPACE_Intervisible";
      }
    },
    angleMeasure () {
      if (this.measurementType !== "SPACE_ANGLE") {
        this.updateCreatingBind();
        this._angle = new XE.Obj.Polyline(this.$root.$earth);
        this._angle.ground = false;
        this._angle.isCreating = true;
        this._angle.creating = true;

        this._creating.push(XE.MVVM.bind(
          this,
          "measuring",
          this._angle,
          "creating"
        ));
        let self = this;
        this._creating.push(XE.MVVM.watch(() => ({
          positions: [...this._angle.positions],
        }), () => {
          if (self._angle.positions.length == 2) {
            var result = XE.Tool.Math.hpr(self._angle.positions[0], self._angle.positions[1]);
            if (result) {
              self._labels.forEach(l => l.destroy());
              self._labels = [];
              var lb = self.createLabel({
                pos: self._angle.positions[1],
                dis: Math.round(((result[0] * 180 / Math.PI) + 90) % 360 * 100) / 100 + "度"
              });
              self._labels.push(lb);
            }
          } else if (self._angle.positions.length > 2) {
            this._angle.creating = false;
          }
        }));

        this._temGeometry.push(this._angle);
        this.measurementType = "SPACE_ANGLE";
      }
    },
    areaGroudMeasure () {
      this.areaGroudinterval = 0;
      this.temAreaGroudInterval = 0;
      if (this.measurementType !== "SPACE_AREA_GROUD") {
        this._areaGroud = new XE.Obj.CustomPrimitiveExt.Image(this.$root.$earth);
        this._areaGroud.isCreating = true;
        this._areaGroud.creating = true;
        this._areaGroud.imageUrl = null;
        this._areaGroud.offsetHeight = 5;
        this._areaGroud._customPrimitive.translucent = true;
        this.updateCreatingBind();
        this._creating.push(XE.MVVM.bind(
          this,
          "measuring",
          this._areaGroud,
          "creating"
        ));
        let self = this;
        this._creating.push(XE.MVVM.watch(() => ({
          positions: [...this._areaGroud.positions],
        }), () => {
          if (self._areaGroud.positions.length > 2) {
            self.areaGroud = self._areaGroud.totalArea;
            if (isNaN(self.areaGroud)) {
              self.areaGroud = 0;
            }
            if (self.areaGroudinterval === 0 && self.areaGroud > 1) {
              self._areaGroud.interpolation = true;
              self.temAreaGroudInterval = Math.sqrt(self.areaGroud) / 5;
              self._areaGroud.interpolationDistance = self.temAreaGroudInterval;
            }

            self._labels.forEach(l => l.destroy());
            self._labels = [];
            var lb = self.createLabel({
              pos: self._areaGroud.positions[0],
              dis: Math.round(self.areaGroud * 100) / 100 + "平方米"
            });
            self._labels.push(lb);
          }

        }));

        this._temGeometry.push(this._areaGroud);
        this.measurementType = "SPACE_AREA_GROUD";
      }
    },
    disGroudMeasure () {
      this.measurementType = "SPACE_DIS_GROUD"
      this.$root.$earthUI.showPropertyWindow({}, {
        component: "ProfileAnalysis"
      });
    },
    updateCreatingBind () {
      this._creating.forEach(d => d());
      this._creating = [];
      let self = this;
      if (this._labels.length > 0) {
        this._labels.forEach(l => {
          self._temGeometry.push(l);
        })
        this._labels = [];
        this.measurementType = "NONE";
      }
      if (this.areaGroudInterval == 0) {
        this.areaGroudInterval = this.temAreaGroudInterval;
      }
    },
    createLabel (option) {
      let p = new XE.Obj.Pin(this.$root.$earth);
      p.pinBuilder.extTextFont = "36px 楷体";
      p.pinBuilder.outlineColor = [0, 0, 0];
      p.position = option.pos;
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
      this.$root.$earth.analyzation.cutFillComputing.positions = [];
      this.cutFillComputingShow = false;
      if (this._temGeometry) {
        this._temGeometry.forEach(e => {
          e.destroy();
        });
      }
      this.measurementType = "NONE";
      this.$root.$earth.analyzation.cutFillComputingOld.clearResults();
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

