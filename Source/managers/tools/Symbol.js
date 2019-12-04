/**
 * 模型结构树面板
 * @class
 */
class Symbol {
    constructor(root) {
        this._root = root;
        this._compCustom = root._comp.$refs.customSymbol[0];
        this._compLab = root._comp.$refs.labSymbol[0];

        XE.MVVM.extend(this, {
            /**
                        * 自定义标绘面板是否可见
                        * @type {boolean}
                        * @default false 
                        * @instance
                        * @memberof Symbol
                        */
            showCustom: false,
        });

        XE.MVVM.extend(this, {
            /**
                        * cesiumLab标绘面板是否可见
                        * @type {boolean}
                        * @default false 
                        * @instance
                        * @memberof Symbol
                        */
            showLab: false,
        });

        var toolbar = root._comp.$refs.mainBarControl.$refs.entity;
        this.unbind1 = XE.MVVM.bind(
            toolbar,
            "CustomSymbolShow",
            this,
            "showCustom"
        );

        this.unbind1 = XE.MVVM.bind(
            toolbar,
            "LabSymbolShow",
            this,
            "showLab"
        );

        this.unbind3 = XE.MVVM.bind(
            this._compLab,
            "show",
            this,
            "showLab"
        );
                
        this.unbind4 = XE.MVVM.bind(
            this._compCustom,
            "show",
            this,
            "showCustom"
        );

    }

    isDestroyed() {
        return false;
    }

    destroy() {
        this._showListenerDisposer = this._showListenerDisposer && this._showListenerDisposer();

        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();
        this.unbind3 = this.unbind3 && this.unbind3();
        this.unbind4 = this.unbind4 && this.unbind4();
    }

}

export default Symbol;