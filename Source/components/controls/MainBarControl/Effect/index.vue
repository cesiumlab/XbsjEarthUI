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
        <span class="xbsj-list-name">{{lang.weather}}</span>
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn sunbutton"
            :class="{'sunbutton-on':weather.sun}"
            @click="toggleSun"
          ></div>
          <span class="xbsj-item-name">{{lang.sun}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'sun'}"
          @click.stop="togglePopup('sun',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn moonbutton"
            :class="{'moonbutton-on':weather.moon}"
            @click="toggleMoon"
          ></div>
          <span class="xbsj-item-name">{{lang.moon}}</span>
        </div>
        <!-- 
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'moon'}"
          @click.stop="togglePopup('moon',$event)"
        ></span>
        -->

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn atmospherebutton"
            :class="{'atmospherebutton-on':weather.atmosphere}"
            @click="toggleAtmosphere"
          ></div>
          <span class="xbsj-item-name">{{lang.atmosphere}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'atmosphere'}"
          @click.stop="togglePopup('atmosphere',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn cloudbutton"
            :class="{'cloudbutton-on':weather.cloud}"
            @click="toggleCloud"
          ></div>
          <span class="xbsj-item-name">{{lang.cloud}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'cloud'}"
          @click.stop="togglePopup('cloud',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn rainPostProcessbutton"
            :class="{'rainPostProcessbutton-on':weather.rainPostProcess}"
            @click="weather.rainPostProcess=!weather.rainPostProcess"
          ></div>
          <span class="xbsj-item-name">{{lang.rain}}</span>
        </div>
        <!-- <span
          class="xbsj-select"
          :class="{highlight:popup == 'rainPostProcess'}"
          @click.stop="togglePopup('rainPostProcess',$event)"
        ></span>-->

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn snowPostProcessbutton"
            :class="{'snowPostProcessbutton-on':weather.snowPostProcess}"
            @click="weather.snowPostProcess=!weather.snowPostProcess"
          ></div>
          <span class="xbsj-item-name">{{lang.snow}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'snowPostProcess'}"
          @click.stop="togglePopup('snowPostProcess',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn fogbutton"
            :class="{'fogbutton-on':weather.fog}"
            @click="weather.fog=!weather.fog"
          ></div>
          <span class="xbsj-item-name">{{lang.fog}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'fog'}"
          @click.stop="togglePopup('fog',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn fogpostprocessbutton"
            :class="{'fogpostprocessbutton-on':weather.fogPostProcess}"
            @click="weather.fogPostProcess=!weather.fogPostProcess"
          ></div>
          <span class="xbsj-item-name">{{lang.fogpostprocess}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'fogPostProcess'}"
          @click.stop="togglePopup('fogPostProcess',$event)"
        ></span>

        <!-- 星空显隐 -->
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn starryskybutton"
            :class="{'starryskybutton-on':weather.skyBox}"
            @click="weather.skyBox = !weather.skyBox"
          ></div>
          <span class="xbsj-item-name">{{lang.starrysky}}</span>
        </div>
        <!-- 天空盒 -->
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn skyboxbutton"
            :class="{'skyboxbutton-on':skyBoxOnGround}"
            @click="skyBoxOnGround = !skyBoxOnGround"
          ></div>
          <span class="xbsj-item-name">{{lang.skyBoxOnGround}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'skyBox'}"
          @click.stop="togglePopup('skyBox',$event)"
        ></span>
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.effect}}</span>
        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn shadowbutton"
            :class="{'shadowbutton-on':effect.shadow}"
            @click="effect.shadow=!effect.shadow"
          ></div>
          <span class="xbsj-item-name">{{lang.shadow}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'shadow'}"
          @click.stop="togglePopup('shadow',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn bloombutton"
            :class="{'bloombutton-on':postProcess.bloom}"
            @click="postProcess.bloom=!postProcess.bloom"
          ></div>
          <span class="xbsj-item-name">{{lang.bloom}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'bloom'}"
          @click.stop="togglePopup('bloom',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn ambientocclusionbutton"
            :class="{'ambientocclusionbutton-on':postProcess.ambientOcclusion}"
            @click="postProcess.ambientOcclusion=!postProcess.ambientOcclusion"
          ></div>
          <span class="xbsj-item-name">{{lang.ambientOcclusion}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'ambientOcclusion'}"
          @click.stop="togglePopup('ambientOcclusion',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn depthoffieldbutton"
            :class="{'depthoffieldbutton-on':postProcess.depthOfField}"
            @click="postProcess.depthOfField=!postProcess.depthOfField"
          ></div>
          <span class="xbsj-item-name">{{lang.depthOfField}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'depthOfField'}"
          @click.stop="togglePopup('depthOfField',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn silhouettebutton"
            :class="{'silhouettebutton-on':postProcess.silhouette}"
            @click="postProcess.silhouette=!postProcess.silhouette"
          ></div>
          <span class="xbsj-item-name">{{lang.silhouette}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'silhouette'}"
          @click.stop="togglePopup('silhouette',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn brightnessbutton"
            :class="{'brightnessbutton-on':postProcess.brightness}"
            @click="postProcess.brightness=!postProcess.brightness"
          ></div>
          <span class="xbsj-item-name">{{lang.brightness}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'brightness'}"
          @click.stop="togglePopup('brightness',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn blackandwhitebutton"
            :class="{'blackandwhitebutton-on':postProcess.blackAndWhite}"
            @click="postProcess.blackAndWhite=!postProcess.blackAndWhite"
          ></div>
          <span class="xbsj-item-name">{{lang.blackAndWhite}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'blackAndWhite'}"
          @click.stop="togglePopup('blackAndWhite',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn nightvisionbutton"
            :class="{'nightvisionbutton-on':postProcess.nightVision}"
            @click="postProcess.nightVision=!postProcess.nightVision"
          ></div>
          <span class="xbsj-item-name">{{lang.nightVision}}</span>
        </div>

        <!--
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'nightVision'}"
          @click.stop="togglePopup('nightVision',$event)"
        ></span>
        -->
        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn lensflarebutton"
            :class="{'lensflarebutton-on':postProcess.lensFlare}"
            @click="toggleFlare"
          ></div>
          <span class="xbsj-item-name">{{lang.lensFlare}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'lensFlare'}"
          @click.stop="togglePopup('lensFlare',$event)"
        ></span>

        <div class="xbsj-item-btnbox">
          <div
            class="xbsj-item-btn mosaicbutton"
            :class="{'mosaicbutton-on':postProcess.mosaic}"
            @click="postProcess.mosaic=!postProcess.mosaic"
          ></div>
          <span class="xbsj-item-name">{{lang.mosaic}}</span>
        </div>

        <div class="xbsj-item-btnbox ml20">
          <div
            class="xbsj-item-btn forcesunbutton"
            :class="{'forcesunbutton-on':effect.forceSunPos}"
            @click="effect.forceSunPos=!effect.forceSunPos"
          ></div>
          <span class="xbsj-item-name">{{lang.forceSunPos}}</span>
        </div>
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'forceSunPos'}"
          @click.stop="togglePopup('forceSunPos',$event)"
        ></span>

        <!--
        <span
          class="xbsj-select"
          :class="{highlight:popup == 'mosaic'}"
          @click.stop="togglePopup('mosaic',$event)"
        ></span>
        -->
      </div>
    </div>
    <Sun ref="sun" v-show="popup =='sun'"></Sun>
    <Atmosphere ref="atmosphere" v-show="popup =='atmosphere'"></Atmosphere>
    <Cloud ref="cloud" v-show="popup =='cloud'"></Cloud>
    <Moon ref="moon" v-show="popup =='moon'"></Moon>
    <Rain ref="rainPostProcess" v-show="popup =='rainPostProcess'"></Rain>
    <Snow ref="snowPostProcess" v-show="popup =='snowPostProcess'"></Snow>
    <Fog ref="fog" v-show="popup =='fog'"></Fog>
    <FogPostProcess ref="fogPostProcess" v-show="popup =='fogPostProcess'"></FogPostProcess>
    <SkyBox ref="skyBox" v-show="popup =='skyBox'"></SkyBox>
    <LensFlare ref="lensFlare" v-show="popup =='lensFlare'"></LensFlare>
    <Bloom ref="bloom" v-show="popup =='bloom'"></Bloom>
    <Brightness ref="brightness" v-show="popup =='brightness'"></Brightness>
    <BlackAndWhite ref="blackAndWhite" v-show="popup =='blackAndWhite'"></BlackAndWhite>
    <AmbientOcclusion ref="ambientOcclusion" v-show="popup =='ambientOcclusion'"></AmbientOcclusion>
    <Shadow ref="shadow" v-show="popup =='shadow'"></Shadow>
    <Silhouette ref="silhouette" v-show="popup =='silhouette'"></Silhouette>
    <Mosaic ref="mosaic" v-show="popup =='mosaic'"></Mosaic>
    <NightVision ref="nightVision" v-show="popup =='nightVision'"></NightVision>
    <DepthOfField ref="depthOfField" v-show="popup =='depthOfField'"></DepthOfField>
    <ForceSunPos ref="forceSunPos" v-show="popup =='forceSunPos'"></ForceSunPos>
  </div>
