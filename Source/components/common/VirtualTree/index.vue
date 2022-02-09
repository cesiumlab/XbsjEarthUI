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
            :modelTree="modelTree"
            @on-context-menu="options => $emit('on-context-menu', options)"
            @on-change-title="options => $emit('on-change-title', options)"
            @on-click="options => $emit('on-click', options)"
            @on-double-click="options => $emit('on-double-click', options)"
            @on-item-move="options=>$emit('on-item-move',options)"
            @on-item-drop="options=>$emit('on-item-drop',options)"
            @on-item-canmove="options=>$emit('on-item-canmove',options)"
            @model-item-checked="modelItemChecked"
            @model-tree-checked="modelTreeChecked"
            @model-double-click="modelDoubleClick"
            @load-model-Tree="loadModelTree"
        ></VirtualTreeItem>
    </div>
</template>

<script>
import VirtualTreeItem from './VirtualTreeItem.vue'
import axios from 'axios'
let vueItemTotal = 0
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
		},
		modelItemChecked(opitons) {
			var item = opitons.item
			var checked = opitons.checked
			item.checkStatus = checked ? 'checked' : 'unchecked'
			var tileset = this.getItemBindTileset(item)
			if (!tileset) return

			//递归item把它之下的所有 构件修改为false 或者 true 根据check
			var visible = checked
			//需要去判定父的状态，如果有一个父节点是未选中的，那么visible还是false
			if (visible) {
				visible = this.getParentVisible(item.parent)
			}
			//寻找当前图层的配置
			var config = this.$root._visibleConfig.find(f => f.tileset === tileset)
			if (!config) {
				config = {
					tileset: tileset,
					visibleCach: {}
				}
				this.$root._visibleConfig.push(config)
			}
			this.setElementVisible(item, config.visibleCach, visible)

			tileset._tileset.makeStyleDirty()
		},
		setElementVisible(item, visibleCach, visible) {
			if (!item) return
			if (item.element) {
				var ele = item.element().t
				if (!ele.children) {
					visibleCach[ele.id] = visible
				}
			}
			//遍历item的所有子
			if (item.children) {
				item.children.forEach(si => {
					si.checkStatus = visible ? 'checked' : 'unchecked'
					this.setElementVisible(si, visibleCach, visible)
				})
			}
		},
		getItemBindTileset(item) {
			if (!item) return undefined
			if (typeof item.bind == 'function') return item.bind()
			return this.getItemBindTileset(item.parent)
		},
		getParentVisible(item) {
			if (!item) return true
			if (item.checkStatus !== 'checked') return false

			//继续判定父
			return this.getParentVisible(item.parent)
		},
		modelTreeChecked(checked) {
			this.modelItemChecked({ item: this.modelTree[0], checked })
		},
		modelDoubleClick(treeItem) {
			var item = treeItem.item

			var element
			if (item.element) {
				element = item.element()
			}
			if (!element || !element.t.sphere) {
				item.expand = !item.expand
			} else {
				//取到构件去定位
				this.locateElement(element.tileset, element.t)
			}
		},
		locateElement(tileset, element) {
			var sphere = element.sphere
			if (!sphere) return
			if (sphere[3] <= 0) return
			var center = new Cesium.Cartesian3(sphere[0], sphere[1], sphere[2])

			//定位飞行
			try {
				//取到原始的transform矩阵的逆
				var srcMatInv = tileset._tileset._root.transform
				srcMatInv = Cesium.Matrix4.inverse(srcMatInv, new Cesium.Matrix4())

				//渠道当前的transform

				var curMat = tileset._tileset.root.computedTransform

				var mat = Cesium.Matrix4.multiply(curMat, srcMatInv, new Cesium.Matrix4())

				center = Cesium.Matrix4.multiplyByPoint(mat, center, new Cesium.Cartesian3())

				this.$root.$earth.czm.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(center, sphere[3]), {
					duration: 0.5
				})
			} catch (ex) {}

			//设置当前
			var config = this.$root._colorConfig.find(t => t.tileset === tileset)
			if (!config) {
				this.$root._colorConfig.push({
					tileset: tileset,
					id: element.id
				})
			} else {
				config.id = element.id
			}
			//刷新样式
			tileset._tileset.makeStyleDirty()
		},
		loadModelTree(tileset) {
			if (Array.isArray(this.modelTree) && this.modelTree.length == 0) {
				var url = tileset.url
				if (!url || url == '') return

				//加载
				url = url.replace(/tileset.json/g, 'scenetree.json')
				axios
					.get(url)
					.then(res => {
						//添加tree的所有子
						var children
						if (res.data) {
							//bim处理结果
							if (res.data.children) {
								children = res.data.children
							}
							//场景处理结果
							else if (res.data.scenes) {
								children = res.data.scenes
							}
						}
						if (children[0].children) {
							console.log(children[0])
							var tree = {}
							tree.id = vueItemTotal++
							tree.bind = () => {
								return tileset
							}
							tree.title = children[0].name // 是否有必要？
							tree.checkStatus = 'checked'
							tree.expand = true
							tree.children = this.createTrees(tileset, children[0].children)
							this.modelTree.push(tree)
						}
						this.$root.$earthUI.promptInfo('load ' + tileset.name + ' scenetree.json success')
					})
					.catch(err => {})
			}
		},
		createTrees(tileset, srcArr) {
			if (!srcArr) return undefined
			var trees = []

			srcArr.forEach(t => {
				var tree = {
					id: vueItemTotal++,
					title: t.name,
					expand: false,
					checkStatus: 'checked',
					element: () => {
						return { tileset, t }
					}
				}

				tree.children = this.createTrees(tileset, t.children)

				trees.push(tree)
			})

			if (trees.length == 0) return undefined

			return trees
		}
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