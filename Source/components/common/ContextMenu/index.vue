<template>
  <div v-show="show" :style="position" class="menu-box">
    <slot name="above"></slot>
    <ul class="list-unstyled">
      <li
        v-for="(it,i) in items"
        :key="i"
        @click="click(it)"
        :style="{'itemborder':it.border}"
        :class="{'divideron':it.type=='divider'}"
      >
        <span v-if="it.type!=='divider'">{{it.text}}</span>
        <span v-if="it.type!=='divider'" style="float:right;display:block;">{{it.keys}}</span>
        <!-- <span v-if="it.type=='divider'" class="menu-divider"></span> -->
      </li>
    </ul>
    <slot name="below"></slot>
  </div>
</template>
<script>
import { addOutterEventListener } from "../../utils/xbsjUtil";
export default {
  data() {
    return {
      items: [],
      show: false,
      cursor: {
        x: 0,
        y: 0,
      },
      position: "left:0px;top:0px;",
    };
  },
  mounted() {
    /*
    //防止浏览器默认菜单
    document.body.oncontextmenu = () => {
      return false;
    };
    */

    let container = this.$root.$refs.mainUI.$el;
    let xbsjviewer = document.getElementsByClassName("xbsj-viewer")[0];

    //监控鼠标位置
    document.body.addEventListener("mousemove", (event) => {
      // let left = container.offsetLeft;
      // let top = container.offsetTop;
      let left = xbsjviewer.offsetLeft;
      let top = xbsjviewer.offsetTop;

      this.cursor = {
        x: event.clientX - left,
        y: event.clientY - top,
      };
    });

    //添加一个外部事件，如果点击后隐藏
    addOutterEventListener(this.$el, "mousedown", () => {
      this.show = false;
    });

    /*
    //这是一个测试
    document.body.addEventListener("mousedown", event => {
      this.pop([
        {
          text: "复制"
        },
        {
          type: "divider"
        },
        {
          text: "粘贴",
          func: () => {
            console.log(this.cursor.x);
          }
        }
      ]);
    });
    */
  },
  methods: {
    click(it) {
      if (typeof it.func === "function") {
        it.func();
      }
      this.show = false;
      this.items = [];
    },
    pop(items, x, y) {
      if (this.show) return;
      this.items = items;
      this.show = true;
      if (x == undefined) x = this.cursor.x;
      if (y == undefined) y = this.cursor.y;
      let bottom = 0;
      items.forEach((element) => {
        if (element.type === "divider") {
          bottom += 2;
        } else {
          bottom += 30;
        }
      });
      if (this.$parent.$el.clientHeight < y + bottom) {
        y = y - bottom;
      }
      if (this.$parent.$el.clientWidth < x + 150) {
        x = x - 150;
      }
      this.position = `left:${x}px; top:${y}px;`;
    },
    close() {
      if (!this.show) return;
      this.show = false;
      this.items = [];
    },
  },
  destroyed() {
    document.body.oncontextmenu = null;
  },
};
</script>

<style scoped>
.divideron:hover {
  /* background: none !important; */
}
.divideron {
  height: 2px !important;
  width: 100% !important;
  line-height: 2px !important;
  background: rgba(31, 255, 255, 0.6) !important;
}
.itemborder {
  border-top: 2px solid #6b6b6b;
}
.menu-divider {
  width: 100%;
  height: 2px;
  background: red;
}
.menu-box {
  border-top: 4px solid rgba(31, 255, 255, 0.6);
  width: 150px;
  /* padding: 5px 10px; */
  position: absolute;
  z-index: 10000;
  left: 100px;
  right: 100px;
  background: #474747;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.menu-box > ul {
  margin: auto;
}
.menu-box ul li {
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  padding: 0px 10px;
  box-sizing: border-box;
  list-style: none;
}
.menu-box ul li + li {
  /* border-top: 1px solid; */
}
.menu-box ul li:hover {
  background: #6b6b6b;
}
.menu-box ul li span {
  display: inline-block;
}
.menu-box ul li span:first-child {
  margin-right: 5px;
}
</style>