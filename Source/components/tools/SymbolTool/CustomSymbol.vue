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
    :title="lang.customtitle"
  >
    <div class="containbox" style="overflow-y: hidden;">
      <div class="leftbox" style="overflow-y: auto;">
        <XbsjVirtualTree
          ref="vtree"
          :tree="tree"
          @on-click="itemClick"
          @on-context-menu="treeContextMenu"
          @on-change-title="changeTitle"
          :canmove="canmove"
          @on-item-move="moveItem"
          @on-item-drop="dropItem"
          @on-item-canmove="canMoveItem"
        ></XbsjVirtualTree>
      </div>
      <div class="rightbox" style="overflow-y: auto;">
        <div>
          <ul>
            <li
              v-for="(symbol,index) in symbols"
              style="width:64px;height:76px;"
              @click="createGroundImage(symbol)"
              :key="index"
              @mousedown="movetreeitem(symbol,$event)"
              @contextmenu.prevent="symbolsContextMenu(symbol, $event)"
            >
              <div class="backimg">
                <img :src="symbol.thumbnail" class="itemimg" />
              </div>
              <div style="line-height:1;">
                <span
                  v-if="!symbolNameEditable[symbol._id]"
                  style="white-space: nowrap;font-size: 14px;line-height: 30px;padding: 0 5px; user-select:none;"
                  class="color-dddddd"
                >{{symbol.name}}</span>
                <XbsjInput
                  v-else
                  v-focus
                  autofocus
                  ref="symbolNameEditor"
                  :value="symbol.name"
                  @on-enter="$event => (symbolChange(symbol, {name: $event.target.value}), symbolNameEditable[symbol._id] = false)"
                  placeholder="请输入..."
                  style="width: 70px"
                  @on-blur="$event => (symbolChange(symbol, {name: $event.target.value}), symbolNameEditable[symbol._id] = false)"
                ></XbsjInput>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import languagejs from "./locale";