</template>

<script>
import languagejs from "./index_locale";
import Sun from "./Sun";
import Atmosphere from "./Atmosphere";
import Cloud from "./Cloud";
import Moon from "./Moon";
import Rain from "./Rain";
import Snow from "./Snow";
import Fog from "./Fog";
import FogPostProcess from "./FogPostProcess";
import SkyBox from "./SkyBox";
import LensFlare from "./LensFlare";
import Bloom from "./Bloom";
import Brightness from "./Brightness";
import BlackAndWhite from "./BlackAndWhite";
import AmbientOcclusion from "./AmbientOcclusion";
import Shadow from "./Shadow";
import Mosaic from "./Mosaic";
import Silhouette from "./Silhouette";
import NightVision from "./NightVision";
import DepthOfField from "./DepthOfField";
import ForceSunPos from "./ForceSunPos";
import { addOutterEventListener } from "../../../utils/xbsjUtil";
export default {
  components: {
    Sun,
    Atmosphere,
    Cloud,
    Moon,
    Rain,
    Snow,
    Fog,
    FogPostProcess,
    SkyBox,
    LensFlare,
    Bloom,
    Brightness,
    BlackAndWhite,
    AmbientOcclusion,
    Shadow,
    Mosaic,
    Silhouette,
    NightVision,
    DepthOfField,
    ForceSunPos
  },
  data() {
    return {
      selectlist: false,
      lang: {},
      weather: {
        sun: false,
        moon: false,
        atmosphere: false,
        cloud: false,
        rainPostProcess: false,
        snowPostProcess: false,
        fog: false,
        fogPostProcess: false,
        skyBox: true
      },
      skyBoxOnGround: false,
      popup: "",
      effect: {
        shadow: false,
        forceSunPos: false
      },
      postProcess: {
        bloom: false,
        ambientOcclusion: false,
        depthOfField: false,
        silhouette: false,
        brightness: false,
        blackAndWhite: false,
        nightVision: false,
        lensFlare: false,
        mosaic: false
      },
      langs: languagejs
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

    this.$nextTick(() => {
      this.binVue("weather.sun");
      this.binVue("weather.moon");
      this.binVue("weather.atmosphere");
      this.binVue("weather.cloud");
      this.binVue("weather.rainPostProcess");
      this.binVue("weather.snowPostProcess");
      this.binVue("weather.fog");
      this.binVue("weather.fogPostProcess");
      this.binVue("weather.skyBox");
      this.bindVue("skyBoxOnGround");

      this.binVue("effect.shadow");
      this.binVue("effect.forceSunPos");

      this.binVue("postProcess.ambientOcclusion");
      this.binVue("postProcess.bloom");
      this.binVue("postProcess.blackAndWhite");
      this.binVue("postProcess.brightness");
      this.binVue("postProcess.depthOfField");
      this.binVue("postProcess.lensFlare");
      this.binVue("postProcess.mosaic");
      this.binVue("postProcess.nightVision");
      this.binVue("postProcess.silhouette");
    });
  },
  methods: {
    toggleCloud() {
      this.$root.$earth.cameraViewManager.globe.flyTo().then(() => {
        this.weather.cloud = !this.weather.cloud;
      });
    },
    toggleAtmosphere() {
      this.$root.$earth.cameraViewManager.globe.flyTo().then(() => {
        this.weather.atmosphere = !this.weather.atmosphere;
      });
    },
    toggleSun() {
      var viewer = this.$root.$earth.czm.viewer;
      var p = this.$root.$earth.weather.sunPosition;

      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          -p.x / 1000,
          -p.y / 1000,
          -p.z / 2000
        ),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90.0),
          roll: 0.0
        },
        cancel: () => {
          this.weather.sun = !this.weather.sun;
        },
        complete: () => {
          this.weather.sun = !this.weather.sun;
        },
        duration: 0.5
      });
    },
    toggleFlare() {
      var viewer = this.$root.$earth.czm.viewer;
      var p = this.$root.$earth.weather.sunPosition;

      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          -p.x / 1000,
          -p.y / 1000,
          -p.z / 2000
        ),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90.0),
          roll: 0.0
        },
        cancel: () => {
          this.postProcess.lensFlare = !this.postProcess.lensFlare;
        },
        complete: () => {
          this.postProcess.lensFlare = !this.postProcess.lensFlare;
        },
        duration: 0.5
      });
    },
    toggleMoon() {
      var viewer = this.$root.$earth.czm.viewer;
      var p = this.$root.$earth.weather.moonPosition;

      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(p.x / 1.2, p.y / 1.2, p.z / 1.2),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(90.0),
          roll: 0.0
        },
        cancel: () => {
          this.weather.moon = !this.weather.moon;
        },
        complete: () => {
          this.weather.moon = !this.weather.moon;
        },
        duration: 0.5
      });
    },
    binVue(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth, prp + ".enabled")
      );
    },
    bindVue(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.weather.skyBox, prp)
      );
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
  },
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>

