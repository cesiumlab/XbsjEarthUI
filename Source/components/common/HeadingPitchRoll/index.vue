<template>
  <div class="xbsj-headingPitchRoll">
    <input v-model="heading" class="heading" @keyup.enter="updateHeading" @blur="updateHeading" />
    <input v-model="pitch" class="pitch" @keyup.enter="updatePitch" @blur="updatePitch" />
    <input v-model="roll" class="roll" @keyup.enter="updateRoll" @blur="updateRoll" />
  </div>
</template>
<script>
export default {
  model: {
    prop: "headingPitchRoll",
    event: "changed"
  },
  props: {
    headingPitchRoll: {
      type: Array,
      default() {
        return [0, 0, 0];
      }
    }
  },
  data() {
    return {
      heading: "0",
      pitch: "0",
      roll: "0"
    };
  },
  mounted() {
    //赋初值
    this.fromArray();
  },
  methods: {
    f_angle(v) {
      return ((v * 180) / Math.PI).toFixed(1) + "°";
    },
    _Heading() {
      var v = this.f_angle(this.headingPitchRoll[0]);
      if (this.heading != v) {
        this.heading = v;
      }
    },
    _Pitch() {
      var v = this.f_angle(this.headingPitchRoll[1]);
      if (this.pitch != v) {
        this.pitch = v;
      }
    },
    _Roll() {
      var v = this.f_angle(this.headingPitchRoll[2]);
      if (this.roll != v) {
        this.roll = v;
      }
    },
    fromArray() {
      this._Heading();
      this._Pitch();
      this._Roll();
    },
    updateHeading() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.heading;
      if (nstr.lastIndexOf("°") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var heading = parseFloat(nstr);
      if (!isNaN(heading) && heading <= 360 && heading >= 0) {
        this.headingPitchRoll.splice(0, 1, (heading * Math.PI) / 180);
        this.$emit("changed", this.headingPitchRoll);
      }
      this._Heading();
    },
    updatePitch() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.pitch;
      if (nstr.lastIndexOf("°") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var pitch = parseFloat(nstr);
      if (!isNaN(pitch) && pitch <= 90 && pitch >= -90) {
        this.headingPitchRoll.splice(1, 1, (pitch * Math.PI) / 180);
        this.$emit("changed", this.headingPitchRoll);
      }
      this._Pitch();
    },
    updateRoll() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.roll;
      if (nstr.lastIndexOf("°") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var roll = parseFloat(nstr);
      if (!isNaN(roll) && roll <= 360 && roll >= 0) {
        this.headingPitchRoll.splice(2, 1, (roll * Math.PI) / 180);
        this.$emit("changed", this.headingPitchRoll);
      }
      this._Roll();
    }
  },
  watch: {
    headingPitchRoll(v) {
      //监控这个属性变化来负值
      this.fromArray();
    }
  }
};
</script>
<style scoped>
.xbsj-headingPitchRoll {
  display: flex;
}

.xbsj-headingPitchRoll .heading {
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
.xbsj-headingPitchRoll .pitch {
  width: 25%;
  margin-left: 5%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding: 5px;
  outline: none;
}

.xbsj-headingPitchRoll .roll {
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


