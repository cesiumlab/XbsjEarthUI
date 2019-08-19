// 场景树创建
function sceneTreeCreateExample1(xbsjEarth) {
    const objs =                         {
        "title": "当前场景",
        "children": [
            {
                "czmObject": {
                    "xbsjType": "Cylinder",
                    "name": "圆柱体",     
                    "startPosition": [
                        1.9016974701882112,
                        0.5972325152147303,
                        425.8641913624607
                    ],
                    "endPosition": [
                        1.9016974701882112,
                        0.5972325152147303,
                        525.8641913624607
                    ],
                    "radius": 20,  
                    "color": [1.0, 0.0, 0.0, 1.0],    
                    // "maxSceneScale": 30,    
                    // "fixScreenSize": 30,
                }
            },
            {
                "czmObject": {
                    "xbsjType": "Tileset",
                    "xbsjGuid": "b4137394-d346-4434-a01e-5b2d3730ec9f",
                    "name": "三维瓦片1x",
                    "url": "//lab2.cesiumlab.com:9000/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json",
                    "lightColor": null,
                    "specularEnvironmentMaps": null,
                    "xbsjPosition": [
                        1.9016974701882112,
                        0.5972325152147303,
                        425.8641913624607
                    ],
                    "xbsjFlattenGuid": "93916e9b-82dd-4a56-b15e-27303b08e781",
                    "xbsjClippingPlanes": {}
                }
            },
            {
                "title": "三维瓦片2",
                "czmObject": {
                    "xbsjType": "Tileset",
                    "xbsjGuid": "4c9e66a4-dc72-4744-a3c9-d0c554178f38",
                    "name": "三维瓦片2",
                    "url": "//lab2.cesiumlab.com:9000/model/d16c1ce0ac2d11e99dbd8fd044883638/tileset.json",
                    "lightColor": null,
                    "specularEnvironmentMaps": null,
                    "xbsjPosition": [
                        2.0314142297769386,
                        0.6965069903408323,
                        9.831644570475259
                    ],
                    "xbsjClippingPlanes": {}
                }
            },
            {
                "title": "谷歌影像",
                "czmObject": {
                    "xbsjType": "Imagery",
                    "xbsjGuid": "fdcf9733-3e17-4d89-aaee-46a50ca834e9",
                    "name": "谷歌影像",
                    "xbsjImageryProvider": {
                        "XbsjImageryProvider": {
                            "url": "//mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
                        },
                        "UrlTemplateImageryProvider": {},
                        "WebMapTileServiceImageryProvider": {}
                    }
                }
            },
            {
                "title": "WMTS影像",
                "enabled": false,
                "czmObject": {
                    "xbsjType": "Imagery",
                    "enabled": false,
                    "xbsjGuid": "d2615d4c-692f-4f50-8381-98c0d10b175c",
                    "name": "WMTS影像",
                    "show": false,
                    "xbsjImageryProvider": {
                        "XbsjImageryProvider": {},
                        "UrlTemplateImageryProvider": {},
                        "WebMapTileServiceImageryProvider": {
                            "url": "//basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS",
                            "layer": "USGSShadedReliefOnly",
                            "style": "default",
                            "tileMatrixSetID": "GoogleMapsCompatible",
                            "maximumLevel": 19
                        },
                        "type": "WebMapTileServiceImageryProvider"
                    }
                }
            },
            {
                "title": "中国地形",
                "enabled": false,
                "czmObject": {
                    "xbsjType": "Terrain",
                    "enabled": false,
                    "xbsjGuid": "640d2511-b5c4-4f9e-84f4-4dd3b0db515c",
                    "name": "中国地形",
                    "xbsjTerrainProvider": {
                        "type": "XbsjCesiumTerrainProvider",
                        "XbsjEllipsoidTerrainProvider": {},
                        "XbsjCesiumTerrainProvider": {
                            "url": "//lab2.cesiumlab.com:9000/terrain/577fd5b0ac1f11e99dbd8fd044883638"
                        }
                    },
                    "show": false
                }
            },
            {
                "title": "视频融合1",
                "czmObject": {
                    "xbsjType": "CameraVideo",
                    "xbsjGuid": "19e84dea-2faa-4949-95c2-8d333a03e0c7",
                    "name": "视频融合1",
                    "videoUrl": "../../../XbsjEarthUI/assets/demo.mp4",
                    "position": [
                        1.9017043698837766,
                        0.5972379094016695,
                        446.2499351617626
                    ],
                    "rotation": [
                        0.07413323656963833,
                        -0.933639537288121,
                        0.0003900191769634631
                    ],
                    "far": 50
                }
            },
            {
                "title": "视频融合2",
                "czmObject": {
                    "xbsjType": "CameraVideo",
                    "xbsjGuid": "09205680-e32a-43a2-978e-6e7f3116ee25",
                    "name": "视频融合2",
                    "videoUrl": "../../../XbsjEarthUI/assets/demo.mp4",
                    "position": [
                        1.9017145371326925,
                        0.5972610388274915,
                        447.0411765370373
                    ],
                    "rotation": [
                        4.689689783226122,
                        -0.9712893893861931,
                        6.277658415979939
                    ],
                    "far": 50
                }
            },
            {
                "title": "视域分析1",
                "czmObject": {
                    "xbsjType": "Viewshed",
                    "xbsjGuid": "d03fdb90-e8af-4af4-90fb-12f92c113a1c",
                    "name": "视域分析1",
                    "position": [
                        1.9016941363233133,
                        0.5972280994903124,
                        441.33440879700987
                    ],
                    "rotation": [
                        5.661008560777628,
                        -0.4002876987466508,
                        6.281209044159919
                    ],
                    "far": 50
                }
            },
            {
                "title": "视域分析2",
                "czmObject": {
                    "xbsjType": "Viewshed",
                    "xbsjGuid": "4c554de3-0fa0-448d-93db-4de668e603c4",
                    "name": "视域分析2",
                    "position": [
                        1.9017162550061513,
                        0.5972198728482121,
                        433.7983257335933
                    ],
                    "rotation": [
                        5.48363664103055,
                        -0.32127571902937535,
                        6.280826152838497
                    ],
                    "far": 50
                }
            },
            {
                "title": "多边形1",
                "czmObject": {
                    "xbsjType": "Polygon",
                    "xbsjGuid": "b55bbb1e-5ad7-40d4-9874-74c98354d7ed",
                    "name": "多边形1",
                    "positions": [
                        -2.007128639793479,
                        0.6457718232379019,
                        -2.007128639793479,
                        0.5585053606381855,
                        -1.8675022996339325,
                        0.5759586531581287,
                        -1.780235837034216,
                        0.5410520681182421,
                        -1.780235837034216,
                        0.6108652381980153
                    ],
                    "height": 1000
                }
            },
            {
                "title": "裁剪面1",
                "czmObject": {
                    "xbsjType": "ClippingPlane",
                    "xbsjGuid": "9ab55d98-32ed-49ad-9004-1940f4903b68",
                    "name": "裁剪面1",
                    "position": [
                        1.9016970582304769,
                        0.5972442199495571,
                        426
                    ]
                }
            },
            {
                "title": "压平多边形组1",
                "czmObject": {
                    "xbsjType": "FlattenedPolygonCollection",
                    "xbsjGuid": "93916e9b-82dd-4a56-b15e-27303b08e781",
                    "name": "压平多边形组1",
                    "polygons": [
                        {
                            "positions": [
                                1.9016970582304769,
                                0.5972442199495571,
                                1.901705173920893,
                                0.597244064486611,
                                1.9017051803683183,
                                0.5972514238789111,
                                1.90169684143085,
                                0.5972513210237236
                            ],
                            "height": 426
                        }
                    ]
                }
            },
            {
                "title": "点",
                "czmObject": {
                    "xbsjType": "Points",
                    "xbsjGuid": "01b897db-5b12-4006-9898-1bed040ffa84",
                    "name": "点",
                    "points": [
                        {
                            "position": [
                                2.0313887163962,
                                0.6963863715457375,
                                100
                            ],
                            "color": [
                                1,
                                0,
                                0,
                                1
                            ],
                            "pixelSize": 6,
                            "show": true,
                            "disableDepthTestDistance": null
                        }
                    ]
                }
            },
            {
                "title": "折线👇",
                "czmObject": {
                    "xbsjType": "Polyline",
                    "xbsjGuid": "6f9a3744-b961-4c65-9c34-b4b84cd9ccc8",
                    "name": "折线👇",
                    "positions": [
                        [
                            2.0313887163962,
                            0.6963863715457375,
                            0
                        ],
                        [
                            2.0313887163962,
                            0.3647738136668149,
                            0
                        ],
                        [
                            1.7521360360771072,
                            0.3490658503988659,
                            0
                        ]
                    ],
                    "material": {
                        "XbsjColorMaterial": {},
                        "XbsjPolylineDashMaterial": {},
                        "XbsjPolylineArrowMaterial": {}
                    }
                }
            },
            {
                "title": "⚪",
                "czmObject": {
                    "xbsjType": "Circle",
                    "xbsjGuid": "a1955ba2-da26-4f52-963d-a6d5fd3217a2",
                    "name": "⚪",
                    "center": [
                        2.0313887163962,
                        0.6963863715457375,
                        100
                    ],
                    "radius": 150000,
                    "arcType": "GEODESIC",
                    "material": {
                        "XbsjColorMaterial": {},
                        "XbsjPolylineDashMaterial": {},
                        "XbsjPolylineArrowMaterial": {}
                    }
                }
            }
        ]
    };

    const sceneTreeJSON = {
        "root": {
            "children": [
                {
                    "title": "项目1",
                    "children": [
                        objs,
                    ]
                },
                {
                    "title": "项目2",
                    "children": []
                }
            ]
        }
    };

    xbsjEarth.sceneTree = sceneTreeJSON;
}