<style>
.sunbutton {
  background: url(../../../../images/sun.png) no-repeat;
  background-size: contain;
}
.sunbutton:hover,
.sunbutton-on {
  background: url(../../../../images/sun_on.png) no-repeat;
  background-size: contain;
}
.moonbutton {
  background: url(../../../../images/moon.png) no-repeat;
  background-size: contain;
}
.moonbutton:hover,
.moonbutton-on {
  background: url(../../../../images/moon_on.png) no-repeat;
  background-size: contain;
}

.atmospherebutton {
  background: url(../../../../images/atmosphere.png) no-repeat;
  background-size: contain;
}
.atmospherebutton:hover,
.atmospherebutton-on {
  background: url(../../../../images/atmosphere_on.png) no-repeat;
  background-size: contain;
}

.cloudbutton {
  background: url(../../../../images/cloud.png) no-repeat;
  background-size: contain;
}
.cloudbutton:hover,
.cloudbutton-on {
  background: url(../../../../images/cloud_on.png) no-repeat;
  background-size: contain;
}

.rainPostProcessbutton {
  background: url(../../../../images/rain.png) no-repeat;
  background-size: contain;
}
.rainPostProcessbutton:hover,
.rainPostProcessbutton-on {
  background: url(../../../../images/rain_on.png) no-repeat;
  background-size: contain;
}

