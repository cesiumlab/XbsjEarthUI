<template>
  <div class="xbsj-meterInput">
    <input type="text" v-model="meter" class="meter" @keyup.enter="updateValue" @blur="updateValue" />
  </div>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "changed"
  },
  props: {
    value: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      meter: "0"
    };
  },
  mounted() {
    //赋初值
    this.meter = this.f_value(this.value);
  },
  methods: {
    f_value(v) {
      return v.toFixed(2) + "m";
    },
    updateValue() {
      //如果v最后一位是 °  那么去除最后一个，parseFloat
      var nstr = this.meter;
      if (nstr.lastIndexOf("m") == nstr.length - 1) {
        nstr = nstr.substr(0, nstr.length - 1);
      }
      var value = parseFloat(nstr);
      if (!isNaN(value)) {
        this.$emit("changed", value);
      }
      this.meter = this.f_value(value);
    }
  },
  watch: {
    value(v) {
      this.meter = this.f_value(this.value);
    }
  }
};
</script>
<style scoped>
.xbsj-meterInput {
  display: flex;
}
.xbsj-meterInput input {
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.xbsj-lnglatheight .meter {
  width: calc(100%- 10px);
  margin-left: 5px;
  margin-right: 5px;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
</style>


