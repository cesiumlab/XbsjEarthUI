/**
 * 颜色选择器
 * @class
 */
class ColorPicker {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.colorPicker;


        let viewer = root.earth._viewer;

        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.handler.setInputAction(event => {
            this._comp.hide();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }
    /**
      * 是否显示
      * @type {boolean}
      * @readonly
      * @instance 
      */
    get show() {
        return this._comp.show;
    }

     /**
      * 隐藏颜色选择器 
      */
    hide() {
        this._comp.hide();
    }

    
     /**
      * 弹出颜色选择器 
      * @param  {Object} color 弹出的初始颜色
      * @param {Function} colorChanged  颜色修改之后的回调
        * @param {Number} x   弹出的x位置，如果不传递，那么使用上次位置
        * @param {Number} y   弹出的x位置，如果不传递，那么使用上次位置
      */
    pop(color, colorChanged, x, y) {
        this._comp.pop(color, colorChanged, x, y);
    }
}

export default ColorPicker;