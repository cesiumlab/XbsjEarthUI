<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :height="500"
    :left="5"
    :top="138"
    :title="lang.title"
    @contextMenu="onContexMenu"
  >
    <!-- <p>Tzst Virtual Tree</p> -->
    <XbsjVirtualTree
      ref="vtree"
      :tree="tree"
      :canmove="canmove"
      :on-toggle-expand="toggleExpand"
      :on-toggle-checked="toggleChecked"
      @on-context-menu="contextMenu"
      @on-change-title="changeTitle"
      @on-click="itemClick"
      @on-double-click="itemDoubleClick"
      @on-item-move="moveItem"
      @on-item-drop="dropItem"
      @on-item-canmove="canMoveItem"
      style="font-size: 16px;"
    ></XbsjVirtualTree>
  </Window>
</template>

<script>
import { getCodeUrl, getCode } from './code';

function destroyVueNode(ivuNode, parent) {
  if (ivuNode._inner.disposer) {
    ivuNode._inner.disposer.basicPropDisposer &&
      ivuNode._inner.disposer.basicPropDisposer();
    ivuNode._inner.disposer.childrenInterceptDisposer &&
      ivuNode._inner.disposer.childrenInterceptDisposer();
  }

  ivuNode.children &&
    ivuNode.children.forEach(child => {
      destroyVueNode(child, ivuNode);
    });

  if (parent) {
    const index = parent.children.indexOf(ivuNode);
    if (~index) {
      parent.children.splice(index, 1);
    }
  }
}

let vueItemTotal = 0;

function createVueNode(xbsjSceneNode) {
  const ivuNode = {};
  ivuNode.id = vueItemTotal++;
  ivuNode._inner = Object.freeze({ sn: xbsjSceneNode, disposer: {} });
  ivuNode.title = xbsjSceneNode.title; // 是否有必要？
  ivuNode.isSelected = xbsjSceneNode.isSelected;
  ivuNode.checkStatus = xbsjSceneNode.checkStatus;
  if(xbsjSceneNode.czmObject){ //判断是否有type属性，用于展示树状结构图标
      ivuNode.type = xbsjSceneNode.czmObject.xbsjType;
  }else{
      ivuNode.type = 'ios-folder'
  }


  if (xbsjSceneNode instanceof XE.SceneTree.Group) {
    ivuNode.expand = xbsjSceneNode.expand;

    ivuNode.children = [];
    xbsjSceneNode.children &&
      xbsjSceneNode.children.forEach(child => {
        ivuNode.children.push(createVueNode(child));
      });
  } else if (xbsjSceneNode instanceof XE.SceneTree.Leaf) {
    ivuNode.expand = false;
  }

  // const titleXbsjEarth.mobxDisposer = reaction(
  //   () => xbsjSceneNode.title,
  //   title => (ivuNode.title = title)
  // );
  const basicPropDisposer = XE.MVVM.watch(() => {
    ivuNode.title = xbsjSceneNode.title;
    ivuNode.isSelected = xbsjSceneNode.isSelected;
    ivuNode.expand = !!xbsjSceneNode.expand;
    ivuNode.checkStatus = xbsjSceneNode.checkStatus;
  });
  ivuNode._inner.disposer.basicPropDisposer = basicPropDisposer;

  if (!!xbsjSceneNode.children) {
    const childrenInterceptDisposer = XE.MVVM.reaction.intercept(
      xbsjSceneNode.children,
      changed => {
        if (changed.type === "splice") {
          // changed.index;
          // changed.removedCount;
          // changed.added;
          const added = changed.added.map(e => createVueNode(e));
          const toDels = ivuNode.children.slice(
            changed.index,
            changed.index + changed.removedCount
          );
          toDels.forEach(e => destroyVueNode(e, ivuNode));
          ivuNode.children.splice(changed.index, 0, ...added);
        } else if (changed.type === "update") {
          // changed.index;
          // changed.newValue;
          destroyVueNode(ivuNode.children[changed.index], ivuNode);
          const newChild = createVueNode(changed.newValue);
          ivuNode.children.splice(changed.index, 0, newChild);
        }
        return changed;
      }
    );
    childrenInterceptDisposer &&
      (ivuNode._inner.disposer.childrenInterceptDisposer = childrenInterceptDisposer);
  }

  return ivuNode;
}

