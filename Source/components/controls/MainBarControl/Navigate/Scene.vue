<template>
  <div class="xbsj-mainbar-popup popup">
    <div>
      <label>{{lang.sceneName}}:</label>
      <input class="inputstyle" v-model="sceneName" @keyup.enter="updateName" />
    </div>
    <div style="margin-top:10px;">
      <label>{{lang.thumbnail}}:</label>
      <XbsjCaptureThumbnail
        style="float:right;width: calc(100% - 55px);height: 96px;"
        :value="thumbnail"
        @changed="updateThumbNail"
      ></XbsjCaptureThumbnail>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          sceneName: "场景名称",
          thumbnail: "缩略图"
        },
        en: {
          sceneName: "Scene Name",
          thumbnail: "Thumb"
        }
      },
      lang: undefined,
      sceneName: "新建场景",
      sceneID: undefined,
      thumbnail: ""
    };
  },
  created() {
    
  },
  mounted() {},
  methods: {
    updateThumbNail(img) {
      this.$root.$earthUI.labScene.updateThumbNail(img);
    },
    updateName() {
      this.$root.$earthUI.labScene.updateName();
    }
  },

  beforeDestroy() {}
};
</script>
<style scoped>
.popup {
  width: 312px;
  height: 185px;
}
.inputstyle {
  height: 22px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.inputstyle:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
</style>

