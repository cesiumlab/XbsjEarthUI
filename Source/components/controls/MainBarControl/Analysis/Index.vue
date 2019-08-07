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

        <div class="xbsj-item-btnbox ml20" @click="startViewshed" title="以当前相机姿态创建新的视域分析">
          <div class="xbsj-item-btn visualbutton"></div>
          <span class="xbsj-item-name">{{lang.visual}}</span>
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
export default {
  data() {
    return {
      lang: {},
      measurementType: "NONE",
      cutFillComputingShow: false,
      langs: languagejs
    };
  },
  created() {
    
  },
  mounted() {
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
    });
  },
  beforeDestroy() {
    this._disposers.forEach(d => d());
  },
  methods: {
    
    startCameraVideo() {
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
    startViewshed() {
      var viewshed = new XE.Obj.Viewshed(this.$root.$earth);
      viewshed.setPositionWithCurrentCamera();
      viewshed.far = 50;
      viewshed.name = "未命名视域分析";
      viewshed.isCreating = true;

      this.$root.$earthUI.showPropertyWindow(viewshed);
    },
    startFlattenning() {
      var flattenedPolygons = new XE.Obj.FlattenedPolygonCollection(
        this.$root.$earth
      );
      flattenedPolygons.name = "未命名压平组";
      flattenedPolygons.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(flattenedPolygons);
    },
    startClipping() {
      var clippingPlane = new XE.Obj.ClippingPlane(this.$root.$earth);
      clippingPlane.name = "未命名剖切面";
      clippingPlane.positionPicking = true;
      clippingPlane.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(clippingPlane);
    },
    clearResults() {
      this.$root.$earth.analyzation.measurement.clearResults();
      this.$root.$earth.analyzation.cutFillComputing.clearResults(); 
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
</style>