.snowPostProcessbutton {
  background: url(../../../../images/snow.png) no-repeat;
  background-size: contain;
}
.snowPostProcessbutton:hover,
.snowPostProcessbutton-on {
  background: url(../../../../images/snow_on.png) no-repeat;
  background-size: contain;
}

.fogbutton {
  background: url(../../../../images/fog.png) no-repeat;
  background-size: contain;
}
.fogbutton:hover,
.fogbutton-on {
  background: url(../../../../images/fog_on.png) no-repeat;
  background-size: contain;
}

.fogpostprocessbutton {
  background: url(../../../../images/fogpostprocess.png) no-repeat;
  background-size: contain;
}
.fogpostprocessbutton:hover,
.fogpostprocessbutton-on {
  background: url(../../../../images/fogpostprocess_on.png) no-repeat;
  background-size: contain;
}

.starryskybutton {
  background: url(../../../../images/starrysky.png) no-repeat;
  background-size: contain;
}
.starryskybutton:hover,
.starryskybutton-on {
  background: url(../../../../images/starrysky_on.png) no-repeat;
  background-size: contain;
}

.skyboxbutton {
  background: url(../../../../images/skybox.png) no-repeat;
  background-size: contain;
}
.skyboxbutton:hover,
.skyboxbutton-on {
  background: url(../../../../images/skybox_on.png) no-repeat;
  background-size: contain;
}

