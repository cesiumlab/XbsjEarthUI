<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :height="500"
    :left="800"
    :top="138"
    :title="lang.title"
  >
    <div class="header">
      <button class="xbsj-button" @click="restore">{{lang.restore}}</button>
    </div>
    <div class="treeContainer">
      <XbsjVirtualTree
        ref="vtree"
        :tree="tree"
        :on-toggle-checked="toggleChecked"
        @on-double-click="itemDoubleClick"
        :checkBoxShow="checkBoxShow"
      ></XbsjVirtualTree>
    </div>
  </Window>
</template>
<script>
let vueItemTotal = 0;
import axios from "axios";
export default {
  data() {
    return {
      show: true,
      tree: [],
      langs: {
        zh: {
          title: "模型结构树",
          restore: "恢复原始样式"
        },
        en: {
          title: "Model Scene",
          restore: "Restore Style"
        }
      },
      lang: undefined,
      checkBoxShow: true
    };
  },
  created() {
    this._styles = [];
    this._testedUrl = [];

    this._colorConfig = [];
    this._visibleConfig = [];
  },
  mounted() {
    //映射到我们自己的函数里去
    this.$root.$earth.propertyStyle = new Cesium.Cesium3DTileStyle({
      color: {
        evaluateColor: (feature, result) => {
          return this.evaluateColor(feature, result);
        }
      },
      show: {
        evaluate: feature => {
          return this.evaluateShow(feature);
        }
      }
    });

    this.unBinds = [];
    //监控场景中3dtiles变化，如果结构有变化 url改变？？
    //监控结构改变来创建整个结构
    this.unBinds.push(
      XE.MVVM.watch(() => {
        var co = this.$root.$earth.tilesetCollection;
        co.forEach(tileset => {
          //查找子tree，如果没有，那么新建一个子tree对象
          if (this.findTilesetTree(tileset) < 0) {
            this.createTilesetTree(tileset);
          }
        });

        //遍历所有tree，如果某个tree的guid不存在了，那么删除它
        var i = this.tree.length;
        while (i--) {
          var tree = this.tree[i];

          if (co.findIndex(t => tree.bind() === t) < 0) {
            this.tree.splice(i, 1);
          }
        }
      })
    );

    this._otherColor = new Cesium.Color(1, 200 / 255, 200 / 255, 0.2);
  },
  methods: {
    evaluateShow(feature) {
      if (!feature) return true;
      if (!feature.hasProperty("id")) return true;
      var fid = feature.getProperty("id");
      //获取tileset
      var tileset = feature.tileset.xbsjTileset;
      if (!tileset) return true;

      //寻找这个tileset上绑定的配置
      var config = this._visibleConfig.find(f => f.tileset === tileset);
      if (!config) return true;

      //如果配置里包含，那么返回可见性
      if (config.visibleCach.hasOwnProperty(fid)) {
        return config.visibleCach[fid];
      }
      //否则返回可见
      return true;
    },
    evaluateColor(feature, result) {
      if (!feature) return;
      if (!feature.hasProperty("id")) return;
      var fid = feature.getProperty("id");
      //获取tileset
      var tileset = feature.tileset.xbsjTileset;
      if (!tileset) return;

      //寻找这个tileset上绑定的
      var config = this._colorConfig.find(f => f.tileset === tileset);

      if (!config) return;

      //如果有那么返回白色
      if (config.id === fid) return;

      //其他半透明
      return Cesium.Color.clone(this._otherColor, result);
    },
    restore() {
      this._colorConfig.forEach(f => f.tileset._tileset.makeStyleDirty());
      this._colorConfig = [];
    },
    findTilesetTree(tileset) {
      return this.tree.findIndex(t => t.bind() == tileset);
    },
    createTilesetTree(tileset) {
      //先请求url
      if (tileset.url == "") return;

      //如果已经测试过url 那么也返回
      if (this._testedUrl.findIndex(url => url == tileset.url) >= 0) {
        return;
      }

      this._testedUrl.push(tileset.url);

      //监控tileset url 变化
      this.unBinds.push(
        XE.MVVM.watch(() => {
          var url = tileset.url;
          // console.log(tileset.url);
          //  console.log("loadSceneTree in auto run", url);
          //先移除
          this.removeTilesetTree(tileset);

          //再创建
          this.loadSceneTree(tileset);
        })
      );

      //监控名称变化
      this.unBinds.push(
        XE.MVVM.watch(() => {
          var name = tileset.name;
          var idx = this.findTilesetTree(tileset);
          if (idx >= 0) {
            this.tree[idx].name = name;
          }
        })
      );
    },
    getItemBindTileset(item) {
      if (!item) return undefined;
      if (typeof item.bind == "function") return item.bind();
      return this.getItemBindTileset(item.parent);
    },
    setElementVisible(item, visibleCach, visible) {
      if (!item) return;
      if (item.element) {
        var ele = item.element().t;
        if (!ele.children) {
          visibleCach[ele.id] = visible;
        }
      }
      //遍历item的所有子
      if (item.children) {
        item.children.forEach(si => {
          si.checkStatus = visible ? "checked" : "unchecked";
          this.setElementVisible(si, visibleCach, visible);
        });
      }
    },
    findStyle(tileset) {
      //更新挂接的tileset的 sytle
      var idx = this._styles.findIndex(s => s.bind() === tileset);
      var style;
      if (idx >= 0) {
        style = this._styles[idx];
      } else {
        style = {
          visibleCach: {},
          bind: () => {
            return tileset;
          }
        };
        this._styles.push(style);
      }

      return style;
    },
    getParentVisible(item) {
      if (!item) return true;
      if (item.checkStatus !== "checked") return false;

      //继续判定父
      return this.getParentVisible(item.parent);
    },
    toggleChecked(item, checked) {
      item.checkStatus = checked ? "checked" : "unchecked";

      var tileset = this.getItemBindTileset(item);
      if (!tileset) return;

      //递归item把它之下的所有 构件修改为false 或者 true 根据check
      var visible = checked;
      //需要去判定父的状态，如果有一个父节点是未选中的，那么visible还是false
      if (visible) {
        visible = this.getParentVisible(item.parent);
      }
      //寻找当前图层的配置
      var config = this._visibleConfig.find(f => f.tileset === tileset);
      if (!config) {
        config = {
          tileset: tileset,
          visibleCach: {}
        };
        this._visibleConfig.push(config);
      }
      this.setElementVisible(item, config.visibleCach, visible);

      tileset._tileset.makeStyleDirty();
    },

    locateElement(tileset, element) {
      var sphere = element.sphere;
      if (!sphere) return;
      if (sphere[3] <= 0) return;
      var center = new Cesium.Cartesian3(sphere[0], sphere[1], sphere[2]);

      //定位飞行
      try {
        //取到原始的transform矩阵的逆
        var srcMatInv = tileset._tileset._root.transform;
        srcMatInv = Cesium.Matrix4.inverse(srcMatInv, new Cesium.Matrix4());

        //渠道当前的transform

        var curMat = tileset._tileset.root.computedTransform;

        var mat = Cesium.Matrix4.multiply(
          curMat,
          srcMatInv,
          new Cesium.Matrix4()
        );

        center = Cesium.Matrix4.multiplyByPoint(
          mat,
          center,
          new Cesium.Cartesian3()
        );

        this.$root.$earth.czm.viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(center, sphere[3]),
          {
            duration: 0.5
          }
        );
      } catch (ex) {}

      //设置当前
      var config = this._colorConfig.find(t => t.tileset === tileset);
      if (!config) {
        this._colorConfig.push({
          tileset: tileset,
          id: element.id
        });
      } else {
        config.id = element.id;
      }
      //刷新样式
      tileset._tileset.makeStyleDirty();
    },
    itemDoubleClick(treeItem) {
      var item = treeItem.item;

      var element;
      if (item.element) {
        element = item.element();
      }
      if (!element || !element.t.sphere) {
        item.expand = !item.expand;
      } else {
        //取到构件去定位
        this.locateElement(element.tileset, element.t);
      }
    },
    removeTilesetTree(tileset) {
      var idx = this.findTilesetTree(tileset);
      if (idx >= 0) {
        this.tree.splice(idx, 1);
      }
    },
    createTrees(tileset, srcArr) {
      if (!srcArr) return undefined;
      var trees = [];

      srcArr.forEach(t => {
        var tree = {
          id: vueItemTotal++,
          title: t.name,
          expand: false,
          checkStatus: "checked",
          element: () => {
            return { tileset, t };
          }
        };

        tree.children = this.createTrees(tileset, t.children);

        trees.push(tree);
      });

      if (trees.length == 0) return undefined;

      return trees;
    },
    loadSceneTree(tileset) {
      var url = tileset.url;
      if (!url || url == "") return;

      //加载
      url = url.replace(/tileset.json/g, "scenetree.json");
      axios
        .get(url)
        .then(res => {
          //添加tree的所有子
          var children;
          if (res.data) {
            //bim处理结果
            if (res.data.children) {
              children = res.data.children;
            }
            //场景处理结果
            else if (res.data.scenes) {
              children = res.data.scenes;
            }
          }
          if (children) {
            var tree = {};
            tree.id = vueItemTotal++;
            tree.bind = () => {
              return tileset;
            };
            tree.title = tileset.name; // 是否有必要？
            tree.checkStatus = "checked";
            tree.expand = true;
            tree.children = this.createTrees(tileset, children);
            this.tree.push(tree);
          }
          this.$root.$earthUI.promptInfo(
            "load " + tileset.name + " scenetree.json success"
          );
        })
        .catch(err => {
          /*
          this.$root.$earthUI.promptInfo(
            "load  " + tileset.name + " scenetree.json failed:" + err.message ||
              err,
            "error"
          );*/
        });
    }
  },
  beforeDestroy() {
    this._unbinds.forEach(e => e());
    this._unbinds.length = 0;
  }
};
</script>
<style scoped>
.header {
  height: 30px;
}
.treeContainer {
  overflow: auto;
  width: calc(100%-10px);
  height: calc(100% - 30px);
}
</style>

