<template>
  <div
    ref="xbsjmodelbox"
    class="xbsj-model-box"
    :class="{'xbsj-model-box-close':collapsed}"
    :style="windowstyle"
    @click="showclick"
  >
    <i @mousedown="startResize($event)" ref="barbr" class="bar" :class="{'hidden':collapsed}"></i>
    <!-- 标题 -->
    <div class="xbsj-model-header" ref="xbsjmodelheader" @mousedown="startMove($event)">
      {{title}}
      <span
        class="xbsj-model-arrow"
        :class="{'closestatus':collapsed}"
        @click.stop="collapse"
      ></span>
      <span class="xbsj-model-close" @click.stop="cancel"></span>
    </div>
    <!-- 内容 -->
    <div
      class="xbsj-model-content"
      :class="{'xbsj-model-closetatus-body':collapsed,'xbsj-model-nofooter':footervisible}"
      ref="xbsjmodelbody"
      @contextmenu.prevent="contextMenu"
    >
      <div class="xbsj-model-content-box">
        <slot></slot>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="xbsj-model-footer" v-if="footervisible&&!collapsed">
      <button class="btn cancelBtn" v-if="showCancelButton" @click="cancel">{{compCancelText}}</button>
      <button class="btn confirmBtn" @click="ok">{{compOkText}}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    confirmtext: {
      type: String,
      default: ""
    },
    canceltext: {
      type: String,
      default: ""
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    left: {
      type: Number,
      default: 350
    },
    top: {
      type: Number,
      default: 200
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    minWidth: {
      type: Number,
      default: 100
    },
    minHeight: {
      type: Number,
      default: 100
    },
    footervisible: false,
    floatright: true,
    windowID: {
      type: String,
      default: ""
    },
    resized: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      langs: {
        zh: {
          ok: "确定",
          cancel: "取消"
        },
        en: {
          ok: "OK",
          cancel: "Cancel"
        }
      },
      collapsed: false,
      _width: 0,
      _height: 0,
      _left: 0,
      _top: 0,
      windowstyle: {}
    };
  },
  created() {
    // console.log(earth.czm.viewer.container)
    let earthUIWidth = this.$root.$earthUI._mainUI.clientWidth;
    this._width = this.width;
    this._height = this.height;
    if (this.floatright) {
      this._left = earthUIWidth - this.width;
    } else {
      this._left = this.left;
    }

    this._top = this.top;

    this.updateStyle();
  },
  computed: {
    compCancelText: function() {
      if (this.canceltext == "") {
        return this.lang.cancel;
      }
      return this.canceltext;
    },
    compOkText: function() {
      if (this.confirmtext == "") {
        return this.lang.ok;
      }
      return this.confirmtext;
    }
  },
  mounted() {},
  methods: {
    contextMenu() {
      this.$emit("contextMenu");
    },
    updateStyle() {
      this.windowstyle = {
        width: this._width + "px",
        height: this._height + "px",
        top: this._top + "px",
        left: this._left + "px"
      };
    },
    collapse() {
      this.collapsed = !this.collapsed;
      this.$parent.refShow = !this.$parent.refShow;
    },
    cancel() {
      this.$emit("cancel");
    },
    ok() {
      this.$emit("ok");
    },
    showclick() {
      this.$emit("showclick");
    },
    startMove(e) {
      e = e || event;

      if (e.target != this.$refs.xbsjmodelheader) return;
      //记录鼠标所在位置
      var navheight = this.$root.$refs.mainUI.$refs.mainBarControl.$el
        .clientHeight;

      var maxWidth = this.$root.$el.clientWidth;
      var maxHeight = this.$root.$el.clientHeight;

      var box = this.$refs.xbsjmodelbox;

      var disx = e.pageX - box.offsetLeft;
      var disy = e.pageY - box.offsetTop;

      this.$root.$refs.mainUI.topWindow(this);
      var self = this;

      var headerHeight = this.$refs.xbsjmodelheader.clientHeight;

      function move(e) {
        var e = e || event;
        e.stopPropagation();
        //计算当前鼠标位置
        let left = e.pageX - disx;
        let top = e.pageY - disy;
        if (left > 0 && left <= maxWidth - self._width) {
          self._left = left;
        } else if (left <= 0 && self._left < left) {
          self._left = left;
        } else if (left > maxWidth - self._width && self._left > left) {
          self._left = left;
        }

        if (
          top > navheight &&
          top <= maxHeight - (self.collapsed ? headerHeight : self._height)
        ) {
          self._top = top;
        } else if (top <= navheight && self._top < top) {
          self._top = top;
        } else if (
          top > maxHeight - (self.collapsed ? headerHeight : self._height) &&
          self._top > top
        ) {
          self._top = top;
        }

        self.updateStyle();
      }

      var conbox = this.$root.$refs.mainUI.$el;

      function up() {
        conbox.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }

      conbox.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    startResize(e) {
      e = e || event;

      //记录鼠标所在位置
      var navheight = this.$root.$refs.mainUI.$refs.mainBarControl.$el
        .clientHeight;
      var maxWidth = this.$root.$el.clientWidth - this._left;
      var maxHeight = this.$root.$el.clientHeight - this._top;

      this.$root.$refs.mainUI.topWindow(this);

      var self = this;

      function move(e) {
        var e = e || event;
        e.stopPropagation();
        //计算当前鼠标位置和全局点击位置的偏插值，尝试修改宽度和高度
        let w = e.movementX + self._width;
        let h = e.movementY + self._height;

        if (w >= self.minWidth && w <= maxWidth) {
          self._width = w;
        }

        if (h >= self.minHeight && h <= maxHeight) {
          self._height = h;
        }
        self.updateStyle();
      }

      var conbox = this.$root.$refs.mainUI.$el;

      function up() {
        if (self.resized) {
          self.resized();
        }
        conbox.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }

      conbox.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    }
  }
};
</script>

