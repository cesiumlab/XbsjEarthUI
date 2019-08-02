<template>
  <div class="xbsj-mainbar-popup popup">
    <table border="1" cellpadding="0" cellspacing="0">
      <tr>
        <th colspan="2">{{lang.title}}</th>
      </tr>
      <tr v-for="(value,index) in shortcutkeys" :key="index">
        <td>{{value.key}}</td>
        <td>{{getText(value)}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      langs: {
        zh: {
          title: "键盘按键说明"
        },
        en: {
          title: "Keyboard Instructions"
        }
      },
      shortcutkeys: [
        {
          key: "W(↑)",
          zh: "水平方向前进",
          en: "Forward"
        },
        {
          key: "A(←)",
          zh: "水平方向左移",
          en: "Left"
        },
        {
          key: "S(↓)",
          zh: "水平方向后退",
          en: "Backward"
        },
        {
          key: "D(→)",
          zh: "水平方向右移",
          en: "Right"
        },
        {
          key: "SHIFT + W(↑)",
          zh: "视线方向前进",
          en: "Sight Forward"
        },
        {
          key: "SHIFT + S(↓)",
          zh: "视线方向后退",
          en: "Sight Backward"
        },
        {
          key: "Q",
          zh: "向左旋转",
          en: "Turn Left"
        },
        {
          key: "E",
          zh: "向右旋转",
          en: "Turn Right"
        },
        {
          key: "R",
          zh: "视点抬高",
          en: "Lift"
        },
        {
          key: "F",
          zh: "视点降低",
          en: "Fall"
        },
        {
          key: "1",
          zh: "减速（默认速度的基础上*0.8）",
          en: "Slow Down"
        },
        {
          key: "2",
          zh: "恢复默认速度",
          en: "Default Speed"
        },
        {
          key: "3",
          zh: "提速（默认速度的基础上*1.2）",
          en: "Speed Up"
        },
        {
          key: "4",
          zh: "切换 固定速度模式/自动速度模式",
          en: "Switch Constant/Auto speed"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    getText(v) {
      if (this.$root.language == "zh") return v.zh;
      else return v.en;
    }
  }
};
</script>
<style scoped>
.popup {
  width: 260px;
  height: 288px;
}
table {
  border: solid black;
  border-width: 0px 1px 1px 0px;
  width: 100%;
}
table td {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
}
table th {
  border: solid black;
  border-width: 1px 0px 0px 1px;
  text-align: center;
  font-size: 14px;
}
.zhu {
  margin-top: 5px;
  color: #f6b5b0;
}
</style>