import { parse } from "path";
export default {
  data () {
    return {
      canmove: true,
      show: false,
      tree: [],
      symbols: [],
      currentSelectedTreeNode: null,
      symbolNameEditable: {},
      langs: languagejs,
      lang: undefined,
      symbolGroupId: "custom_symbols",
      symbolContent: null,
    };
  },
  created () { },
  mounted () { },
  methods: {
    symbolsContextMenu (item, vueObject) {
      var self = this;
      var labServer = this.$root.$labServer;
      const baseItems = [
        {
          text: this.lang.rename,
          func: () => {
            self.symbolNameEditable[item._id] = true;
            self.$forceUpdate();
            // self.modifyingSymbol = item
            // self.modifyGroundImage(item)
          }
        },
        {
          text: this.lang.thumbnail,
          func: () => {
            self.$root.$earth
              .capture(64, 64)
              .then(img => {
                self.symbolChange(item, { thumbnail: img });
              })
              .catch(err => {
                console.log(err);
              });
          }
        },
        {
          text: this.lang.delete,
          func: () => {
            this.$root.$earthUI.confirm(this.lang.conformdelete, () => {
              const index = self.currentSelectedTreeNode.content.symbols.indexOf(
                item._id
              );
              self.currentSelectedTreeNode.content.symbols.splice(index, 1);

              const symbolIndex = self.symbols.indexOf(item);
              self.symbols.splice(symbolIndex, 1);
              self.updateSymbolGroup();
              self.deleteSymbol(item._id);
            });
          }
        }
      ];
      this.$root.$earthUI.contextMenu.pop(baseItems);
    },
    treeContextMenu ({ item, vueObject }) {
      var self = this;
      var labServer = this.$root.$labServer;
      const baseItems = [
        {
          text: this.lang.addGroup,
          func: () => {
            labServer
              .createGuid()
              .then(result => {
                if (result.status === "ok") {
                  var dataNode = {
                    _id: result.id,
                    name: self.lang.newGroup,
                    symbols: [],
                    children: []
                  };
                  var treeNode = {
                    id: result.id,
                    expand: true,
                    title: self.lang.newGroup,
                    children: [],
                    content: dataNode
                  };
                  item.children.push(treeNode);
                  item.content.children.push(dataNode);
                  self.updateSymbolGroup();
                }
              })
              .catch(err => {
                this.error = err;
              });
          }
        },
        {
          text: this.lang.rename,
          func: () => {
            vueObject.titleEditable = true;
          }
        },
        {
          text: this.lang.delete,
          func: () => {
            const index = item.parent.children.indexOf(item);
            item.parent.children.splice(index, 1);

            const indexContent = item.parent.content.children.indexOf(
              item.content
            );
            item.parent.content.children.splice(indexContent, 1);
            self.updateSymbolGroup();
          }
        }
      ];
      this.$root.$earthUI.contextMenu.pop(baseItems);
    },
    deleteSymbol (id) {
      this.$root.$labServer.deleteSymbol(id);
    },
    updateSymbolGroup () {
      var self = this;
      this.$root.$labServer
        .updateSymbolGroup(this.symbolContent)
        .then(result => { })
        .catch(err => {
          this.error = err;
        });
    },
    isChildren (parent, children) {
      if (parent.children === undefined || parent.children.length === 0) {
        return false;
      }
      var isChildren = parent.children.indexOf(children);
      if (isChildren < 0) {
        for (var i = 0; i < parent.children.length; i++) {
          if (this.isChildren(parent.children[i], children)) {
            break;
          }
        }
      }
      return isChildren >= 0;
    },
    movetreeitem (item, $event) {
      let self = this;
      let source = $event.currentTarget;
      // 按下鼠标键并开始移动鼠标时，会在被拖放的元素上触发dragstart事件。
      // 此时光标变成“不能放”符号(圆环中有一条反斜线)，表示不能把元素放到自己上面
      source.addEventListener(
        "dragstart",
        function (event) {
          event.dataTransfer.setData("obj", JSON.stringify(item)); //兼容火狐浏览器，拖动时候必须携带数据否则没效果
          self.moveItem({ item, vueObject: self, $event });
        },
        false
      );

      // 触发dragstart事件后，随即会触发drag事件，而且在元素被拖动期间会持续触发该事件
      source.addEventListener("drag", function (event) { }, false);

      // 当拖动停止时(无论是把元素放到了有效的放置目标，还是放到了无效的放置目标上)，会触发dragend事件
      source.addEventListener("dragend", function (event) { }, false);

      //只要有元素被拖动到放置目标上，触发dragenter事件
      source.addEventListener(
        "dragenter",
        function (event) {
          event.preventDefault();
          // self.moveItem({ item, vueObject: self, $event });
        },
        false
      );
      //被拖动的元素在放置目标的范围内移动时，持续触发dragover事件
      source.addEventListener(
        "dragover",
        function (event) {
          if (self.canmove) {
            event.preventDefault();
            self.xbsjitemover = true;
          }
        },
        false
      );

      // 如果元素被拖出了放置目标，触发dragleave事件
      source.addEventListener(
        "dragleave",
        function (event) {
          self.xbsjitemover = false;
          event.preventDefault();
        },
        false
      );

      // 如果元素被放到了放置目标中，触发drop事件
      source.addEventListener(
        "drop",
        function (event) {
          self.xbsjitemover = false;
          event.preventDefault();
        },
        false
      );
    },
    moveItem ({ item, vueObject }) {
      //拖拽移动的时候保存当前拖动的item
      this.canmove = true;
      this._currentDropNode = item;
      var sceneTree = this.$root.$refs.mainUI.$refs.sceneTreeTool[0];
      sceneTree._currentSceneNode = undefined;
    },
    canMoveItem ({ item, vueObject }) {
      //判断放置目标是否是源目标的子节点
      if (this._currentDropNode && item !== this._currentDropNode) {
        if (this.isChildren(this._currentDropNode, item)) {
          this.canmove = false;
        } else {
          this.canmove = true;
        }
      } else {
        this.canmove = false;
      }
    },
    dropItem ({ item, vueObject }) {
      //放置源目标到放置目标位置
      if (this._currentDropNode) {
        if (
          this._currentDropNode.type) {
          var index = this.currentSelectedTreeNode.content.symbols.indexOf(
            this._currentDropNode._id
          );
          this.currentSelectedTreeNode.content.symbols.splice(index, 1);
          vueObject.item.content.symbols.push(this._currentDropNode._id);
          var symbolsIndex = this.symbols.indexOf(this._currentDropNode);
          this.symbols.splice(symbolsIndex, 1);
          this.updateSymbolGroup();
        } else if (this._currentDropNode && item !== this._currentDropNode) {
          this._currentDropNode.parent &&
            this.moveToItem(this._currentDropNode, vueObject.item);
        }
      }
      this.$forceUpdate();
      this._currentDropNode = undefined;
    },
    moveToItem (srcItem, dstItem) {
      if (srcItem.parent) {
        if (srcItem.parent.content) {
          var contentIndex = srcItem.parent.content.children.indexOf(
            srcItem.content
          );
          srcItem.parent.content.children.splice(contentIndex, 1);

          var index = srcItem.parent.children.indexOf(srcItem);
          srcItem.parent.children.splice(index, 1);

          this.$nextTick(() => {
            dstItem.content.children.push(srcItem.content);
            dstItem.children.push(srcItem);
            this.updateSymbolGroup();
            dstItem.expand = true;
          });
        }
      }
    },
    changeTitle (options) {
      const treeItem = options.item;
      const newTitle = options.title;
      treeItem && (treeItem.title = newTitle);
      treeItem.content.name = newTitle;
      this.updateSymbolGroup();
    },
    createGroundImage (symbol) {
      if (this.symbol && this.symbol.isCreating) {
        // 新创建的，没确定之前，又选择了其他图标
        this.symbol.destroy();
      }
      this.symbol = XE.Core.XbsjObject.createObject(symbol.type, this.$root.$earth);
      var json = JSON.parse(symbol.content);
      if(json.czmObject){
        json = json.czmObject;
      }
      this.symbol.xbsjFromJSON(json);
      this.symbol.isCreating = true;

      // var czmObject = JSON.parse(symbol.content);
      // if (czmObject.czmObject) {
      //   czmObject = czmObject.czmObject;
      //   if (!czmObject.name) {
      //     czmObject.name = symbol.name;
      //   }
      // }
      // this.symbol.xbsjFromJSON(czmObject);
      this.$root.$earthUI.showPropertyWindow(this.symbol);
      this.symbol.creating = true;
      // window.symbol = this.symbol
    },
    symbolChange (item, options) {
      var self = this;
      this.$root.$labServer.updateSymbol(item._id, options).then(res => {
        self.itemClick({ item: self.currentSelectedTreeNode });
      });
    },
    initSymbol (id) {
      var labServer = this.$root.$labServer;
      var self = this;
      labServer
        .getSymbol(id)
        .then(result => {
          if (result.status === "ok" && result.symbols.rows.length === 1) {
            self.symbolContent = JSON.parse(result.symbols.rows[0].content);
            var treeRoot = self.initTreeNode(self.symbolContent);
            treeRoot.expand = true;
            self.tree = [treeRoot];
            // self.$forceUpdate()
          }
        })
        .catch(err => {
          this.error = err;
        });
    },
    initTreeNode (node) {
      var self = this;
      var treeNode = {
        expand: false,
        title: node.name,
        children: [],
        content: node
      };
      if (node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
          treeNode.children.push(self.initTreeNode(node.children[i]));
        }
      }
      return treeNode;
    },
    addSymbolToRoot (id) {
      if (this.symbolContent) {
        this.symbolContent.symbols.push(id);
      }
    },
    itemClick (item) {
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
      inserted: function (el) {
        // el.__vue__ && el.__vue__.focus();
      }
    }
  },
  watch: {
    show (val) {
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
