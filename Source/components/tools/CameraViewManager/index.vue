<template>
  <Window
    :title="lang.title"
    :width="450"
    :height="300"
    @cancel="show=false"
    v-show="show"
    :footervisible="false"
  >
    <div class="xbsj-custom-top">
      <ul class="xbsj-custom-ul">
        <li>
          <button
            @click="multiSelect"
            class="xbsj-custom-select"
            :class="canMultiSelected ? 'xbsj-custom-select' : 'xbsj-custom-cancelselect'"
          ></button>
        </li>
        <li>
          <button class="xbsj-custom-setdefault" @click="setDefault" :disabled="selected.length!=1"></button>
        </li>
        <li>
          <button class="xbsj-custom-edit" @click="edit" :disabled="selected.length!=1"></button>
        </li>
        <li>
          <button class="xbsj-custom-delete" @click="del" :disabled="selected.length==0"></button>
        </li>
        <li>
          <button class="xbsj-custom-add" @click="add"></button>
        </li>
      </ul>
    </div>
    <!-- <div class="xbsj-custom-middle"></div> -->
    <div class="xbsj-foot">
      <ul class="xbsj-foot-ul" :key="index" v-for="(item,index) in items">
        <li @click="clickItem(index,$event)" @mousedown="movetreeitem(index,$event)">
          <span class="xbsj-default" v-if="defaultIndex == index"></span>
          <img
            :src="item.thumbnail"
            class="xbsj-cameraview-img"
            @contextmenu.prevent="onContexMenu(index, $event)"
          />
        </li>
        <li>
          <label class="xbsj-check">
            <input type="checkbox" :value="index" v-model="selected" v-if="canMultiSelected" />
            {{item.name}}
          </label>
        </li>
      </ul>
    </div>
  </Window>
