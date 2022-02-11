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
import VirtualTreeItem from './VirtualTreeItem.vue'

function flattenJsonObject(jsonObjectArray, parent, level, items) {
	jsonObjectArray.forEach(jsonObject => {
		jsonObject.level = level
		jsonObject.parent = parent
		items.push(jsonObject)

		if (jsonObject.expand && jsonObject.children) {
			flattenJsonObject(jsonObject.children, jsonObject, level + 1, items)
		}
	})
}

export default {
	components: { VirtualTreeItem },
	created() {},
	mounted() {
		this.updateData()
		this._styles = []
		this._testedUrl = []
		this.$root._colorConfig = []
		this.$root._visibleConfig = []

		// 映射到我们自己的函数里去
		this.$root.$earth.propertyStyle = new Cesium.Cesium3DTileStyle({
			color: {
				evaluateColor: (feature, result) => {
					return this.evaluateColor(feature, result)
				}
			},
			show: {
				evaluate: feature => {
					return this.evaluateShow(feature)
				}
			}
		})

		this._otherColor = new Cesium.Color(1, 200 / 255, 200 / 255, 0.2)
	},
	props: {
		onToggleExpand: {
			type: Function,
			default: treeItem => {
				treeItem.expand = !treeItem.expand
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
			items: [],
			modelTree: []
		}
	},
	methods: {
		toggleExpand(item) {
			this.onToggleExpand(item)
		},
		toggleChecked(item, checked) {
			this.onToggleChecked(item, checked)
		},
		itemIconTypeCallback(item) {
			return this.onItemIconTypeCallback(item)
		},
		updateData() {
			this.items.splice(0)
			flattenJsonObject(this.tree, undefined, 0, this.items)
		},

		// 增加模型结构树
		evaluateColor(feature, result) {
			if (!feature) return
			if (!feature.hasProperty('id')) return
			var fid = feature.getProperty('id')
			//获取tileset
			var tileset = feature.tileset.xbsjTileset
			if (!tileset) return

			//寻找这个tileset上绑定的
			var config = this.$root._colorConfig.find(f => f.tileset === tileset)

			if (!config) return

			//如果有那么返回白色
			if (config.id === fid) return

			//其他半透明
			return Cesium.Color.clone(this._otherColor, result)
		},
		evaluateShow(feature) {
			if (!feature) return true
			if (!feature.hasProperty('id')) return true
			var fid = feature.getProperty('id')
			//获取tileset
			var tileset = feature.tileset.xbsjTileset
			if (!tileset) return true

			//寻找这个tileset上绑定的配置
			var config = this.$root._visibleConfig.find(f => f.tileset === tileset)
			if (!config) return true

			//如果配置里包含，那么返回可见性
			if (config.visibleCach.hasOwnProperty(fid)) {
				return config.visibleCach[fid]
			}
			//否则返回可见
			return true
		}

		// modelTreeChecked(checked) {
		// 	this.modelItemChecked({ item: this.modelTree[0], checked })
		// },
	},
	watch: {
		tree: {
			handler: function(val, oldVal) {
				this.updateData()
			},
			deep: true
		}
	}
}
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