/**
 * 3dtiles 测试面板
 * @class
 */
class TilesTest {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.tilesTest[0];

        XE.MVVM.extend(this, {
/**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof TilesTest
            */
            show: false,
        });


        var tool =  root._comp.$refs.mainBarControl.$refs.view;

        this.unbind = XE.MVVM.bind(
            tool,
            "tilesTestShow",
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

export default TilesTest;