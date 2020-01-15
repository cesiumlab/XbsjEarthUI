<template>
  <Window
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :width="463"
    :minWidth="200"
    :height="500"
    :left="500"
    :top="138"
    :title="lang.title"
  >
    <div class="group" v-for="g in groups">
      <div class="groupname" @click=" g.close = !g.close;">
        <label>{{g.name}}</label>
        <XbsjIcon
          type="ios-arrow-forward"
          :class="{ XbsjVritualTreeItemExpandIcon: true, XbsjVritualTreeItemRotate: !g.close }"
          style="position: absolute;right: 18px;"
        />
      </div>
      <ul :class="{'group-list-close':g.close}" v-if="g.props.length>0">
        <li v-for="p in g.props">
          <label class="liname">{{p.name}}</label>
          <label class="livalue">{{p.value}}</label>
        </li>
      </ul>
    </div>
  </Window>
</template>

<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          title: "对象属性"
        },
        en: {
          title: "Feature Property"
        }
      },
      lang: undefined,
      show: false,
      groups: [],
      disabled: false
    };
  },
  created() {},
  mounted() {
    //监控获取pick到的对象
    const picking = this.$root.$earth.interaction.picking;
    // 修复feature属性窗口自动弹出的问题，XE.MVVM.watch(picking, 'clickedObj' 会导致莫名奇妙被调用，虽然clickObj中的值并未发生变化。
    // this.unAutorun = XE.MVVM.watch(picking, 'clickedObj', () => {
    this.unAutorun = XE.MVVM.watch(() => picking.clickedObj, () => {
      // var feature =
      //   this.$root.$earth.pickedObject.clicked &&
      //   this.$root.$earth.pickedObject.clicked.rawObject;
      const co = picking.clickedObj;
      const pickedObject = co && picking.clickedAttachedInfo;
      const feature = pickedObject instanceof Cesium.Cesium3DTileFeature && pickedObject;

      //如果有对象并且没有禁用弹出，那么弹出
      if (feature && !this.disabled) this.onPicked(feature);
      else this.show = false;
    });
  },
  methods: {
    getProperties(feature) {
      if (!feature || !feature.hasProperty) return;
      var fileParams;
      //如果有文件名，那么依据文件名
      if (feature.hasProperty("file")) {
        var file = feature.getProperty("file");

        if (feature.tileset.properties) {
          for (var i = 0; i < feature.tileset.properties.length; i++) {
            var params = feature.tileset.properties[i];
            if (params.file == file) {
              fileParams = params.params;
            }
          }
        }
      }
      //直接取第一个
      else if (feature.tileset.properties) {
        if (feature.tileset.properties.length > 0)
          fileParams = feature.tileset.properties[0].params;
      }

      //解析json属性，
      var groups = [
        {
          name: "通用",
          props: []
        }
      ];

      function findDef(fieldname) {
        if (!fileParams) return;

        return fileParams.find(g => g.name == fieldname);
      }

      function findGroup(groupname) {
        return groups.find(g => g.name == groupname);
      }
      function findGroupByField(fieldname) {
        var def = findDef(fieldname);
        if (!def || def.group == "") return groups[0];

        var g = findGroup(def.group);
        if (!g) {
          g = {
            name: def.group,
            props: []
          };
          groups.push(g);
        }

        return g;
      }

      if (!feature._content || !feature._content.batchTable) return;
      var names = feature._content.batchTable.getPropertyNames(
        feature._batchId
      );
      if (!names) return;
      //遍历所有属性去显示
      for (var i = 0; i < names.length; i++) {
        var n = names[i];
        var group = findGroupByField(n);
        group.props.push({
          name: n,
          value: feature.getProperty(n)
        });
      }

      return groups;
    },
    onPicked(feature) {
      this.groups = [];

      // console.log(feature);

      //尝试获取bim分组属性
      this.groups = this.getProperties(feature);

      //设置为空数组
      if (!this.groups) this.groups = [];

      // console.log(this.groups);
      this.groups.forEach(element => {
        //动态添加一个close控制展开和收起
        this.$set(element, "close", false);
      });

      if (!this.show) {
        //设置window的位置永远靠右
        this.show = true;
      }
    }
  },
  computed: {},
  filters: {},
  beforeDestroy() {},
  watch: {}
};
</script>

<style scoped>
.group .groupname {
  display: inline-block;
  width: 100%;
  height: 25px;
  text-align: left;
  line-height: 25px;
  background: rgba(71, 71, 71, 0.8);
  position: relative;
  padding-left: 10px;
  border-bottom: 1px solid rgba(158, 158, 158, 0.23);
}
.group ul {
  border-bottom: 1px solid rgba(158, 158, 158, 0.23);
}
.group ul li {
  border-top: 1px solid rgba(232, 232, 232, 0.2);
}
.liname {
  width: 50%;
  display: inline-block;
  border-right: 1px solid rgba(232, 232, 232, 0.2);
  text-align: right;
  padding-right: 10px;
}
.livalue {
  padding-left: 10px;
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
.group-list-close {
  display: none;
}
</style>