.shadowbutton {
  background: url(../../../../images/shadow.png) no-repeat;
  background-size: contain;
}
.shadowbutton-on,
.shadowbutton:hover {
  background: url(../../../../images/shadow_on.png) no-repeat;
  background-size: contain;
}
.bloombutton {
  background: url(../../../../images/bloom.png) no-repeat;
  background-size: contain;
}
.bloombutton:hover,
.bloombutton-on {
  background: url(../../../../images/bloom_on.png) no-repeat;
  background-size: contain;
}

.lensflarebutton {
  background: url(../../../../images/lensflare.png) no-repeat;
  background-size: contain;
}
.lensflarebutton:hover,
.lensflarebutton-on {
  background: url(../../../../images/lensflare_on.png) no-repeat;
  background-size: contain;
}

.depthoffieldbutton {
  background: url(../../../../images/depthoffield.png) no-repeat;
  background-size: contain;
}
.depthoffieldbutton:hover,
.depthoffieldbutton-on {
  background: url(../../../../images/depthoffield_on.png) no-repeat;
  background-size: contain;
}
.silhouettebutton {
  background: url(../../../../images/silhouette.png) no-repeat;
  background-size: contain;
}
.silhouettebutton-on,
.silhouettebutton:hover {
  background: url(../../../../images/silhouette_on.png) no-repeat;
  background-size: contain;
}

.brightnessbutton {
  background: url(../../../../images/brightness.png) no-repeat;
  background-size: contain;
}
.brightnessbutton:hover,
.brightnessbutton-on {
  background: url(../../../../images/brightness_on.png) no-repeat;
  background-size: contain;
}

.blackandwhitebutton {
  background: url(../../../../images/blackandwhite.png) no-repeat;
  background-size: contain;
}
.blackandwhitebutton:hover,
.blackandwhitebutton-on {
  background: url(../../../../images/blackandwhite_on.png) no-repeat;
  background-size: contain;
}

.ambientocclusionbutton {
  background: url(../../../../images/ambientocclusion.png) no-repeat;
  background-size: contain;
}
.ambientocclusionbutton-on,
.ambientocclusionbutton:hover {
  background: url(../../../../images/ambientocclusion_on.png) no-repeat;
  background-size: contain;
}

.mosaicbutton {
  background: url(../../../../images/mosaic.png) no-repeat;
  background-size: contain;
}
.mosaicbutton-on,
.mosaicbutton:hover {
  background: url(../../../../images/mosaic_on.png) no-repeat;
  background-size: contain;
}

.nightvisionbutton {
  background: url(../../../../images/nightvision.png) no-repeat;
  background-size: contain;
}
.nightvisionbutton-on,
.nightvisionbutton:hover {
  background: url(../../../../images/nightvision_on.png) no-repeat;
  background-size: contain;
}

.forcesunbutton {
  background: url(../../../../images/forcesun.png) no-repeat;
  background-size: contain;
}
.forcesunbutton-on,
.forcesunbutton:hover {
  background: url(../../../../images/forcesun_on.png) no-repeat;
  background-size: contain;
}
</style>

