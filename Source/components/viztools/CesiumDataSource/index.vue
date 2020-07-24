<template>
  <Window
    :width="482"
    :minWidth="480"
    :height="218"
    :floatright="true"
    :title="title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten">
      <!-- 名称 -->
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="datasource.name" />
      </div>
      <div class="flatten">
        <label>{{lang.url}}</label>
        <input style="float:left;" type="text" v-model="datasource.url" />
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./index_locale";

export default {
  props: {
    getBind: Function,
  },
  data() {
    return {
      lang: {},
      title: "",
      datasource: {
        name: "",
        url: "",
      },
      langs: languagejs,
    };
  },
  created() {},
  mounted() {
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // console.log(czmObj);
    if (czmObj.xbsjType === "XbsjGeoJSON") {
      this.title = "GeoJSON";
    } else if (czmObj.xbsjType === "XbsjKML") {
      this.title = "KML";
    } else if (czmObj.xbsjType === "XbsjCzml") {
      this.title = "Czml";
    }
    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "datasource.name",
        url: "datasource.url",
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
    }
  },
  computed: {
    name() {
      return this.datasource.name;
    },
    guid() {
      return this.getBind().guid;
    },
  },
  methods: {
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const modelToolObj = this._czmObj;
      if (!modelToolObj) {
        return;
      }
      if (modelToolObj.isCreating && modelToolObj.isCreating === true) {
        modelToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const modelToolObj = this._czmObj;
      if (!modelToolObj) {
        return;
      }
      if (modelToolObj.isCreating && modelToolObj.isCreating === true) {
        modelToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(modelToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    },
  },
  beforeDestroy() {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach((e) => e());
    this._disposers.length = 0;
  },
};
</script>

<style scoped>
.flatten-flex {
  display: flex;
}

button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
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
  min-width: 60px;
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
</style>
