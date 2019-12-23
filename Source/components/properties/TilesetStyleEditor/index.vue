<template>
  <Window
    :title="title"
    :width="700"
    :height="445"
    :minWidth="380"
    @ok="ok"
    @cancel="cancel"
    :footervisible="true"
  >
    <div class="container">
      <div class="left">
        <textarea v-model="code"></textarea>
        <div class="box-footer">
          <!-- <label class="error" v-show="error!=''">{{error}}</label> -->
          <a
            href="https://github.com/AnalyticalGraphicsInc/3d-tiles/tree/master/specification/Styling
"
            target="__black"
            style="padding: 1.5px 15px; margin-right: 15px;"
          >{{lang.styledescription}}</a>
          <button @click="save">{{lang.save}}</button>
          <button @click="apply">{{lang.apply}}</button>
        </div>
      </div>
      <div class="right" @contextmenu.prevent="popMenuAdd" @click="cancelEditting($event)">
        <ul ref="right">
          <li
            v-for="(s,index) in styles"
            :class="{highlight:selected == s}"
            @contextmenu.prevent="popMenuStyle(s,index)"
            @click="selectStyle(s)"
            :key="index"
          >
            <img :src="s.thumbnail" />
            <div v-if="!s.editting">
              {{s.name}}
              <span class="toolTip">{{s.name}}</span>
            </div>
            <input v-else v-model="edittingName" @keyup.enter="renameStyle(s)" ref="edittingInput" />
          </li>
        </ul>
      </div>
    </div>
  </Window>
</template>
<script>
function codeValid(code, earthUI) {
  try {
    const style = JSON.parse(code);
  } catch (error) {
    try {
      const style = eval(code + ";style");
      if (typeof style === "undefined") {
        earthUI.promptInfo(`typeof style === 'undefined'`, "error");
        return false;
      }
    } catch (error) {
      // console.warn('3dtiles的style设置不合法！');
      //提醒
      earthUI.promptInfo(error.message || error, "error");
      return false;
    }
  }
  return true;
}

