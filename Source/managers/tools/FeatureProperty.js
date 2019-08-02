/**
 * 对象属性面板
 * @class
 */
class FeatureProperty {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.featureProperty[0];

       
        XE.MVVM.extend(this, {
            /**
            * 是否禁止显示
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof FeatureProperty
            */
            disabled: false,
        });

        var tool =  root._comp.$refs.mainBarControl.$refs.navigate.$refs.pickObject;

        this.unbind = XE.MVVM.bind(
            tool,
            "disableDefatulePropertyWindow",
            this,
            "disabled"
        );
        
        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "disabled",
            this,
            "disabled"
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

export default FeatureProperty;