<template>
  <div class="xbsj-mainbar-popup popup" ref="searchbox">
    <div v-show="loading">{{lang.searching}}</div>
    <div v-show="error!=''">{{error}}</div>
    <ul>
      <li v-show="results.length!=''" v-for="(item,index) in results" :key="index">
        <div class="xbsj-search-item" @click="selectItem(item)">
          <div>{{item.name}}</div>
          <span>{{lang.position}}</span>
          <div class="xbsj-weizhi">
            <span>{{item.location.lng.toFixed(5)}}</span>
            <span>{{item.location.lat.toFixed(5)}}</span>
          </div>
          <div>
            <span>{{item.province}}</span>-
            <span>{{item.city}}</span>-
            <span>{{item.district}}</span>
          </div>
          <div class="xbsj-map">{{lang.provider}}-{{item.provider}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          searching: "正在查询...",
          position: "位置:",
          provider: "来自-"
        },
        en: {
          searching: "search ...",
          position: "Position:",
          provider: "Provider-"
        }
      },
      lang: undefined,
      loading: false,
      error: "",
      results: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    query(key) {
      this.loading = true;
      this.error = "";
      this.results = [];

      this.$root.$labServer
        .geocoder(key)
        .then(result => {
          this.loading = false;
          this.results = result;
        })
        .catch(error => {
          this.loading = false;
          this.error = error.message || error;
        });
    },
    newView(item) {
      let cvm = this.$root.$earth.cameraViewManager;
      cvm
        .newView()
        .then(view => {
          view.name = item.name;
          cvm.views.push(view);
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectItem(item) {
      this.$emit("itemSelected", item);
      let viewer = this.$root.$earth.czm.viewer;

      if (this._entity) this.clear();

      //创建定位图标 并飞行
      this._entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          item.location.lng,
          item.location.lat
        ),
        billboard: {
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          pixelOffset: new Cesium.Cartesian2(-18, 0),
          image:
            "data:image/png;base64,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"
        },
        label: {
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          text: item.name,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "35px 楷体",
          fillColor: new Cesium.Color(0, 1, 1, 1),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 6,
          scale: 0.5,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        contextMenus: [
          {
            text: "保存视角",
            keys: "",
            func: () => {
              this.newView(item);
            }
          }
        ]
      });

      viewer.flyTo(this._entity, {
        offset: new Cesium.HeadingPitchRange(0, -1.7, 1000),
        duration: 1
      });
    },
    clear() {
      if (this._entity) {
        let viewer = this.$root.$earth._viewer;
        viewer.entities.remove(this._entity);
        this._entity = undefined;
      }
    }
  }
};
</script>
<style scoped>
.popup {
  width: 270px;
  height: 276px;
  top: 120px;
  left: 429px;
  overflow: auto;
  padding: 10px 10px;
}
.popup ul li {
  list-style: none;
  border-bottom: 1px solid;
}
.popup::-webkit-scrollbar {
  width: 4px;
}
.popup::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.popup::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.xbsj-map {
  text-align: right;
}
.xbsj-weizhi {
  display: inline-block;
}
.xbsj-search-item {
  cursor: pointer;
}
.xbsj-search-item:hover {
  background: rgba(107, 107, 107, 1);
}
</style>

