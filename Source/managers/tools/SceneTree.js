/**
 * 图层管理面板
 * @class
 */
class SceneTree {
    constructor(root) {
        this._root = root;
        this._comp = root._comp.$refs.sceneTreeTool[0];

        XE.MVVM.extend(this, {
/**
            * 是否可见
            * @type {boolean}
            * @default true 
            * @instance
            * @memberof SceneTree
            */
            show: true,
        });

        var toolbar = root._comp.$refs.mainBarControl.$refs.view;
        this.unbind1 = XE.MVVM.bind(
            toolbar,
            "layerShow",
            this,
            "show"
        );
         
        this.unbind2 = XE.MVVM.bind(
            this._comp,
            "show",
            this,
            "show"
        );
           

        //不能放到这里设置，而是在 comp的mounted中去
        //const xbsjEarth = root._earth;
        // this._comp.setSceneTree(xbsjEarth.sceneTree);
    }

    // get show() {
    //     return this._comp.show;
    // }

    // set show(value) {
    //     this._comp.show = value;
    // }

    isDestroyed() {
        return false;
    }

    destroy() {
        this._showListenerDisposer = this._showListenerDisposer && this._showListenerDisposer();

        this.unbind1 = this.unbind1 && this.unbind1();
        this.unbind2 = this.unbind2 && this.unbind2();

    }
/**
 * 添加一个场景树图层
 * @param {Object} layer  场景对象
 * @param {String} title  图层标题
 */
    addSceneObject(layer, title) {
        //构造场景树结构
        const obj = new XE.SceneTree.Leaf(layer);
        obj.title = title;

        var earth = this._root._earth;
        //获得当前选中的树节点，
        var selected = earth.sceneTree.currentSelectedNode;
        //如果为空，那么添加到根下
        if (!selected) {
            earth.sceneTree.root.children.push(obj);
        }
        //如果为group，添加到group最后
        else if (selected.children) {
            selected.children.push(obj);
        }
        //如果为node，添加到node的parent最后
        else if (selected.parent) {
            selected.parent.children.push(obj);
        }

    }
}

export default SceneTree;