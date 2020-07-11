<template>
  <Window
    :width="712"
    :minWidth="712"
    :height="712"
    :top="158"
    :floatright="true"
    :title="lang.title"
    @cancel="cancel"
    @ok="ok"
    :footervisible="true"
    @showclick="showSelect=false"
  >
    <div class="xbsj-flatten" ref="customPrimitive">
      <!-- 名称 -->
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="model.name" />
      </div>
      <div class="flatten-flex">
        <!-- 鼠标点选 -->
        <div class="flatten">
          <label></label>
          <div class="buttonGroup">
            <button
              class="attitudeEditCameraButton"
              @click="model.creating =!model.creating"
              :class="model.creating?'btncoloron':''"
            >{{lang.creating}}</button>
            <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="model.positionEditing =!model.positionEditing"
              :class="model.positionEditing?'btncoloron':''"
            >{{lang.positionEditing}}</button>
            <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="model.rotationEditing =!model.rotationEditing"
              :class="model.rotationEditing?'btncoloron':''"
            >{{lang.rotationEditing}}</button>
            <button
              style="margin-left:20px;"
              class="attitudeEditCameraButton"
              @click="flyto"
            >{{lang.flyto}}</button>
          </div>
          <!-- 拖拽 -->
          <div
            :title="lang.drag"
            class="dragBox"
            @dragover="dragOver"
            @drop="drop"
            @dragleave="dragLeave"
            style="display: inline-block;"
          >
            <div class="dragButton" :class="{highlight:drag_over}">{{lang.dragcontent}}</div>
          </div>
        </div>
      </div>
      <!-- 位置 -->
      <div class="flatten">
        <label>{{lang.weizhi}}</label>
        <div class="flatten-box">
          <XbsjLngLatHeight v-model="model.position"></XbsjLngLatHeight>
        </div>
      </div>
      <!-- 姿态 -->
      <div class="flatten">
        <label>{{lang.zitai}}</label>
        <div class="flatten-box">
          <XbsjHeadingPitchRoll v-model="model.rotation"></XbsjHeadingPitchRoll>
        </div>
      </div>

      <div class="flatten">
        <!-- 宽度  -->
        <label>{{lang.width}}</label>
        <div class="flatten-box">
          <XbsjInputNumber style="float:left; width: calc(50% - 90px);" v-model="model.canvasWidth"></XbsjInputNumber>
        </div>
        <!-- 高度  -->
        <label>{{lang.height}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; width: calc(50% - 90px);"
            v-model="model.canvasHeight"
          ></XbsjInputNumber>
        </div>
      </div>

      <div class="flatten">
        <!-- x,y,z缩放值  -->
        <label>{{lang.scale}}</label>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; margin-right: 20px; width: calc(33% - 56px);"
            v-model="model.scale[0]"
          ></XbsjInputNumber>
        </div>
        <div class="flatten-box">
          <XbsjInputNumber
            style="float:left; margin-right: 20px; width: calc(33% - 56px);"
            v-model="model.scale[1]"
          ></XbsjInputNumber>
        </div>
        <div class="flatten-box">
          <XbsjInputNumber style="float:left; width: calc(33% - 56px);" v-model="model.scale[2]"></XbsjInputNumber>
        </div>
      </div>

      <div class="flatten" style="display:flex;">
        <!-- 类型 -->
        <div style="position: relative;">
          <label>{{lang.primitivetype}}</label>
          <input
            type="text"
            v-model="primitiveTypeObj[model.primitiveType]"
            @click="selectinput"
            readonly
            style="cursor: pointer; width: 138px;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showTypeSelect" style="width: 148px; left: 83px;">
            <div @click="optionssure(index)" v-for="(c,index) in primitiveTypeObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
        <!-- pass -->
        <div style="position: relative;">
          <label>{{lang.pass}}</label>
          <input
            type="text"
            v-model="passObj[model.pass]"
            @click="selectpassinput"
            readonly
            style="cursor: pointer; width: 362px;"
          />
          <button class="selectButton"></button>
          <div
            class="cutselectbox"
            v-show="showPassSelect"
            style="width: 370px; height: 150px; overflow-y: auto; left: 84px;"
          >
            <div @click="passoptionssure(index)" v-for="(c,index) in passObj" :key="index">
              <span>{{c}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flatten-flex">
        <div class="flatten" style="width:50%;">
          <label>{{lang.imageUrl}}</label>
          <input type="text" v-model="model.imageUrl" />
        </div>
        <div class="flatten" style="width:50%;">
          <label>{{lang.objUrl}}</label>
          <input type="text" v-model="model.objUrl" />
        </div>
        <!-- <div class="flatten">
          <label>{{lang.videoUrl}}</label>
          <input type="text" v-model="model.videoUrl" />
        </div>-->
      </div>

      <!-- 预定义 -->
      <!-- <div class="flatten" style="display:flex;">
        <div style="position: relative;">
          <label>{{lang.predefined}}</label>
          <input
            type="text"
            v-model="primitiveName"
            @click="selectPredefinedinput"
            readonly
            style="cursor: pointer; width: 380px;"
          />
          <button class="selectButton"></button>
          <div class="cutselectbox" v-show="showPredefinedSelect" style="width: 389px; left: 84px;">
            <div
              @click="primitiveoptions(index)"
              v-for="(item,index) in primitiveData"
              :key="index"
            >
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>-->

      <div class="topbox">{{lang.editing}}{{topTitle}}</div>
      <div class="containbox">
        <div class="leftbox">
          <XbsjVirtualTree
            ref="vtree"
            :tree="tree"
            @on-click="itemClick"
            :checkBoxShow="checkBoxShow"
          ></XbsjVirtualTree>
        </div>
        <div class="rightbox">
          <textarea v-show="geometryShow" v-model="obj"></textarea>
          <textarea v-show="createcodeShow" v-model="evalString"></textarea>
          <textarea v-show="framecodeShow" v-model="preUpdateEvalString"></textarea>
          <textarea v-show="destorycodeShow" v-model="destroyEvalString"></textarea>
          <textarea v-show="vertexshaderShow" v-model="vertexShaderSource"></textarea>
          <textarea v-show="spritsshaderShow" v-model="fragmentShaderSource"></textarea>
          <textarea v-show="renderstatsShow" v-model="renderState"></textarea>
          <div class="footbox">
            <button @click="apply">{{lang.apply}}</button>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import { copyobj } from "../../utils/tools";
import languagejs from "./index_locale";
import axios from "axios";

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      lang: {},
      showTypeSelect: false,
      showPassSelect: false,
      showPredefinedSelect: false,
      geometryShow: true,
      createcodeShow: false,
      framecodeShow: false,
      destorycodeShow: false,
      vertexshaderShow: false,
      spritsshaderShow: false,
      renderstatsShow: false,
      checkBoxShow: false,
      obj: "",
      evalString: "",
      preUpdateEvalString: "",
      destroyEvalString: "",
      vertexShaderSource: "",
      fragmentShaderSource: "",
      renderState: "",
      topTitle: "",
      tree: [],
      drag_over: false,
      primitiveTypeObj: {
        0: "POINTS",
        1: "LINES",
        2: "LINE_LOOP",
        3: "LINE_STRIP",
        4: "TRIANGLES",
        5: "TRIANGLE_STRIP",
        6: "TRIANGLE_FAN"
      },
      passObj: {
        0: "ENVIRONMENT",
        1: "COMPUTE",
        2: "GLOBE",
        3: "TERRAIN_CLASSIFICATION",
        4: "CESIUM_3D_TILE",
        5: "CESIUM_3D_TILE_CLASSIFICATION",
        6: "CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW",
        7: "OPAQUE",
        8: "TRANSLUCENT",
        9: "OVERLAY",
        10: "NUMBER_OF_PASSES"
      },
      model: {
        name: "",
        show: true,
        positionEditing: false,
        rotationEditing: false,
        canvasWidth: 0,
        canvasHeight: 0,
        creating: true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        primitiveType: Number,
        pass: Number,
        scale: [0, 0, 0],
        imageUrl: "",
        objUrl: ""
        // videoUrl: ""
      },
      pinstyletype: true,
      langs: languagejs,
      bgbaseColorUI: {
        rgba: {
          r: 0,
          g: 0,
          b: 255,
          a: 1
        }
      },
      bgbaseColor: [0, 0, 0.5, 1],
      primitiveData: [],
      primitiveName: "默认",
      index: Number
    };
  },
  created() {},
  mounted() {
    this.topTitle = this.lang.geometry;
    this.tree = [
      {
        title: this.lang.geometry,
        expand: true,
        checkStatus: "checked",
        children: [],
        geometryShows: true
      },
      {
        title: this.lang.canvastexture,
        expand: true,
        checkStatus: "checked",
        children: [
          {
            title: this.lang.createcode,
            expand: false,
            checkStatus: "checked",
            createcodeShows: true
          },
          {
            title: this.lang.framecode,
            expand: false,
            checkStatus: "checked",
            framecodeShows: true
          },
          {
            title: this.lang.destorycode,
            expand: false,
            checkStatus: "checked",
            destorycodeShows: true
          }
        ]
      },
      {
        title: this.lang.render,
        expand: true,
        checkStatus: "checked",
        children: [
          {
            title: this.lang.vertexshader,
            expand: false,
            checkStatus: "checked",
            vertexshaderShows: true
          },
          {
            title: this.lang.spritsshader,
            expand: false,
            checkStatus: "checked",
            spritsshaderShows: true
          },
          {
            title: this.lang.renderstats,
            expand: false,
            checkStatus: "checked",
            renderstatsShows: true
          }
        ]
      }
    ];
    // 数据关联
    this._disposers = this._disposers || [];
    var czmObj = this.getBind();
    // console.log(czmObj);

    if (czmObj) {
      this._czmObj = czmObj;
      const bindData = {
        name: "model.name",
        creating: "model.creating",
        // show: "model.show",
        positionEditing: "model.positionEditing",
        rotationEditing: "model.rotationEditing",
        position: "model.position",
        rotation: "model.rotation",
        canvasWidth: "model.canvasWidth",
        canvasHeight: "model.canvasHeight",
        primitiveType: "model.primitiveType",
        pass: "model.pass",
        scale: "model.scale",
        imageUrl: "model.imageUrl",
        objUrl: "model.objUrl"
        // videoUrl: "model.videoUrl"
      };

      Object.entries(bindData).forEach(([sm, vm]) => {
        if (typeof vm === "string") {
          this._disposers.push(XE.MVVM.bind(this, vm, czmObj, sm));
        } else {
          this._disposers.push(vm.handler(this, vm.prop, czmObj, sm));
        }
      });
      this._disposers.push(XE.MVVM.bind(this, "bgbaseColor", czmObj, "color"));
    }
    this.obj = this.objData();

    let customPrimitive = this.$refs.customPrimitive;
    let that = this;

    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // 读取文件内容信息
    function handleFileSelect(e) {
      // e.stopPropagation();
      e.preventDefault();
      let item = e.dataTransfer;

      var files = [];
      [].forEach.call(
        e.dataTransfer.files,
        function(file) {
          files.push(file);
        },
        false
      );

      for (var f of files) {
        var reader = new FileReader();
        reader.readAsText(f);
        //读取文件的内容
        reader.onload = function() {
          that.obj = this.result;

          // that.objToArr();
        };
      }
    }

    // 监听拖拽
    customPrimitive.addEventListener("dragover", handleDragOver, false);
    customPrimitive.addEventListener("drop", handleFileSelect, false);

    this.geDatainfo();
  },
  computed: {
    name() {
      return this.model.name;
    },
    guid() {
      return this.getBind().guid;
    }
  },
  watch: {
    bgbaseColorUI(color) {
      let v = color.rgba;

      var cc = [v.r / 255.0, v.g / 255.0, v.b / 255.0, v.a];
      if (!this.bgbaseColor.every((c, index) => c === cc[index])) {
        this.bgbaseColor = cc;
      }
    },
    bgbaseColor(c) {
      this.bgbaseColorUI = {
        rgba: {
          r: c[0] * 255,
          g: c[1] * 255,
          b: c[2] * 255,
          a: c[3]
        }
      };
    }
  },
  methods: {
    geDatainfo() {
      var primitiveServer = this.$root.$labServer;
      let url = primitiveServer.server + "primitive/list";
      axios
        .post(url)
        .then(res => {
          if (res.data.status === "ok") {
            this.primitiveData = res.data.primitives.rows;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectinput() {
      this.showTypeSelect = !this.showTypeSelect;
    },
    optionssure(index) {
      this.model.primitiveType = parseInt(index);
      this.showTypeSelect = !this.showTypeSelect;
    },
    selectpassinput() {
      this.showPassSelect = !this.showPassSelect;
    },
    passoptionssure(index) {
      this.model.pass = parseInt(index);
      this.showPassSelect = !this.showPassSelect;
    },
    selectPredefinedinput() {
      this.showPredefinedSelect = !this.showPredefinedSelect;
    },
    primitiveoptions(index) {
      this.index = index;
      this.primitiveName = this.primitiveData[index].name;
      // console.log(this.primitiveName);
      this.showPredefinedSelect = !this.showPredefinedSelect;
      var customPrimitives = new XE.Obj.CustomPrimitive(this.$root.$earth);
      var allJson = customPrimitives.toAllJSON();
      var position = [...this._czmObj.position];
      this._czmObj.xbsjFromJSON(allJson);
      this._czmObj.xbsjFromJSON(JSON.parse(this.primitiveData[index].content));
      this.obj = this.objData();
      this._czmObj.position = position;
    },
    itemClick(item) {
      // console.log(item);
      if (item.item.geometryShows) {
        this.geometryShow = true;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.topTitle = this.lang.geometry;
        this.obj = this.objData();
      }
      if (item.item.createcodeShows) {
        this.geometryShow = false;
        this.createcodeShow = true;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.evalString = this._czmObj.evalString;
        this.topTitle = this.lang.createcode;
      }
      if (item.item.framecodeShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = true;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.preUpdateEvalString = this._czmObj.preUpdateEvalString;
        this.topTitle = this.lang.framecode;
      }
      if (item.item.destorycodeShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = true;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.destroyEvalString = this._czmObj.destroyEvalString;
        this.topTitle = this.lang.destorycode;
      }
      if (item.item.vertexshaderShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = true;
        this.spritsshaderShow = false;
        this.renderstatsShow = false;
        this.topTitle = this.lang.vertexshader;
        this.vertexShaderSource = this._czmObj.vertexShaderSource;
      }
      if (item.item.spritsshaderShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = true;
        this.renderstatsShow = false;
        this.topTitle = this.lang.spritsshader;
        this.fragmentShaderSource = this._czmObj.fragmentShaderSource;
      }
      if (item.item.renderstatsShows) {
        this.geometryShow = false;
        this.createcodeShow = false;
        this.framecodeShow = false;
        this.destorycodeShow = false;
        this.vertexshaderShow = false;
        this.spritsshaderShow = false;
        this.renderstatsShow = true;
        this.topTitle = this.lang.renderstats;
        this.renderState = JSON.stringify(
          this._czmObj.renderState,
          undefined,
          " "
        );
      }
    },
    apply() {
      if (this.obj) {
        this.objToArr();
      }
      if (this.createcodeShow) {
        this._czmObj.evalString = this.evalString;
      }
      if (this.framecodeShow) {
        this._czmObj.preUpdateEvalString = this.preUpdateEvalString;
      }
      if (this.destorycodeShow) {
        this._czmObj.destroyEvalString = this.destroyEvalString;
      }
      if (this.vertexShaderSource) {
        this._czmObj.vertexShaderSource = this.vertexShaderSource;
      }
      if (this.fragmentShaderSource) {
        this._czmObj.fragmentShaderSource = this.fragmentShaderSource;
      }
      if (this.renderState) {
        this._czmObj.renderState = JSON.parse(this.renderState);
        // console.log(this._czmObj.renderState);
      }
    },
    // 将数组分割成每三个一组
    splitArray(arr) {
      var result = [];
      for (var i = 0; i < arr.length; i += 3) {
        result.push(arr.slice(i, i + 3));
      }
      return result;
    },
    // 将数组分割成每两个一组
    splitArray2(data) {
      var result2 = [];
      for (var i = 0; i < data.length; i += 2) {
        result2.push(data.slice(i, i + 2));
      }
      return result2;
    },
    // 获取obj文件信息
    objData() {
      var pos = this.splitArray(this._czmObj.positions),
        color = [],
        vn = [],
        f = this.splitArray(this._czmObj.indices),
        vt = [],
        v = [],
        v1 = "",
        v2 = "",
        vt2 = "",
        vn2 = "",
        f2 = "";
      if (this._czmObj.colors !== undefined) {
        color = this.splitArray(this._czmObj.colors);
        for (var i = 0; i < pos.length; i++) {
          v.push(pos[i].concat(color[i]));
        }
      } else {
        for (var j = 0; j < pos.length; j++) {
          v.push(pos[j]);
        }
      }
      if (this._czmObj.sts !== undefined) {
        vt = this.splitArray2(this._czmObj.sts);
        for (var x = 0; x < vt.length; x++) {
          vt[x][0] = vt[x][0].toFixed(6);
          vt[x][1] = vt[x][1].toFixed(6);
          vt2 += "vt" + " " + vt[x].join(" ") + "\n";
        }
      }
      if (this._czmObj.normals !== undefined) {
        vn = this.splitArray(this._czmObj.normals);
        for (var y = 0; y < vn.length; y++) {
          vn2 += "vn" + " " + vn[y].join(" ") + "\n";
        }
      }
      for (var k = 0; k < v.length; k++) {
        v[k][0] = v[k][0].toFixed(6);
        v[k][1] = v[k][1].toFixed(6);
        v[k][2] = v[k][2].toFixed(6);
        v1 += "v" + " " + v[k].join(" ") + "\n";
      }
      for (var z = 0; z < f.length; z++) {
        if (
          this._czmObj.normals !== undefined &&
          this._czmObj.sts !== undefined
        ) {
          f[z][0] =
            Number(f[z][0] + 1) +
            "/" +
            Number(f[z][0] + 1) +
            "/" +
            Number(f[z][0] + 1);
          f[z][1] =
            Number(f[z][1] + 1) +
            "/" +
            Number(f[z][1] + 1) +
            "/" +
            Number(f[z][1] + 1);
          f[z][2] =
            Number(f[z][2] + 1) +
            "/" +
            Number(f[z][2] + 1) +
            "/" +
            Number(f[z][2] + 1);
        } else if (
          this._czmObj.normals === undefined &&
          this._czmObj.sts === undefined
        ) {
          f[z][0] = Number(f[z][0] + 1);
          f[z][1] = Number(f[z][1] + 1);
          f[z][2] = Number(f[z][2] + 1);
        } else {
          f[z][0] = Number(f[z][0] + 1) + "/" + Number(f[z][0] + 1);
          f[z][1] = Number(f[z][1] + 1) + "/" + Number(f[z][1] + 1);
          f[z][2] = Number(f[z][2] + 1) + "/" + Number(f[z][2] + 1);
        }

        f2 += "f" + " " + f[z].join(" ") + "\n";
      }
      return v1 + vt2 + vn2 + f2;
    },
    // 去掉字符串中的空格
    removeExtraSpace(sentence) {
      //获得当前字符串的长度
      var length = sentence.length;

      //去掉字符串前面的空格
      for (var i = 0; i < length; i++) {
        if (sentence[i] != " ") {
          sentence = sentence.substring(i, length);
          break;
        }
      }

      //去掉字符串前面空格的字符串长度
      length = sentence.length;
      //去掉字符串后面的空格
      for (var i = length - 1; i >= 0; i--) {
        if (sentence[i] != " ") {
          sentence = sentence.substring(0, i + 1);
          break;
        }
      }

      length = sentence.length;
      //去掉字符串中间的空格
      for (var i = 0; i < length; i++) {
        if (sentence[i] == " ") {
          if (sentence[i + 1] == " ") {
            var buffer1 = sentence.substring(0, i);
            var buffer2 = sentence.substring(i + 1, sentence.length);
            sentence = buffer1 + buffer2;
            i--;
          }
        }
      }
      return sentence;
    },
    // 将obj文件信息转化为数组
    objToArr() {
      var arr = [];
      arr = this.obj.split("\n");
      var l = arr.length,
        arr2 = [],
        arr3 = [],
        arr4 = [],
        arr5 = [],
        positions = [],
        colors = [],
        sts = [],
        normals = [],
        indices = [];
      for (var i = 0; i < l; i++) {
        var removeSpaceString = this.removeExtraSpace(arr[i]);
        arr2 = removeSpaceString.split(" ");
        if (arr2[0] == "v") {
          if (
            arr2[1] !== undefined &&
            arr2[2] !== undefined &&
            arr2[3] !== undefined
          ) {
            positions.push(Number(arr2[1]));
            positions.push(Number(arr2[2]));
            positions.push(Number(arr2[3]));
          }

          if (
            arr2[4] !== undefined &&
            arr2[5] !== undefined &&
            arr2[6] !== undefined
          ) {
            colors.push(Number(arr2[4]));
            colors.push(Number(arr2[5]));
            colors.push(Number(arr2[6]));
            colors.push(Number(1));
          }
        } else if (arr2[0] == "vt") {
          if (arr2[1] !== undefined && arr2[2] !== undefined) {
            sts.push(Number(arr2[1]));
            sts.push(Number(arr2[2]));
          }
        } else if (arr2[0] == "vn") {
          if (
            arr2[1] !== undefined &&
            arr2[2] !== undefined &&
            arr2[3] !== undefined
          ) {
            normals.push(Number(arr2[1]));
            normals.push(Number(arr2[2]));
            normals.push(Number(arr2[3]));
          }
        } else if (arr2[0] == "f") {
          if (
            arr2[1] !== undefined &&
            arr2[2] !== undefined &&
            arr2[3] !== undefined
          ) {
            arr3 = arr2[1].split("/");
            arr4 = arr2[2].split("/");
            arr5 = arr2[3].split("/");
            indices.push(Number(arr3[0]) - 1);
            indices.push(Number(arr4[0]) - 1);
            indices.push(Number(arr5[0]) - 1);
          }
        }
      }
      if (positions.length === 0 || indices.length === 0) {
        //弹出确认
        this.$root.$earthUI.confirm(this.lang.tipcontent, () => {});
        return;
      } else {
        this._czmObj.positions = positions;
        this._czmObj.indices = indices;
        if (colors.length / 4 !== positions.length / 3) {
          this._czmObj.colors = undefined;
        } else {
          this._czmObj.colors = colors;
        }
        if (sts.length / 2 !== positions.length / 3) {
          this._czmObj.sts = undefined;
        } else {
          this._czmObj.sts = sts;
        }
        if (normals.length !== positions.length) {
          this._czmObj.normals = undefined;
        } else {
          this._czmObj.normals = normals;
        }
      }
    },
    close() {
      this.$parent.destroyTool(this);
    },
    cancel() {
      this.close();
      const modelToolObj = this._czmObj;
      if (!modelToolObj) {
        return;
      }
      modelToolObj.positionEditing = false;
      modelToolObj.rotationEditing = false;
      if (modelToolObj.isCreating) {
        modelToolObj.isCreating = false;
        modelToolObj.destroy();
      }
    },
    ok() {
      this.close();
      const modelToolObj = this._czmObj;
      modelToolObj.positionEditing = false;
      modelToolObj.rotationEditing = false;
      if (!modelToolObj) {
        return;
      }
      modelToolObj.positionEditing = false;
      if (modelToolObj.isCreating) {
        modelToolObj.isCreating = false;
        const sceneObject = new XE.SceneTree.Leaf(modelToolObj);
        this.$root.$earthUI.addSceneObject(sceneObject);
      }
    },

    flyto() {
      this._czmObj.flyTo();
    },
    reset() {
      this.model.xbsjRotation = [0, 0, 0];
    },
    //拖拽移动上面
    dragOver(e) {
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        (czmObj.positions !== undefined || czmObj.position !== undefined)
      ) {
        e.dataTransfer.dropEffect = "copy";
        this.drag_over = true;
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    dragLeave() {
      this.drag_over = false;
    },
    //拖拽放置
    drop(e) {
      this.drag_over = false;
      e.preventDefault();
      let czmObj = this.$root.$earthUI.getCzmObjectFromDrag(e.dataTransfer);
      if (
        czmObj &&
        (czmObj.position !== undefined || czmObj.positions !== undefined)
      ) {
        this._czmObj.creating = false;
        if (czmObj.position !== undefined) {
          this._czmObj.position = [...czmObj.position];
        } else {
          this._czmObj.position = [...czmObj.positions[0]];
        }
      }
    }
  },
  beforeDestroy() {
    // 解绑数据关联
    this._polygonDisposers = this._polygonDisposers && this._polygonDisposers();
    this._disposers.forEach(e => e());
    this._disposers.length = 0;
  }
};
</script>

<style scoped>
.flatten-flex {
  display: flex;
}
.field {
  padding-left: 4px;
  display: inline-block;
  width: 220px;
}
.header-add .add {
  background: url(../../../images/flatten/add.png) no-repeat;
  background-position: center;
  border-left: none !important;
}
.header-add .add:focus {
  outline: none;
}

.item-btn-box input {
  float: left;
}
.item-btn-box .del {
  background: url(../../../images/flatten/del.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .edit {
  background: url(../../../images/flatten/edit.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .edit-on {
  background: url(../../../images/flatten/edit_on.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .position {
  background: url(../../../images/flatten/position.png) no-repeat !important;
  background-position: center !important;
}
.item-btn-box .autoheight {
  background: url(../../../images/flatten/autoheight.png) no-repeat !important;
  background-position: center !important;
}
.flatten-btn {
  background: none;
  border: none;
  width: 100%;
  height: 34px;
  /* border-left: 1px solid black; */
  margin-top: -1px;
  cursor: pointer;
}
.flatten-btn:focus {
  outline: none;
}
.item-btn-box {
  width: 100%;
  padding-top: 1px;
  border: 1px solid #000;
  border-collapse: collapse;
}
.item-btn-box thead tr {
  border-bottom: 1px solid #000;
}

.item-btn-box thead tr th {
  width: 16.66%;
  text-align: center;
  border-right: 1px solid #000;
}
.item-btn-box tbody tr td {
  border-right: 1px solid #000;
  text-align: center;
}
.item-btn-box tbody tr {
  border-top: 1px solid #000;
}

.iteminput {
  width: 72px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin: 2px;
}
.item-order {
  width: 51px;
  height: 34px;
  text-align: center;
  line-height: 30px;
  border-right: none !important;
  border-top: none !important;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
}
.header-add {
  width: 61px;
  height: 30px;
  /* border-bottom: none !important; */
}
.falatten-body-item div {
  float: left;
}
.header-content {
  width: 264px;
  height: 30px;
  border-left: none !important;
  border-right: none !important;
}
.flatten-table-header {
  width: 100%;
  height: 30px;
}
.flatten-table-header .border {
  float: left;
}
.flatten-table-order {
  width: 51px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  /* border-bottom: none !important; */
}
.xbsj-flatten {
  min-width: 462px;
}
.xbsj-flatten > div {
  width: 100%;
  height: 28px;
  margin-top: 10px;
}
.xbsj-flatten label {
  float: left;
  min-width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
}
.xbsj-flatten .flatten input,
.xbsj-flatten .attributePath input {
  width: calc(100% - 100px);
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
.xbsj-flatten .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.xbsj-flatten .attributePlay .playspan {
  display: inline-block;
  width: 17px;
  height: 20px;
  background: url(../../../images/play.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributePlay .suspendspan {
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(../../../images/suspend.png) no-repeat;
  background-size: contain;
  margin-top: 4px;
}
.xbsj-flatten .attributeLocation input,
.xbsj-flatten .attributeAttitude input {
  width: 66px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
  margin-right: 6px;
}
input[type="text"]:focus,
button:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
.flatten-table {
  display: inline-block;
  width: 80%;
}
.border {
  border: 1px solid black;
}
.select-ul {
  width: 80%;
  padding-left: 8px;
  margin-left: calc(10% + 23px);
  background: rgba(138, 138, 138, 1);
  z-index: 9999;
  position: relative;
}

.cutselectbox {
  width: calc(100% - 102px);
  background: rgba(138, 138, 138, 1);
  position: absolute;
  left: 78px;
  border-radius: 0px 0px 4px 4px;
  overflow: auto;
  z-index: 999;
}
.cutselectbox div {
  width: 100%;
  height: 28px;
  font-size: 14px;
  color: rgba(221, 221, 221, 1);
  cursor: pointer;
  line-height: 28px;
}

.cutselectbox div:hover {
  background: rgba(107, 107, 107, 1);
}

.cutselectbox span {
  display: inline-block;
  /* width: 72px; */
  text-align: left;
  margin-left: 10px;
}

.selectButton {
  width: 12px;
  height: 10px;
  border: none;
  background: url(../../../images/titles-select.png) no-repeat;
  background-size: contain;
  cursor: pointer;
  float: right;
  /* margin-right: 15px; */
  /* margin-top: 10px; */
  outline: none;
  position: absolute;
  right: 9px;
  top: 11px;
}

.buttonGroup {
  display: inline-block;
}
.buttonGroup div {
  display: inline-block;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.attitudeEditCameraButton {
  color: #dddddd;
}
.btncoloron {
  color: #1fffff !important;
}
button {
  background: none;
  border: none;
  margin: 0 auto;
  display: block;
  line-height: 25px;
  outline: none;
}
button:focus {
  outline: none !important;
}
.attitudeEditCameraButton {
  display: block;
  float: left;
  height: 25px;
  margin-left: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #dddddd;
}
.xbsj-videoAttribute .attributePlay button {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
.buttonGroup div .playButton {
  background: url(../../../images/play.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.buttonGroup div .suspendButton {
  background: url(../../../images/suspend.png) no-repeat !important;
  background-size: contain;
  height: 30px;
  width: 100px;
}
.containbox {
  display: flex;
  width: calc(100% - 36px) !important;
  height: 270px !important;
  margin-left: 30px;
}
.topbox {
  width: calc(100% - 36px) !important;
  height: 28px;
  text-align: center;
  line-height: 28px;
  margin-bottom: -10px;
  margin-left: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid black;
}
li {
  list-style: none;
  float: left;
  width: 82px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 36%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
  background: rgba(0, 0, 0, 0.5);
}
.rightbox {
  width: 64%;
  height: 100%;
  float: left;
  background: rgba(0, 0, 0, 0.5);
}
.leftbox span {
  display: block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  padding-left: 10px;
}
.leftbox span:hover {
  background: rgba(0, 0, 0, 0.51);
}
textarea {
  width: calc(100% - 20px);
  height: calc(100% - 55px);
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 10px;
  outline: none;
  resize: none;
}
.footbox {
  width: 100%;
  height: 30px;
  border-top: 1px solid black;
}
.footbox button {
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  /* padding: 2px 15px; */
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  float: right;
}
.footbox button:hover {
  color: #1fffff;
}
.xbsj-input-number {
  border-radius: 4px;
  border: none;
}
.dragButton {
  display: inline-block;
  width: 120px;
  height: 25px;
  margin-left: 18px;
  background: url(../../../images/drag.png) no-repeat;
  background-size: contain;
  text-align: center;
  line-height: 25px;
  float: left;
}

.dragButton.highlight {
  background: url(../../../images/drag_on.png) no-repeat;
  background-size: contain;
  color: #1fffff;
}
</style>