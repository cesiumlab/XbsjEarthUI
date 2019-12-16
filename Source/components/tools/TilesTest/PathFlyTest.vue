<template>
  <div style="height: 100%;">
    <div class="flatten">
      <div style="position: relative;">
        <label>{{lang.pathAnimation}}</label>
        <input
          type="text"
          v-model="pin.attachedPathGuid"
          @click="pinselectinput"
          readonly
          style="cursor: pointer;"
        />
        <button class="selectButton"></button>
        <div class="cutselectbox" v-show="pinshowPinSelect" style="overflow:scroll;height:100px;">
          <div @click="pinoptionssure(c)" v-for="(c,index) in pathGuidarr" :key="index">
            <span>{{c.name}}</span>
          </div>
        </div>
      </div>
    </div>

    <ul class="flexul" :class="showContent ? 'contentUl' : ''">
      <li v-for="s in tiles" @click="select(s)" :key="s.url">
        <div :class="[{highlight:selected == s} ]" class="backimg">
          <img style="width:64px;height:64px;" :src="s.thumbnail" alt />
        </div>
        <div class="onlinTerrainName">
          {{s.cnname}}
          <span class="onlineTerrainToolTip">{{s.cnname}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import languagejs from "./locale";

export default {
  props: { result },
  data () {
    return {
      ranges: true,
      lang: {},
      showPinSelect: false,
      pinshowPinSelect: false,
      tabShow: '1',
      drag_over: false,
      dragShow: false,
      showContent: false,
      tiles: [],
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
.flexul {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 48px);
}
.contentUl {
  overflow-x: hidden;
  height: calc(100% - 104px);
}
.flexul li {
  list-style: none;
  /* float: left; */
  position: relative;
  height: 102px;
}
.backimg {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-radius: 4px;
  background: gray;
  margin: 5px;
}
</style>