<template>
    <div :class="{'XbsjVritualTreeItemOver':xbsjitemover}">
        <div
            @click="onClick(item, $event)"
            @contextmenu.prevent="onContexMenu(item, $event)"
            @dblclick="onDoubleClick(item, $event)"
            draggable="true"
            ref="treeitem"
            style="position: relative;"
            class="XbsjVritualTreeItem"
            @mousedown="movetreeitem(item,$event)"
            :style="{ paddingLeft: 20 * (item.level) + 10 + 'px', backgroundColor: item.isSelected ? 'rgba(0, 0, 0, 0.51)' : undefined, }"
        >
            <XbsjIcon
                type="ios-arrow-forward"
                :style="{visibility: (  (item.children && item.children.length != 0)|| ( item.type=='Tileset') ) ? 'visible' :'hidden'  }"
                @click="toggleExpand(item)"
                :class="{ XbsjVritualTreeItemExpandIcon: true, XbsjVritualTreeItemRotate: item.expand }"
            />
            <XbsjCheckBox
                :value="item.checkStatus === 'checked'"
                :indeterminate="item.checkStatus === 'indeterminate'"
                :disabled="item.checkStatus === 'ignored'"
                @on-change="toggleChecked(item, $event)"
                v-show="checkBoxShow"
            ></XbsjCheckBox>
            <!-- <XbsjIcon :type="itemIconType" @click="onContexMenu(item, $event)"/> -->
            <XbsjIcon :type="itemIconType" @click="onContexMenu(item, $event)"/>
            <span
                v-if="!titleEditable"
                style="white-space: nowrap;font-size: 14px;line-height: 30px;padding: 0 5px; user-select:none;"
                class="color-dddddd"
            >{{ item.title }}</span>
            <XbsjInput
                v-else
                v-focus
                autofocus
                ref="titleEditor"
                :value="item.title"
                @on-enter="$event => ($emit('on-change-title', {item, title: $event.target.value}), titleEditable = false)"
                placeholder="请输入..."
                style="width: 200px"
                @on-blur="$event => ($emit('on-change-title', {item, title: $event.target.value}), titleEditable = false)"
            ></XbsjInput>
            <span v-show="item.cameraAttached" class="pathbind"></span>
        </div>
        <div v-show="( ( item.type=='Tileset')&&item.expand )" :style="{ paddingLeft: 20 * (item.level) + 20 + 'px' }">
            <XbsjVirtualTree
                ref="vtree"
                :tree="modelTree"
                :checkBoxShow="true"
                :on-toggle-checked="modelChecked"
                @on-double-click="modelDoubleClick"
                @on-context-menu="modelContextMenu"
            ></XbsjVirtualTree>
        </div>
    </div>
</template>

