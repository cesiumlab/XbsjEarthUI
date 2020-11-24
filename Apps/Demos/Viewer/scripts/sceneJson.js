const sceneJson = {
    "sceneTree": {
        "root": {
            "children": [{
                "title": "项目1",
                "children": [{
                    "title": "当前场景",
                    "children": [{
                        "title": "三维瓦片1x",
                        "czmObject": {
                            "xbsjType": "XbsjTileset",
                            "xbsjGuid": "5caad563-3202-429a-842d-9b237102a51c",
                            "name": "三维瓦片1x",
                            "url": "//114.116.116.117/api/3dtiles/photo/5d205273053f8d14e00ec926/tileset.json",
                            "xbsjPosition": [1.9016974701882112, 0.5972325152147303, 425.8641913624607],
                            "xbsjFlattenGuid": "72c32831-03c1-4d27-b902-a2b423d487d9",
                            "xbsjClippingPlanes": {}
                        }
                    }, {
                        "title": "三维瓦片2",
                        "czmObject": {
                            "xbsjType": "XbsjTileset",
                            "xbsjGuid": "2174cc4e-c882-4008-af1f-2ba4fabb4b30",
                            "name": "三维瓦片2",
                            "url": "//114.116.116.117/api/3dtiles/bim/5ca968a2daaf1c1034cd54f3/tileset.json",
                            "xbsjPosition": [2.0314188886229756, 0.6965075857844879, 3.380522304181532],
                            "xbsjClippingPlanes": {}
                        }
                    }, {
                        "title": "谷歌影像",
                        "czmObject": {
                            "xbsjType": "XbsjImagery",
                            "xbsjGuid": "276ff209-4881-48f9-9e27-c9d795bdf23b",
                            "name": "谷歌影像",
                            "xbsjImageryProvider": {
                                "XbsjImageryProvider": {
                                    "url": "http://mt1.google.cn/vt/lyrs=s,h&gl=cn&x={x}&y={y}&z={z}&s=Gali"
                                }
                            }
                        }
                    }, {
                        "title": "中国地形",
                        "czmObject": {
                            "xbsjType": "XbsjTerrain",
                            "xbsjGuid": "ed36fad7-ae66-44da-9821-0caa93c1ca3d",
                            "name": "中国地形",
                            "xbsjTerrainProvider": {
                                "XbsjCesiumTerrainProvider": {
                                    "url": "//114.116.116.117/api/wmts/terrain/5cbb024d053f8d0e8018cc0d"
                                },
                                "type": "XbsjCesiumTerrainProvider"
                            },
                            "show": false
                        }
                    }, {
                        "title": "视频融合1",
                        "czmObject": {
                            "xbsjType": "XbsjCameraVideo",
                            "xbsjGuid": "52523150-b2d5-41f8-b4f0-a53f9bd500e8",
                            "name": "视频融合1",
                            "videoUrl": "../../Static/big-buck-bunny-trailer-small.mp4",
                            "position": [1.9017043698837766, 0.5972379094016695, 446.2499351617626],
                            "rotation": [0.07413323656963833, -0.933639537288121, 0.0003900191769634631],
                            "far": 50
                        }
                    }, {
                        "title": "视频融合2",
                        "czmObject": {
                            "xbsjType": "XbsjCameraVideo",
                            "xbsjGuid": "6c7fdfd2-e942-42a8-be06-a5f570d8d8c6",
                            "name": "视频融合2",
                            "videoUrl": "../../Static/big-buck-bunny-trailer-small.mp4",
                            "position": [1.9017145371326925, 0.5972610388274915, 447.0411765370373],
                            "rotation": [4.689689783226122, -0.9712893893861931, 6.277658415979939],
                            "far": 50
                        }
                    }, {
                        "title": "视域分析1",
                        "czmObject": {
                            "xbsjType": "XbsjViewshed",
                            "xbsjGuid": "b8449fed-2de7-4c08-b5bd-44f48dbfe5eb",
                            "name": "视域分析1",
                            "position": [1.9016941363233133, 0.5972280994903124, 441.33440879700987],
                            "rotation": [5.661008560777628, -0.4002876987466508, 6.281209044159919],
                            "far": 50
                        }
                    }, {
                        "title": "视域分析2",
                        "czmObject": {
                            "xbsjType": "XbsjViewshed",
                            "xbsjGuid": "2e396eb4-bfad-4e1c-acf1-f648eaa973b2",
                            "name": "视域分析2",
                            "position": [1.9017162550061513, 0.5972198728482121, 433.7983257335933],
                            "rotation": [5.48363664103055, -0.32127571902937535, 6.280826152838497],
                            "far": 50
                        }
                    }, {
                        "title": "裁剪面1",
                        "czmObject": {
                            "xbsjType": "XbsjClippingPlane",
                            "xbsjGuid": "c00c4e7f-e3e8-4f4d-8b9c-97f84d4ad404",
                            "name": "裁剪面1",
                            "position": [1.9016970582304769, 0.5972442199495571, 426],
                            "show": false
                        }
                    }, {
                        "title": "压平多边形组1",
                        "czmObject": {
                            "xbsjType": "XbsjFlattenedPolygonCollection",
                            "xbsjGuid": "72c32831-03c1-4d27-b902-a2b423d487d9",
                            "name": "压平多边形组1",
                            "polygons": [{
                                "positions": [1.9016970582304769, 0.5972442199495571, 1.901705173920893, 0.597244064486611, 1.9017051803683183, 0.5972514238789111, 1.90169684143085, 0.5972513210237236],
                                "height": 426
                            }]
                        }
                    }]
                }]
            }, {
                "title": "项目2",
                "children": []
            }]
        }
    },
    "cameraViewManager": {
        "xbsjType": "XbsjCameraViewManager",
        "xbsjGuid": "0b4c855c-7ba7-482b-bbf9-c9eb60b0d249",
        "globe": {
            "xbsjType": "XbsjCameraView",
            "xbsjGuid": "cca0270c-04e3-40b1-82ee-f1592cb7b609",
            "position": [2.1031217486531677, 0.5042461979915104, 22191651.019924622],
            "rotation": [0, -1.5704894508531937, 0],
            "near": 0.1,
            "far": 10000000000
        },
        "china": {
            "xbsjType": "XbsjCameraView",
            "xbsjGuid": "6ab7d9f4-1ae8-4c4b-b011-c49c4d0d1783",
            "position": [1.8770894704964525, 0.662547523843314, 8511735.797037361],
            "rotation": [0, -1.5701114159178209, 0],
            "near": 0.1,
            "far": 10000000000
        }
    },
    "cameraFlight": {
        "xbsjType": "XbsjCameraFlight",
        "xbsjGuid": "e0ca9b3a-85b0-4350-b2ad-2b9ba5969979",
        "rotateGlobe": {
            "xbsjType": "XbsjRotateGlobe",
            "xbsjGuid": "e7a95fdd-e6ac-47cd-bff9-4906e5c2e2d3"
        },
        "rotateCenter": {
            "xbsjType": "XbsjRotateCenter",
            "xbsjGuid": "d5b630c1-4889-4243-a3a1-a9b03f878dc9"
        },
        "track": {
            "xbsjType": "XbsjCameraTrack",
            "xbsjGuid": "dc5d5f63-f561-48e9-b0ee-57cd98e3af6e"
        }
    },
    "weather": {
        "xbsjType": "XbsjWeather",
        "xbsjGuid": "cf847fba-8927-44e5-adc1-d08911dd6533",
        "fog": {
            "xbsjType": "XbsjFog",
            "xbsjGuid": "bf77eb7c-c0e9-4d13-86d7-86f9f6da4258"
        },
        "sun": {
            "xbsjType": "XbsjSun",
            "xbsjGuid": "d7ae3b36-6cb2-4d31-bc3a-bb4eb011c582"
        },
        "moon": {
            "xbsjType": "XbsjMoon",
            "xbsjGuid": "32d959de-1c54-4094-93de-517d983fa827"
        },
        "rain": {
            "xbsjType": "XbsjRain",
            "xbsjGuid": "a3c9a07b-1ea9-482e-9a73-a7152db610e7"
        },
        "snow": {
            "xbsjType": "XbsjSnow",
            "xbsjGuid": "6ac2f193-c882-4931-9f9e-691b2c5d83c5"
        },
        "cloud": {
            "xbsjType": "XbsjWorldCloud",
            "xbsjGuid": "ef2865a3-ad49-4618-9a23-407ccb914f1d"
        },
        "atmosphere": {
            "xbsjType": "XbsjAtmosphere",
            "xbsjGuid": "0c072dad-b153-4c50-b532-70dfecb2409f"
        }
    },
    "terrainEffect": {
        "xbsjType": "XbsjTerrainEffect",
        "xbsjGuid": "69d0b610-fc00-4d12-86d1-23a97d188e0b",
        "elevation": {
            "xbsjType": "XbsjElevationRamp",
            "xbsjGuid": "706262cf-c570-4ede-ba50-d11a3397d8ef"
        },
        "slope": {
            "xbsjType": "XbsjSlopeRamp",
            "xbsjGuid": "ad535213-5ab9-47d1-aba2-9521410e34ef"
        },
        "aspect": {
            "xbsjType": "XbsjAspectRamp",
            "xbsjGuid": "777b7036-57d1-4ae2-8d01-ebd9fbfebe18"
        },
        "contour": {
            "xbsjType": "XbsjContour",
            "xbsjGuid": "6a903517-4e1d-40ec-b330-cb298c4a2c3a"
        }
    },
    "postProcess": {
        "xbsjType": "XbsjPostProcess",
        "xbsjGuid": "aa9f6426-1890-43de-acb8-d192f8ed352f",
        "ambientOcclusion": {
            "xbsjType": "XbsjAmbientOcclusionStage",
            "xbsjGuid": "b3241fbb-0055-416b-a1e2-ab21d9983529"
        },
        "bloom": {
            "xbsjType": "XbsjBloomStage",
            "xbsjGuid": "13423b93-041e-49b3-9db9-89c9e6ec1e42"
        },
        "blackAndWhite": {
            "xbsjType": "XbsjBlackAndWhiteStage",
            "xbsjGuid": "424a94c3-52b6-4906-8c65-7f871af6a64e"
        },
        "brightness": {
            "xbsjType": "XbsjBrightnessStage",
            "xbsjGuid": "cb7060f5-8849-4223-8d72-d76d98c2de8d"
        },
        "depthOfField": {
            "xbsjType": "XbsjDepthOfFieldStage",
            "xbsjGuid": "3192b1d0-b55a-46c1-a674-7a71ebbbca07"
        },
        "lensFlare": {
            "xbsjType": "XbsjLensFlareStage",
            "xbsjGuid": "72a7c58c-87f3-49d6-8013-956edcd08db1"
        },
        "mosaic": {
            "xbsjType": "XbsjMosaicStage",
            "xbsjGuid": "f371761b-3064-41e6-b554-c612501b6bd5"
        },
        "nightVision": {
            "xbsjType": "XbsjNightVisionStage",
            "xbsjGuid": "c71090c7-44db-4206-9556-bfb0a7992069"
        },
        "silhouette": {
            "xbsjType": "XbsSilhouetteStage",
            "xbsjGuid": "6a8bb532-8fd8-461c-a9dd-507b9be5226b"
        }
    },
    "effect": {
        "xbsjType": "XbsjEffect",
        "xbsjGuid": "357314a9-7997-4d63-8002-e56dbbfd1d3a",
        "shadow": {
            "xbsjType": "XbsjShadow",
            "xbsjGuid": "3c6f928c-0029-4afe-afdb-a852bde3951b"
        }
    }
}