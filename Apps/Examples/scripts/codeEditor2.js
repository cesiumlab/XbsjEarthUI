var lastForceCodeTimeStamp = 0;

var delayApply = (function() {
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

var setCodeFromUrl = (function() {
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
        <codemirror ref="myCm"
            :value="value" 
            :options="cmOptions"
            @ready="onCmReady"
            @focus="onCmFocus"
            @input="onCmCodeChange">
        </codemirror>
    `,
  data() {
    return {
      // code: '',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        // mode: 'text/javascript',
        mode: "htmlmixed",
        // theme: 'base16-dark',
        // theme: 'base16-light',
        lineNumbers: true,
        line: true,
        // more codemirror options, 更多 codemirror 的高级配置...

        // 以什么格式进行高亮 -->
        // mode: "text/x-sql",
        // 主题 -->
        theme: "seti",
        // 是否代码折叠 -->
        lineWrapping: false,

        // 是否在编辑器左侧显示行号 -->
        lineNumbers: true,
        // 行号从哪个数开始计数，默认为1 -->
        firstLineNumber: 1,

        // tab字符的宽度，默认为4 -->
        indentWithTabs: true,
        // 自动缩进，设置是否根据上下文自动缩进,默认为true-->
        smartIndent: true,

        // 括号匹配 -->
        matchBrackets: true,
        // 是否在初始化时自动获取焦点 -->
        autofocus: true,
        // 智能提示  -->
        // extraKeys: {"Ctrl-Space": "autocomplete"},
        // 编辑器是否只读,并且不能获得焦点 -->
        // readOnly:'nocursor',
        // 在选择时是否显示光标，默认为false -->
        showCursorWhenSelecting: true
      }
    };
  },
  methods: {
    onCmReady(cm) {},
    onCmFocus(cm) {},
    onCmCodeChange(newCode) {
      this.$emit("input", newCode);
    }
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    }
  },
  mounted() {
    // console.log('this is current codemirror object', this.codemirror)
    // you can use this.codemirror to do something...
  },
  beforeDestroy() {}
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
    // console.log('this is current codemirror object', this.codemirror)
    // you can use this.codemirror to do something...
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
    changemenu(){
      var q = {};
      location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
      this.menu = !this.menu; 
      if(q.url){
        window.history.replaceState(null, null, `?menu=${this.menu}&url=${q.url}`);
      }else if(q.code){
        window.history.replaceState(null, null, `?menu=${this.menu}&code=${q.code}`);
      }else if(q.id){
        window.history.replaceState(null, null, `?menu=${this.menu}&id=${q.id}`);
      }else{
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
      return getCodeUrl(this.code,this.menu);
    },
    showCodeUrl() {
      const codeUrl = this.getCodeUrl();
      console.log(codeUrl)
      this.copyText(codeUrl, function() {
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
