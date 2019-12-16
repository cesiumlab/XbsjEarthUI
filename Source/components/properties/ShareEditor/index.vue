<template>
  <Window
    :title="title"
    :width="700"
    :height="460"
    :minWidth="380"
    @ok="ok"
    @cancel="cancel"
    :footervisible="true"
  >
    <div class="xbsj-flatten">
      <!-- 名称 -->
      <div class="flatten">
        <label>{{lang.name}}</label>
        <input style="float:left;" type="text" v-model="addData.name" />
      </div>
      <!-- 标签 -->
      <div class="flatten">
        <label>{{lang.label}}</label>
        <input style="float:left;" type="text" v-model="addData.label" />
      </div>
      <!-- 描述 -->
      <div class="flatten" style="height: 80px">
        <label>{{lang.description}}</label>
        <textarea style="float:left; height: 60px" v-model="addData.description"></textarea>
      </div>
      <!-- 代码 -->
      <!-- <div class="flatten" style="height: 234px">
        <label>{{lang.code}}</label>
        <textarea style="float:left; height: 216px" v-model="addData.content"></textarea>
      </div>-->
      <div class="flatten">
        <label>{{lang.thumbnail}}</label>
        <div class="thumbnail">
          <img :src="addData.thumbnail" v-show="addData.thumbnail" />
          <div class="noimg" v-show="!addData.thumbnail">{{lang.noimg}}</div>
          <button class="addcapture" @click="capture">{{lang.capture}}</button>
        </div>
        <!-- <XbsjCaptureThumbnail
          style="float:right;width: calc(100% - 83px);height: 96px;"
          v-model="addData.thumbnail"
        ></XbsjCaptureThumbnail>-->
      </div>
    </div>
  </Window>
</template>
<script>
import axios from "axios";
import QS from "qs";

export default {
  props: {
    getBind: Function
  },
  data () {
    return {
      langs: {
        zh: {
          title: "分享",
          name: "标题",
          label: "标签",
          description: "描述",
          code: "代码",
          thumbnail: "缩略图",
          noimg: "暂无缩略图",
          capture: "截图",
          sharesuccess: "添加分享成功",
          sharetip: "您的分享在审核通过后有可能被其他用户使用，确认分享吗?"
        },
        en: {
          title: "Share",
          name: "Name",
          label: "Label",
          description: "Description",
          code: "Code",
          thumbnail: "Thumb",
          noimg: "No Thumb",
          capture: "Capture",
          sharesuccess: "Add share success",
          sharetip: "Your share may be used by other users. Do you confirm to share?"
        }
      },
      lang: undefined,
      addData: {
        name: "",
        label: "",
        description: "",
        content: "",
        thumbnail: ""
      }
    };
  },
  computed: {
    title () {
      var b = this.getBind();
      if (!b) return this.lang.title;

      return this.lang.title + "  [" + b.name + "]";
    }
  },
  created () { },
  mounted () {
    var czmObj = this.getBind();
    this.addData.name = czmObj.name;
    this.addData.content = czmObj.toJSONStr();
  },
  methods: {
    capture () {
      //截图
      this.$root.$earth
        .capture(192, 128)
        .then(img => {
          //更新，如果成功，那么刷新页面，否则提示错误
          this.addData.thumbnail = img;
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel () {
      this.$parent.destroyTool(this);
    },
    ok () {
      let self = this;
      this.$root.$earthUI.confirm(this.lang.sharetip, () => {
        self.$parent.destroyTool(self);
        var shareAddServer = self.$root.$labServer;
        let url = shareAddServer.server + "symbol/share/add";
        axios
          .post(url, QS.stringify(self.addData))
          .then(res => {
            // console.log(res);
            if (res.data.status === "ok") {
              self.$root.$earthUI.promptInfo(self.lang.sharesuccess);
            }
          })
          .catch(err => {
            self.$root.$earthUI.promptInfo(err, "error");
          });
      });
    }
  }
};
</script>
<style scoped>
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
textarea {
  width: calc(100% - 110px);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #ffffff;
  padding: 10px;
  outline: none;
  resize: none;
}
.thumbnail {
  width: 192px;
  height: 192px;
  margin-left: 82px;
}
img {
  width: 192px;
  height: 128px;
  border: 1px solid #000;
  border-radius: 5px;
  margin-right: -20px;
}
.noimg {
  width: 192px;
  height: 128px;
  line-height: 128px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 5px;
}
.addcapture {
  width: 192px;
  border: none;
  background: #000;
  border-radius: 5px;
  margin-top: 4px;
  color: #fff;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
}
</style>
