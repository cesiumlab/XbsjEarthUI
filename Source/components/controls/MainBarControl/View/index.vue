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
        <span class="xbsj-list-name">{{lang.control}}</span>
        <div class="xbsj-item-btnbox ml20" @click="layerShow=!layerShow">
          <div class="xbsj-item-btn layerbutton" :class="layerShow ? 'layerbuttonActive' : ''"></div>
          <span class="xbsj-item-name">{{lang.layer}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="navcontrolShow=!navcontrolShow">
          <div class="xbsj-item-btn navbutton" :class="navcontrolShow ? 'navbuttonActive' : ''"></div>
          <span class="xbsj-item-name">{{lang.navcontrol}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="scalecontrolShow=!scalecontrolShow">
          <div
            class="xbsj-item-btn scalebutton"
            :class="scalecontrolShow ? 'scalebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.scalecontrol}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="statecontrolShow=!statecontrolShow">
          <div
            class="xbsj-item-btn statebutton"
            :class="statecontrolShow ? 'statebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.statecontrol}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="timelinecontrolShow=!timelinecontrolShow">
          <div
            class="xbsj-item-btn timebutton"
            :class="timelinecontrolShow ? 'timebuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.timelinecontrol}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="modelTreeShow=!modelTreeShow">
          <div class="xbsj-item-btn scenebutton" :class="{highlight :modelTreeShow}"></div>
          <span class="xbsj-item-name">{{lang.modelTree}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="tilesTestShow=!tilesTestShow">
          <div class="xbsj-item-btn testbutton" :class="{highlight: tilesTestShow}"></div>
          <span class="xbsj-item-name">{{lang.autoTest}}</span>
        </div>
        <!--
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn attributebutton"></div>
          <span class="xbsj-item-name">{{lang.attributepanel}}</span>
        </div>
        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn timebutton"></div>
          <span class="xbsj-item-name">{{lang.timeaxis}}</span>
        </div>
        -->
      </div>
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.splitscreen}}</span>
        <div
          class="xbsj-item-btnbox ml20"
          @click="popup=!popup"
          v-show="splitX<=0&&splitY<=0||splitX<=0&&splitY>=1||splitX>=1&&splitY<=0||splitX>=1&&splitY>=1"
        >
          <div class="xbsj-item-btn singleviewportbutton singleviewportbuttonActive"></div>
          <span class="xbsj-item-name">{{lang.singleviewport}}</span>
        </div>
        <div
          class="xbsj-item-btnbox ml20"
          @click="popup=!popup"
          v-show="(splitX > 0 && splitX < 1 && !(splitY > 0 && splitY < 1))"
        >
          <div
            class="xbsj-item-btn leftrightbutton"
            :class="(splitX > 0 && splitX < 1 && !(splitY > 0 && splitY < 1)) ? 'leftrightbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.leftright}}</span>
        </div>
        <div
          class="xbsj-item-btnbox"
          @click="popup=!popup"
          v-show="(!(splitX > 0 && splitX < 1) && splitY > 0 && splitY < 1)"
        >
          <div
            class="xbsj-item-btn upanddownbutton"
            :class="(!(splitX > 0 && splitX < 1) && splitY > 0 && splitY < 1) ? 'upanddownbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.upanddown}}</span>
        </div>
        <div
          class="xbsj-item-btnbox"
          @click="popup=!popup"
          v-show="(splitX > 0 && splitX < 1 && splitY > 0 && splitY < 1)"
        >
          <div
            class="xbsj-item-btn fourpointsbutton"
            :class="(splitX > 0 && splitX < 1 && splitY > 0 && splitY < 1) ? 'fourpointsbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.fourpoints}}</span>
        </div>
      </div>
      <div class="xbsj-list-item xbsj-list-lastitem">
        <span class="xbsj-list-name">{{lang.debug}}</span>
        <div class="xbsj-item-btnbox ml20" @click="terrainDebug=!terrainDebug">
          <div
            class="xbsj-item-btn terrainbutton"
            :class="terrainDebug ? 'terrainbuttonActive' : ''"
          ></div>
          <span class="xbsj-item-name">{{lang.terraindebug}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="cesiumDebug=!cesiumDebug">
          <div class="xbsj-item-btn dtilesbutton" :class="cesiumDebug ? 'dtilesbuttonActive' : ''"></div>
          <span class="xbsj-item-name">{{lang.dtilesdebug}}</span>
        </div>

        <div class="xbsj-item-btnbox" @click="capture">
          <div class="xbsj-item-btn capturebutton"></div>
          <span class="xbsj-item-name">{{lang.capture}}</span>
        </div>

        <div class="xbsj-item-btnbox">
          <div class="xbsj-item-btn">
            <XbsjColorButton v-model="baseColorUI" ref="baseColor"></XbsjColorButton>
          </div>
          <span class="xbsj-item-name">{{lang.earthColor}}</span>
        </div>
      </div>
    </div>
    <div class="xbsj-mainbar-popup popup" v-show="popup">
      <div class="xbsj-item-btnbox ml20" @click="viewportshow('0'),setViewport(1.0,1.0)">
        <div class="xbsj-item-btn singleviewportbuttonActive"></div>
        <span class="xbsj-item-name">{{lang.singleviewport}}</span>
      </div>
      <div class="xbsj-item-btnbox ml20" @click="viewportshow('1'),setViewport(0.5, 1.0)">
        <div class="xbsj-item-btn leftrightbuttonActive"></div>
        <span class="xbsj-item-name">{{lang.leftright}}</span>
      </div>
      <div class="xbsj-item-btnbox" @click="viewportshow('2'),setViewport(1.0, 0.5)">
        <div class="xbsj-item-btn upanddownbuttonActive"></div>
        <span class="xbsj-item-name">{{lang.upanddown}}</span>
      </div>
      <div class="xbsj-item-btnbox" @click="viewportshow('3'),setViewport(0.5, 0.5)">
        <div class="xbsj-item-btn fourpointsbuttonActive"></div>
        <span class="xbsj-item-name">{{lang.fourpoints}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";

export default {
  data() {
    return {
      layerShow: true,
      navcontrolShow: true,
      scalecontrolShow: true,
      statecontrolShow: true,

      timelinecontrolShow: true,
      modelTreeShow: false,
      show: true,
      selectlist: false,
      splitX: 1.0,
      splitY: 1.0,
      terrainDebug: false,
      cesiumDebug: false,
      lang: {},
      viewport: "0",
      popup: false,
      options: {
        verticalshow: false,
        transverseshow: false,
        verticalleft: this.splitX,
        transversetop: this.splitY
      },
      baseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      baseColor: [0, 0, 0.5, 1],
      langs: languagejs,
      tilesTestShow: true
    };
  },
  created() {},
  mounted() {
    //console.log(this.$root.$earth);

    // 用于卸载 vtxf 20190620
    this._unbinds = [];

    this.$nextTick(() => {
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "navcontrolShow",
          this.$root.$earth.camera.navigator,
          "showCompass"
        )
      );
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "scalecontrolShow",
          this.$root.$earth.camera.navigator,
          "showDistanceLegend"
        )
      );
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "splitX",
          this.$root.$earth,
          "camera.viewport.splitX"
        )
      );
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "splitY",
          this.$root.$earth,
          "camera.viewport.splitY"
        )
      );
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "terrainDebug",
          this.$root.$earth,
          "misc.debug.cesiumInspectorVisibility"
        )
      );
      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "cesiumDebug",
          this.$root.$earth,
          "misc.debug.tilesetInspectorVisibility"
        )
      );

      this._unbinds.push(
        XE.MVVM.bind(
          this,
          "baseColor",
          this.$root.$earth.terrainEffect,
          "baseColor"
        )
      );
    });
  },
  beforeDestroy() {
    this._unbinds.forEach(e => e());
    this._unbinds.length = 0;
  },
  computed: {
    split() {
      return { splitX: this.splitX, splitY: this.splitY };
    }
  },
  watch: {
    baseColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.baseColor.every((c, index) => c === cc[index])) {
        this.baseColor = cc;
      }
    },
    baseColor(c) {
      this.baseColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    }
  },
  methods: {
    setViewport(splitX, splitY) {
      this.splitX = splitX;
      this.splitY = splitY;
    },
    viewportshow(v) {
      this.viewport = v;
      this.popup = false;
    },
    capture() {
      this.$root.$earthUI.saveScreenToFile(
        this.$root.$earth.czm.viewer.canvas.width,
        this.$root.$earth.czm.viewer.canvas.height,
        "cesiumlab.png"
      );
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
.layerbutton {
  background: url(../../../../images/layer.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.layerbuttonActive {
  background: url(../../../../images/layer_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.layerbutton:hover {
  background: url(../../../../images/layer_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.navbutton {
  background: url(../../../../images/nav.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.navbutton:hover {
  background: url(../../../../images/nav_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.navbuttonActive {
  background: url(../../../../images/nav_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.scalebutton {
  background: url(../../../../images/scale.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.scalebutton:hover {
  background: url(../../../../images/scale_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.scalebuttonActive {
  background: url(../../../../images/scale_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.statebutton {
  background: url(../../../../images/state.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.statebutton:hover {
  background: url(../../../../images/state_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.statebuttonActive {
  background: url(../../../../images/state_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.scenebutton {
  background: url(../../../../images/scene.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.scenebutton.highlight,
.scenebutton:hover {
  background: url(../../../../images/scene_on.png) no-repeat;
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
.attributebutton {
  background: url(../../../../images/attribute.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.attributebutton:hover {
  background: url(../../../../images/attribute_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.timebutton {
  background: url(../../../../images/time.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.timebutton:hover {
  background: url(../../../../images/time_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.timebuttonActive {
  background: url(../../../../images/time_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.singleviewportbutton {
  background: url(../../../../images/singleviewport.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.singleviewportbutton:hover {
  background: url(../../../../images/singleviewport_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.singleviewportbuttonActive {
  background: url(../../../../images/singleviewport_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.leftrightbutton {
  background: url(../../../../images/leftright.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.leftrightbutton:hover {
  background: url(../../../../images/leftright_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.leftrightbuttonActive {
  background: url(../../../../images/leftright_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.upanddownbutton {
  background: url(../../../../images/upanddown.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.upanddownbutton:hover {
  background: url(../../../../images/upanddown_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.upanddownbuttonActive {
  background: url(../../../../images/upanddown_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.fourpointsbutton {
  background: url(../../../../images/fourpoints.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.fourpointsbutton:hover {
  background: url(../../../../images/fourpoints_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.fourpointsbuttonActive {
  background: url(../../../../images/fourpoints_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.terrainbutton {
  background: url(../../../../images/terrain.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.terrainbutton:hover {
  background: url(../../../../images/terrain_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.terrainbuttonActive {
  background: url(../../../../images/terrain_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.dtilesbutton {
  background: url(../../../../images/3Dtiles.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.dtilesbutton:hover {
  background: url(../../../../images/3Dtiles_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.dtilesbuttonActive {
  background: url(../../../../images/3Dtiles_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.popup {
  padding: 0 0 20px 0;
  border: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: rgba(71, 71, 71, 0.8);
  left: 346px;
}

.capturebutton {
  background: url(../../../../images/layer.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.capturebutton:hover {
  background: url(../../../../images/layer_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.testbutton {
  background: url(../../../../images/test.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.testbutton.highlight,
.testbutton:hover {
  background: url(../../../../images/test_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
</style>

