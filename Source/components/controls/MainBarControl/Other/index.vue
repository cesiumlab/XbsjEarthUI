<template>
  <!-- box -->
  <div class="xbsj-template">
    <div class="xbsj-list" ref="container">
      <div class="xbsj-list-item">
        <span class="xbsj-list-name">{{lang.dataSource}}</span>
        <!-- 在线 -->
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
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";

export default {
  components: {
  },
  data () {
    return {
      lang: {},
      langs: languagejs,
    };
  },
  created () { },
  mounted () {
  },
  methods: {
    geoJSON () {
      var geojson = new XE.Obj.GeoJSON(this.$root.$earth);
      geojson.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(geojson);
    },
    KML () {
      var kml = new XE.Obj.KML(this.$root.$earth);
      kml.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(kml);

    },
    Czml () {
      var czml = new XE.Obj.Czml(this.$root.$earth);
      czml.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(czml);

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
</style>

