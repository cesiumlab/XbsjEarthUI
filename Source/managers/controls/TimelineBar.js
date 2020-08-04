/**
 * 状态栏
 * @class
 */
class TimelineBar {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.timelineBarControl;

        XE.MVVM.extend(this, {
             /**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof TimelineBar
            */
            show: true,
        });



        this.unbind1 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show",
        );

        //找到导航条
        var toolbar = root._comp.$refs.mainBarControl.$refs.view;

        this.unbind2 = XE.MVVM.bind(
            toolbar,
            "timelinecontrolShow",
            this,
            "show"
        );






    }

    isDestroyed() {
        return false;
    }

    destroy() {
    

        this.unbind1 = this.unbind1 && this.unbind1();
        // this.unbind2 = this.unbind2 && this.unbind2();
 
    }
}

export default TimelineBar;