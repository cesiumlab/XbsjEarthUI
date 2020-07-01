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
      <div class="xbsj-list-item" v-show="labServiceUI">
        <span class="xbsj-list-name">{{lang.scene}}</span>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn savebutton" @click="saveScene"></div>
          <span class="xbsj-item-name">{{lang.save}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'sceneView'}"
          @click.stop="togglePopup('sceneView',$event)"
        ></span>
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.view}}</span>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn globalbutton" @click="flyToGlobe"></div>
          <span class="xbsj-item-name">{{lang.global}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'globeView'}"
          @click.stop="togglePopup('globeView',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn chinabutton" @click="flyToChina"></div>
          <span class="xbsj-item-name">{{lang.china}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'chinaView'}"
          @click.stop="togglePopup('chinaView',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn custombutton" @click="flyToCustom"></div>
          <span class="xbsj-item-name">{{lang.custom}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:cameraViewManagerShow}"
          @click.stop="toggleCameraViewManager()"
        ></span>
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.location}}</span>
        <input type="text" class="xbsj-search-box" @keyup.enter="search" v-model="key" />
        <div class="xbsj-search"></div>
        <div v-show="searchItem!==undefined">
          <button type="button" class="xbsj-clear" @click="clear"></button>
        </div>
      </div>
      <!-- <div class="xbsj-list-item">
        <div class="xbsj-earth">
          <div class="xbsj-jingdu">
            <label class="xbsj-label">{{lang.jingdu}}</label>
            <input class="xbsj-input">
          </div>
          <div class="xbsj-weidu">
            <label class="xbsj-label">{{lang.weidu}}</label>
            <input class="xbsj-input">
          </div>
        </div>
        <div class="xbsj-item-btnbox ml20">
          <div class="xbsj-item-btn locationbutton"></div>
          <span class="xbsj-item-name">{{lang.location}}</span>
        </div>
      </div>-->
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.autofly}}</span>
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn globalrotationbutton"
            :class="{highlight: cameraMode=='rotateGlobe'}"
            @click="toggleCameraFlight('rotateGlobe')"
          ></div>
          <span class="xbsj-item-name">{{lang.globalrotation}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'rotateGlobe'}"
          @click.stop="togglePopup('rotateGlobe',$event)"
        ></span>
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn centerrotationbutton"
            :class="{highlight: cameraMode=='rotateCenter'}"
            @click="toggleCameraFlight('rotateCenter')"
          ></div>
          <span class="xbsj-item-name">{{lang.centerrotation}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'rotateCenter'}"
          @click.stop="togglePopup('rotateCenter',$event)"
        ></span>
        <!-- 绑定相机 -->
        <div class="xbsj-item-btnbox" ref="cameraAttach" @click="cameraattachbtn">
          <div
            class="xbsj-item-btn cameraattachbutton"
            :class=" {  cameraattachbuttonActive : cameraAttached || cameraAttachOver }"
          ></div>
          <span class="xbsj-item-name">{{lang.cameraattach}}</span>
        </div>
        <!--
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn trackbutton"
            :class="{highlight: cameraMode=='track'}"
            @click="toggleCameraFlight('track')"
          ></div>
          <span class="xbsj-item-name">{{lang.track}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'track'}"
          @click.stop="togglePopup('track',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn pathflightbutton"
            :class="{highlight: cameraMode=='pathFly'}"
            @click="toggleCameraFlight('pathFly')"
          ></div>
          <span class="xbsj-item-name">{{lang.pathflight}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'pathFly'}"
          @click.stop="togglePopup('pathFly',$event)"
        ></span>
        -->
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.interactivemode}}</span>
        <div class="xbsj-item-btnbox" @click="useCesiumNavigator = true">
          <div
            class="xbsj-item-btn defaultbutton"
            :class=" { defaultbuttonActive : useCesiumNavigator }"
          ></div>
          <span class="xbsj-item-name">{{lang.default}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="useCesiumNavigator = false">
          <div
            class="xbsj-item-btn gooleearthbutton"
            :class=" { gooleearthbuttonActive : !useCesiumNavigator }"
          ></div>
          <span class="xbsj-item-name">{{lang.gooleearth}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="ghostMode = !ghostMode">
          <div
            class="xbsj-item-btn firstpersonbutton"
            :class="{ firstpersonbuttonActive: ghostMode }"
          ></div>
          <span class="xbsj-item-name">{{lang.firstperson}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'firstPerson'}"
          @click.stop="togglePopup('firstPerson',$event)"
        ></span>
        <div class="xbsj-item-btnbox" @click="picking = !picking">
          <div class="xbsj-item-btn mousebutton" :class="{ mousebuttonActive: picking }"></div>
          <span class="xbsj-item-name">{{lang.mouseshiqu}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'pickObject'}"
          @click.stop="togglePopup('pickObject',$event)"
        ></span>
        <!-- vr -->
        <div class="xbsj-item-btnbox" @click="vrClick">
          <div class="xbsj-item-btn vrbutton"></div>
          <span class="xbsj-item-name">VR</span>
        </div>
      </div>
    </div>
    <GlobeViewComp ref="globeView" v-show="popup =='globeView'"></GlobeViewComp>
    <ChinaViewComp ref="chinaView" v-show="popup =='chinaView'"></ChinaViewComp>
    <SearchComp ref="search" v-show="popup =='search'" @itemSelected="searchResult"></SearchComp>
    <RotateGlobeComp ref="rotateGlobe" v-show="popup =='rotateGlobe'"></RotateGlobeComp>
    <RotateCenterComp ref="rotateCenter" v-show="popup =='rotateCenter'"></RotateCenterComp>
    <TrackComp ref="track" v-show="popup =='track'"></TrackComp>
    <PathFlyComp ref="pathFly" v-show="popup =='pathFly'"></PathFlyComp>
    <FirstPersonComp ref="firstPerson" v-show="popup =='firstPerson'"></FirstPersonComp>
    <PickObjectComp ref="pickObject" v-show="popup =='pickObject'"></PickObjectComp>
    <SceneComp ref="sceneView" v-show="popup =='sceneView'"></SceneComp>
  </div>
</template>

<script>
import languagejs from "./index_locale";
import SearchComp from "./Search";
import RotateGlobeComp from "./RotateGlobe";
import RotateCenterComp from "./RotateCenter";
import PathFlyComp from "./PathFly";

import FirstPersonComp from "./FirstPerson";
import PickObjectComp from "./PickObject";
import GlobeViewComp from "./GlobeView";
import ChinaViewComp from "./ChinaView";
import SceneComp from "./Scene";

import TrackComp from "./Track";
import { addOutterEventListener } from "../../../utils/xbsjUtil";
export default {
  props: ["labServiceUI"],
  components: {
    SearchComp,
    RotateGlobeComp,
    RotateCenterComp,
    PathFlyComp,
    FirstPersonComp,
    PickObjectComp,
    GlobeViewComp,
    ChinaViewComp,
    TrackComp,
    SceneComp
  },
  data() {
    return {
      // selectlist: false,
      popup: "",
      loading: true,
      lang: {},
      key: "",
      result: [],
      searchItem: undefined,
      cameraMode: "",
      ghostMode: false,
      picking: false,
      useCesiumNavigator: false,
      cameraViewManagerShow: false,
      moving: false,
      langs: languagejs,
      cameraAttached: false,
      cameraAttachOver: false,
      clicknum: -1
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

    this.$parent.$on("hidePopup", () => {
      this.showPopup(false);
      this.popup = "";
    });

    //响应earth的飞行组件
    XE.MVVM.watch(() => {
      const flying = this.$root.$earth.cameraFlight.flying;
      if (!flying) {
        this.cameraMode = "";
      } else {
        this.cameraMode = flying.mode;
      }
    });

    this.$nextTick(() => {
      if (this._disposers) {
        this._disposers.forEach(d => d());
        this._disposers.length = 0;
      }
      this._disposers = this._disposers || [];

      this._disposers.push(
        XE.MVVM.bind(
          this,
          "ghostMode",
          this.$root.$earth.camera.immersion,
          "ghostMode"
        )
      );

      this._disposers.push(
        XE.MVVM.bind(
          this,
          "useCesiumNavigator",
          this.$root.$earth.camera.interaction,
          "useCesiumNavigator"
        )
      );
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "picking",
          this.$root.$earth.interaction.picking,
          "enabled"
        )
      );

      this._disposers.push(
        XE.MVVM.bind(
          this,
          "cameraAttached",
          this.$root.$earth.camera.tracking,
          "enabled"
        )
      );
    });

    let cameraAttach = this.$refs.cameraAttach;

    var that = this;

    function getCzmObjectFromDrag(dataTransfer) {
      for (let i = 0; i < dataTransfer.types.length; i++) {
        var t = dataTransfer.types[i];
        if (!t) continue;
        if (t.startsWith("_czmobj_")) {
          let guid = t.substring(8);

          return that.$root.$earth.getObject(guid);
        }
      }
      return undefined;
    }
    //拖拽移动上面
    cameraAttach.addEventListener(
      "dragover",
      e => {
        //e.stopPropagation();
        e.preventDefault();
        let czmObj = getCzmObjectFromDrag(e.dataTransfer);
        if (czmObj && czmObj.cameraAttached !== undefined) {
          that.cameraAttachOver = true;
          e.dataTransfer.dropEffect = "link";
        } else {
          e.dataTransfer.dropEffect = "none";
        }
      },
      false
    );

    cameraAttach.addEventListener(
      "dragleave",
      e => {
        that.cameraAttachOver = false;
      },
      false
    );

    //拖拽放置
    cameraAttach.addEventListener(
      "drop",
      e => {
        // e.stopPropagation();
        e.preventDefault();

        let czmObj = getCzmObjectFromDrag(e.dataTransfer);
        if (czmObj && czmObj.cameraAttached !== undefined) {
          czmObj.cameraAttached = true;
        }
        that.cameraAttachOver = false;
      },
      false
    );
  },
  beforeDestroy() {
    if (this._disposers) {
      this._disposers.forEach(d => d());
      this._disposers.length = 0;
    }
  },
  methods: {
    cameraattachbtn() {
      this.cameraAttached = false;
    },
    saveScene() {
      this.$root.$earthUI.labScene.saveScene();
    },
    flyToGlobe() {
      this.$root.$earth.cameraViewManager.globe.flyTo();
    },
    flyToChina() {
      this.$root.$earth.cameraViewManager.china.flyTo();
    },
    flyToCustom() {
      let def = this.$root.$earth.cameraViewManager.defaultView;
      if (def) {
        def.flyTo();
      }
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
    toggleCameraViewManager() {
      this.cameraViewManagerShow = !this.cameraViewManagerShow;
    },
    togglePopup(p, event) {
      //调用上一个组件的隐藏
      this.showPopup(false);

      this.popup = this.popup == p ? "" : p;

      //调用当前组件的显示
      let curComp = this.showPopup(true);

      if (this.popup != "" && event) {
        if (curComp) {
          try {
            //基于现在UI结构强行计算的
            let el = curComp.$el;
            el.style.left =
              event.target.offsetLeft +
              event.target.offsetParent.offsetLeft -
              40 +
              "px";
            el.style.top =
              event.target.offsetTop +
              event.target.offsetParent.offsetTop +
              44 +
              "px";
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    },
    search() {
      this.popup = "search";
      this.$refs.search.query(this.key);
    },
    clear() {
      this.key = "";
      this.searchItem = undefined;
      this.$refs.search.clear();
    },
    searchResult(item) {
      this.key = item.name;
      this.searchItem = item;
    },
    toggleCameraFlight(type) {
      const cf = this.$root.$earth.cameraFlight;
      const fly = cf.flying;

      //先停止当前的
      if (fly) {
        fly.cancel();

        //判定是否要开始，如果类型和当前一致，那么不开启
        if (fly.type == type) return;
      }

      //如果获取为空，那么也不开始
      let newFly = cf[type];
      if (newFly) {
        newFly.start();
      }
    },
    vrClick() {
      this.clicknum++;
      switch (this.clicknum) {
        case 0:
          XE.HTML.loadJS("./assets/js/earthsdk-webxr.js");
          this.$root.$earthUI.promptInfo(this.lang.initvr);
          break;
        case 1:
          this.$root.$earthUI.promptInfo(this.lang.openvr);
          this.$root.$earth.camera.useWebXR = true;
          break;
        case 2:
          this.$root.$earthUI.promptInfo(this.lang.startvr);
          this.$root.$earth.camera.useWebXR = true;
          break;
        default:
          this.$root.$earth.camera.useWebXR = !this.$root.$earth.camera
            .useWebXR;
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
  },
  computed: {}
};
</script>

<style scoped>
.moving {
  cursor: move;
}
.xbsj-search-box {
  width: 260px !important;
  height: 30px;
  background: rgba(71, 71, 71, 1);
  border: 2px solid rgba(138, 138, 138, 1);
  padding-left: 30px !important;
  margin: 30px 10px;
  margin-left: 18px;
  color: white;
}
.xbsj-search-box:focus {
  border: 2px solid rgba(31, 255, 255, 1);
}
.xbsj-search {
  display: block;
  width: 20px;
  height: 19px;
  background: url(../../../../images/location_search.png) no-repeat;
  background-size: 100%;
  position: absolute;
  top: 38px;
  left: 42px;
}
.globalbutton {
  background: url(../../../../images/global.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globalbutton:hover {
  background: url(../../../../images/global_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.chinabutton {
  background: url(../../../../images/china.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.chinabutton:hover {
  background: url(../../../../images/china_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.custombutton {
  background: url(../../../../images/view.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.custombutton:hover {
  background: url(../../../../images/view_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.defaultbutton {
  background: url(../../../../images/default.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.defaultbutton:hover {
  background: url(../../../../images/default_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.defaultbuttonActive {
  background: url(../../../../images/default_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.vrbutton {
  background: url(../../../../images/vr.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.vrbutton:hover {
  background: url(../../../../images/vr_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.vrbuttonActive {
  background: url(../../../../images/vr_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.gooleearthbutton {
  background: url(../../../../images/gooleearth.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.gooleearthbutton:hover {
  background: url(../../../../images/gooleearth_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.gooleearthbuttonActive {
  background: url(../../../../images/gooleearth_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.firstpersonbutton {
  background: url(../../../../images/firstperson.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.firstpersonbutton:hover {
  background: url(../../../../images/firstperson_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.firstpersonbuttonActive {
  background: url(../../../../images/firstperson_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.mousebutton {
  background: url(../../../../images/mouse.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.mousebutton:hover {
  background: url(../../../../images/mouse_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.mousebuttonActive {
  background: url(../../../../images/mouse_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-box {
  width: auto;
  height: 72px;
  position: relative;
  margin: 12px 25px;
  border-right: 2px solid rgba(71, 71, 71, 1);
  padding-right: 66px;
}
.xbsj-label {
  display: inline-block;
  width: 32px;
  height: 12px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(221, 221, 221, 1);
  text-align: center;
}
.xbsj-input {
  display: inline-block;
  background: rgba(71, 71, 71, 1);
  border: 2px solid #8a8a8a;
  padding: 3px 5px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(221, 221, 221, 1);
  width: 80px;
  margin: 3px 0;
}
.xbsj-earth input:focus {
  border: 2px solid rgba(79, 179, 255, 1);
}
.xbsj-location,
.xbsj-earth {
  display: inline-block;
  width: 116px;
}
.xbsj-location {
  width: 27px;
  height: 34px;
  background: rgba(71, 71, 71, 1);
  border-radius: 50%;
  background: url(../../../../images/location_earth.png) no-repeat;
  background-size: 100%;
  position: absolute;
  left: 123px;
  top: 20px;
}
.locationbutton {
  background: url(../../../../images/location_earth.png) no-repeat;
}
.locationbutton:hover {
  background: url(../../../../images/location_earth_on.png) no-repeat;
  background-size: 100%;
}
.xbsj-locationspan {
  width: 50px;
  position: absolute;
  left: 112px;
  top: 54px;
  text-align: center;
}
.globalrotationbutton {
  background: url(../../../../images/globalrotation.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.globalrotationbutton.highlight,
.globalrotationbutton:hover {
  background: url(../../../../images/globalrotation_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.centerrotationbutton {
  background: url(../../../../images/centerrotation.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.centerrotationbutton.highlight,
.centerrotationbutton:hover {
  background: url(../../../../images/centerrotation_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.trackbutton {
  background: url(../../../../images/track.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.trackbutton.highlight,
.trackbutton:hover {
  background: url(../../../../images/track_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pathflightbutton {
  background: url(../../../../images/pathflight.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.pathflightbutton.highlight,
.pathflightbutton:hover {
  background: url(../../../../images/pathflight_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.savebutton {
  background: url(../../../../images/savecj.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.savebutton.highlight,
.savebutton:hover {
  background: url(../../../../images/savecj_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.xbsj-clear {
  border: 0;
  position: absolute;
  top: 42px;
  right: 36px;
  background: url(../../../../images/clear.png) no-repeat;
  width: 25px;
  height: 25px;
  background-size: 13px 13px;
  cursor: pointer;
}
.xbsj-clear:focus,
.xbsj-clear:active:focus,
.xbsj-clear.active:focus,
.xbsj-clear.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
}
.cameraattachbutton {
  background: url(../../../../images/cameraattach.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.cameraattachbuttonActive {
  background: url(../../../../images/cameraattach_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
</style>

