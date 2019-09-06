<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="pickrow">
      <label class="picklabel" @click="hoverEnable=false">{{lang.xfsj}}:</label>
      <XbsjSwitch v-model="hoverEnable" :value="hoverEnable"></XbsjSwitch>
    </div>
    <div class="pickrow">
      <label class="picklabel">{{lang.clickcolor}}:</label>
      <div class="colorstartDiv">
        <XbsjColorButton ref="colorButton" v-model="uiclickedcolor"></XbsjColorButton>
      </div>
      <label class="picklabel">{{lang.hovercolor}}:</label>
      <div class="colorendDiv">
        <XbsjColorButton ref="colorButton" v-model="uihoveredcolor"></XbsjColorButton>
      </div>
    </div>

     <div class="pickrow">
      <label class="picklabel" @click="disableDefatulePropertyWindow=false">{{lang.disableDefatulePropertyWindow}}:</label>
      <XbsjSwitch v-model="disableDefatulePropertyWindow" ></XbsjSwitch>
    </div>

  </div>
</template>
<script>  
export default {
  
  data() {
    return {
      langs: {
        zh: {
          xfsj: "悬浮事件",
          clickcolor: "选中颜色",
          hovercolor: "悬浮颜色",
          disableDefatulePropertyWindow: "隐藏属性"
        },
        en: {
          xfsj: "Hover",
          clickcolor: "ClickColor",
          hovercolor: "HoverColor",
          disableDefatulePropertyWindow: "HidePrp"
        }
      },
      lang: undefined,
      hoverEnable: false,
      clickedColor: [],
      hoveredColor: [],
      uiclickedcolor: undefined,
      uihoveredcolor: undefined,
      disableDefatulePropertyWindow:false
    };
  },
  created() {
    
  },
  mounted() {
    this.bind("hoverEnable");
    this.bind("clickedColor");
    this.bind("hoveredColor");
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(
          this,
          prp,
          // this.$root.$earth.pickedObject,
          this.$root.$earth.interaction.picking,
          prp
        )
      );
    }
  },
  watch: {
    uiclickedcolor(clickcolor) {
      var clickv = clickcolor.rgba;
      var clickcc = [
        clickv.r / 255.0,
        clickv.g / 255.0,
        clickv.b / 255.0,
        clickv.a
      ];
      if (
        !this.clickedColor.every((clickc, index) => clickc === clickcc[index])
      ) {
        this.clickedColor = clickcc;
      }
    },
    clickedColor(clickc) {
      this.uiclickedcolor = {
        rgba: {
          r: clickc[0] * 255,
          g: clickc[1] * 255,
          b: clickc[2] * 255,
          a: clickc[3]
        }
      };
    },
    uihoveredcolor(hovercolor) {
      var hoverv = hovercolor.rgba;
      var hovercc = [
        hoverv.r / 255.0,
        hoverv.g / 255.0,
        hoverv.b / 255.0,
        hoverv.a
      ];
      if (
        !this.hoveredColor.every((hoverc, index) => hoverc === hovercc[index])
      ) {
        this.hoveredColor = hovercc;
      }
    },
    hoveredColor(hoverc) {
      this.uihoveredcolor = {
        rgba: {
          r: hoverc[0] * 255,
          g: hoverc[1] * 255,
          b: hoverc[2] * 255,
          a: hoverc[3]
        }
      };
    }
  },
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>
<style scoped>
.popup {
  width: 242px;
  height: 150px;
}
.pickrow {
  margin-top: 10px;
}
.picklabel {
  display: inline-block;
  width: 60px;
  text-align: right;
  margin-right: 5px;
  vertical-align: top;
  line-height: 29px;
}
.colorstartDiv,
.colorendDiv {
  display: inline-block;
}
</style>

