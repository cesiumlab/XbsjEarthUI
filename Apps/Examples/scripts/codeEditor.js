var lastForceCodeTimeStamp = 0;

var delayApply = (function () {
  var _settingCodeDelay = new rxjs.Subject();
  var _settingCodeDelaySubscription;

  function delayApply_(code, vueApp) {
    _settingCodeDelaySubscription =
      _settingCodeDelaySubscription ||
      _settingCodeDelay
        .pipe(rxjs.operators.debounceTime(2000))
        .subscribe(() => {
          const diffTime = Date.now() - lastForceCodeTimeStamp;
          if (diffTime > 2000 + 500) {
            vueApp.autoRefresh && vueApp.apply();
          }
        });

    _settingCodeDelay.next(code);
  }
  return delayApply_;
})();

var setCodeFromUrl = (function () {
  var _setCodeFromUrlSubscription;

  function setCodeFromUrl_(url, vueApp) {
    _setCodeFromUrlSubscription && _setCodeFromUrlSubscription.unsubscribe();
    _setCodeFromUrlSubscription = undefined;

    _setCodeFromUrlSubscription =
      _setCodeFromUrlSubscription ||
      rxjs.fetch
        .fromFetch(url)
        .pipe(
          rxjs.operators.switchMap(res => {
            if (res.ok) {
              return res.text();
            } else {
              return of({
                error: true,
                message: `Error ${res.status}`
              });
            }
          }),
          rxjs.operators.catchError(err => {
            // Network or other error, handle appropriately
            console.error(err);
            return of({
              error: true,
              message: err.message
            });
          }),
          rxjs.operators.map(code => {
            lastForceCodeTimeStamp = Date.now();
            code && (vueApp.code = code);
            vueApp.apply();
          })
        )
        .subscribe(() => {
          _setCodeFromUrlSubscription &&
            _setCodeFromUrlSubscription.unsubscribe();
          _setCodeFromUrlSubscription = undefined;
        });
  }
  return setCodeFromUrl_;
})();

var CodeEditor = {
  props: {
    value: String
  },
  template: `
      <div ref="monaco"></div>
    `,
  data() {
    return {
      curTheme: 'vs-dark',
      language: 'html',
      isChange: false
    };
  },
  watch: {
    value(val) {
      if (!this.isChange) {
        this.getdata(val);
      }
      this.isChange = false;
    }
  },
  methods: {
    getdata(val) {
      let self = this;
      // 配置路径别名
      require.config({ paths: { 'vs': './scripts/monacoeditor/vs' } });
      // 加载editor.main依赖(editor.main为编辑器的主入口)
      require(['vs/editor/editor.main'], function () {

        //销毁实例
        if (self.editor && !self.isChange) {
          self.editor.dispose();
        }
        self.editor = monaco.editor.create(self.$refs.monaco, {
          value: val,
          language: self.language,
          theme: self.curTheme,
          // 自适应layout
          automaticLayout: true
        });

        var editor = self.editor;
        editor.onDidChangeModelContent(function (event) {//编辑器内容change事件
          self.isChange = true;
          self.$emit("input", editor.getValue()); //通过如此调用可以改变父组件上v-model绑定的值
        });
      });

    }
  },
  mounted() { },
};

var vueApp = new Vue({
  components: {
    CodeEditor
  },
  el: "#vueApp",
  data: {
    examples: [],
    autoRefresh: true,
    code: "",
    id: "",
    title: "<未能获取示例名称!>",
    menu: "",
    scl: false,
    reduce: false
  },
  mounted() {
    var q = {};
    location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = v));
    this.menu = q.menu;
    if (q.menu === "false") {
      this.menu = false;
    } else {
      this.menu = true;
    }
  },
  methods: {
    changemenu() {
      var q = {};
      location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
      this.menu = !this.menu;
      if (q.url) {
        window.history.replaceState(null, null, `?menu=${this.menu}&url=${q.url}`);
      } else if (q.code) {
        window.history.replaceState(null, null, `?menu=${this.menu}&code=${q.code}`);
      } else if (q.id) {
        window.history.replaceState(null, null, `?menu=${this.menu}&id=${q.id}`);
      } else {
        window.history.replaceState(null, null, `?menu=${this.menu}&url=./startup-createEarth.html`);
      }

    },
    sclcontrl() {
      this.scl = !this.scl;
    },
    reducecontrl() {
      this.reduce = !this.reduce;
    },
    setCodeFromUrl(url) {
      setCodeFromUrl(url, this);
      window.history.replaceState(null, null, `?menu=${this.menu}&url=${url}`);
    },
    apply() {
      this.$refs.earthAppFrame.srcdoc = this.code;
      var titles = /\<title\>([\s\S]*)\<\/title\>/gm.exec(this.code);
      var title = "<未能获取示例名称!>";
      if (titles.length >= 2) {
        title = titles[1];
      }
      this.title = title;
      document.title = "示例集合---" + this.title;
    },
    getCodeUrl() {
      return getCodeUrl(this.code, this.menu);
    },
    showCodeUrl() {
      const codeUrl = this.getCodeUrl();
      console.log(codeUrl)
      this.copyText(codeUrl, function () {
        alert("url复制成功");
      });
    },
    copyText(text, callback) {
      // text: 要复制的内容， callback: 回调
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = text;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      if (callback) {
        callback(text);
      }
    }
  },
  watch: {
    code(newVal) {
      delayApply(newVal, this);
    }
  }
});

// earthAppFrame.src方式会改变iframe中文
// var basePath = location.host + location.pathname;
// code = code.replace('<head>', `<head><base href="${basePath}" />`);

// var blob = new Blob([code], { type: 'text/html' });
// var ou = URL.createObjectURL(blob);
// earthAppFrame.src = ou;
// URL.revokeObjectURL(ou);

// 只有这种方法才能起作用，但是url会被改掉。
// earthAppFrame.srcdoc = code;

// var codes = /\<head\>([\s\S]*)\<\/head\>[\s\S]*\<body\>([\s\S]*)\<\/body\>/mg.exec(code)
// if (codes && codes.length === 3) {
//     var head = codes[1];
//     var body = codes[2];
//     earthAppFrame.contentDocument.head.innerHTML = head;
//     earthAppFrame.contentDocument.body.innerHTML = body;
// }