export default {
  data() {
    return {
      show: true,
      tree: [],
      canmove: true,   
      langs: {
        zh: {
          confirm: "确认删除图层?",
          delete: "删除",
          cut: "剪切",
          paste: "粘贴",
          rename: "重命名",
          locate: "定位",
          property: "属性",
          addFolder: "添加文件夹",
          style: "样式",
          moving: "拖拽移动", 
          newFolder: "新建文件夹",
          title: "图层管理"
        },
        en: {
          confirm: "confirm to delete the layer?",
          delete: "delete",
          cut: "cut",
          paste: "paste",
          rename: "rename",
          locate: "locate",
          property: "property",
          addFolder: "add folder",
          style: "style",
          moving: "drag", 
          newFolder: "new folder",
          title: "Layer Manager"
        }
      },
      lang: undefined
    };
  },
  created() {
    
  },
  mounted() {
    this.setSceneTree(this.$root.$earth.sceneTree);
  },
  methods: {
    onContexMenu() {
      const baseItems = [
        {
          text: this.lang.addFolder,
          keys: "",
          func: () => {
            const g0 = new XE.SceneTree.Group(this.$root.$earth);
            g0.title = this.lang.newFolder;
            const xbsjSceneTree = this.$root.$earth.sceneTree;
            xbsjSceneTree.root.children.push(g0);
          }
        }
      ];
      this.$root.$earthUI.contextMenu.pop(baseItems);
    },
    playClick() {
      this.playShow = !this.playShow;
    },
    cameraClick() {
      this.cameraShow = !this.cameraShow;
    },
    mouseClick() {
      this.mouseShow = !this.mouseShow;
    },
    rotationClick() {
      this.rotationShow = !this.rotationShow;
    },
    
    setSceneTree(sceneTree) {
      if (this._vueTree) {
        destroyVueNode(this._vueTree, undefined);
        this._vueTree = undefined;
        this._sceneTree = undefined;
        this.tree = [];
      }

      this._sceneTree = sceneTree;
      this._vueTree = createVueNode(this._sceneTree.root);
      this.tree = this._vueTree.children;
    },
    toggleExpand(treeItem) {
      treeItem._inner.sn.expand = !treeItem.expand;
    },
    toggleChecked(treeItem, checked) {
      treeItem._inner.sn.enabled = checked;
    },
    popContextMenu({ item, vueObject }) {
      //右键之后设置当前node
      item._inner.sn.isSelected = true;
      //console.log(this);
      const baseItems = [
        {
          text: this.lang.cut,
          keys: "",
          func: () => {
            this._currentSceneNode = item._inner.sn;
          }
        },
        {
          text: this.lang.delete,
          keys: "",
          func: () => {
            this.$root.$earthUI.confirm(this.lang.confirm, () => {
              const sn = item._inner.sn;
              const index = sn.parent.children.indexOf(sn);
              sn.parent.children.splice(index, 1);
            });
          }
        },
        {
          type: "divider"
        },
        {
          text: this.lang.rename,
          keys: "",
          border: true,
          func: () => {
            vueObject.titleEditable = true;
          }
        }, {
          text: '输出示例',
          keys: "",
          border: true,
          func: () => {
            const jsonObject = item._inner.sn.toJSON();
            const finalJsonObject = {
              sceneTree: {
                root: {
                  children: [jsonObject],
                }
              },
              // : this.$root.$earth.cam
            };
            const code = getCode(finalJsonObject);
            const url = getCodeUrl(code);
            // prompt('url', url); // 有问题
            window.open(url, '_blank'); 
          }
        }
      ];

      if (this._currentSceneNode) {
        baseItems.splice(1, 0, {
          text: this.lang.paste,
          keys: "",
          func: () => {
            const sn = item._inner.sn;
            if (this._currentSceneNode && sn !== this._currentSceneNode) {
              if (sn instanceof XE.SceneTree.Group) {
                this._currentSceneNode.moveTo(sn);
              } else {
                sn.parent &&
                  this._currentSceneNode.moveTo(
                    sn.parent,
                    sn.parent.children.indexOf(sn)
                  );
              }
            }
            this._currentSceneNode = undefined;
          }
        });
      }

      if (item.children) {
        // 如果存在children，说明是组节点
        baseItems.unshift(
          ...[
            {
              text: this.lang.addFolder,
              keys: "",
              func: () => {
                const sn = item._inner.sn;
                if (sn instanceof XE.SceneTree.Group) {
                  const g = new XE.SceneTree.Group(this.$root.$earth);
                  sn.children.push(g);
                }
              }
            },

            {
              type: "divider"
            }
          ]
        );
      } else {
        baseItems.unshift(
          ...[
            {
              text: this.lang.locate,
              keys: "",
              func: () => {
                const czmObject = item._inner.sn.czmObject;
                czmObject.flyTo();
              }
            },
            {
              type: "divider"
            }
          ]
        );

        //如果是tileset 那么增加几个属性   样式，移动，分层着色
        if (item._inner.sn.czmObject.xbsjType == "Tileset") {
          baseItems.push(
            ...[
              {
                type: "divider"
              },
              {
                text: this.lang.style,
                func: () => {
                  this.$root.$earthUI.showPropertyWindow(
                    item._inner.sn.czmObject,
                    {
                      component: "TilesetStyleEditor"
                    }
                  );
                }
              },
              {
                text: this.lang.moving,
                func: () => {
                  //显示移动编辑面板
                  item._inner.sn.czmObject.positionEditing = !item._inner
                    .sn.czmObject.positionEditing;
                  if (item._inner.sn.czmObject.positionEditing) {
                    item._inner.sn.czmObject.xbsjUseOriginTransform = false;
                  }
                }
              }  
            ]
          );
        }

        baseItems.push(
          ...[
            {
              type: "divider"
            },
            {
              text: this.lang.property,
              func: () => {
                // console.log(item._inner.sn.czmObject);
                this.$root.$earthUI.showPropertyWindow(
                  item._inner.sn.czmObject
                );
              }
            }
          ]
        );
      }
      this.$root.$earthUI.contextMenu.pop(baseItems);
    },
    contextMenu({ item, vueObject }) {
      this.popContextMenu({ item, vueObject });
    },
    changeTitle(options) {
      const treeItem = options.item;
      const newTitle = options.title;
      treeItem._inner.sn && (treeItem._inner.sn.title = newTitle);
    },
    itemDoubleClick({ item, vueObject }) {
      const czmObject = item._inner.sn.czmObject;
      if (czmObject) {
        czmObject.flyTo();

        let t = czmObject.xbsjType;
        //根据类型去显示界面
        if (t == "XbsjTileset")
          this.$root.$earthUI.controls.mainBar.showPage("model");
        else if (t == "XbsjImagery")
          this.$root.$earthUI.controls.mainBar.showPage("imagery");
        else if (t == "XbsjTerrain")
          this.$root.$earthUI.controls.mainBar.showPage("terrain");
      }
    },
    itemClick({ item, vueObject }) {
      // 会给双击带来问题， TODO(vtxf): 需要想办法处理！
      // item._inner.sn.isSelected = !item._inner.sn.isSelected;
      item._inner.sn.isSelected = true;
    },
    moveItem({ item, vueObject }) {
      //拖拽移动的时候保存当前拖动的item
      this.canmove = true;
      this._currentSceneNode = item._inner.sn;
    },
    canMoveItem({ item, vueObject }) {
      //判断放置目标是否是源目标的子节点
      const sn = item._inner.sn;
      if (this._currentSceneNode && sn !== this._currentSceneNode) {
        if (
          sn instanceof XE.SceneTree.Group ||
          !this._currentSceneNode.canMoveTo(sn.parent)
        ) {
          if (!this._currentSceneNode.canMoveTo(sn)) {
            this.canmove = false;
          } else {
            this.canmove = true;
          }
          // if (!this._currentSceneNode.canMoveTo(sn.parent)) {
          //   this.canmove = false;
          // }
        }
      }
    },
    dropItem({ item, vueObject }) {
      //放置源目标到放置目标位置
      const sn = item._inner.sn;
      if (this._currentSceneNode && sn !== this._currentSceneNode) {
        if (sn instanceof XE.SceneTree.Group) {
          this._currentSceneNode.moveTo(sn);
        } else {
          sn.parent &&
            this._currentSceneNode.moveTo(
              sn.parent,
              sn.parent.children.indexOf(sn)
            );
        }
      }
      this._currentSceneNode = undefined;
    }
  },
  computed: {
    progressStyle() {
      const { horizonAngle } = this;
      // console.log(horizonAngle);
      return {
        width: `${((Number(horizonAngle) - 1) * 100) / 178}%`,
        height: "4px"
      };
    },
    progressStyle2() {
      const { verticalAngle } = this;
      // console.log(verticalAngle);
      return {
        width: `${((Number(verticalAngle) - 1) * 100) / 178}%`,
        height: "4px"
      };
    }
  },
  beforeDestroy() {
    if (this.unbind) {
      this.unbind();
      this.unbind = undefined;
    }
  }
};
</script>

<style scoped>
</style>