export default {
  props: {
    getBind: Function
  },
  data() {
    return {
      langs: {
        zh: {
          save: "另存为新样式",
          apply: "应用",
          add: "保存新样式",
          styledescription: "style语言说明",
          delete: "删除",
          rename: "重命名",
          thumbnail: "更新缩略图",
          confirmDelete: "确认删除？",
          title: "样式编辑器",
          newStyle: "新建样式",
          confirmUpdate: "确认更新缩略图？"
        },
        en: {
          save: "Save New Style",
          apply: "Apply",
          add: "Save new style",
          styledescription: "Style description",
          delete: "Delete",
          rename: "Rename",
          thumbnail: "Update thumbnail",
          confirmDelete: "confirm delete?",
          title: "Style Editor",
          newStyle: "new style",
          confirmUpdate: "confirm to update thumbnail?"
        }
      },
      lang: undefined,
      code: "",
      orignCode: "",
      styles: [],
      edittingName: "",
      error: "",
      selected: undefined
    };
  },
  computed: {
    title() {
      var b = this.getBind();
      if (!b) return this.lang.title;

      return this.lang.title + "  [" + b.name + "]";
    }
  },
  created() {},
  mounted() {
    //获取当前的样式
    this.orignCode = this.code = this.getBind().xbsjStyle;

    this.queryStyles();
  },
  methods: {
    cancelEditting(e) {
      if (e.target != this.$refs.right) return;
      if (this._editting) {
        this._editting.editting = false;
        this._editting = false;
      }
    },
    cancel() {
      this.getBind().xbsjStyle = this.orignCode;
      this.$parent.destroyTool(this);
    },
    ok() {
      if (codeValid(this.code, this.$root.$earthUI)) {
        //设置样式
        this.getBind().xbsjStyle = this.code;
        this.$parent.destroyTool(this);
      }
    },
    save() {
      //截图
      this.$root.$earth
        .capture(64, 64)
        .then(img => {
          //更新，如果成功，那么刷新页面，否则提示错误
          this._newStyle(img);
        })
        .catch(err => {
          this.error = err.message || ex;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    apply() {
      if (codeValid(this.code, this.$root.$earthUI)) {
        this.getBind().xbsjStyle = this.code;
      }
    },
    _newStyle(img) {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .newStyle(this.lang.newStyle, this.code, img)
        .then(() => {
          this.queryStyles();
        })
        .catch(ex => {
          this.error = ex.message || ex;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
      this.edittingName = "";
    },
    popMenuAdd() {
      this.$root.$earthUI.contextMenu.pop([
        {
          text: this.lang.add,
          keys: "",
          func: () => {
            //截图
            this.$root.$earth
              .capture(64, 64)
              .then(img => {
                //更新，如果成功，那么刷新页面，否则提示错误
                this._newStyle(img);
              })
              .catch(err => {
                this.error = err.message || ex;
                this.$root.$earthUI.promptInfo(this.error, "error");
              });
          }
        }
      ]);
    },
    queryStyles() {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .styles()
        .then(styles => {
          styles.forEach(s => {
            s.editting = false;
          });

          this.styles = styles;
        })
        .catch(ex => {
          this.error = ex.message || ex;
          this.$root.$earthUI.promptInfo(this.error, "error");
          this.styles = [];
        });
    },
    renameStyle(style) {
      var labServer = this.$root.$earthUI.labServer;
      labServer
        .rename("styles", style._id, this.edittingName)
        .then(styles => {
          this.queryStyles();
        })
        .catch(ex => {
          this.error = ex.message || ex;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
      this.edittingName = "";
    },
    deleteStyle(style) {
      //确认删除提示
      this.$root.$earthUI.confirm(this.lang.confirmDelete, () => {
        var labServer = this.$root.$earthUI.labServer;
        labServer
          .deleteStyle(style._id)
          .then(() => {
            this.queryStyles();
          })
          .catch(ex => {
            this.error = ex.message;
            this.$root.$earthUI.promptInfo(this.error, "error");
          });
      });
    },
    _updateThumbnail(style, img) {
      this.$root.$earthUI.confirm(this.lang.confirmUpdate, () => {
        var labServer = this.$root.$earthUI.labServer;
        labServer
          .updateLayerThumbnail("styles", style._id, img)
          .then(data => {
            this.queryStyles();
          })
          .catch(err => {
            this.error = err.message;
            this.$root.$earthUI.promptInfo(this.error, "error");
          });
      });
    },
    updateStyle(style) {
      //截图
      this.$root.$earth
        .capture(64, 64)
        .then(img => {
          //更新，如果成功，那么刷新页面，否则提示错误
          this._updateThumbnail(style, img);
        })
        .catch(err => {
          this.error = err.message;
          this.$root.$earthUI.promptInfo(this.error, "error");
        });
    },
    popMenuStyle(s, index) {
      this.$root.$earthUI.contextMenu.pop([
        {
          text: this.lang.rename,
          keys: "",
          func: () => {
            this.edittingName = s.name;
            s.editting = true;

            if (this._editting) {
              this._editting.editting = false;
            }
            this._editting = s;

            this.$nextTick(() => {
              this.$refs.edittingInput[0].focus();
            });
          }
        },
        {
          text: this.lang.thumbnail,
          keys: "",
          func: () => {
            this.updateStyle(s);
          }
        },
        {
          text: this.lang.delete,
          keys: "",
          func: () => {
            this.deleteStyle(s);
          }
        }
      ]);
    },
    selectStyle(style) {
      this.selected = style;
      this.code = style.code;
    }
  }
};
</script>
<style scoped>
.error {
  color: red;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
.left {
  width: 50%;
  height: 100%;
  display: inline-block;
}
.left textarea {
  width: 100%;
  height: calc(100% - 55px);
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #ffffff;
  margin-top: 5px;
  padding: 10px;
  outline: none;
  resize: none;
}
.box-footer {
  float: right;
  margin-right: -20px;
}
.box-footer button,
.box-footer a {
  display: inline-block;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  padding: 3px 15px;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
}
.box-footer button:hover,
.box-footer a:hover {
  color: #1fffff;
}
.right {
  width: 50%;
  height: 100%;
  display: flex;
}

.right img {
  width: 64px;
  height: 64px;
  border: 2px solid;
  margin: 5px;
  border-radius: 4px;
}
.right div {
  width: 68px;
  text-align: center;
  margin-left: 5px;
  margin-top: -5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right input {
  display: block;
  width: 68px;
  text-align: center;
  margin-left: 5px;
  margin-top: -2px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border: none;
  outline: none;
  padding-top: 2px;
  padding-bottom: 2px;
}
.right {
  margin-left: 24px;
}
.right ul {
  cursor: pointer;
}
.right li {
  display: inline-block;
  position: relative;
}
.right li.highlight img,
.right li img:hover {
  border: 2px solid rgba(31, 255, 255, 1);
  margin: 5px;
}
.right ul li div .toolTip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  left: 10px;
  bottom: 20px;
}
.right ul li div:hover .toolTip {
  visibility: visible;
}
</style>
