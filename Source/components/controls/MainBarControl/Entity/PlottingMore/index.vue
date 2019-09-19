<template>
  <Window
    :width="480"
    :minWidth="480"
    :height="322"
    :title="lang.title"
    @cancel="cancel"
    v-show="show"
    :footervisible="false"
    @showclick="showSelect=false"
  >这里是更多弹窗</Window>
</template>

<script>
 
import languagejs from "./index_locale";

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      show:false,
      langs: languagejs
    };
  },
  created() {},
  mounted() {
    // 数据关联
  },
  beforeDestroy() {},
  computed: {},
  watch: {},
  methods: {
    close() {
      this.show = false
    },
    cancel() {
      this.close();
    }
  },
  beforeDestroy() {
    //销毁监控
    // this.disAutorun();
  }
};
</script>

<style scoped>
 
</style>