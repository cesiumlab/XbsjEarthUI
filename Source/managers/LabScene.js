/**
 * 场景打开以及存储类
 * @class
 */
class LabScene {
    constructor(root) {
        this._root = root;

        //响应式变量 sceneID  , sceneName
        XE.MVVM.extend(this, {
            /**
            * 场景ID  场景保存后才会有值
            * @type {string}
            * @default undefined 
            * @instance
            * @memberof LabScene
            */
            sceneID: undefined,
            /**
           * 场景名称 
           * @type {string}
           * @default '新建场景' 
            * @instance
            * @memberof LabScene
           */
            sceneName: "新建场景",
            /**
           * 场景缩略图地址
           * @type {string}
           * @default '' 
            * @instance
            * @memberof LabScene
           */
            thumbnail: ''
        });
        //绑定到vue组件上
        this._comp = root._comp.$refs.mainBarControl.$refs.navigate.$refs.sceneView;

        this.unbinds = [];
        this.unbinds.push(XE.MVVM.bind(
            this._comp,
            "sceneID",
            this,
            "sceneID"
        ));
        this.unbinds.push(XE.MVVM.bind(
            this._comp,
            "sceneName",
            this,
            "sceneName"
        ));
        this.unbinds.push(XE.MVVM.bind(
            this._comp,
            "thumbnail",
            this,
            "thumbnail"
        ));

        //更新标题
        this.unbinds.push(XE.MVVM.watch(() => {
            document.title = this.sceneName;
        }));

        // //更新url参数
        this.unbinds.push(XE.MVVM.watch(() => {

            if (this.sceneID) {
            
                var url  =  "./index.html?scene=" + this.sceneID;

                var labServer = this._root.labServer;
                if(labServer.server != labServer._defaultServer)
                {
                    url+="&labserver=" + labServer.server;
                }

                history.pushState(
                    "cesiumlab",
                    document.title,
                    url
                ); 
            }

        }));

    }
    destroy() {
        this._unbinds.forEach(e => e());
        this._unbinds.length = 0;
    }

    /**
     * 加载场景
     * @param {String} id  场景id  
     */
    loadScene(id) {
        //场景加载
        var labServer = this._root.labServer;
        labServer
            .queryScene(id)
            .then(scene => {
                //解析场景内容


                //解析场景内容
                var jc = JSON.parse(scene.content);

                this._root.earth.xbsjFromJSON(jc);

                this.sceneName = scene.name;
                this.sceneID = id;
                this.thumbnail = scene.thumbnail;

                this._root.promptInfo('加载场景成功:' + id);
            })
            .catch(ex => {
                console.log("query scene failed " + ex.message || ex);
                console.log(this._root);
                this._root.promptInfo('加载场景失败:' + ex.message || ex, 'error');
            });
    }
    /**
    * 保存场景 
    */
    saveScene() {
        //如果当前全局内没有场景，那么 向服务器新建场景
        if (!this.sceneID) {
            //新建场景
            this.newScene();
        } else {
            //更新场景
            this.updateScene();
        }
    }
    /**
    * 新建场景
    */
    newScene() {
        if (this.sceneID) return;

        var jc = this._root.earth.toJSON();

        var labServer = this._root.labServer;
        labServer
            .addScene(this.sceneName, JSON.stringify(jc))
            .then(id => {
                this.sceneID = id;

                this._root.promptInfo('创建场景成功:' + id);
            })
            .catch(ex => {
                console.log("new scene failed " + ex.message || ex);
                this._root.promptInfo('创建场景失败:' + ex.message || ex, 'error');
            });
    }
    /**
    * 更新场景
    */
    updateScene() {

        if (!this.sceneID) return;

        var jc = this._root.earth.toJSON();

        var labServer = this._root.labServer;
        labServer
            .updateScene(this.sceneID, JSON.stringify(jc))
            .then(id => {
                // console.log("update scene success");

                this._root.promptInfo('更新场景成功:' + this.sceneID);
            })
            .catch(ex => {
                console.log("update scene failed " + ex.message || ex);
                this._root.promptInfo('更新场景失败:' + ex.message || ex, 'error');
            });

    }
    /**
    * 更新缩略图
    * @param {string} img 需要保存的缩略图地址
    */
    updateThumbNail(img) {
        //更新场景名称
        if (!this.sceneID) return;

        var labServer = this._root.labServer;
        labServer
            .updateLayerThumbnail("scenes", this.sceneID, img)
            .then(id => {
                console.log("update scene thumbnail success");

                this.thumbnail = img;
                this._root.promptInfo('更新场景缩略图成功:' + this.sceneID);
            })
            .catch(ex => {
                console.log("update scene thumbnail failed " + ex.message || ex);
            });
    }
    /**
       * 更新场景名称
       */
    updateName() {
        if (!this.sceneID) return;

        var labServer = this._root.labServer;
        var self = this;
        labServer
            .rename("scenes", this.sceneID, this.sceneName)
            .then(id => {
                console.log("update scene name success", id);

                this._root.promptInfo('场景改名成功:' + this.sceneID);
            })
            .catch(ex => {
                console.log("update scene name failed " + ex.message || ex);
                this._root.promptInfo('场景改名失败:' + ex.message || ex, 'error');
            });
    }

}

export default LabScene;