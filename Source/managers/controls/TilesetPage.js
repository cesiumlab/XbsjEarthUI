/**
 * 主工具栏
 * @class
 */
class TilesetPage {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.mainBarControl.$refs.model;
    }

    destroy() {

    }

    /**
     * 添加自定义按钮
     * @readonly 
     * @param {Object} button 需要添加的按钮配置，详见示例
     * @memberof TilesetPage
     */
    addCustomButton(button) {
        this._comp.addCustomButton(button);
    }

    /**
     * 删除自定义按钮
     * @readonly 
     * @param {Object} button 需要删除的按钮
     * @memberof TilesetPage
     */
    removeCustomButton(button) {
        this._comp.removeCustomButton(button);
    }
};

export default TilesetPage;