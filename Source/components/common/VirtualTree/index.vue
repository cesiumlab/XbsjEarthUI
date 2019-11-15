<template>
  <div>
    <VirtualTreeItem
      v-for="(item, index) of items"
      :index="index"
      :item="item"
      :canmove="canmove"
      :checkBoxShow="checkBoxShow"
      :key="typeof item.id !== 'undefined' ? item.id : index"
      :onToggleExpand="toggleExpand"
      :onToggleChecked="toggleChecked"
      @on-context-menu="options => $emit('on-context-menu', options)"
      @on-change-title="options => $emit('on-change-title', options)"
      @on-click="options => $emit('on-click', options)"
      @on-double-click="options => $emit('on-double-click', options)"
      @on-item-move="options=>$emit('on-item-move',options)"
      @on-item-drop="options=>$emit('on-item-drop',options)"
      @on-item-canmove="options=>$emit('on-item-canmove',options)"
    ></VirtualTreeItem>
  </div>
</template>

<script>
import VirtualTreeItem from "./VirtualTreeItem.vue";

function flattenJsonObject(jsonObjectArray, parent, level, items) {
  jsonObjectArray.forEach(jsonObject => {
    jsonObject.level = level;
    jsonObject.parent = parent;
    items.push(jsonObject);

    if (jsonObject.expand && jsonObject.children) {
      flattenJsonObject(jsonObject.children, jsonObject, level + 1, items);
    }
  });
}

export default {
  components: { VirtualTreeItem },
  mounted() {
    this.updateData();
  },
  props: {
    onToggleExpand: {
      type: Function,
      default: treeItem => {
        treeItem.expand = !treeItem.expand;
      }
    },
    onToggleChecked: {
      type: Function,
      default: () => {}
    },
    tree: Array,
    canmove: Boolean,
    checkBoxShow: Boolean
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    toggleExpand(item) {
      this.onToggleExpand(item);
    },
    toggleChecked(item, checked) {
      this.onToggleChecked(item, checked);
    },
    itemIconTypeCallback(item) {
      return this.onItemIconTypeCallback(item);
    },
    updateData() {
      this.items.splice(0);
      flattenJsonObject(this.tree, undefined, 0, this.items);
    }
  },
  watch: {
    tree: {
      handler: function(val, oldVal) {
        this.updateData();
      },
      deep: true
    }
  }
};
</script>

<style>
.listWrap {
  position: relative;
}

/* .list-loading {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
} */

.list {
  color: #fff;
  /* background: #fff; */
  /* border-radius: 3px; */
  /* border: 1px solid #ddd; */
  /* -webkit-overflow-scrolling: touch; */
  /* overflow-scrolling: touch; */
}
</style>