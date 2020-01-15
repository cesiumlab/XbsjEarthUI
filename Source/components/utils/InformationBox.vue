<template>
  <div class="infomation">
    <span class="infomation_info" v-if="type=='info'"></span>
    <span class="infomation_warning" v-if="type=='warning'"></span>
    <span class="infomation_error" v-if="type=='error'"></span>
    {{this.info}}
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "info" // info warning error
    },
    info: {
      type: String,
      default: ""
    }
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.infomation {
  position: absolute;
  left: 50%;
  z-index: 10010;
  background: rgba(0, 0, 0, 0.4);
  padding: 3px;
  text-align: center;
  transform: translate(-25%, 0);
  height: 20px;
  line-height: 20px;
  /* display: flex; */
}
.infomation span {
  display: inline-block;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  vertical-align: middle;
}
.infomation_info {
  background: url(../../images/infomation_info.png);
  background-size: cover;
}
.infomation_warning {
  background: url(../../images/infomation_warning.png);
  background-size: cover;
}
.infomation_error {
  background: url(../../images/infomation_error.png);
  background-size: cover;
}
</style>


