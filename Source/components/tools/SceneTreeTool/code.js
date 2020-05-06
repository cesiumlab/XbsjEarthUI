import { deflate, inflate } from "pako";

function base64ToString (base64String) {
  var jsonString = inflate(atob(base64String), { raw: true, to: "string" });
  return jsonString;
}

function stringToBase64 (data) {
  var base64String = btoa(deflate(data, { raw: true, to: "string", level: 9 }));
  return base64String;
}

function getCodeUrl (code) {
  const json = {
    code
  };

  const jsonStr = JSON.stringify(json);
  const base64 = stringToBase64(jsonStr);
  const base64Encode = encodeURIComponent(base64);
  const url =
    "//www.earthsdk.com/v/last/Apps/Examples/" + `?code=${base64Encode}`;
  console.log(url);
  return url;
}

function getCode (jsonObject) {
  let jsonStr = JSON.stringify(jsonObject, undefined, "    ");
  jsonStr = jsonStr.replace(/\n/g, '\n                    ');

  const code = `<!DOCTYPE html>
    <html lang="zh-CN">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="xbsj-labels" content="Earth起步"></meta>
        <title>EarthSDK场景加载</title>
        <!-- 0 引入js文件 -->
        <script src="https://earthsdk.com/v/last/XbsjEarth/XbsjEarth.js"></script>
        <style>            
            html,body { width: 100%; height: 100%; margin: 0px; padding: 0px;}
        </style>
    </head>
    
    <body>
        <div id="earthContainer" style="width: 100%; height: 100%; background: grey">
        </div>
        <script>
            function startup() {
                var earth = new XE.Earth('earthContainer');
                earth.xbsjFromJSON(${jsonStr});

                // 仅为测试
                window.earth = earth;          
            }
    
            // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
            XE.ready().then(startup);            
        </script>
    </body>
    
    </html>
`;

  return code;
}

function getCzmCode (tilesetCzmObj) {
  const earth = tilesetCzmObj.earth;
  const ls = tilesetCzmObj.toJSONStr();
  const lss = ls.replace(/\n/g, '\n                    ');

  var loadTilesetString = `
                // earth加载代码
                /*
                earth.sceneTree.root.children.push({
					czmObject: ${lss}
                });

                // 指定相机位置
                earth.camera.position = [${earth.camera.position}];
                earth.camera.rotation = [${earth.camera.rotation}];                
                */
                
                // cesium加载代码
                var viewer = earth.czm.viewer;
                var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                    url: '${tilesetCzmObj.url}',
                    modelMatrix: Cesium.Matrix4.fromArray([${Cesium.Matrix4.toArray(tilesetCzmObj._tileset.modelMatrix)}]),
                }));
                viewer.flyTo(tileset);
    `;

  const code = `<!DOCTYPE html>
    <html lang="zh-CN">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="xbsj-labels" content="Earth起步"></meta>
        <title>EarthSDK以cesium方式加载影像</title>
        <!-- 0 引入js文件 -->
        <script src="//earthsdk.com/v/last/XbsjEarth/XbsjEarth.js"></script>
        <style>            
            html,body { width: 100%; height: 100%; margin: 0px; padding: 0px;}
        </style>
    </head>
    
    <body>
        <div id="earthContainer" style="width: 100%; height: 100%; background: grey">
        </div>
        <script>    
            function startup() {
                var earth = new XE.Earth('earthContainer');
    
                earth.sceneTree.root = {
                    "children": [
                        {
                            "czmObject": {
                                "name": "默认离线影像",
                                "xbsjType": "Imagery",
                                "xbsjImageryProvider": {
                                    "createTileMapServiceImageryProvider": {
                                        "url": XE.HTML.cesiumDir + 'Assets/Textures/NaturalEarthII',
                                        "fileExtension": 'jpg',
                                    },
                                    "type": "createTileMapServiceImageryProvider"
                                }
                            }
                        },
                    ]
                };

${loadTilesetString}

                // 仅为测试
                window.earth = earth;
                window.viewer = viewer;
                window.tileset = tileset;
            }
    
            // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
            // XE.ready().then(startup); // 不加载插件时，可以直接这样使用
            XE.ready().then(() => {
                // 加载标绘插件
                const p1 = XE.HTML.loadJS('../../XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js');
                const p2 = XE.HTML.loadJS('../../XbsjEarth-Plugins/customPrimitive/customPrimitive.js');
                const p3 = XE.HTML.loadJS('../../XbsjEarth-Plugins/customPrimitiveImage/customPrimitiveImage.js');
                return Promise.all([p1, p2, p3]);
            }).then(() => {
                startup()
            });
        </script>
    </body>
    
    </html>
  `;

  return code;
}


function getCzmImageCode (imageCzmObj) {

  var rect = "";
  if(imageCzmObj.rectangle !== undefined){
    rect = `rect = Cesium.Rectangle.fromRadians(${imageCzmObj.rectangle[0]}, 
        ${imageCzmObj.rectangle[1]}, 
        ${imageCzmObj.rectangle[2]}, 
        ${imageCzmObj.rectangle[3]})`;
  }
  var loadTilesetString = `
              
              // cesium加载代码
              var viewer = earth.czm.viewer;
              var rect;
              ${rect}
              viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: '${imageCzmObj.xbsjImageryProvider.XbsjImageryProvider.url}',
                rectangle: rect,
                //minimumLevel:${imageCzmObj.xbsjImageryProvider.XbsjImageryProvider.minimumLevel},
                //maximumLevel:${imageCzmObj.xbsjImageryProvider.XbsjImageryProvider.maximumLevel}
              }));
              
              if(rect){
                viewer.camera.flyTo({
                  destination: rect,
                  duration: 1,
                  orientation : {
                      heading : Cesium.Math.toRadians(0.0),
                      pitch : Cesium.Math.toRadians(-90.0),
                      roll : 0.0
                  }
                })
              }
  `;

  const code = `<!DOCTYPE html>
  <html lang="zh-CN">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="xbsj-labels" content="Earth起步"></meta>
      <title>EarthSDK场景加载</title>
      <!-- 0 引入js文件 -->
      <script src="//earthsdk.com/v/last/XbsjEarth/XbsjEarth.js"></script>
      <style>            
          html,body { width: 100%; height: 100%; margin: 0px; padding: 0px;}
      </style>
  </head>
  
  <body>
      <div id="earthContainer" style="width: 100%; height: 100%; background: grey">
      </div>
      <script>    
          function startup() {
              var earth = new XE.Earth('earthContainer');
  
              earth.sceneTree.root = {
                  "children": [
                      {
                          "czmObject": {
                              "name": "默认离线影像",
                              "xbsjType": "Imagery",
                              "xbsjImageryProvider": {
                                  "createTileMapServiceImageryProvider": {
                                      "url": XE.HTML.cesiumDir + 'Assets/Textures/NaturalEarthII',
                                      "fileExtension": 'jpg',
                                  },
                                  "type": "createTileMapServiceImageryProvider"
                              }
                          }
                      },
                  ]
              };

${loadTilesetString}

              // 仅为测试
              window.earth = earth;
              window.viewer = viewer;
          }
  
          // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
          XE.ready().then(startup);            
      </script>
  </body>
  
  </html>
`;

  return code;
}

export { getCodeUrl, getCode, getCzmCode, getCzmImageCode };
