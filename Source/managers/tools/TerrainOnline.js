/**
 * 在线地形服务选择面板
 * @class
 */
class TerrainOnline {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.terrainOnline[0];

        XE.MVVM.extend(this, {
/**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof TerrainOnline
            */
            show: false,
        });


        var tool =  root._comp.$refs.mainBarControl.$refs.terrain;

        this.unbind = XE.MVVM.bind(
            tool,
            "terrainOnline",
            this,
            "show"
        );
        
        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );
    }

    isDestroyed() {
        return false;
    }

    destroy() {
        
        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();

    }
}

export default TerrainOnline;