</template>
<script>
import languagejs from "./locale";
export default {
  data () {
    return {
      show: true,
      confirmInfo: "",
      defaultIndex: -1,
      items: [],
      selected: [],
      lang: {},
      canMultiSelected: false,
      langs: languagejs
    };
  },
  created () { },
  mounted () {
    this.cvm = this.$root.$earth.cameraViewManager;

    this.autorunDisposer = XE.MVVM.watch(() => {
      this.getData(this.$root.$earth.cameraViewManager.views);
    });

    this.getData(this.$root.$earth.cameraViewManager.views);
  },
  methods: {
    movetreeitem (index,$event) {
      let self = this;
      let source = $event.target;
      // 按下鼠标键并开始移动鼠标时，会在被拖放的元素上触发dragstart事件。
      // 此时光标变成“不能放”符号(圆环中有一条反斜线)，表示不能把元素放到自己上面
      source.addEventListener(
        "dragstart",
        function (event) {
          try {
            event.dataTransfer.setData(
              "_view",
              index
              // this.$root.$earth.cameraViewManager.views[parseInt(index)].toJSON()
            ); //兼容火狐浏览器，拖动时候必须携带数据否则没效果
          } catch (e) { }
        },
        false
      );
    },
    fromView (view) {
      return {
        name: view.name,
        duration: view.duration,
        thumbnail: view.thumbnail,
        status: view.toReadable
      };
    },

    getData (views) {
      this.items = [];
      views.map(view => {
        this.items.push(this.fromView(view));
      });

      this.defaultIndex = this.cvm.defaultViewIndex;
    },
    clickItem (index) {
      try {
        let views = this.cvm.views;
        views[index].flyTo();
      } catch (ex) {
        console.log(ex);
      }
    },
    onContexMenu (index, event) {
      //弹出右键菜单

      const menus = [
        {
          text: this.lang.location,
          keys: "",
          func: () => {
            this.clickItem(index);
          }
        },
        {
          text: this.lang.default,
          keys: "",
          func: () => {
            this.cvm.defaultViewIndex = index;
          }
        },
        {
          text: this.lang.deltip,
          keys: "",
          func: () => {
            this.$root.$earthUI.confirm(this.lang.conformdelete, () => {
              let views = this.cvm.views;
              //删除确认
              views.splice(index, 1);
            });
          }
        },
        {
          text: this.lang.attribute,
          keys: "",
          func: () => {
            this._edit(index);
          }
        }
      ];

      this.$root.$earthUI.contextMenu.pop(menus);
    },
    multiSelect () {
      this.canMultiSelected = !this.canMultiSelected;
      this.selected = [];
    },
    setDefault () {
      if (this.selected.length == 1) {
        this.cvm.defaultViewIndex = this.selected[0];
      }
    },
    _edit (index) {
      //弹出待修改的对象
      let view = this.cvm.views[index];

      this.$root.$earthUI.showPropertyWindow(view, {
        component: "CameraViewPrp"
      });
    },
    edit () {
      if (this.selected.length == 1) {
        this._edit(this.selected[0]);
      }
    },
    del () {
      //弹出确认
      this.$root.$earthUI.confirm(this.lang.delcontent, () => {
        //按从大到小排序
        this.selected.sort((a, b) => {
          return b - a;
        });
        //删除所有选中的
        let views = this.cvm.views;
        for (let i = 0; i < this.selected.length; i++) {
          let idx = this.selected[i];
          views.splice(idx, 1);
        }
        this.selected = [];
        this.canMultiSelected = false;
      });
    },
    add () {
      //直接增加
      this.cvm
        .newView()
        .then(view => {
          view.name = this.lang.newview;
          this.cvm.views.push(view);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {},
  beforeDestroy () {
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
    if (this.autorunDisposer) {
      this.autorunDisposer();
      this.autorunDisposer = undefined;
    }
  }
};
</script>
<style scoped>
.xbsj-cameraview-img {
  margin: 3px;
  border-radius: 10px;
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: absolute;
}
.popup {
  min-height: 200px;
}
.xbsj-custom-result {
  width: 330px;
  min-height: 273px;
  background: rgba(71, 71, 71, 0.8);
  position: absolute;
  top: 137px;
  left: 138px;
  overflow: auto;
  /* border-radius: 0px 0px 4px 4px; */
}
.xbsj-custom-top {
  /* width: 340px; */
  height: 35px;
}
/* .xbsj-custom-middle {
  width: 340px;
  height: 4px;
  background: rgba(0, 0, 0, 1);
  opacity: 0.4;
} */
.xbsj-custom-ul {
  height: 35px;
  margin-right: 20px;
}
.xbsj-custom-ul li {
  float: right;
  list-style: none;
  width: 28px;
  height: 28px;
  margin-top: 3.5px;
  padding-left: 5px;
  cursor: pointer;
}
.xbsj-custom-add {
  width: 20px;
  height: 20px;
  background: url(../../../images/add.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-left: -1px;
  cursor: pointer;
}
.xbsj-custom-add:hover {
  background: url(../../../images/add_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-custom-delete {
  width: 20px;
  height: 20px;
  background: url(../../../images/delete.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-right: 4px;
  cursor: pointer;
}
.xbsj-custom-delete:hover {
  background: url(../../../images/delete_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-custom-delete:disabled {
  background: url(../../../images/delete.png) no-repeat;
  background-size: contain;
  cursor: not-allowed;
}

.xbsj-custom-edit {
  width: 20px;
  height: 20px;
  background: url(../../../images/edit.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-right: 4px;
  cursor: pointer;
}
.xbsj-custom-edit:hover {
  background: url(../../../images/edit_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-custom-edit:disabled {
  background: url(../../../images/edit_disabled.png) no-repeat;
  background-size: contain;
  cursor: not-allowed;
}
.xbsj-custom-setdefault {
  width: 20px;
  height: 20px;
  background: url(../../../images/setdefault.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-left: -1px;
  cursor: pointer;
}
.xbsj-custom-setdefault:hover {
  background: url(../../../images/setdefault_on.png) no-repeat;
  background-size: contain;
  cursor: pointer;
}
.xbsj-custom-setdefault:disabled {
  background: url(../../../images/setdefault_disabled.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  cursor: not-allowed;
}
.xbsj-custom-select {
  width: 20px;
  height: 20px;
  background: url(../../../images/select.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-left: -1px;
  cursor: pointer;
  outline: none;
}
.xbsj-custom-cancelselect {
  width: 20px;
  height: 20px;
  background: url(../../../images/cancelselect.png) no-repeat;
  background-size: contain;
  border: none;
  margin-top: 4px;
  margin-left: -1px;
  cursor: pointer;
}
.xbsj-foot-ul {
  margin-top: 10px;
  margin-left: 9px;
  margin-right: 2px;
  width: 70px;
  height: 80px;
  float: left;
}
.xbsj-foot-ul li {
  list-style: none;
  float: left;
  width: 70px;
  height: 70px;
}
.xbsj-foot-ul li:nth-child(1) {
  position: relative;
  width: 70px;
  height: 70px;
  background: url(../../../images/custom-icon.png) no-repeat;
  background-size: contain;
  margin-top: 5px;
  /* margin-bottom: 23px; */
}
.xbsj-foot-ul li:nth-child(1):hover {
  background: url(../../../images/custom-icon_on.png) no-repeat;
  background-size: contain;
}
.xbsj-foot-ul li:nth-child(2) {
  display: inline-block;
  width: 70px;
  height: 20px;
  text-align: center;
  cursor: pointer;
}
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.xbsj-default {
  display: inline-block;
  width: 18px;
  height: 30px;
  background: url(../../../images/xbsj-default.png) no-repeat;
  position: absolute;
  left: 10px;
  display: block;
  z-index: 1;
}
.xbsj-shijiao {
  position: absolute;
  top: 74px;
  left: 13px;
}
/* .popup input[type="checkbox"] {
  width: 15px;
  height: 15px;
  background: rgba(0, 0, 0, 0.4);
  -webkit-appearance: none;
  outline: none;
  text-align: center;
  cursor: pointer;
}
.popup input[type="checkbox"]:checked::before {
  display: block;
  content: "\2714";
  text-align: center;
  color: #1fffff;
  cursor: pointer;
} */
.xbsj-check {
  cursor: pointer;
}
.xbsj-check input {
  display: inline-block;
  width: 15px;
  height: 15px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  background: url(../../../images/check.png) no-repeat top center;
  background-size: 100% 100%;
  cursor: pointer;
  vertical-align: middle;
}
.xbsj-check input:checked {
  position: relative;
  background: url(../../../images/check_on.png) no-repeat top center;
  background-size: 100% 100%;
}
.xbsj-check span {
  cursor: pointer;
}
.xbsj-custom-setdefault:focus,
.xbsj-custom-setdefault:active:focus,
.xbsj-custom-setdefault.active:focus,
.xbsj-custom-setdefault.focus,
.xbsj-custom-add:focus,
.xbsj-custom-add:active:focus,
.xbsj-custom-add.active:focus,
.xbsj-custom-add.focus,
.xbsj-custom-edit:focus,
.xbsj-custom-edit:active:focus,
.xbsj-custom-edit.active:focus,
.xbsj-custom-edit.focus,
.xbsj-custom-delete:focus,
.xbsj-custom-delete:active:focus,
.xbsj-custom-delete.active:focus,
.xbsj-custom-delete.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
}
.xbsj-model-content {
  padding: 5px 0;
}
.xbsj-custom-result .xbsj-model-content p {
  font-size: 14px;
}

.xbsj-foot {
  /* width: 339px; */
  height: calc(100% - 37px);
  overflow: auto;
}
</style>

