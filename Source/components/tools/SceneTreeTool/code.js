import {deflate, inflate} from 'pako';

function base64ToString(base64String) {
    var jsonString = inflate(atob(base64String), { raw: true, to: 'string' });
    return jsonString;
};

function stringToBase64(data) {
    var base64String = btoa(deflate(data, { raw: true, to: 'string', level: 9 }));
    return base64String;
}

function getCodeUrl(code) {
    const json = {
        code,
    }

    const jsonStr = JSON.stringify(json);
    const base64 = stringToBase64(jsonStr);
    const base64Encode = encodeURIComponent(base64);
    const url = '//cesiumlab.gitee.io/earthsdk/v/last/Apps/Examples/' + `?code=${base64Encode}`;
    console.log(url);
    return url;
}

function getCode(jsonObject) {

const jsonStr = JSON.stringify(jsonObject, undefined, '    ');

const code = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="xbsj-labels" content="Earth起步"></meta>
    <title>3dtiles数据加载</title>
    <!-- 0 引入js文件：XbsjEarth.js和vue.min.js -->
    <script src="../../XbsjEarth/XbsjEarth.js"></script>
    <script src="scripts/vue.min.js"></script>
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>
<body>
    <div id="vueApp" style="width:100%; height: 100%; background: grey; position: relative;">
        <earth-comp></earth-comp>
    </div>

    <script>
        // 1 创建Earth的vue组件
        var EarthComp = {
            template: \`
                <div style="width: 100%; height: 100%">
                    <div ref="earthContainer" style="width: 100%; height: 100%">
                    </div>
                </div>
            \`,
            data() { 
                return {
                    _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
                };
            },
            // 1.1 资源加载
            mounted() {
                // 1.2.1 创建地球
                var earth = new XE.Earth(this.$refs.earthContainer);

                // 1.2.3 创建Tileset
                earth.xbsjFromJSON(${jsonStr});
                window.earth = earth; // only for Debug

                // 1.2.5 变量记录
                this._earth = earth;
            },
            // 1.2 资源销毁
            beforeDestroy() {
                // vue程序销毁时，需要清理相关资源
                this._disposers.forEach(d => d());
                this._disposers.length = 0;
                this._earth = this._earth && this._earth.destroy();
            },
        }

        // 2 创建vue程序
        // XE.ready()用来加载Cesium.js等相关资源
        XE.ready().then(() => {
            var app = new Vue({
                el: '#vueApp',
                components: {
                    EarthComp,
                },
            });

            // only for Debug
            window.app = app;
        });
    </script>


</body>
</html>
`;

return code;
}

export { getCodeUrl, getCode };