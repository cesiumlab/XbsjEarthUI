<template>
  <Window
    :width="400"
    :height="400"
    :minWidth="200"
    :title="lang.title"
    :close="close"
    @cancel="cancel"
    :footervisible="false"
  >
    <ul>
      <li
        v-for="s in times"
        @click="select(s)"
        :key="s.year+''+s.month+''+s.day+''+s.hour+''+s.minute+''+s.second"
      >{{s.year}}年 {{s.month}}月 {{s.day}}日 {{s.hour}}:{{s.minute}}:{{s.second}}</li>
    </ul>
  </Window>
</template>
<script>
import languagejs from "./index_locale";
import axios from "axios";
export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      times: [],
      url: "",
      lang: {},
      langs: languagejs
    };
  },
  created() {},
  mounted() {
    var wmts = this.getBind();
    var url = wmts.xbsjImageryProvider.WebMapTileServiceImageryProvider.url;
    this.url = url.substr(0, url.indexOf("?"));
    console.log(this.url);

    //监控相机停止事件
    var camera = this.$root.$earth.czm.camera;
    this._disposers = [];
    this._disposers.push(
      camera.moveEnd.addEventListener(() => {
        this.refreshTimes();
      })
    );
    this.refreshTimes();
  },
  methods: {
    refreshTimes() {
      var camera = this.$root.$earth.czm.camera;
      //计算当前的视野中心点的经纬度，判定相机到经纬度的距离来计算级别
      const scene = this.$root.$earth.czm.viewer.scene;
      var ray = camera.getPickRay(
        new Cesium.Cartesian2(
          scene.canvas.width * 0.5,
          scene.canvas.height * 0.5
        )
      );
      //获取屏幕中心点，如果获取不到，不进行飞行
      var position = scene.globe.pick(ray, scene);
      if (!position) return;
      //console.log(position);
      var distance = Cesium.Cartesian3.distance(position, camera.position);
      //console.log(distance);
      var resolution =
        (distance * Math.tan(camera.frustum.fov * 0.5) * 2) /
        scene.canvas.height;
      // console.log(resolution);
      //第一级的精度是  PI * R / 256
      //第N级的精度是   PI * R / 256 / 2^(N-1)
      var zoom = Math.floor(
        Math.log2(
          (Math.PI * Cesium.Ellipsoid.WGS84._maximumRadius) / 256 / resolution
        ) + 1
      );
      zoom  = Math.min(17,zoom);
      //console.log(zoom);

      var longlat = Cesium.Cartographic.fromCartesian(position);
      //console.log(longlat);

      axios
        .get(this.url, {
          params: {
            request: "GetMetadata",
            lon: Cesium.Math.toDegrees(longlat.longitude),
            lat: Cesium.Math.toDegrees(longlat.latitude),
            z: zoom
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.updateTimes(res.data);
          } else {
            this.updateTimes();
          }
        })
        .catch(err => {
          console.log(err);
          this.updateTimes();
        });
    },
    cancel() {
      this.close();
    },
    close() {
      this.$parent.destroyTool(this);
    },
    updateTimes(data) {
      console.log(data);
      if (!Array.isArray(data)) data = [];
      //把日期显示到列表上
      this.times = data;
    },
    select(t) {
      //根据这个修改url参数
      var url = this.url;
      url +=
        "?request=GetTile&service=wmts&yy=" +
        t.year +
        "&dd=" +
        this.fix2(t.day) +
        "&mmon=" +
        this.fix2(t.month) +
        "&hh=" +
        this.fix2(t.hour) +
        "&mmin=" +
        this.fix2(t.minute) +
        "&ss=" +
        this.fix2(t.second) +
        "&format=jpeg&height=256&width=256&z={TileMatrix}&x={TileCol}&y={TileRow}";

      console.log(url);

      var wmts = this.getBind();
      wmts.xbsjImageryProvider.WebMapTileServiceImageryProvider.url = url;
      wmts.name = this.key(t) + "历史影像";
    },
    fix(num, length) {
      return ("" + num).length < length
        ? (new Array(length + 1).join("0") + num).slice(-length)
        : "" + num;
    },
    fix2(num) {
      return this.fix(num, 2);
    },
    key(s) {
      return (
        s.year +
        "年" +
        s.month +
        "月" +
        s.day +
        "日" +
        s.hour +
        "时" +
        s.minute +
        "分" +
        s.second
      );
    }
  },
  beforeDestroy() {
    // 解绑数据关联
    if (this._disposers) {
      this._disposers.forEach(e => e());
      this._disposers.length = 0;
    }
  }
};
</script>
<style scoped>
</style>
