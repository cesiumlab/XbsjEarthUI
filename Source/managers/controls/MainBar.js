import TilesetPage from "./TilesetPage"

/**
 * 主工具栏
 * @class
 */
class MainBar {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.mainBarControl;
   
        XE.MVVM.extend(this, {

            /**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof MainBar
            */
            show: true,
            /**
            * 当前标签页  可选值 'navigate','view','imagery','model','terrain','analysis','effect','entity'
            * @type {String}
            * @default 'navigate' 
            * @instance
            * @memberof MainBar
            */
            page: "navigate",

            /**
            * 是否显示加载云服务数据的按钮
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof MainBar
            */
            cloudServiceUI: false,

            /**
            * 是否显示加载cesiumlab数据的按钮
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof MainBar
            */
           labServiceUI: true,
        });

        this.unbind1 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );

        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "page",
            this,
            "page"
        );

        this.unbind3 = XE.MVVM.bind(
            this._comp,
            "cloudServiceUI",
            this,
            "cloudServiceUI"
        );

        this.unbind4 = XE.MVVM.bind(
            this._comp,
            "labServiceUI",
            this,
            "labServiceUI"
        );

        //监控show的改变
        this.unbind3 = XE.MVVM.watch(() => {

            var czmDom = root._comp.$refs.xbsjcesium;

            //如果不可见
            if (!this.show) {
                czmDom.style.height = '100%';
            }
            else if (this.page == '') {
                czmDom.style.height = 'calc(100% - 41px)';
            }
            else {
                czmDom.style.height = 'calc(100% - 137px)';
            }
        });

        this._tileset = new TilesetPage(root);
    }

    destroy() {
        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();
        this.unbind3 = this.unbind3 && this.unbind3();
        this.unbind4 = this.unbind4 && this.unbind4();
    }

    /**
    * UI控件大小
    * @readonly
    * @returns {Object} 返回一个包含width 和 height的对象，表示当前控件大小
    * @memberof MainBar
    */
    get size() {
        return this._comp.getSize();
    }
    /**
     * 显示哪个标签页
     * @readonly 
     * @param {String} page 可选值 'navigate','view','imagery','model','terrain','analysis','effect','entity'
     * @memberof MainBar
     */

    showPage(page) {
        return this._comp.showPage(page);
    }
    /**
    * 获取瓦片配置页
    * @readonly
    * @returns {Object} 返回一个包含width 和 height的对象，表示当前控件大小
    * @memberof MainBar
    */
    get tileset(){
        return this._tileset;
    }
}

export default MainBar;