<template>
  <div class="xbsj-mainbar-popup popup">
    <div class="row">
      <label class="label">{{lang.sedai}}:</label>
      <XbsjRampSelect class="ramp" ref="ramp" @selected="selected"></XbsjRampSelect>
    </div>
  </div>
</template>
<script> 


export default {
  
  data() {
    return {
      langs: {
        zh: {
          sedai: "色带"
        },
        en: {
          sedai: "Legend"
        }
      },
      lang: undefined
    };
  },
  created() {
    
  },
  mounted() {
   
  },
  methods: {
    selected(it) {
      // console.log(it.img);
      this.$root.$earth.terrainEffect.aspect.image = it.img;
    }
  },
  watch: {}
};
</script>
<style scoped>
.popup {
  width: 347px;
  height: 128px;
}
.label {
  display: inline-block;
  width: 30px;
  text-align: right;
}
.ramp {
  display: inline-block;
}
.row {
  margin-bottom: 4px;
  margin-bottom: 4px;
}
.slider {
  padding-left: 4px;
  display: inline-block;
  width: 280px;
}
</style>

