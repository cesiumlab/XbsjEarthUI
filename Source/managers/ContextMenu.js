/**
 * 右键菜单
 * @class
 */
class ContextMenu {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.contextMenu;

        XE.MVVM.extend(this, {
            /**
            * 是否显示
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof ContextMenu
            */
            show: false
        });
        this.unbinds = [];
        this.unbinds.push(XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        ));


        let viewer = root.earth._viewer;
        //对viewer 添加统一的contextmenu响应，避免每个entity去叠加
        viewer.canvas.addEventListener("contextmenu", () => {
            //pick下
            var picked = viewer.scene.pick(
                new Cesium.Cartesian2(event.offsetX, event.offsetY)
            );
            if (!picked || !picked.id || !picked.id.contextMenus) return;

            this.pop(picked.id.contextMenus);

        });

        //点击地球后隐藏
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.handler.setInputAction(event => {
            this._comp.show = false;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    }
    /**
    * 弹出右键菜单  
    * @param {Object} items 菜单项 详见示例
    * @param {Number} x   弹出的x位置，如果不传递，那么使用鼠标目前位置
    * @param {Number} y   弹出的x位置，如果不传递，那么使用鼠标目前位置 
    */
    pop(items, x, y) {
        this._comp.pop(items, x, y);
    }
}

export default ContextMenu;