<style>
.xbsj-model-box {
  position: absolute;
  background: rgba(71, 71, 71, 0.8);
  top: 200px;
  left: 200px;
  border-radius: 3px;
  overflow: hidden;
  z-index: 9;
}
.xbsj-model-content {
  /* overflow-x: auto;
  overflow-y: auto; */
  position: relative;
  padding: 5px;
  text-align: left;
  width: calc(100% - 10px);
  transition: all 0.5s linear;
  height: calc(100% - 40px);
}
.xbsj-model-content-box {
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 10px);
}
.xbsj-model-nofooter {
  height: calc(100% - 82px);
}
.xbsj-model-content p {
  color: #1fffff;
}
.xbsj-model-header {
  cursor: all-scroll;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  top: 0;
  left: 0;
  min-height: 40px;
  line-height: 40px;
  border-bottom: 4px solid rgba(0, 0, 0, 0.4);
  color: #dddddd;
  font-size: 14px;
  font-family: \5fae\8f6f\96c5\9ed1;
  padding: 0 31px 0 18px;
  text-align: left;
  user-select: none;
}
.xbsj-model-close {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -6.5px;
  right: 20px;
  width: 13px;
  height: 13px;
  line-height: 13px;
  background: url(../../../images/model_close.png) no-repeat;
  background-size: contain;
}
.xbsj-model-close:hover {
  background: url(../../../images/model_close_hover.png) no-repeat;
  background-size: contain;
}
.xbsj-model-arrow {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -5px;
  right: 50px;
  width: 16px;
  height: 12px;
  line-height: 12px;
  background: url(../../../images/model_arrow.png) no-repeat;
  background-size: contain;
  transition: all 0.5s linear;
}
.xbsj-model-arrow:hover {
  background: url(../../../images/model_arrow_hover.png) no-repeat;
  background-size: contain;
}
.xbsj-model-close:hover {
  color: #47f0ff;
}
.xbsj-model-footer {
  margin: 0;
  padding: 6px 0;
  text-align: right;
  border-top: 4px solid rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 0;
  width: 100%;
}
.btn {
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  padding: 2px 15px;
  border-radius: 3px;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
}
.xbsj-model-footer .cancelBtn:focus,
.xbsj-model-footer .cancelBtn:hover {
  color: #1fffff;
}
.xbsj-model-footer .confirmBtn:focus,
.xbsj-model-footer .confirmBtn:hover {
  color: #1fffff;
}
.xbsj-model-footer .confirm-btn .marginLeft {
  margin-left: 10px;
}
.cancelBtn {
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
}
.confirmBtn {
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  margin-right: 24px;
}
button + button {
  margin-left: 15px;
}

.xbsj-model-box .bar {
  position: absolute;
  z-index: 2;
}
.xbsj-model-box i.bart,
.xbsj-model-box i.barb {
  height: 4px;
  left: -1px;
  right: -1px;
  cursor: n-resize;
}
.xbsj-model-box i.bart {
  top: -1px;
}
.xbsj-model-box i.barb {
  bottom: -1px;
}
.xbsj-model-box i.barr,
.xbsj-model-box i.barl {
  width: 4px;
  top: -1px;
  bottom: -1px;
  cursor: e-resize;
}
.xbsj-model-box i.barl {
  left: -1px;
}
.xbsj-model-box i.barr {
  right: -1px;
}
.xbsj-model-box i.bar {
  width: 14px;
  height: 14px;
  cursor: nw-resize;
  bottom: -1px;
  right: -1px;
  /* background: rgba(221, 221, 221, 0.4); */
  background: url(../../../images/model_right_bottom.png) no-repeat;
  background-size: cover;
}
.xbsj-model-box .closestatus {
  transform: rotate(-180deg);
  -ms-transform: rotate(-180deg); /* IE 9 */
  -moz-transform: rotate(-180deg); /* Firefox */
  -webkit-transform: rotate(-180deg); /* Safari 和 Chrome */
  -o-transform: rotate(-180deg);
}
.xbsj-model-box .xbsj-model-closetatus-body {
  height: 0;
}
.xbsj-model-box-close {
  height: 40px !important;
}
.hidden {
  display: none;
}
</style>
