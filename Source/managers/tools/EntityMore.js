/**
 * 模型结构树面板
 * @class
 */
class EntityMore {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.entitymoreTool[0];

        XE.MVVM.extend(this, {
            /**
                        * 是否可见
                        * @type {boolean}
                        * @default false 
                        * @instance
                        * @memberof EntityMore
                        */
            show: false,
        });

        var toolbar = root._comp.$refs.mainBarControl.$refs.entity;
        this.unbind1 = XE.MVVM.bind(
            toolbar,
            "EntityMoreShow",
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
        this._showListenerDisposer = this._showListenerDisposer && this._showListenerDisposer();

        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();

    }

}

export default EntityMore;