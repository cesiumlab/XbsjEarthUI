/**
 * 视角管理器
 * @class
 */
class CameraViewManager {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.cameraViewManager[0];

        XE.MVVM.extend(this, {
             /**
            * 是否可见
            * @type {boolean}
            * @default false 
            * @instance
            * @memberof CameraViewManager
            */
            show: false,
        });


        this.unbind1 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );
        //找到导航面板
        var toolbar = root._comp.$refs.mainBarControl.$refs.navigate;

        this.unbind2 = XE.MVVM.bind(toolbar, 'cameraViewManagerShow', this, 'show');
    }

    isDestroyed() {
        return false;
    }

    destroy() {
        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();
    }
}

export default CameraViewManager;