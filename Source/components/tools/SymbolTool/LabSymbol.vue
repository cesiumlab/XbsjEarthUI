<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :width="500"
    :height="500"
    :min-width="396"
    :left="500"
    :top="138"
    :title="lang.labtitle"
  >
    <div class="containbox" style="overflow-y: hidden;">
      <div class="leftbox" style="overflow-y: auto;">
        <XbsjVirtualTree ref="vtree" :tree="tree" @on-click="itemClick"></XbsjVirtualTree>
      </div>
      <div class="rightbox" style="overflow-y: auto;">
        <div>
          <ul>
            <li
              v-for="(symbol,index) in symbols"
              style="width:64px;height:76px;"
              @click="createGroundImage(symbol)"
              :key="index"
            >
              <div class="backimg">
                <img :src="symbol.thumbnail" class="itemimg" />
              </div>
              <div style="line-height:1;">
                <span
                  style="white-space: nowrap;font-size: 14px;line-height: 30px;padding: 0 5px; user-select:none;"
                  class="color-dddddd"
                >{{symbol.name}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { parse } from "path";
import languagejs from "./locale";
export default {
  data() {
    return {
      show: false,
      tree: [],
      symbols: [],
      currentSelectedTreeNode: null,
      langs: languagejs,
      lang: undefined,
      symbolGroupId: "cesiumlab_symbols",
      selected: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    createGroundImage(symbol) {
      if (this.symbol && this.symbol.isCreating) {
        // 新创建的，没确定之前，又选择了其他图标
        this.symbol.destroy();
      }
      this.symbol = XE.Core.XbsjObject.createObject(
        symbol.type,
        this.$root.$earth
      );
      var json = JSON.parse(symbol.content);
      if (json.czmObject) {
        json = json.czmObject;
      }
      this.symbol.xbsjFromJSON(json);
      this.symbol.isCreating = true;
      this.$root.$earthUI.showPropertyWindow(this.symbol);
      this.symbol.creating = true;
    },
    initSymbol(id) {
      var labServer = this.$root.$labServer;
      var self = this;
      labServer
        .getSymbol(id)
        .then(result => {
          if (result.status === "ok" && result.symbols.rows.length === 1) {
            var group = JSON.parse(result.symbols.rows[0].content);
            var treeRoot = self.initTreeNode(group);
            treeRoot.expand = true;
            self.tree = [treeRoot];
          }
        })
        .catch(err => {
          this.error = err;
        });
    },
    initTreeNode(node) {
      var self = this;
      var treeNode = {
        expand: false,
        title: node.name,
        children: [],
        content: node,
        isSelected: false
      };
      this.tree.push(treeNode);
      if (node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
          treeNode.children.push(self.initTreeNode(node.children[i]));
        }
      }
      return treeNode;
    },
    itemClick(item) {
      if (this.tree[0].title == item.item["title"]) {
        this.tree[0].isSelected = true;
      } else {
        this.tree[0].isSelected = false;
      }

      var treeroot = this.tree[0];

      function getChildren(parent) {
        var len = parent.children.length;
        if (len > 0) {
          for (var i = 0; i < len; i++) {
            if (parent.children[i].title == item.item["title"]) {
              parent.children[i].isSelected = true;
            } else {
              parent.children[i].isSelected = false;
            }
            getChildren(parent.children[i]);
          }
        }
      }
      getChildren(treeroot);

      if (item && item.item) {
        this.currentSelectedTreeNode = item.item;
      }
      if (
        this.currentSelectedTreeNode &&
        this.currentSelectedTreeNode.content.symbols.length > 0
      ) {
        var labServer = this.$root.$labServer;
        var self = this;
        var ids = this.currentSelectedTreeNode.content.symbols
          .join(",")
          .replace('"', "");
        labServer
          .getSymbols(ids)
          .then(result => {
            if (result.status === "ok") {
              self.symbols = result.symbols.rows;
            }
          })
          .catch(err => {
            this.error = err;
          });
      } else {
        this.symbols = [];
      }
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        // el.__vue__ && el.__vue__.focus();
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.initSymbol(this.symbolGroupId);
      }
    }
  }
};
</script>

<style scoped>
.backimg {
  height: 50px;
}
.itemimg {
  width: 48px;
  height: 48px;
  background: rgba(200, 200, 200, 0.5);
}
.containbox {
  display: flex;
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
  float: left;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 45%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
}
.rightbox {
  width: 55%;
  height: 100%;
  float: left;
}
.leftbox span {
  display: block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  padding-left: 10px;
}
.leftbox span:hover {
  background: rgba(0, 0, 0, 0.51);
}
</style>
