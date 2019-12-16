<template>
  <Window
    :width="602"
    :minWidth="480"
    :height="664"
    :top="164"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div style="height: 100%;">
      <div style="text-align: center;">
        <div class="tab">
          <span @click="tabShow='1'">{{lang.firstpage}}</span>
          <span @click="tabShow='2'">{{lang.secondpage}}</span>
          <span @click="tabShow='3'">{{lang.secondpage}}</span>
        </div>
      </div>
      <div class="xbsj-flatten" v-show="tabShow == '1'">
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./locale";

export default {
  props: {
    getBind: Function
  },
  data () {
    return {
      ranges: true,
      lang: {},
      showPinSelect: false,
      pinshowPinSelect: false,
      tabShow: '1',
      makiIconObj: {},
      drag_over: false,
      dragShow: false,
      pin: {
        name: "",
        creating: true,
        enabled: true,
        editing: false,
        far: 100,
        near: 1,
        imageUrl: "",
        scale: 1,
        show: true,
        position: [0, 0, 0],
        pinBuilder: {},
        attachedPathGuid: "",
        origin: [0, 0],
        isDivImage: true,
        evalString: ""
      },

      langs: languagejs,
      pathGuidarr: [],
    };
  },
  created () { },
  mounted () {

  },
  computed: {
    name () {
      return this.pin.name;
    },
    guid () {
      return this.getBind().guid;
    },
    nearfar: {
      get () {
        return [0, 30];
      },
      set (newValue) {
        this.pin.near = Math.round(Math.pow(2, newValue[0]));
        this.pin.far = Math.round(Math.pow(2, newValue[1]));
      }
    }
  },
  watch: {
    nearfar (e) { },
    "pin.pinBuilder.text" (e) {
      if (e !== "") {
        this.pin.pinBuilder.makiIcon = "";
      }
    },

  },
  methods: {
    pinoptionssure (c) {
      this.pin.attachedPathGuid = c.guid;
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    pinselectinput () {
      this.pathGuidarr = [];
      let guidobj = {};
      this.pathGuidarr.push({ name: "空", guid: "" });
      this.$root.$earth.pathCollection.forEach(e => {
        guidobj.name = e.name;
        guidobj.guid = e.guid;
        this.pathGuidarr.push(guidobj);
      });
      if (this.pathGuidarr.length < 2) {
        this.$root.$earthUI.promptInfo(
          "There is no path in the current scenario",
          "warning"
        );
        return;
      }
      this.pinshowPinSelect = !this.pinshowPinSelect;
    },
    optionssure (c) {
      this.pin.pinBuilder.makiIcon = c;
      this.showPinSelect = !this.showPinSelect;
    },
    selectinput () {
      this.showPinSelect = !this.showPinSelect;
      // console.log(this.showSelect);
    },
    apply () {
      this._czmObj.evalString = this.pin.evalString;
    },
    close () {
      this.$parent.destroyTool(this);
    },
    cancel () {
      this.close();
      const pinToolObj = this._czmObj;
      if (!pinToolObj) {
        return;
      }
      pinToolObj.positionEditing = false;
      if (pinToolObj.isCreating) {
        pinToolObj.isCreating = false;
        pinToolObj.destroy();
      }
    },
    ok () {
      this.close();
      const pinToolObj = this._czmObj;
      pinToolObj.editing = false;
      if (!pinToolObj) {
        return;
      }
      pinToolObj.positionEditing = false;
      pinToolObj.twoPostionsEditing = false;
      if (pinToolObj.isCreating) {
        pinToolObj.isCreating = false;

        const sceneObject = new XE.SceneTree.Leaf(pinToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    },

    flyto (index) {
      this._czmObj.polygons[index].flyTo();
    },
    getCzmObjectFromDrag (dataTransfer) {
      for (let i = 0; i < dataTransfer.types.length; i++) {
        var t = dataTransfer.types[i];
        if (!t) continue;
        if (t.startsWith("_czmobj_")) {
          let guid = t.substring(8);

          return this.$root.$earth.getObject(guid);
        }
      }
      return undefined;
    },
    //拖拽移动上面
    dragOver (e) {
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        (czmObj.positions !== undefined || czmObj.position !== undefined)
      ) {
        e.dataTransfer.dropEffect = "copy";
        this.drag_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    dragLeave () {
      this.drag_over = false;
    },
    //拖拽放置
    drop (e) {
      this.drag_over = false;
      e.preventDefault();
      let czmObj = this.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        (czmObj.position !== undefined || czmObj.positions !== undefined)
      ) {
        if (czmObj.position !== undefined) {
          czmObj.position = [...this._czmObj.position];
        } else {
          czmObj.positions[0] = [...this._czmObj.position];
        }
        this.dragShow = true;
      }
    }
  },
  beforeDestroy () {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach(e => e());
    this._disposers.length = 0;
  }
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
  outline: none;
}
button:focus {
  outline: none !important;
}
.xbsj-flatten {
  min-width: 462px;
}
.xbsj-flatten > div {
  width: 100%;
  height: 28px;
  margin-top: 10px;
}
.xbsj-flatten label {
  float: left;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 100px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.xbsj-flatten .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.xbsj-flatten .attributePlay .playspan {
  display: inline-block;
  width: 17px;
  height: 20px;
  background: url(../../../images/play.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributePlay .suspendspan {
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(../../../images/suspend.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributeLocation input,
.xbsj-flatten .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-right: 6px;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.border {
  border: 1px solid black;
}
.select-ul {
  width: 80%;
  padding-left: 8px;
  margin-left: calc(10% + 23px);
  background: rgba(138, 138, 138, 1);
  z-index: 9999;
  position: relative;
}

.cutselectbox {
  width: calc(100% - 102px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 78px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}
.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  margin-right: 15px;
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 15px;
  top: 11px;
}
.flatten-box {
  display: flex;
  width: calc(100% - 100px);
  height: 28px;
}
.tab span {
  display: inline-block;
  min-width: 50px;
  height: 28px;
  line-height: 28px;
  background: rgba(0, 0, 0, 0.5);
  margin-right: 20px;
  cursor: pointer;
}
.tab span:hover {
  background: #000;
}
</style>