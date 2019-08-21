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

    //定义一个响应式变量 server
    XE.MVVM.extend(this, {
      /**
      * CesiumLab服务地址
      * @type {string}
      * @default '//localhost:9000/' 
      * @instance
      * @memberof LabServer
      */
      server: '//localhost:9000/',
          /**
      * CesiumLab在线服务服务地址
      * @type {string}
      * @default '//lab2.cesiumlab.com/' 
      * @instance
      * @memberof LabServer
      */
     serverOnline: '//lab2.cesiumlab.com/',
    });
  }

  isDestroyed() {
    return false;
  }

  destroy() {

  }
  /**
   * 位置查询
   * @param {String} key 查询关键字
   * @returns {Promise} 
   */
  geocoder(key) {

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

  _layers(type, key, sortfield, sortorder) {
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
  /**
   * 查询列出影像服务
   * @param {String} key 查询关键字
   * @returns {Promise}  
   */
  imageLayers(key) {
    return this._layers('image', key);
  }
  /**
   * 查询列出地形服务
   * @param {String} key 查询关键字
   * @returns {Promise}  
   */
  terrainLayers(key) {
    return this._layers('terrain', key);
  }
  /**
    * 查询列出瓦片服务
    * @param {String} key 查询关键字
    * @returns {Promise}  
    */
  modelLayers(key) {
    return this._layers('model', key);
  }
  /**
    * 更新数据库对象的缩略图
    * @param {String} type 服务类型 terrain,image,model,style,scene
    * @param {String} id  对象id
    * @param {String} img 缩略图地址
    * @returns {Promise}  
    */
  updateLayerThumbnail(type, id, img) {
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
  styles(key) {
    return this._layers('style', key, 'date', 'asc');
  }
  /**
    * 新建样式
    * @param {String} name 样式名称 
     * @param {String} code 样式代码 
      * @param {String} thumbnail 样式缩略图
    * @returns {Promise}  
    */
  newStyle(name, code, thumbnail) {
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
  deleteStyle(id) {
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
  rename(type, id, name) {
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
  queryScene(id) {
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
  addScene(name, content) {
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
  updateScene(id, content) {
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

}


export default LabServer;