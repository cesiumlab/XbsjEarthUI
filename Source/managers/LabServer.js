import axios from "axios";
import QS from 'qs';
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * CesiumLab服务访问控制
 * @class
 */
class LabServer {
  constructor(root) {
    this._root = root;
    this._defaultServer = 'http://localhost:9000/';
    //定义一个响应式变量 server
    XE.MVVM.extend(this, {
      /**
      * CesiumLab服务地址
      * @type {string}
      * @default '//localhost:9000/' 
      * @instance
      * @memberof LabServer
      */
      server: this._defaultServer,
      /**
  * CesiumLab在线服务服务地址
  * @type {string}
  * @default '//lab2.cesiumlab.com/' 
  * @instance
  * @memberof LabServer
  */
      serverOnline: '//lab2.cesiumlab.com/',

      /**
     * CesiumLab在线服务服务地址
     * @type {string}
     * @default '' 
     * @instance
     * @memberof LabServer
     */
      cloudServiceUrl: '',

      /**
      * 自定义标绘库id
      * @type {string}
      * @default '' 
      * @instance
      * @memberof LabServer
      */
      symbolGroupId: 'custom_symbols',
    });
    // this.getSymbol(this.symbolGroupId);
  }

  isDestroyed () {
    return false;
  }

  destroy () {

  }
  /**
   * 位置查询
   * @param {String} key 查询关键字
   * @returns {Promise} 
   */
  geocoder (key) {

    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "other/geocoder?key=" + key)
        .then(res => {
          if (res.status == 200 && res.data.status == "ok") {
            resolve(res.data.result);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  _layers (type, key, sortfield, sortorder) {
    if (!sortfield)
      sortfield = 'date';
    if (!sortorder)
      sortorder = 'desc';

    return new Promise((resolve, reject) => {
      axios
        .get(this.server + type + "/?key=" + (key ? key : '') + "&sort=" + sortorder + "&sortfield=" + sortfield)
        .then(res => {
          if (res.status == 200 && res.data.status == "ok") {
            resolve(res.data[type + 's'].rows);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  cloudlayers (type, page, skip, sortfield, sortorder, minend, maxend) {
    if (!sortfield)
      sortfield = 'date';
    if (!sortorder)
      sortorder = 'desc';
    return new Promise((resolve, reject) => {
      axios
        .get(this.cloudServiceUrl + "/api/result/datalist?minend=" + (minend ? minend : '')
          + "&maxend=" + (maxend ? maxend : '') + "&datatype=" + type)
        .then(res => {
          if (res.status === 200 && res.data.status === "ok") {
            resolve(res.data.result);
          } else {
            reject(res.data.result);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  cloud3dtiles (type, page, skip, sortfield, sortorder, minend, maxend) {
    if (!sortfield)
      sortfield = 'date';
    if (!sortorder)
      sortorder = 'desc';
    return new Promise((resolve, reject) => {
      axios
        .get(this.cloudServiceUrl + "/api/3dtiles/" + type + "?st=" + (minend ? minend : '')
          + "&et=" + (maxend ? maxend : '') + "&order=" + sortfield)
        .then(res => {
          if (res.status === 200 && res.data.status === "ok") {
            resolve(res.data.result);
          } else {
            reject(res.data.result);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 查询列出影像服务
   * @param {String} key 查询关键字
   * @returns {Promise}  
   */
  imageLayers (key) {
    return this._layers('image', key);
  }
  /**
   * 查询列出地形服务
   * @param {String} key 查询关键字
   * @returns {Promise}  
   */
  terrainLayers (key) {
    return this._layers('terrain', key);
  }
  /**
    * 查询列出瓦片服务
    * @param {String} key 查询关键字
    * @returns {Promise}  
    */
  modelLayers (key) {
    return this._layers('model', key);
  }
  /**
    * 更新数据库对象的缩略图
    * @param {String} type 服务类型 terrain,image,model,style,scene
    * @param {String} id  对象id
    * @param {String} img 缩略图地址
    * @returns {Promise}  
    */
  updateLayerThumbnail (type, id, img) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.server + "other/thumbnail/" + type + "/" + id, QS.stringify({ thumbnail: img }))
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.result);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  /**
    * 查询列出样式
    * @param {String} key 查询关键字 
    * @returns {Promise}  
    */
  styles (key) {
    return this._layers('style', key, 'date', 'asc');
  }
  /**
    * 新建样式
    * @param {String} name 样式名称 
     * @param {String} code 样式代码 
      * @param {String} thumbnail 样式缩略图
    * @returns {Promise}  
    */
  newStyle (name, code, thumbnail) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "style", QS.stringify({ name: name, code: code, thumbnail: thumbnail }))
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.result);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  /**
     * 删除样式
     * @param {String} id 样式id  
     * @returns {Promise}  
     */
  deleteStyle (id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(this.server + "style/" + id)
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.result);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
     * 更新数据库对象的名称
     * @param {String} type 服务类型 terrain,image,model,style,scene
     * @param {String} id  对象id
      * @param {String} name  对象新名称
     * @returns {Promise}  
     */
  rename (type, id, name) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.server + "other/rename/" + type + "/" + id, QS.stringify({ name: name }))
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.result);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
    * 获取一个场景的内容 
    * @param {String} id  场景id 
    * @returns {Promise}  
    */
  queryScene (id) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "scene/?_id=" + id)
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.scenes.rows[0]);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });

    });
  }
  /**
  * 添加一个场景
  * @param {String} name  场景名称
      * @param {String} content  场景内容
  * @returns {Promise}  
  */
  addScene (name, content) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "scene", QS.stringify({ name: name, content: content }))
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.id);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  /**
* 更新场景内容
* @param {String} id  场景id 
* @param {String} content  场景内容
* @returns {Promise}  
*/
  updateScene (id, content) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.server + "scene/" + id, QS.stringify({ content: content }))
        .then(res => {
          console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(true);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 获取标绘符号
   * @param {String} id 
   */
  getSymbol (id) {
    var self = this
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "symbol/group?id=" + id)
        .then(res => {
          if (res.status === 200) {
            if (res.data.symbols.rows.length === 1) {
              var group = res.data.symbols.rows[0]
              if (id === this.symbolGroupId) {
                self.symbolContent = JSON.parse(group.content)
              }
            }
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
 * 删除标绘符号
 * @param {String} id 
 */
  deleteSymbol (id) {
    var self = this
    return new Promise((resolve, reject) => {
      axios
        .delete(this.server + "symbol/" + id)
        .then(res => {
          if (res.status === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 获取标绘符号
   * @param {String} ids 符号id列表，用逗号隔开
   */
  getSymbols (ids) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "symbol/list", QS.stringify({
          ids: ids
        }))
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 添加标绘符号
   * @param {String} id groupSymbolId
   * @param {String} symbol 
   */
  addSymbol (symbol) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "symbol", QS.stringify(symbol))
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    })
  }


  /**
   * 修改符号
   * @param {String} id symbolId
   * @param {String} group 
   */
  updateSymbol (id, options) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "symbol/" + id, QS.stringify(options))
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  /**
   * 修改符号组
   * @param {String} id groupSymbolId
   * @param {String} group 
   */
  updateSymbolGroup (content) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "symbol/group/" + this.symbolGroupId, QS.stringify({
          name: this.symbolContent.name,
          content: JSON.stringify(content)
        }))
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addToSymbolGroup (symbol, img) {
    var objJson = symbol.toJSON()
    delete objJson.xbsjGuid
    var content = JSON.stringify(objJson)
    var self = this

    this.addSymbol({ groupId: this.symbolGroupId, name: objJson.name, type: objJson.xbsjType, content: content, thumbnail: img })
      .then(result => {
        if (result.status === 'ok') {
          self._root.promptInfo("添加成功！", "info")
          self._root._comp.$refs.customSymbol[0].addSymbolToRoot(result.id);
          self._root._comp.$refs.customSymbol[0].itemClick();
        }
      })
      .catch(err => {
        this.error = err;
      });
  }

  getShareSymbol (param) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "symbol/share/list", {
          params: param
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  shareSymbolAddCount (id) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.server + "symbol/share/use/" + id)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  getContentById (id) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + 'symbol/share/getContentById/' + id)
        .then(res => {
          if (res.status === 200 && res.data.status === 'ok') {
            var content = res.data.content;
            if (content.czmObject) {
              content = content.czmObject;
            }
            resolve(content);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        })
    })
  }
  /**
   * 创建Guid
   */
  createGuid () {
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "other/createGuid")
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
    * 查询lod模型库
    * @returns {Promise}  
    */
  Getlodmodels () {
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "lodmodels")
        .then(res => {
          // console.log(res);
          if (res.status == 200 && res.data.status == "ok") {

            resolve(res.data.lodmodels.rows);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  /**
   * 修改或添加资源
   */
  addAssets (assets) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.server + "assets", assets)
        .then(res => {
          // console.log(res);
          if (res.status == 200 && res.data.status == "ok") {
            resolve(res.data);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
 * 获取资源
 */
  getAssets (id) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "assets/" + id)
        .then(res => {
          // console.log(res);
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getAuth(){
    return new Promise((resolve, reject) => {
      axios
        .get(this.server + "other/authinfo")
        .then(res => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data.status);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default LabServer;
