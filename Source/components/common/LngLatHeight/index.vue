<template>
  <div class="xbsj-lnglatheight">
    <input v-model="lon" class="lon" @keyup.enter="updateLon" @blur="updateLon" />
    <input v-model="lat" class="lat" @keyup.enter="updateLat" @blur="updateLat" />
    <input v-model="height" class="height" @keyup.enter="updateHeight" @blur="updateHeight" />
  </div>
</template>
<script>
export default {
  model: {
    prop: "lngLatHeight",
    event: "changed"
  },
  props: {
    lngLatHeight: {
      type: Array,
      default() {
        return [0, 0, 0];
      }
    }
  },
  data() {
    return {
      lon: "0",
      lat: "0",
      height: "0"
    };
  },
  mounted() {
    //赋初值
    this.fromArray();
  },
  methods: {
    f_lnglat(v) {
      return ((v * 180) / Math.PI).toFixed(7) + "°";
    },
    f_height(v) {
      return v.toFixed(2) + "m";
    },
    fromArray() {
      this.lon = this.f_lnglat(this.lngLatHeight[0]);
      this.lat = this.f_lnglat(this.lngLatHeight[1]);
      this.height = this.f_height(this.lngLatHeight[2]);
    },
    updateLon() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.lon;
      if (nstr.lastIndexOf("°") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var lon = parseFloat(nstr);
      if (!isNaN(lon) && lon <= 180 && lon >= -180) {
        //this.lngLatHeight[0] = (lon * Math.PI) / 180;
        this.lngLatHeight.splice(0, 1, (lon * Math.PI) / 180);
        this.$emit("changed", this.lngLatHeight);
      }
      this.lon = this.f_lnglat(this.lngLatHeight[0]);
    },
    updateLat() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.lat;
      if (nstr.lastIndexOf("°") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var lat = parseFloat(nstr);
      if (!isNaN(lat) && lat <= 90 && lat >= -90) {
        // this.lngLatHeight[1] = (lat * Math.PI) / 180;
        this.lngLatHeight.splice(1, 1, (lat * Math.PI) / 180);
        this.$emit("changed", this.lngLatHeight);
      }
      this.lat = this.f_lnglat(this.lngLatHeight[1]);
    },
    updateHeight() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.height;
      if (nstr.lastIndexOf("m") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var height = parseFloat(nstr);
      if (!isNaN(height)) {
        //  this.lngLatHeight[2] = height;
        this.lngLatHeight.splice(2, 1, height);
        this.$emit("changed", this.lngLatHeight);
      }
      this.height = this.f_height(this.lngLatHeight[2]);
    }
  },
  watch: {
    lngLatHeight(v) {
      //监控这个属性变化来负值
      this.fromArray();
    }
  }
};
</script>
<style scoped>
.xbsj-lnglatheight {
  display: flex;
}

.xbsj-lnglatheight .lon {
  width: 25%;
  /* margin-left: 5%; */
  /* margin-left: 20px; */
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 5px;
  outline: none;
}
.xbsj-lnglatheight .lat {
  width: 25%;
  margin-left: 5%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 5px;
  outline: none;
}

.xbsj-lnglatheight .height {
  width: 25%;
  margin-left: 5%;
  margin-right: 5%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 5px;
  outline: none;
}
</style>


