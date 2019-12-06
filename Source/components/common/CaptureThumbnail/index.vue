<template>
  <div class="captureThumbnail">
    <div class="left">
      <textarea v-model="image" @blur="inputed"></textarea>
    </div>
    <div class="right">
      <img :src="image" v-show="image" />
      <div class="noimg" v-show="!image">{{lang.noimg}}</div>
      <button class="addcapture" @click="capture">{{lang.capture}}</button>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "changed"
  },
  props: {
    value: String,
    default() {
      return "";
    }
  },
  data() {
    return {
      langs: {
        zh: {
          capture: "截图",
          noimg: "暂无缩略图"
        },
        en: {
          capture: "Capture",
          noimg: "No Thumb"
        }
      },
      lang: undefined,
      image: ""
    };
  },
  created() {},
  mounted() {
    this.image = this.value;
  },
  methods: {
    inputed() {
      this.$emit("changed", this.image);
    },
    capture() {
      //截图并发送
      this.$root.$earth
        .capture(64, 64)
        .then(img => {
          this.image = img;
          this.$emit("changed", this.image);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    value(v) {
      this.image = v;
    }
  }
};
</script>
<style scoped>
.captureThumbnail {
  display: flex;
}
.left {
  width: 100%;
}
.right {
  width: 70px;
  margin-left: 12px;
  position: relative;
}
img {
  width: 64px;
  height: 64px;
  border: 1px solid #000;
  border-radius: 5px;
}
textarea {
  resize: none;
  height: 90px;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  color: #dddddd;
}
textarea:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.noimg {
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 5px;
}
.addcapture {
  width: 64px;
  border: none;
  background: #000;
  border-radius: 5px;
  margin-top: 4px;
  color: #fff;
  height: 20px;
  line-height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
}
</style>

