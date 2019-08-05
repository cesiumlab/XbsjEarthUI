// 场景树的创建有两种方式：
// 1 api直接调用方式

function sceneTreeCreateExample1(xbsjEarth) {
    const xbsjSceneTree = xbsjEarth.sceneTree;
    { // 测试代码，以后删除
        const g0 = new XE.SceneTree.Group(xbsjEarth);
        g0.title = '项目1'
        const g1 = new XE.SceneTree.Group(xbsjEarth);
        g1.title = '项目2'
        const g00 = new XE.SceneTree.Group(xbsjEarth);
        g00.title = '当前场景'

        xbsjSceneTree.root.children.push(g0);
        xbsjSceneTree.root.children.push(g1);
        g0.children.push(g00);

        // 三维瓦片加载
        {
            const tileset1 = new XE.Obj.Tileset(xbsjEarth);
            tileset1.name = '三维瓦片1x';
            window.tileset1 = tileset1; 
            tileset1.url = 'http://lab2.cesiumlab.com:9000/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json';
            const tileset1SO = new XE.SceneTree.Leaf(tileset1);
            window.tileset1SO = tileset1SO;
            // tileset1SO.title = '三维瓦片1';
            g00.children.push(tileset1SO);
        }

        // 三维瓦片2加载
        {
            const tileset2 = new XE.Obj.Tileset(xbsjEarth);
            window.tileset2 = tileset2; 
            tileset2.url = 'http://lab2.cesiumlab.com:9000/model/d16c1ce0ac2d11e99dbd8fd044883638/tileset.json';
            const tileset2SO = new XE.SceneTree.Leaf(tileset2);
            tileset2SO.title = '三维瓦片2';
            g00.children.push(tileset2SO);
        }

        // 谷歌影像加载
        {
            var googleImageryLayer = new XE.Obj.Imagery(xbsjEarth);
            window.googleImageryLayer = googleImageryLayer;

            googleImageryLayer.xbsjImageryProvider.type = 'XbsjImageryProvider';
            googleImageryLayer.xbsjImageryProvider['XbsjImageryProvider'] = {
                url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
                rectangle: [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5],
            };;

            const googleImageryLayerSO = new XE.SceneTree.Leaf(googleImageryLayer);
            googleImageryLayerSO.title = '谷歌影像';
            g00.children.push(googleImageryLayerSO);
        }

        // WMTS影像加载
        {
            var wmtsImageryLayer = new XE.Obj.Imagery(xbsjEarth);
            window.wmtsImageryLayer = wmtsImageryLayer;

            wmtsImageryLayer.xbsjImageryProvider.type = 'WebMapTileServiceImageryProvider';
            wmtsImageryLayer.xbsjImageryProvider['WebMapTileServiceImageryProvider'] = {
                url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
                layer: 'USGSShadedReliefOnly',
                style: 'default',
                format: 'image/jpeg',
                //tileMatrixSetID : 'default028mm',
                tileMatrixSetID: 'GoogleMapsCompatible',
                maximumLevel: 19,
                credit: 'U. S. Geological Survey'
            };
 

            const imageryLayerSO = new XE.SceneTree.Leaf(wmtsImageryLayer);
            imageryLayerSO.title = 'WMTS影像';
            imageryLayerSO.enabled = false;
            g00.children.push(imageryLayerSO);
        }

        // // 谷歌影像加载
        // for (let i=0; i<4; ++i) {
        //     var googleImageryLayer = new XE.Obj.Imagery(xbsjEarth);
        //     window.googleImageryLayer = googleImageryLayer;

        //     const imageryProvider = new XE.ImageryProvider.XbsjImageryProvider();
        //     imageryProvider.url = 'http://www.google.cn/maps/vt?lyrs=s,h&gl=CN&x={x}&y={y}&z={z}';
        //     imageryProvider.rectangle = [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5];
        //     imageryProvider.srcCoordType = 'GCJ02';
        //     imageryProvider.dstCoordType = 'WGS84';
        //     // googleImageryLayer.xbsjImageryProvider = imageryProvider;
        //     googleImageryLayer.xbsjImageryProvider.type = imageryProvider._type;
        //     googleImageryLayer.xbsjImageryProvider[imageryProvider._type] = imageryProvider;

        //     const googleImageryLayerSO = new XE.SceneTree.Leaf(googleImageryLayer);
        //     googleImageryLayerSO.title = '谷歌影像+标注';
        //     g00.children.push(googleImageryLayerSO);
        // }

        // // 谷歌影像加载
        // for (let i=0; i<5; ++i) {
        //     var googleImageryLayer = new XE.Obj.Imagery(xbsjEarth);
        //     window.googleImageryLayer = googleImageryLayer;

        //     const imageryProvider = new XE.ImageryProvider.UrlTemplateImageryProvider();
        //     imageryProvider.url = 'http://www.google.cn/maps/vt?lyrs=s,h&gl=CN&x={x}&y={y}&z={z}';
        //     imageryProvider.rectangle = [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5];
        //     // googleImageryLayer.xbsjImageryProvider = imageryProvider;
        //     googleImageryLayer.xbsjImageryProvider.type = imageryProvider._type;
        //     googleImageryLayer.xbsjImageryProvider[imageryProvider._type] = imageryProvider;

        //     const googleImageryLayerSO = new XE.SceneTree.Leaf(googleImageryLayer);
        //     googleImageryLayerSO.title = '谷歌影像+标注';
        //     g00.children.push(googleImageryLayerSO);
        // }

        // 百度影像加载
        // {
        //     var imageryLayer = new XE.Obj.Imagery(xbsjEarth);
        //     window.baiduImageryLayer = imageryLayer;

        //     const imageryProvider = new XE.ImageryProvider.XbsjImageryProvider();
        //     imageryProvider.url = 'http://online2.map.bdimg.com/onlinelabel/?qt=tile&styles=pl&x={x}&y={y}&z={z}';
        //     imageryProvider.rectangle = [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5];
        //     imageryProvider.srcCoordType = 'BD09';
        //     // googleImageryLayer.xbsjImageryProvider = imageryProvider;
        //     imageryLayer.xbsjImageryProvider.type = imageryProvider._type;
        //     imageryLayer.xbsjImageryProvider[imageryProvider._type] = imageryProvider;
        //     imageryLayer.show = false;

        //     const baiduImageryLayerSO = new XE.SceneTree.Leaf(imageryLayer);
        //     baiduImageryLayerSO.title = '百度影像';
        //     g00.children.push(baiduImageryLayerSO);
        // }

        // 中国地形加载
        {
            var chinaTerrain = new XE.Obj.Terrain(xbsjEarth);
            chinaTerrain.show = false;
            chinaTerrain.xbsjTerrainProvider = {
                XbsjCesiumTerrainProvider: { 
                   url:'http://lab2.cesiumlab.com:9000/terrain/577fd5b0ac1f11e99dbd8fd044883638'
                },
                type: 'XbsjCesiumTerrainProvider'
            }

            window.chinaTerrain = chinaTerrain;

            const chinaTerrainSO = new XE.SceneTree.Leaf(chinaTerrain);
            chinaTerrainSO.title = '中国地形';
            g00.children.push(chinaTerrainSO);
        }

     
        // 视频融合
        {
            var cameraVideo1 = new XE.Obj.CameraVideo(xbsjEarth);
            cameraVideo1.videoUrl = '../../../XbsjEarthUI/assets/demo.mp4';
            cameraVideo1.position = [1.9017043698837766, 0.5972379094016695, 446.2499351617626];
            cameraVideo1.rotation = [0.07413323656963833, -0.933639537288121, 0.0003900191769634631];
            cameraVideo1.far = 50;

            window.cameraVideo1 = cameraVideo1;

            const cameraVideo1SO = new XE.SceneTree.Leaf(cameraVideo1);
            cameraVideo1SO.title = '视频融合1';
            g00.children.push(cameraVideo1SO);
        }

        // 视频融合2
        {
            var cameraVideo = new XE.Obj.CameraVideo(xbsjEarth);
            cameraVideo.videoUrl = '../../../XbsjEarthUI/assets/demo.mp4';
            cameraVideo.position = [1.9017145371326925, 0.5972610388274915, 447.0411765370373];
            cameraVideo.rotation = [4.689689783226122, -0.9712893893861931, 6.277658415979939];
            cameraVideo.far = 50;
            window.cameraVideo2 = cameraVideo;

            const cameraVideo2SO = new XE.SceneTree.Leaf(cameraVideo);
            cameraVideo2SO.title = '视频融合2';
            g00.children.push(cameraVideo2SO);
        }

        // 视域分析1
        {
            var viewshed1 = new XE.Obj.Viewshed(xbsjEarth);
            viewshed1.position = [1.9016941363233133, 0.5972280994903124, 441.33440879700987];
            viewshed1.rotation = [5.661008560777628, -0.4002876987466508, 6.281209044159919];
            viewshed1.far = 50;

            window.viewshed1 = viewshed1;

            const viewshed1SO = new XE.SceneTree.Leaf(viewshed1);
            viewshed1SO.title = '视域分析1';
            g00.children.push(viewshed1SO);
        }

        // 视域分析2
        {
            var viewshed2 = new XE.Obj.Viewshed(xbsjEarth);
            window.viewshed2 = viewshed2;
            viewshed2.position = [1.9017162550061513, 0.5972198728482121, 433.7983257335933];
            viewshed2.rotation = [5.48363664103055, -0.32127571902937535, 6.280826152838497];
            viewshed2.far = 50;

            const viewshed2SO = new XE.SceneTree.Leaf(viewshed2);
            viewshed2SO.title = '视域分析2';
            g00.children.push(viewshed2SO);
        }

        // 多边形1
        {
            const positions = [
                -115.0, 37.0,
                -115.0, 32.0,
                -107.0, 33.0,
                -102.0, 31.0,
                -102.0, 35.0
            ].map(e => e / 180 * Math.PI);

            var polygon = new XE.Obj.Polygon(xbsjEarth);
            polygon.positions = positions;
            polygon.height = 1000.0;
            window.polygon = polygon;

            const polygonSO = new XE.SceneTree.Leaf(polygon);
            polygonSO.title = '多边形1';
            g00.children.push(polygonSO);
        }


        // 裁剪面1
        {
            var clippingPlane = new XE.Obj.ClippingPlane(xbsjEarth);
            window.clippingPlane = clippingPlane;
            var t = [108.95921534905067, 34.21957314169267].map(e => e / 180 * Math.PI);
            clippingPlane.position = [...t, 426.0];
            const clippingPlaneSO = new XE.SceneTree.Leaf(clippingPlane);
            clippingPlaneSO.title = '裁剪面1';
            g00.children.push(clippingPlaneSO);

            // clippingPlane._primitive.tilesets.push(tileset1._tileset);
        }

        // 压平多边形组
        {
            // const positions = [
            //     -115.0, 37.0,
            //     -115.0, 32.0,
            //     -107.0, 33.0,
            //     -102.0, 31.0,
            //     -102.0, 35.0
            // ].map(e => e / 180 * Math.PI);
            const positions = [
                108.95921534905067, 34.21957314169267,
                108.95968034385935, 34.219564234321986,
                108.95968071326962, 34.21998589644056,
                108.95920292734705, 34.21998000327241,
            ].map(e => e / 180 * Math.PI);

            const flattenedPolygon = {
                positions,
                height: 426.0,
            };

            var flattenedPolygons = new XE.Obj.FlattenedPolygonCollection(xbsjEarth);
            flattenedPolygons.polygons.push(flattenedPolygon);
            window.flattenedPolygons = flattenedPolygons;

            const flattenedPolygonsSO = new XE.SceneTree.Leaf(flattenedPolygons);
            flattenedPolygonsSO.title = '压平多边形组1';
            g00.children.push(flattenedPolygonsSO);

            // 绑定压平多边形
            tileset1.xbsjFlattenGuid = flattenedPolygons.guid;
        }

        {
            const points = new XE.Obj.Points(xbsjEarth);
            const point = {};
            point.position = [116.39 * Math.PI / 180.0, 39.9 * Math.PI / 180, 100];
            point.color = [1, 0, 0, 1];
            points.points.push(point);

            window.points = points;

            const sceneObject = new XE.SceneTree.Leaf(points);
            sceneObject.title = '点';
            g00.children.push(sceneObject);
        }

        {
            const polyline = new XE.Obj.Polyline(xbsjEarth);
            polyline.positions = [[116.39, 39.9], [116.39, 20.9], [100.39, 20.0]].map(p => [...p.map(e => e * Math.PI / 180.0), 0.0]);

            window.polyline = polyline;

            const sceneObject = new XE.SceneTree.Leaf(polyline);
            sceneObject.title = '折线👇';
            g00.children.push(sceneObject);
        }

        {
            const circle = new XE.Obj.Circle(xbsjEarth);
            circle.center = [...([116.39, 39.9].map(e => e * Math.PI / 180.0)), 100];
            circle.radius = 150000;

            window.circle = circle;

            const sceneObject = new XE.SceneTree.Leaf(circle);
            sceneObject.title = '⚪';
            g00.children.push(sceneObject);
        }
    }
}

