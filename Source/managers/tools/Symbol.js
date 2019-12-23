/**
 * 模型结构树面板
 * @class
 */
class Symbol {
    constructor(root) {
        this._root = root;
        this._compCustom = root._comp.$refs.customSymbol[0];
        this._compLab = root._comp.$refs.labSymbol[0];
        this._compOnline = root._comp.$refs.onlineSymbol[0];
        XE.MVVM.extend(this, {
            /**
                        * 自定义标绘面板是否可见
                        * @type {boolean}
                        * @default false 
                        * @instance
                        * @memberof Symbol
                        */
            showCustom: false,

            /**
                        * cesiumLab标绘面板是否可见
                        * @type {boolean}
                        * @default false 
                        * @instance
                        * @memberof Symbol
                        */
            showLab: false,

            /**
            * 在线标绘面板是否可见
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof Symbol
            */
           showOnline: false,
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

        this.unbind5 = XE.MVVM.bind(
            toolbar,
            "OnlineSymbolShow",
            this,
            "showOnline"
        );

        this.unbind6 = XE.MVVM.bind(
            this._compOnline,
            "show",
            this,
            "showOnline"
        );



    }

    isDestroyed () {
        return false;
    }

    destroy () {
        this._showListenerDisposer = this._showListenerDisposer && this._showListenerDisposer();

        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();
        this.unbind3 = this.unbind3 && this.unbind3();
        this.unbind4 = this.unbind4 && this.unbind4();
        this.unbind5 = this.unbind5 && this.unbind5();
        this.unbind6 = this.unbind6 && this.unbind6();
    }

}

export default Symbol;