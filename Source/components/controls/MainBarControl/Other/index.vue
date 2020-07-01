<template>
  <!-- box -->
  <div class="xbsj-template">
    <div class="xbsj-list" ref="container">
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.dataSource}}</span>
        <!-- 数据源-->
        <div class="xbsj-item-btnbox" @click="geoJSON">
          <div class="xbsj-item-btn geojson"></div>
          <span class="xbsj-item-name">GeoJSON</span>
        </div>
        <div class="xbsj-item-btnbox" @click="KML">
          <div class="xbsj-item-btn kml"></div>
          <span class="xbsj-item-name">KML</span>
        </div>
        <div class="xbsj-item-btnbox" @click="Czml">
          <div class="xbsj-item-btn czml"></div>
          <span class="xbsj-item-name">Czml</span>
        </div>
      </div>
      <!-- <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.userDefined}}</span>
        <div class="xbsj-item-btnbox" @click="pinpicturebtn() ">
          <div class="xbsj-item-btn pinpicbutton"></div>
          <span class="xbsj-item-name">{{lang.pinpicturebtn}}</span>
        </div>
        <div class="xbsj-item-btnbox ml20" @click="groundImageBtn">
          <div class="xbsj-item-btn groundimagebutton"></div>
          <span class="xbsj-item-name">{{lang.groundimage}}</span>
        </div>
        <div class="xbsj-item-btnbox" @click="divData()">
          <div class="xbsj-item-btn divData"></div>
          <span class="xbsj-item-name">数据展示</span>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";

export default {
  components: {},
  data() {
    return {
      lang: {},
      langs: languagejs
    };
  },
  created() {},
  mounted() {},
  methods: {
    geoJSON() {
      var geojson = new XE.Obj.GeoJSON(this.$root.$earth);
      geojson.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(geojson);
    },
    KML() {
      var kml = new XE.Obj.KML(this.$root.$earth);
      kml.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(kml);
    },
    Czml() {
      var czml = new XE.Obj.Czml(this.$root.$earth);
      czml.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(czml);
    },
    pinpicturebtn() {
      var PinPictureTool = new XE.Obj.Pin(this.$root.$earth);
      // PinPictureTool.ctrtype = "PinPictureTool";
      PinPictureTool.name = "图片";
      PinPictureTool.imageUrl = "./assets/ico/1.png";
      PinPictureTool.positionPicking = true;
      PinPictureTool.isCreating = true;
      PinPictureTool.creating = true;
      this.$root.$earthUI.showPropertyWindow(PinPictureTool);
    },
    // 贴地图像
    groundImageBtn() {
      var groundimage = new XE.Obj.GroundImage(this.$root.$earth);
      groundimage.name = "贴地图像";
      groundimage.autoRegisterEditing = true;

      groundimage.isCreating = true;
      groundimage.creating = true;
      groundimage.imageUrls = ["./assets/ico/6.png"];
      console.log(groundimage);
      this.$root.$earthUI.showPropertyWindow(groundimage);
    },
    divData() {
      var PinDiv = new XE.Obj.Plots.GeoPin(this.$root.$earth);
      console.log(PinDiv);
      PinDiv.name = "111";
      PinDiv.isCreating = true;
      PinDiv.creating = true;
      PinDiv.innerHTML = `<!DOCTYPE HTML>
        <html>

        <head>
            <title></title>
            <style>
                .contain {
                    position: absolute;
                    height: 235px;
                    width: 586px;
                    left: 2px;
                    top: -242px;
                    color: white;
                    background-size: 100% 100%;
                    padding: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    background-image: url('./assets/dialog2.png');
                }
                .textContain {
                    position: absolute;
                    cursor: pointer;
                    line-height: 15px;
                    top: 20px;
                    bottom: 0px;
                    left: 190px;
                    color: white;
                    padding: 22px;
                }
                .textItem {
                    display: block;
                    font-size: 14px;
                    color: #ffffff;
                    line-height: 22px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 7;
                    -webkit-box-orient: vertical;
                }
                @keyframes scale {
                    0% {
                        transform: scale(1)
                    }
                    50%,
                    75% {
                        transform: scale(3)
                    }
                    78%,
                    100% {
                        opacity: 0
                    }
                }
                @keyframes scales {
                    0% {
                        transform: scale(1)
                    }
                    50%,
                    75% {
                        transform: scale(2)
                    }
                    78%,
                    100% {
                        opacity: 0
                    }
                }
                .smallcircle {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background-color: #56bcd6;
                    opacity: 0.8;
                    border-radius: 50%;
                    top: -4px;
                    left: -6px;
                }
                .smallcircle:before {
                    content: '';
                    display: block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    opacity: .4;
                    background-color: #56bcd6;
                    opacity: 0.8;
                    animation: scale 1s infinite cubic-bezier(0, 0, .49, 1.02);
                }
                .bigcircle {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    opacity: .4;
                    background-color: #56bcd6;
                    opacity: 0.8;
                    animation: scales 1s infinite cubic-bezier(0, 0, .49, 1.02);
                    top: -4px;
                    left: -6px;
                }
            </style>
        </head>
        <body>
            <div class="contain">
                <div style="position: absolute; top: 7px; left: 202px;"><span style="font-size: 16px; color: #ffe799;">景点详情</span>
                <span style="display: inline-block; width: 14px; height: 12px; background: url(./assets/arrow.png) no-repeat; background-size: 100% 100%; margin-left: 6px;"></span></div>
                <div class="textContain"><span class="textItem">"卢浮宫位于法国巴黎市中心的塞纳河北岸，位居世界四大博物馆之首。</span></div>
            </div>
            <div class="smallcircle"></div>
            <div class="bigcircle"></div>
        </body>
        </html>`;
      this.$root.$earthUI.showPropertyWindow(PinDiv);
    }
  }
};
</script>

<style scoped>
.geojson {
  background: url(../../../../images/GeoJSON.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.geojson:hover {
  background: url(../../../../images/GeoJSON2.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.kml {
  background: url(../../../../images/KML.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.kml:hover {
  background: url(../../../../images/KML2.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.czml {
  background: url(../../../../images/Czml.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.czml:hover {
  background: url(../../../../images/Czml2.png) no-repeat;
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
.groundimagebutton {
  background: url(../../../../images/ico/1.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.groundimagebutton.highlight,
.groundimagebutton:hover {
  background: url(../../../../images/ico/2.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}

.divData {
  background: url(../../../../images/ico/1.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.divData:hover {
  background: url(../../../../images/ico/2.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
</style>

