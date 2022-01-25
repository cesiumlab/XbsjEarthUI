function _loadJS(jsFilePath, loadCallback) {
    var _doc = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', jsFilePath);
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
            // console.log('loadJS done: ' + jsFilePath);
        }
        loadCallback && loadCallback();
        script.onload = script.onreadystatechange = null;
    }
    _doc.appendChild(script);
}

function loadJS(jsFilePath) {
    return new Promise((resolve, reject) => {
        _loadJS(jsFilePath, resolve);
    });
}

// 动态创建css
function addCSS(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}

// 动态加载css文件
/*
* @function 动态加载css文件
* @param {string} options.url -- css资源路径
* @param {function} options.callback -- 加载后回调函数
* @param {string} options.id -- link标签id
*/
function _loadCSS(options) {
    var url = options.url,
        callback = typeof options.callback == "function" ? options.callback : function () { },
        id = options.id,
        node = document.createElement("link"),
        supportOnload = "onload" in node,
        isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536, // webkit旧内核做特殊处理
        protectNum = 300000; // 阈值10分钟，一秒钟执行pollCss 500次

    node.rel = "stylesheet";
    node.type = "text/css";
    node.href = url;
    if (typeof id !== "undefined") {
        node.id = id;
    }
    document.getElementsByTagName("head")[0].appendChild(node);

    // for Old WebKit and Old Firefox
    if (isOldWebKit || !supportOnload) {
        // Begin after node insertion
        setTimeout(function () {
            pollCss(node, callback, 0);
        }, 1);
        return;
    }

    if (supportOnload) {
        node.onload = onload;
        node.onerror = function () {
            // 加载失败(404)
            onload();
        }
    } else {
        node.onreadystatechange = function () {
            if (/loaded|complete/.test(node.readyState)) {
                onload();
            }
        }
    }

    function onload() {
        // 确保只跑一次下载操作
        node.onload = node.onerror = node.onreadystatechange = null;

        // 清空node引用，在低版本IE，不清除会造成内存泄露
        node = null;

        callback();
    }

    // 循环判断css是否已加载成功
    /*
    * @param node -- link节点
    * @param callback -- 回调函数
    * @param step -- 计步器，避免无限循环
    */
    function pollCss(node, callback, step) {
        var sheet = node.sheet,
            isLoaded;

        step += 1;

        // 保护，大于10分钟，则不再轮询
        if (step > protectNum) {
            isLoaded = true;

            // 清空node引用
            node = null;

            callback();
            return;
        }

        if (isOldWebKit) {
            // for WebKit < 536
            if (sheet) {
                isLoaded = true;
            }
        } else if (sheet) {
            // for Firefox < 9.0
            try {
                if (sheet.cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                // 火狐特殊版本，通过特定值获知是否下载成功
                // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                    isLoaded = true;
                }
            }
        }

        setTimeout(function () {
            if (isLoaded) {
                // 延迟20ms是为了给下载的样式留够渲染的时间
                callback();
            } else {
                pollCss(node, callback, step);
            }
        }, 20);
    }
}

/**
 * 动态加载css文件
 * @param {string} filePath CSS文件路径
 * @returns {Promise}
 * @memberof HTML
 */
 function loadCSS(filePath) {
    return new Promise((resolve, reject) => {
        _loadCSS({ url: filePath, callback: resolve });
    });
}

function getScriptBaseUrl(scriptName) {
    // var scriptRegex = /((?:.*\/)|^)scriptName[\w-]*\.js(?:\W|$)/i;
    var scriptRegex = new RegExp(`((?:.*\/)|^)${scriptName}\.js(?:\W|$)`, 'i');

    var scripts = document.getElementsByTagName('script');
    for (var i = 0, len = scripts.length; i < len; ++i) {
        var src = scripts[i].getAttribute('src');
        var result = scriptRegex.exec(src);
        if (result !== null) {
            return result[1];
        }
    }
    return undefined;
}


