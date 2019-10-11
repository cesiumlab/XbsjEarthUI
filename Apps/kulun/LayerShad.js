function createLayerShad() {
  return {
    props: {
      getBind: Function
    },
    template: `
   <Window :width="360" :height="510" title="地质分层着色" @cancel="close" >
        <table style="width:100%;" class="layerShadWindow">
            <thead>
                <tr>
                    <td>
                        <XbsjSelect v-model="currentSelect" :list="fields" @input="updateKeyValue"></XbsjSelect>
                    </td>
                    <td>{{lang.visible}}</td>
                    <td>{{lang.color}}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(con,index) in conditions" :key="con.value">
                    <td>{{con.name}}</td>
                    <td>
                        <XbsjCheckBox v-model="con.show" @on-change="updateStyle"></XbsjCheckBox>
                    </td>
                    <td>
                        <XbsjColorButton v-model="con.color" @colorChanged="updateStyle"></XbsjColorButton>
                    </td>
                </tr>
            </tbody>
        </table>
    </Window>`,
    data() {
      return {
        langs: {
          zh: {
            visible: "可见性",
            color: "颜色"
          },
          en: {
            visible: "visible",
            color: "color"
          }
        },
        lang: undefined,
        conditions: [],
        fields: [],
        currentSelect: "",
        xbsjStyle: "",
        url: "",
        _eff: undefined
      };
    },
    created() {},
    mounted() {
      let czmObject = this.getBind();

      this.xbsjStyle = czmObject.toJSON(false).xbsjStyle;

      this._eff = czmObject._tileset._properties;

      var ppp = this._eff.features[0].prop;
      //获取所有字段信息
      var fields = [];
      for (var f in ppp) {
        fields.push(f);
      }
      if (fields.length == 0) return;
      this.fields = fields;
      this.currentSelect = this.fields[0];

      this.$nextTick(() => {
        //将vue数据和xbsjEarth数据进行绑定
        this._disposers = this._disposers || [];
        this._disposers.push(
          XE.MVVM.bind(this, "xbsjStyle", this.getBind(), "xbsjStyle")
        );

        this.updateKeyValue();
      });
    },
    methods: {
      getName(value) {
        //如果是layer
        if (this.currentSelect == "Layer") {
          var names = this._eff.layerNames;
          if (names && value < names.length) {
            return names[value];
          }
        }
        //如果是材质
        else if (
          this.currentSelect == "Material" ||
          this.currentSelect == "Lithology"
        ) {
          var names = this._eff.materials;
          var idx = names.findIndex(m => m.id == value);
          if (idx >= 0) {
            return names[idx].material;
          }
        }
        return value;
      },
      updateKeyValue() {
        var conditions = [];
        this._eff.features.forEach(con => {
          var value = con.prop[this.currentSelect];
          var idx = conditions.findIndex(c => c.value == value);
          if (idx < 0) {
            conditions.push({
              value: value,
              name: this.getName(value),
              show: true,
              color: this.randomColor()
            });
          }
        });
        conditions.sort((a, b) => {
          return a.value - b.value;
        });
        this.conditions = conditions;

        this.updateStyle();
      },
      randomColor() {
        let color = Cesium.Color.fromRandom();

        return {
          rgba: {
            r: Math.floor(color.red * 255),
            g: Math.floor(color.green * 255),
            b: Math.floor(color.blue * 255),
            a: 1
          }
        };
      },
      close() {
        this.$parent.destroyTool(this);
      },
      rgbaStr(c) {
        if (!c || !c.rgba) return "rgba(255,0,0,1)";
        var rgba = c.rgba;

        return (
          "rgba(" +
          Math.floor(rgba.r) +
          "," +
          Math.floor(rgba.g) +
          "," +
          Math.floor(rgba.b) +
          "," +
          rgba.a +
          ")"
        );
      },
      updateStyle() {
        if (this.currentSelect === "") {
          return;
        }
        let show =
          " show: {\r\n\
                conditions: [\r\n\
                ";
        this.conditions.forEach(con => {
          show +=
            "['${" +
            this.currentSelect +
            "}===" +
            con.value +
            "','" +
            con.show +
            "'],\r\n\
                ";
        });

        show +=
          " ['true', 'true']\r\n\
                " + "]\r\n\
                 }";

        let color =
          "color: {\r\n\
                                conditions: [\r\n\
                                ";

        this.conditions.forEach(con => {
          color +=
            "['${" +
            this.currentSelect +
            "}===" +
            con.value +
            "','" +
            this.rgbaStr(con.color) +
            "'],\r\n\
                ";
        });

        color +=
          "['true', 'rgb(255 255, 255)']\r\n\
                " +
          "]\r\n\
                }";

        let stylestr =
          "var style = {\r\n\
            " + color + "\r\n ," + show + "\r\n }";

        eval(stylestr);
        //console.log(style);
        this.xbsjStyle = stylestr;
      }
    }
  };
}
