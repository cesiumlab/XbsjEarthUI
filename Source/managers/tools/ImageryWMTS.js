/**
 * WMTS服务影像源选择
 * @class
 */
class ImageryWMTS {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.imageryWMTS[0];

        XE.MVVM.extend(this, {
 /**
            * 是否可见
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof ImageryWMTS
            */
            show: false,
        });
   
        var tool =  root._comp.$refs.mainBarControl.$refs.imagery;

        this.unbind = XE.MVVM.bind(
            tool,
            "imageryWMTS",
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

export default ImageryWMTS;