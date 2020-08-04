<template>
  <!-- 编辑提示框 -->
  <Window
    :title="lang.title"
    :width="490"
    :minWidth="450"
    :height="400"
    :top="210"
    :left="590"
    @ok="ok"
    @cancel="cancel"
    :footervisible="true"
  >
    <div class="setting-box">
      <div class="setting-item">
        <label class="xbsj-label">{{lang.name}}</label>
        <input class="inputItem" type="text" v-model="editing.name" />
      </div>
      <div class="setting-item">
        <label class="xbsj-label">{{lang.flytime}}</label>
        <!-- <input class="inputItem" type="text" v-model.number="editing.duration" /> -->
        <div class="xbsj-slide-box">
          <XbsjSlider :min="0" :max="10" :step="0.1" showTip="always" v-model="editing.duration"></XbsjSlider>
        </div>
      </div>
    </div>
    <div class="suoluetu">
      <div class="suoluetu-div">
        <label class="xbsj-label">{{lang.thumbnail}}</label>
        <XbsjCaptureThumbnail
          style="margin-left: 10px;width: calc(100% - 81px);height: 97px;"
          v-model="editing.thumbnail"
        ></XbsjCaptureThumbnail>
      </div>
    </div>
    <div class="camera">
      <div class="camera-item">
        <label class="xbsj-label" style="margin-right: 5px;">{{lang.position}}</label>
        <XbsjLngLatHeight style="width: 100%;" v-model="editing.position"></XbsjLngLatHeight>
      </div>
      <div class="camera-item">
        <label class="xbsj-label" style="margin-right: 5px;">{{lang.rotation}}</label>
        <XbsjHeadingPitchRoll style="width: 100%;" v-model="editing.rotation"></XbsjHeadingPitchRoll>
      </div>

      <button class="curphoto" @click="currentCam">{{lang.curcamera}}</button>
    </div>
  </Window>
</template>

<script>
export default {
  props: {
    getBind: Function,
  },
  data() {
    return {
      langs: {
        zh: {
          title: "视角编辑器",
          name: "名称",
          flytime: "飞行时间",
          thumbnail: "缩略图",
          capture: "截屏",
          cameraparm: "相机参数",
          curcamera: "当前相机",
          position: "位置",
          rotation: "朝向",
        },
        en: {
          title: "Camvera View",
          name: "Name",
          flytime: "flytime",
          thumbnail: "thumbnail",
          capture: "Jieping",
          cameraparm: "Camera Param",
          curcamera: "Camera",
          position: "Position",
          rotation: "Rotation",
        },
      },
      lang: undefined,
      editing: {
        name: "",
        thumbnail: "",
        duration: 0.5,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    };
  },
  created() {
    // var lang = this.$root.language;
    // this.lang = this.langs[lang];
  },
  mounted() {
    //获取绑定的view
    let view = this.getBind();

    this.editing = this.fromView(view);
  },
  methods: {
    fromView(view) {
      return {
        name: view.name,
        duration: view.duration,
        thumbnail: view.thumbnail,
        position: [view.position[0], view.position[1], view.position[2]],
        rotation: [view.rotation[0], view.rotation[1], view.rotation[2]],
      };
    },
    ok() {
      //获取绑定的view
      let view = this.getBind();

      view.name = this.editing.name;
      view.thumbnail = this.editing.thumbnail;
      view.duration = this.editing.duration;
      //设置相机状态
      if (this.editingCamera) {
        view.position = this.editingCamera.position;
        view.rotation = this.editingCamera.rotation;
      }

      this.$parent.destroyTool(this);
    },
    cancel() {
      this.$parent.destroyTool(this);
    },
    currentCam() {
      var cvm = this.$root.$earth.cameraViewManager;

      //获取相机当前状态
      this.editingCamera = cvm.getCurrentCameraStatus();

      (this.editing.position = [
        this.editingCamera.position[0],
        this.editingCamera.position[1],
        this.editingCamera.position[2],
      ]),
        (this.editing.rotation = [
          this.editingCamera.rotation[0],
          this.editingCamera.rotation[1],
          this.editingCamera.rotation[2],
        ]);
    },
  },
};
</script>
<style scoped>
.inputItem {
  width: calc(100% - 85px);
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding: 0 6px;
}
.xbsj-label {
  display: inline-block;
  width: 52px;
  height: 28px;
  line-height: 28px;
  margin-left: 9px;
  text-align: right;
}
.suoluetu {
  margin-top: 10px;
  position: relative;
}
.inputPhoto {
  width: 220px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  margin-right: 3px;
  padding: 0 6px;
}
textarea {
  width: 220px;
  height: 68px;
  position: absolute;
  left: 54px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  padding: 5px;
  margin-left: 10px;
}
.curphoto {
  width: 70px;
  height: 28px;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  margin-left: 60px;
  margin-top: 20px;
}
.camera {
  position: relative;
  margin-top: 24px;
}
.suoluetu-div {
  display: flex;
  margin-top: 24px;
}
.suoluetu {
  margin-top: 10px;
  position: relative;
}
.inputPhoto {
  width: 220px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border: none;
  margin-right: 3px;
}
.photobtn {
  width: 70px;
  height: 28px;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  border-radius: 5px;
  cursor: pointer;
  margin-left: -2px;
}
.xbsj-cameraview-img {
  margin: 3px;
  border-radius: 10px;
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: absolute;
}
.camera-item {
  width: 100%;
  display: flex;
  margin-top: 10px;
}
.setting-box {
  display: flex;
  width: 100%;
  margin-top: 10px;
}
.setting-item {
  width: 50%;
}
.xbsj-slide-box {
  display: inline-block;
  width: 154px;
  vertical-align: middle;
  margin-left: 2px;
}
</style>

