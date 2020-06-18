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
            const xbsjEarthUri = (window.xbsjEarthDir || getScriptBaseUrl('xbsj')) + '../XbsjEarth/XbsjEarth.js';

            const pluginUris = [
                xbsjUri + '../XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js',
                xbsjUri + '../XbsjEarth-Plugins/customPrimitive/customPrimitive.js',
                xbsjUri + '../XbsjEarth-Plugins/customPrimitiveImage/customPrimitiveImage.js',
                xbsjUri + '../XbsjEarth-Plugins/plottingSymbol2/plottingSymbol2.js',
                // xbsjUri + '../XbsjEarth-Plugins/webxr/xbsj-cesium-webxr.js',
            ];

            Promise.all([loadJS(xbsjEarthUIUri), loadJS(xbsjEarthUri)]).then(() => {
                return XE.ready().then(() => {
                    const loadPlugins = pluginUris.map(e => loadJS(e));
                    return Promise.all(loadPlugins)
                }).then(() => {
                    //创建earthUI 
                    let earthUI = new XbsjEarthUI.MainUI(earthDom);
                    //隐藏等待图标
                    earthDom.removeChild(loading);
                    resolve(earthUI);
                }).catch(error => {
                    reject(error);
                });
            }).catch(err => {
                reject(err);
            });
        } else {
            //创建earthUI 
            let earthUI = new XbsjEarthUI.MainUI(earthDomID);
            resolve(earthUI);
        }
    });
}
export { create };