<script>
const scratchPath = []
import axios from 'axios'
let vueItemTotal = 0
export default {
	props: {
		item: Object,
		onToggleExpand: Function,
		onToggleChecked: Function,
		canmove: Boolean,
		checkBoxShow: Boolean
	},

	mounted() {
		this.movetreeitem(this.item)
	},
	data() {
		return {
			titleEditable: false, // 'static'
			xbsjitemover: false,
			tree: [],
			modelTree: []
		}
	},
	methods: {
		toggleExpand(item) {
			this.onToggleExpand(item)
			if (item.type == 'Tileset' && !item.expand) {
				this.loadModelTree(item._inner.sn.czmObject)
			}
		},
		toggleChecked(item, checked) {
			// item.checkStatus === 'unchecked' 或者'indeterminate'时，应该设置为true
			// item.checkStatus === 'checked'，应该置为false
			this.onToggleChecked(item, item.checkStatus !== 'checked')
			// 模型结构树
			if (item.type == 'Tileset') {
				this.modelTreeChecked(checked)
			}
		},
		onContexMenu(item, $event) {
			this.$emit('on-context-menu', { item, vueObject: this, $event })
		},
		onDoubleClick(item, $event) {
			this.$emit('on-double-click', { item, vueObject: this, $event })
		},
		onClick(item, $event) {
			this.$emit('on-click', { item, vueObject: this, $event })
		},
		movetreeitem(item, $event) {
			let self = this
			let source = this.$refs.treeitem
			// 按下鼠标键并开始移动鼠标时，会在被拖放的元素上触发dragstart事件。
			// 此时光标变成“不能放”符号(圆环中有一条反斜线)，表示不能把元素放到自己上面
			source.addEventListener(
				'dragstart',
				function(event) {
					try {
						event.dataTransfer.setData('obj', JSON.stringify(item._inner.sn.czmObject)) //兼容火狐浏览器，拖动时候必须携带数据否则没效果
					} catch (e) {}

					self.$emit('on-item-move', { item, vueObject: self, $event })

					//为了在dragover里能判定 对象的类型，这里把guid放进去
					try {
						event.dataTransfer.setData('_czmobj_' + item._inner.sn.czmObject.xbsjGuid, JSON.stringify(item._inner.sn.czmObject))
					} catch (e) {}

					/*
          try {
            event.dataTransfer.setData(
              "objs",
              JSON.stringify(item._inner.sn.toAllJSON())
            ); //兼容火狐浏览器，拖动时候必须携带数据否则没效果
          } catch (e) {}
          */
				},
				false
			)

			// 触发dragstart事件后，随即会触发drag事件，而且在元素被拖动期间会持续触发该事件
			source.addEventListener('drag', function(event) {}, false)

			// 当拖动停止时(无论是把元素放到了有效的放置目标，还是放到了无效的放置目标上)，会触发dragend事件
			source.addEventListener('dragend', function(event) {}, false)

			//只要有元素被拖动到放置目标上，触发dragenter事件
			source.addEventListener(
				'dragenter',
				function(event) {
					event.preventDefault()
					self.$emit('on-item-canmove', { item, vueObject: self, $event })
				},
				false
			)
			//被拖动的元素在放置目标的范围内移动时，持续触发dragover事件
			source.addEventListener(
				'dragover',
				function(event) {
					if (self.canmove) {
						event.preventDefault()
						self.xbsjitemover = true
					}
				},
				false
			)

			// 如果元素被拖出了放置目标，触发dragleave事件
			source.addEventListener(
				'dragleave',
				function(event) {
					self.xbsjitemover = false
					event.preventDefault()
				},
				false
			)

			// 如果元素被放到了放置目标中，触发drop事件
			source.addEventListener(
				'drop',
				function(event) {
					self.$emit('on-item-drop', { item, vueObject: self, $event })
					self.xbsjitemover = false
					event.preventDefault()
				},
				false
			)
		},

		// 模型结构树
		modelDoubleClick(treeItem) {
			this.modelDoubleClick(treeItem)
		},
		modelChecked(item, checked) {
			this.modelItemChecked({ item, checked })
		},
		modelContextMenu(e) {
			e.$event.stopPropagation()
		},
		modelTreeChecked(checked) {
			this.modelItemChecked({ item: this.modelTree[0], checked })
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
			var url = tileset.url
			if (!url || url == '') return
			if (url !== this.url) {
				this.modelTree = []
				this.url = url
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
						if (Array.isArray(children) && children.length) {
							children.forEach(item => {
								if (item.children) {
									var tree = {}
									tree.id = vueItemTotal++
									tree.bind = () => {
										return tileset
									}
									tree.title = item.name // 是否有必要？
									tree.checkStatus = 'checked'
									tree.expand = true
									tree.children = this.createTrees(tileset, item.children)
									this.modelTree.push(tree)
								}
							})
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
	watch: {},
	directives: {
		focus: {
			// 指令的定义
			inserted: function(el) {
				// el.__vue__ && el.__vue__.focus();
			}
		}
	},
	computed: {
		itemIconType() {
			if (!this.onItemIconTypeCallback) {
				if (this.item.type === 'XbsjTerrain' || this.item.type === 'XbsjImagery' || this.item.type === 'XbsjTileset') {
					return !!this.item.children ? 'ios-folder' : this.item.type
				} else {
					return !!this.item.children ? 'ios-folder' : 'ios-image'
				}
			} else {
				return this.onItemIconTypeCallback(this.item)
			}
		}
	}
}
</script>

<style scoped>
.XbsjVritualTreeItemOver {
	background: #ffffff;
}
.XbsjVritualTreeItem {
	height: 30px;
	line-height: 30px;
	display: flex;
	flex-direction: row;
}

.XbsjVritualTreeItem:hover {
	/* background: #444; */
	/* color: #1fff99; */
	/* border-color: #1fff99!important; */
	background-color: rgba(0, 0, 0, 0.51);
}

.XbsjVritualTreeItemExpandIcon {
	padding-left: 5px;
	padding-right: 5px;
	cursor: pointer;
	transition: transform 0.2s;
}

.XbsjVritualTreeItemRotate {
	transform: rotateZ(90deg);
}
</style>

<style>
.ivu-checkbox-checked .ivu-checkbox-inner {
	border-color: #ffffff;
	background-color: #000000;
}

/* .ivu-checkbox-inner:hover {
    border-color: #1fff99;
} */

.ivu-checkbox-inner {
	display: inline-block;
	width: 14px;
	height: 14px;
	position: relative;
	top: 0;
	left: 0;
	border: 1px solid #ffffff;
	border-radius: 2px;
	background-color: #000;
}

.ivu-checkbox-indeterminate .ivu-checkbox-inner {
	background-color: #000000;
	border-color: #ffffff;
}
.pathbind {
	width: 30px;
	height: 30px;
	background: url(../../../images/pathbind.png) no-repeat;
	background-size: 60%;
	background-position: center;
	position: absolute;
	right: 5px;
	top: 0;
}
</style>

