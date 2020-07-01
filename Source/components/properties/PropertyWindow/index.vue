<template>
  <Window :width="420" :height="500" :title="lang.title" @cancel="close">
    <div class="xbsj-treecommon">
      <div class="attribut-group" v-for="(item,index) in attribute" :key="index">
        <!-- 分类名称，点击展开收缩 -->
        <div class="group-name" @click=" item.close = !item.close;">
          {{item.name.chinese}}
          <XbsjIcon
            type="ios-arrow-forward"
            :class="{ XbsjVritualTreeItemExpandIcon: true, XbsjVritualTreeItemRotate: !item.close }"
            style="position: absolute;right: 18px;"
          />
        </div>
        <div :class="{'group-list-close':item.close}" v-if="item.properties.length>0">
          <div
            style="padding-top: 0px;
                      margin-bottom: 0px;
                          border-top: 1px solid rgba(232, 232, 232, 0.2);height:30px;"
            class="treecommon"
            v-for="(list,i) in item.properties"
            :key="i"
          >
            <label :title="list">{{list}}</label>
            <div v-if="list==='xbsjRotation'||list==='xbsjPosition'">
              <XbsjHeadingPitchRoll v-if="list==='xbsjRotation'" v-model="objdeflut[list]"></XbsjHeadingPitchRoll>
              <XbsjLngLatHeight v-if="list==='xbsjPosition'" v-model="objdeflut[list]"></XbsjLngLatHeight>
            </div>

            <div v-else>
              <input
                v-model="objdeflut[list]"
                v-if="(jsonSchema.properties[list].type==='string'&& !jsonSchema.properties[list].enum)||jsonSchema.properties[list].type==='number'"
                @blur.prevent="vchange($event.target.value,list)"
              />
              <XbsjSwitch
                style="position: relative;top: 2px;"
                v-model="objdeflut[list]"
                :value="objdeflut[list]"
                v-if="jsonSchema.properties[list].type==='boolean'"
              ></XbsjSwitch>
              <XbsjSelect
                v-model="objdeflut[list]"
                :list="jsonSchema.properties[list].enum"
                style="width: 52%;margin-left: calc(35% + 34px);"
                v-if="jsonSchema.properties[list].type==='string' && jsonSchema.properties[list].enum"
              ></XbsjSelect>
              <div class="attribut-element" v-if="jsonSchema.properties[list].type==='array'">
                <input
                  v-bind:value="objdeflut[list]"
                  @blur.prevent="vchange($event.target.value,list)"
                />
              </div>
              <div
                v-if="jsonSchema.properties[list].type==='object' && !Array.prototype.isPrototypeOf(jsonSchema.properties[list])"
              >
                <button
                  @click="openPropertyWindow(list,jsonSchema.properties[list])"
                  class="propertybtn"
                >{{lang.title}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
export default {
  props: {
    getBind: Function,
    nextczm: Object
  },

  data() {
    return {
      langs: {
        zh: {
          title: "属性"
        },
        en: {
          title: "Property"
        }
      },
      attribute: {}, //分类，属性名
      objdeflut: {}, //属性默认值
      jsonSchema: {} //完整的数据以及数据类型
    };
  },
  created() {
    // 父组件传递过来的数据
    const czmObject = this.getBind();

    try {
      this.jsonSchema =
        this.nextczm || JSON.parse(JSON.stringify(czmObject._jsonSchema));
      {
        const originIgnoreDefault = czmObject.ignoreDefualt;
        czmObject.ignoreDefualt = false;
        //解决czmobject没有tojson()方法
        try {
          this.objdeflut = czmObject.toJSON();
        } catch (error) {
          this.objdeflut = JSON.parse(JSON.stringify(czmObject));
        }

        czmObject.ignoreDefualt = originIgnoreDefault;
      }

      if (!czmObject._classification) {
        //如果属性没有_classification就构造一个attribute对象用于分类
        this.attribute = [
          {
            name: {
              chinese: "通用",
              english: "General"
            },
            properties: []
          }
        ];
        //构造的分类默认只有一个通用-->this.attribute[0]
        for (var name in this.jsonSchema.properties) {
          this.attribute[0].properties.push(name);
        }
        //动态添加一个close控制展开和收起
        this.attribute.forEach(element => {
          this.$set(element, "close", false);
        });
      } else {
        this.attribute = JSON.parse(JSON.stringify(czmObject._classification));
        this.attribute.forEach(element => {
          //动态添加一个close控制展开和收起
          this.$set(element, "close", false);
        });
      }
    } catch (err) {}
  },
  mounted() {
    this.$nextTick(() => {
      //将vue数据和xbsjEarth数据进行绑定
      this._viewUnbinds = this._viewUnbinds || [];
      this.attribute.forEach(element => {
        element.properties.forEach(el => {
          if (
            (typeof this.objdeflut[el] === "object") &
            !Array.prototype.isPrototypeOf(this.objdeflut[el])
          ) {
            return;
          }
          this._viewUnbinds.push(
            XE.MVVM.bind(this, "objdeflut." + el, this.getBind(), el)
          );
        });
      });
    });
  },
  beforeDestroy() {
    //销毁解绑
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  },
  methods: {
    close() {
      this.$parent.destroyTool(this);
    },
    vchange(v, n) {
      //当input值改变之后判断具体的类型，将string转成数组
      if (v === "") {
        return;
      }
      if (this.objdeflut[n]) {
        if (this.jsonSchema.properties[n].type === "array") {
          if (this.jsonSchema.properties[n].items.type === "number") {
            this.objdeflut[n] = v.split(",").map(Number);
          } else {
            this.objdeflut[n] = v.split(",");
          }
        } else if (this.jsonSchema.properties[n].type === "number") {
          this.objdeflut[n] = Number(v);
        }
      } else {
        for (var name in this.jsonSchema.properties) {
          if (
            this.jsonSchema.properties[name].type === "object" &&
            this.jsonSchema.properties[name].properties[n]
          ) {
            let type = this.jsonSchema.properties[name].properties[n].items
              .type;
            if (type === "string") {
              this.erjiobjdeflut[n] = v.split(",");
            } else {
              this.erjiobjdeflut[n] = v.split(",").map(Number);
            }
          }
        }
      }
    },
    openPropertyWindow(name, jsonSchema) {
      //判断是否需要显示耳二级弹窗（error:需要定义xxxx属性）

      //如果有二级菜单，将二级的数据传递调用openPropertyWindow再次调用本页面将数据渲染出来。
      let item = this.getBind()[name];
      // this.$root.$earthUI.showPropertyWindow(item);
      this.$root.$earthUI.showPropertyWindow(item, { jsonSchema });
    }
  }
};
</script>

<style scoped>
.propertybtn {
  width: 99px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  color: #fff;
  border: none;
  cursor: pointer;
}
.xbsj-treecommon {
  width: 100%;
  min-width: 400px;
}
.xbsj-treecommon label {
  float: left;
  width: 35%;
  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-left: 8px;
  margin-right: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-right: 1px solid rgba(232, 232, 232, 0.2);
  padding-right: 9px;
}
.treecommon:last-child {
  border-bottom: 1px solid rgba(232, 232, 232, 0.2);
}
.treecommon:first-child {
  border-top: none;
}
.xbsj-treecommon .treecommon input,
.xbsj-treecommon .attributePath input {
  /* width: 216px; */
  width: 52%;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  border: none;
  color: #dddddd;
  padding-left: 10px;
}
input:focus {
  border: 2px solid rgba(31, 255, 255, 1);
}
.group-name {
  width: 100%;
  height: 25px;
  text-align: left;
  line-height: 25px;
  background: rgba(71, 71, 71, 0.8);
  position: relative;
  padding-left: 10px;
  border-bottom: 1px solid rgba(158, 158, 158, 0.23);
}
.attribut-group {
  width: 100%;
  height: auto;
}
.group-list-close {
  display: none;
}
.XbsjVritualTreeItemExpandIcon {
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.XbsjVritualTreeItemRotate {
  transform: rotateZ(90deg);
}
</style>