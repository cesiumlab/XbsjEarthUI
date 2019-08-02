/**
 * 状态栏
 * @class
 */
class StatusBar {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.statusBarControl;

        XE.MVVM.extend(this, {
             /**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof StatusBar
            */
            show: true,
        });



        this.unbind1 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );

        //找到导航条
        var toolbar = root._comp.$refs.mainBarControl.$refs.view;


        this.unbind2 = XE.MVVM.bind(
            toolbar,
            "statecontrolShow",
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

export default StatusBar;