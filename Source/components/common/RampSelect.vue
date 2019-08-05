<template>
  <div class="container">
    <!-- <canvas class="srcimg" ref="srcimg"></canvas>-->

    <img :src="srcimg" ref="srcimg" class="srcimg" @load="updateItems" />

    <div class="current" @click="showlist=!showlist">
      <img v-if="selected" :src="selected.img" />
    </div>

    <div class="list" v-show="showlist">
      <div class="row" v-for="it in items" @click="select(it)">
        <img :src="it.img" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "image",
    event: "imageChanged"
  },
  props: {
    image: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      selected: null,
      showlist: false,
      items: [],
      srcimg: require("../../images/ramp/ramp.jpg")
    };
  },
  created() {},
  mounted() {},
  methods: {
    updateItems() {
      var src = this.$refs.srcimg;
      let height = 0;
      while (height + 10 < src.height) {
        var c = document.createElement("canvas");
        c.width = src.width;
        c.height = 10;

        var ctx = c.getContext("2d");
        ctx.drawImage(src, 0, height, src.width, 10, 0, 0, src.width, 10);

        this.items.push({
          img: c.toDataURL("image/jpg")
        });
        height += 16;
      }

      this.selected = this.items[0];
    },
    select(it) {
      this.selected = it;
      this.showlist = false;
      this.$emit("selected", it);
      this.$emit('imageChanged',it.image);
    }
  }
};
</script>
<style scoped>
.container {
  /* width: 282px; */
  height: 14px;
  position: relative;
  cursor: pointer;
}

.srcimg {
  display: none;
}

.current {
  line-height: 14px;
  width: 100%;
  height: 100%;
  border: 1px solid #1fffff;
  display: inline-block;
}
.list {
  position: absolute;
  margin-top: -3px;
  width: 100%;
  border-left: 1px solid #1fffff;
  border-right: 1px solid #1fffff;
  border-bottom: 1px solid #1fffff;
  overflow: auto;
  height: 100px;
  background-color: rgb(107, 107, 107);
}
.row {
  width: 100%;
  height: 12px;
  border-bottom: 1px solid gray;
}
</style>