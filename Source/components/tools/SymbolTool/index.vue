<template>
  <Window
    ref="win"
    :footervisible="false"
    @cancel="show=false"
    v-show="show"
    :width="500"
    :height="500"
    :min-width="396"
    :left="500"
    :top="138"
    :title="lang.title"
  >
    <div class="containbox">
      <div class="leftbox">
        <XbsjVirtualTree ref="vtree" :tree="tree" @on-click="itemClick"></XbsjVirtualTree>
      </div>
      <div class="rightbox">
        <div>
          <ul>
            <li
              v-for="(symbol,index) in symbols"
              style="width:64px;height:64px;"
              @click="createGroundImage(symbol)"
              :key='index'
            >
              <div class="backimg">
                <img
                  :src="symbol.base64"
                  class="itemimg"
                  style="width:40px;height:40px;background-color: #fff;"
                />
              </div>
              <div style="line-height:0;">
                <span>{{symbol.name}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
export default {
  data () {
    return {
      show: true,
      tree: [],
      symbols: [],
      langs: {
        zh: {
          title: "标绘"
        },
        en: {
          title: "Symbol"
        }
      },
      lang: undefined
    };
  },
  created () { },
  mounted () {
    this.initSymbol()
  },
  methods: {
    createGroundImage (symbol) {
      if (symbol.content === null || symbol.content === '') {
        var groundImage = new XE.Obj.GroundImage(this.$root.$earth)
        groundImage.editing = true
        
        if (symbol.image.indexOf('data') !== 0) {
          console.log(symbol.image)
          var base64Str = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(symbol.image)))
          groundImage.imageUrls = [base64Str]
        }
        else {
          groundImage.imageUrls = [symbol.base64]
        }
        this.$root.$earthUI.showPropertyWindow(groundImage)
        if (symbol.image.indexOf('data') !== 0) {
          console.log(symbol.image)
          var base64Str = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(symbol.image)))
          groundImage.imageUrls = [base64Str]
        }
        else {
          groundImage.imageUrls = [symbol.imageUrls]
        }
        window.groundImage = groundImage
      }
    },
    initSymbol (id) {
      var labServer = this.$root.$labServer;
      var self = this
      labServer
        .getSymbol(id)
        .then(result => {
          if (result.status === 'ok' && result.symbols.rows.length === 1) {
            self.tree = []
            var content = JSON.parse(result.symbols.rows[0].content)
            self.tree.push(self.initTreeNode(content))
          }
        })
        .catch(err => {
          this.error = err;
        });
    },
    initTreeNode (node) {
      var self = this
      var treeNode = {
        id: node._id,
        expand: true,
        title: node.name,
        symbols: node.symbols,
        children: []
      }
      if (node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
          treeNode.children.push(self.initTreeNode(node.children[i]))
        }
      }
      return treeNode
    },
    itemClick (item) {
      item = item.item
      // console.log(item);
      if (item.symbols.length > 0) {
        var labServer = this.$root.$labServer;
        var self = this
        var ids = item.symbols.join(',').replace('\"', '')
        labServer
          .getSymbols(ids)
          .then(result => {
            if (result.status === 'ok') {
              self.symbols = result.symbols.rows
              self.symbols.forEach((symbol) => {
                if (symbol.image.indexOf('data') !== 0) {
                  symbol.base64 = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(symbol.image)))
                } else {
                  symbol.base64 = symbol.image
                }
              })
            }
          })
          .catch(err => {
            this.error = err;
          });
      }
    },
    // 圆弧
    Arc () {
      var Arc = new XE.Obj.Plots.GeoArc(this.$root.$earth);
      Arc.creating = true;
      Arc.isCreating = true;
      Arc.name = "圆弧";
      this.$root.$earthUI.showPropertyWindow(Arc);
    },
    // 圆
    Circle () {
      var Circle = new XE.Obj.Plots.GeoCircle(this.$root.$earth);
      Circle.creating = true;
      Circle.isCreating = true;
      Circle.name = "圆";
      this.$root.$earthUI.showPropertyWindow(Circle);
    },
    // 矩形
    Rectangle () {
      var Rectangle = new XE.Obj.Plots.GeoRectangle(this.$root.$earth);
      Rectangle.creating = true;
      Rectangle.isCreating = true;
      Rectangle.name = "矩形";
      this.$root.$earthUI.showPropertyWindow(Rectangle);
    },
    // 曲面旗标
    CurveFlag () {
      var CurveFlag = new XE.Obj.Plots.GeoCurveFlag(this.$root.$earth);
      CurveFlag.creating = true;
      CurveFlag.isCreating = true;
      CurveFlag.name = "曲面旗标";
      this.$root.$earthUI.showPropertyWindow(CurveFlag);
    },
    // 直角旗标
    RightAngleFlag () {
      var RightAngleFlag = new XE.Obj.Plots.GeoRightAngleFlag(
        this.$root.$earth
      );
      RightAngleFlag.creating = true;
      RightAngleFlag.isCreating = true;
      RightAngleFlag.name = "直角旗标";
      this.$root.$earthUI.showPropertyWindow(RightAngleFlag);
    }
  }
};
</script>

<style scoped>
.containbox {
  display: flex;
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
  float: left;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
li:hover {
  background: rgba(0, 0, 0, 0.51);
}
.leftbox {
  width: 45%;
  height: 100%;
  float: left;
  border-right: 1px solid black;
}
.rightbox {
  width: 55%;
  height: 100%;
  float: left;
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
</style>
