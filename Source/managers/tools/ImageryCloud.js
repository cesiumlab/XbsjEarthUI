/**
 * 云平台影像源选择
 * @class
 */
class ImageryCloud {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.ImageryCloud[0];


        XE.MVVM.extend(this, {
            /**
                     * 是否可见
                     * @type {boolean}
                     * @default false 
                     * @instance
                     * @memberof ImageryCloud
                     */
            show: false,
            /**
         * 云服务url
         * @type {string}
         * @default "" 
         * @instance
         * @memberof ImageryCloud
         */
            cloudServiceUrl: ""
        });

        var tool = root._comp.$refs.mainBarControl.$refs.imagery;

        this.unbind = XE.MVVM.bind(
            tool,
            "imageryCloud",
            this,
            "show"
        );

        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );

        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "cloudServiceUrl",
            this,
            "cloudServiceUrl"
        );
    }

    isDestroyed () {
        return false;
    }

    destroy () {

        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();

    }
}

export default ImageryCloud;