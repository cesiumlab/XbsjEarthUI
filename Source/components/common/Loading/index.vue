<template>
  <div class="loading-box">
    <div ref="slice-solid" class="slice-solid" v-if="type==='slice-solid'" v-show="isshow"></div>
    <!-- 可以添加更多的样式 -->
  </div>
</template>

<script>
export default {
  props:{
    type:{
      type:String,
      default:'slice-solid'
    },
    isshow:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      
    }
  },
};
</script>

<style scoped>
.loading-box {
  display: inline-block;
}
.slice-solid {
  width: 25px;
  height: 25px;
  -webkit-animation: circle infinite 0.75s linear;
  -moz-animation: circle infinite 0.75s linear;
  -o-animation: circle infinite 0.75s linear;
  animation: circle infinite 0.75s linear;
  border: 2px solid #1fffff;
  border-top-color: transparent;
  border-radius: 100%;
  display: inline-block;
}

@-webkit-keyframes circle {
  0% {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-moz-keyframes circle {
  0% {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-o-keyframes circle {
  0% {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes circle {
  0% {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