function create(earthDom, options) {
    return new Promise((resolve, reject) => {

        addCSS(`
        @-webkit-keyframes scale {
            0% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
            45% {
                -webkit-transform: scale(.1);
                transform: scale(.1);
                opacity: .7
            }
            80% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
        }
        @keyframes scale {
            0% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
            45% {
                -webkit-transform: scale(.1);
                transform: scale(.1);
                opacity: .7
            }
            80% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
        }
        .ball-pulse>div:nth-child(1) {
            -webkit-animation: scale .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08);
            animation: scale .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08)
        }
        .ball-pulse>div:nth-child(2) {
            -webkit-animation: scale .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08);
            animation: scale .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08)
        }
        .ball-pulse>div:nth-child(3) {
            -webkit-animation: scale .75s 0s infinite cubic-bezier(.2,.68,.18,1.08);
            animation: scale .75s 0s infinite cubic-bezier(.2,.68,.18,1.08)
        }

        .ball-pulse>div {
            background-color: #fff;
            width: 12px;
            height: 12px;
            border-radius: 100%;
            margin: 4px;
            -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
            display: inline-block
        }

        .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            transform: translate(-50%,-50%)
        }
        `)

        if (typeof earthDom === "string") {
            earthDom = document.getElementById(earthDom);
        }

        if (!earthDom) {
            return reject('ID not exist');
        }
        earthDom.className = 'xbsj-viewer';

        //在dom处居中创建一个 等待图标
        var loading = document.createElement('div');
        loading.className = 'loader';
        loading.innerHTML = `
            <div class="loader-inner ball-pulse">
            <div></div>
            <div></div>
            <div></div>
            </div>
             <span style=color:#fff>正在加载 ...</span>`;

        earthDom.appendChild(loading);


        //去加载 xbsjEarthUI.js
        if (typeof XbsjEarthUI.ready === 'undefined') {
            const xbsjUri = getScriptBaseUrl('xbsj');
            const xbsjEarthUIUri = getScriptBaseUrl('xbsj') + 'XbsjEarthUI.js';
            const cesiumCssUri = getScriptBaseUrl('xbsj') + '../XbsjCesium/Widgets/widgets.css';
            const cesiumJsUri = getScriptBaseUrl('xbsj') + '../XbsjCesium/Cesium.js';
            const xbsjEarthUri = (window.xbsjEarthDir || getScriptBaseUrl('xbsj')) + '../XbsjEarth/XbsjEarth.js';

            const pluginUris = [
                xbsjUri + '../XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js',
                xbsjUri + '../XbsjEarth-Plugins/customPrimitive/customPrimitive.js',
                xbsjUri + '../XbsjEarth-Plugins/customPrimitiveImage/customPrimitiveImage.js',
                xbsjUri + '../XbsjEarth-Plugins/customPrimitiveCone/customPrimitiveCone.js',
                xbsjUri + '../XbsjEarth-Plugins/plottingSymbol2/plottingSymbol2.js',
                // xbsjUri + '../XbsjEarth-Plugins/webxr/xbsj-cesium-webxr.js',
            ];

            // Promise.all([loadJS(xbsjEarthUIUri), loadJS(xbsjEarthUri)]).then(() => {
            //     return XE.ready().then(() => {
            //         const loadPlugins = pluginUris.map(e => loadJS(e));
            //         return Promise.all(loadPlugins)
            //     }).then(() => {
            //         //创建earthUI 
            //         let earthUI = new XbsjEarthUI.MainUI(earthDom);
            //         //隐藏等待图标
            //         earthDom.removeChild(loading);
            //         resolve(earthUI);
            //     }).catch(error => {
            //         reject(error);
            //     });
            // }).catch(err => {
            //     reject(err);
            // });

            try {
                (async () => {
                    await Promise.all([loadCSS(cesiumCssUri), loadJS(cesiumJsUri)]);
                    await Promise.all([loadJS(xbsjEarthUIUri), loadJS(xbsjEarthUri)]);
                    await XE.ready();

                    const loadPlugins = pluginUris.map(e => loadJS(e));
                    await Promise.all(loadPlugins);

                    //创建earthUI 
                    let earthUI = new XbsjEarthUI.MainUI(earthDom);
                    //隐藏等待图标
                    earthDom.removeChild(loading);
                    resolve(earthUI);
                })();
            } catch (error) {
                reject(error);
            }

        } else {
            //创建earthUI 
            let earthUI = new XbsjEarthUI.MainUI(earthDomID);
            resolve(earthUI);
        }
    });
}
export { create };
