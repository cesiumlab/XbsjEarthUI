<template>
  <div class="xbsjselect">
    <div class="xbsjselect-selectdiv" @click="selectClick">
      <span class="xbsjselect-selectText">{{ f_title(currentValue)}}</span>
      <button class="xbsjselect-selectButton"></button>
    </div>
    <ul class="xbsjselect-selectOption" v-show="selectshow">
      <li v-for="(ct,index) in listdata" :key="index" @click="selectName(ct)">
        <span>{{ f_title(ct) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { addOutterEventListener } from "../../utils/xbsjUtil";
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    value: "",
    title: {
      type: String,
      default() {
        return undefined;
      }
    }
  },
  data() {
    return {
      selectshow: false,
      currentValue: this.value
    };
  },
  mounted() {
    //添加一个外部事件，如果点击后隐藏
    addOutterEventListener(this.$el, "mousedown", () => {
      this.selectshow = false;
    });
  },
  filters: {},
  computed: {
    listdata() {
      return this.list;
    }
  },
  methods: {
    f_title(ct) {
      if (!ct) return "";
      return this.title ? ct[this.title] : ct;
    },
    selectClick() {
      this.selectshow = !this.selectshow;
    },
    selectName(value) {
      this.currentValue = value;
      this.selectshow = false;
      this.$emit("input", value);
    }
  },
  watch: {
    value(val, old) {
      this.currentValue = this.value;
    }
  }
};
</script>

<style scoped>
.xbsjselect {
  position: relative;
  width: 100%;
}
.xbsjselect-selectdiv {
  display: inline-block;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  height: 28px;
  position: relative;
  text-align: left;
  line-height: 28px;
  cursor: pointer;
  padding-left: 13px;
  left: -2px;
  top: 2px;
  border-radius: 3px;
}
.xbsjselect-selectText {
  font-size: 12px;
}
.xbsjselect-selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  outline: none;
}
.xbsjselect-selectOption {
  width: calc(100% + 13px);
  height: auto;
  min-height: 80px;
  background: rgba(138, 138, 138, 1);
  border-radius: 0px 0px 4px 4px;
  list-style: none;
  overflow: auto;
  z-index: 1;
  position: absolute;
  /* padding-left: 13px; */
  margin-left: -2px;
}

.xbsjselect-selectOption li {
  width: 100%;
  height: 25px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  line-height: 25px;
  cursor: pointer;
}
.xbsjselect-selectOption li span {
  display: inline-block;
  height: 25px;
  position: relative;
  left: 11px;
}
.xbsjselect-selectOption li:hover {
  background: rgba(107, 107, 107, 1);
}
</style>