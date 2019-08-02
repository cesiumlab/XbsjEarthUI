<template>
  <div v-if="visible">
    <div class="xbsj-modal-mask">
      <div
        ref="xbsjmodalbox"
        id="xbsjmodalbox"
        class="xbsj-modal-box"
        :class="{'xbsj-modal-box-close':drow}"
        :style="modelstyle"
      >
        <div class="xbsj-modal-header" ref="xbsjmodalheader">
          {{lang.title}}
          <span class="xbsj-modal-close" @click="cancel"></span>
        </div>
        <!-- 内容 -->
        <div
          class="xbsj-modal-content"
          :class="{'xbsj-modal-nofooter':footervisible}"
          ref="xbsjmodelbody"
        >
          <slot></slot>
        </div>
        <!-- 底部按钮 -->
        <div class="xbsj-modal-footer">
          <button class="btn cancelBtn" @click="cancel" @keyup.enter="cancel">{{compCancelText}}</button>
          <button class="btn confirmBtn" @click="confirm">{{compOkText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "提示"
    },
    visible: {
      type: Boolean,
      default: false
    },
    maskvisible: {
      type: Boolean,
      default: false
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
    modelwidth: {
      type: Number,
      default: 500
    },
    modelheight: {
      type: Number,
      default: 200
    },
    footervisible: true
  },
  data() {
    return {
      langs: {
        zh: {
          title: "提示",
          ok: "确定",
          cancel: "取消"
        },
        en: {
          title: "Infomation",
          ok: "OK",
          cancel: "Cancel"
        }
      },
      positionX: 0,
      positionY: 0,
      modelstyle: {
        width: this.modelwidth + "px"
      },
      drow: false,
      nowwidth: Number,
      nowheight: Number
    };
  },
  created() {},
  updated() {
    let self = this;
    document.addEventListener("keyup", this.keycon);
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
  methods: {
    keycon(e) {
      if (e.keyCode == 27) {
        this.cancel();
      }
    },
    drowarrow() {
      this.drow = !this.drow;
    },
    cancel() {
      this.$emit("cancel");
      document.removeEventListener("keyup", this.keycon);
    },
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>

<style>
/* .modal{
  background: rgba(0, 0, 0, 0.5) !important;
} */
.xbsj-modal-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, 0.6);
  height: 100%;
  z-index: 10001;
}
.xbsj-modal-box {
  position: absolute;
  background: rgba(71, 71, 71, 0.8);
  top: 50%;
  left: 50%;
  border-radius: 3px;
  transform: translate(-50%, -50%);
  height: auto;
}
.xbsj-modal-content {
  position: relative;
  padding: 20px;
  text-align: left;
  width: 100%;
  color: #dddddd;
}
.xbsj-modal-content p {
  color: #dddddd;
}
.xbsj-modal-header {
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  top: 0;
  left: 0;
  height: 40px;
  line-height: 40px;
  border-bottom: 4px solid rgba(0, 0, 0, 0.4);
  color: #dddddd;
  font-size: 14px;
  font-family: \5fae\8f6f\96c5\9ed1;
  padding: 0 31px 0 18px;
  text-align: left;
  user-select: none;
}
.xbsj-modal-close {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background: url(../../../images/model_close.png) no-repeat;
}
.xbsj-modal-arrow {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -5px;
  right: 50px;
  width: 21px;
  height: 12px;
  line-height: 16px;
  background: url(../../../images/model_arrow.png) no-repeat;
  background-size: contain;
  transition: all 0.5s linear;
}
.xbsj-modal-close:hover {
  color: #47f0ff;
}
.xbsj-modal-footer {
  margin: 0;
  padding: 6px 0;
  text-align: right;
  border-top: 4px solid rgba(0, 0, 0, 0.4);
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
.xbsj-modal-footer .cancelBtn:focus,
.xbsj-modal-footer .cancelBtn:hover {
  color: #1fffff;
}
.xbsj-modal-footer .confirmBtn:focus,
.xbsj-modal-footer .confirmBtn:hover {
  color: #1fffff;
}
.xbsj-modal-footer .confirm-btn .marginLeft {
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

.xbsj-modal-box .bar {
  position: absolute;
  z-index: 2;
}
.xbsj-modal-box i.bart,
.xbsj-modal-box i.barb {
  height: 4px;
  left: -1px;
  right: -1px;
  cursor: n-resize;
}
.xbsj-modal-box i.bart {
  top: -1px;
}
.xbsj-modal-box i.barb {
  bottom: -1px;
}
.xbsj-modal-box i.barr,
.xbsj-modal-box i.barl {
  width: 4px;
  top: -1px;
  bottom: -1px;
  cursor: e-resize;
}
.xbsj-modal-box i.barl {
  left: -1px;
}
.xbsj-modal-box i.barr {
  right: -1px;
}
.xbsj-modal-box i.bar {
  width: 14px;
  height: 14px;
  cursor: nw-resize;
  bottom: -1px;
  right: -1px;
  /* background: rgba(221, 221, 221, 0.4); */
  background: url(../../../images/model_right_bottom.png) no-repeat;
  background-size: cover;
}
.xbsj-modal-box .closestatus {
  transform: rotate(-180deg);
  -ms-transform: rotate(-180deg); /* IE 9 */
  -moz-transform: rotate(-180deg); /* Firefox */
  -webkit-transform: rotate(-180deg); /* Safari 和 Chrome */
  -o-transform: rotate(-180deg);
}
.xbsj-modal-box .xbsj-modal-closetatus-body {
  height: 0;
}
.xbsj-modal-box-close {
  height: 40px !important;
}
.hidden {
  display: none;
}
</style>
