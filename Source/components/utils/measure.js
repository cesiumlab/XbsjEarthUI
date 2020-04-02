
var limit = 50;
function getDisAndLabelPos (positions, interval, earth) {
    if (!earth.czm.scene.globe.depthTestAgainstTerrain) {
        earth.czm.scene.globe.depthTestAgainstTerrain = true;
    }
    var samplePoints = [];
    samplePoints.push({
        distance: 0,
        longitude: positions[0][0] * 180 / Math.PI,
        latitude: positions[0][1] * 180 / Math.PI,
        height: positions[0][2]
    });

    var disAndLabelPos = [];
    var total = 0;

    if (interval === 0) {
        for (var i = 1; i < positions.length; i++) {
            var p1 = positions[i - 1];
            var p2 = positions[i];

            var c1 = Cesium.Cartesian3.fromRadians(p1[0], p1[1], p1[2]);
            var c2 = Cesium.Cartesian3.fromRadians(p2[0], p2[1], p2[2]);
            total += Cesium.Cartesian3.distance(c1, c2);
        }

        interval = Math.round(total / limit);
    }

    if (!interval) {
        return null;
    }
    total = 0;
    for (var i = 1; i < positions.length; i++) {
        var p1 = positions[i - 1];
        var p2 = positions[i];
        var center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];

        var c1 = Cesium.Cartesian3.fromRadians(p1[0], p1[1], p1[2]);
        var c2 = Cesium.Cartesian3.fromRadians(p2[0], p2[1], p2[2]);
        var distance = Cesium.Cartesian3.distance(c1, c2);

        var first = c1;
        if (distance > interval) {
            var step = distance / interval;
            var xinterval = (p2[0] - p1[0]) / step;
            var yinterval = (p2[1] - p1[1]) / step;

            var setiondistance = 0;
            var p = p1;
            while (distance >= interval) {
                p = [p[0] + xinterval, p[1] + yinterval, 0];
                p[2] = getSampleHeight(p, earth)

                var second = Cesium.Cartesian3.fromRadians(p[0], p[1], p[2]);
                setiondistance += Cesium.Cartesian3.distance(first, second);
                samplePoints.push({
                    distance: Math.round((total + setiondistance) * 100) / 100,
                    longitude: p[0] * 180 / Math.PI,
                    latitude: p[1] * 180 / Math.PI,
                    height: p[2]
                });

                distance -= interval;
                first = second;
            }
            distance = setiondistance;
        } else {
            samplePoints.push({
                distance: Math.round((total) * 100) / 100,
                longitude: p2[0] * 180 / Math.PI,
                latitude: p2[1] * 180 / Math.PI,
                height: p2[2]
            });
        }
        total += distance;

        disAndLabelPos.push({
            dis: (Math.round((distance) * 100) / 100) + "米",
            pos: center
        })
    }

    disAndLabelPos.push({
        dis: "总长：" + (Math.round((total) * 100) / 100) + "米",
        pos: positions[0]
    })

    var result = {};
    result.sample = samplePoints;
    result.label = disAndLabelPos;
    result.interval = interval;
    return result;
}

function getSampleHeight (p, earth) {
    var c = new Cesium.Cartographic(p[0], p[1]);
    return earth.czm.scene.sampleHeight(c);
}

function getPickRay (p1, p2, earth) {
    var scene = earth.czm.scene;

    var c1 = Cesium.Cartesian3.fromRadians(p1[0], p1[1], p1[2]);
    var c2 = Cesium.Cartesian3.fromRadians(p2[0], p2[1], p2[2]);
    var direction = Cesium.Cartesian3.subtract(c2, c1, new Cesium.Cartesian3())
    direction = Cesium.Cartesian3.normalize(direction, direction);
    var ray = new Cesium.Ray(c1, direction);
    const resultScene = scene.pickFromRay(ray);
    const resultGlobe = scene.globe.pick(ray, scene);

    var result;
    if (Cesium.defined(resultScene) && Cesium.defined(resultScene.position) && Cesium.defined(resultGlobe)) {
        const disScene = Cesium.Cartesian3.distance(c1, resultScene.position);
        const disGlobe = Cesium.Cartesian3.distance(c1, resultGlobe);
        result = disScene < disGlobe ? resultScene.position : resultGlobe;
    } else if (Cesium.defined(resultScene) && Cesium.defined(resultScene.position)) {
        result = resultScene.position;
    } else if (Cesium.defined(resultGlobe)) {
        result = resultGlobe;
    }

    if (Cesium.defined(result)) {
        const d1 = Cesium.Cartesian3.distance(c1, c2);
        const d2 = Cesium.Cartesian3.distance(c1, result);

        if (d2 > d1) {
            return Cesium.Cartographic.fromCartesian(c2);
        } else {
            return Cesium.Cartographic.fromCartesian(result);
        }
    } else {
        return null;
    }
}



export { getDisAndLabelPos, getPickRay };
