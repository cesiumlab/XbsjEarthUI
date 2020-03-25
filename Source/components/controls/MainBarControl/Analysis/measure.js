
function getDisAndLabelPos (positions, interval, maxSample, earth) {
    if (!earth.czm.scene.globe.depthTestAgainstTerrain) {
        earth.czm.scene.globe.depthTestAgainstTerrain = true;
    }
    var samplePoints = [];
    var disAndLabelPos = [];
    var total = 0;
    for (var i = 1; i < positions.length; i++) {
        var p1 = positions[i - 1];
        var p2 = positions[i];
        var center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];

        var c1 = Cesium.Cartesian3.fromRadians(p1[0], p1[1], p1[2]);
        var c2 = Cesium.Cartesian3.fromRadians(p2[0], p2[1], p2[2]);
        var distance = Cesium.Cartesian3.distance(c1, c2);;
        samplePoints.push(p1);

        var pos = [];
        if (distance > interval) {
            var step = distance / interval;
            step = Math.min(step, maxSample);
            interval = distance / step;
            var xinterval = (p1[0] - p2[0]) / step;
            var yinterval = (p1[1] - p2[1]) / step;

            pos.push(c1);
            while (distance > interval) {
                var p = [p1[0] + xinterval, p1[1] + yinterval, 0];
                p[2] = getSampleHeight(p, earth)
                pos.push(Cesium.Cartesian3.fromRadians(p[0], p[1], p[2]));
                samplePoints.push(p);
                distance -= interval;
            }
            pos.push(c2);

            distance = 0;
            for (var j = 1; j < pos.length; j++) {
                var c1 = pos[j - 1];
                var c2 = pos[j];                
                distance += parseFloat(Cesium.Cartesian3.distance(c1, c2).toFixed(2));
            }
        }
        total += distance;

        disAndLabelPos.push({
            dis: distance + "米",
            pos: center
        })
    }
    var p = positions[positions.length - 1];
    samplePoints.push(p);

    disAndLabelPos.push({
        dis: "总长：" + total + "米",
        pos: positions[0]
    })

    var result = {};
    result.sample = samplePoints;
    result.label = disAndLabelPos;
    return result;
}

function getSampleHeight (p, earth) {
    var c = new Cesium.Cartographic(p[0], p[1]);
    return earth.czm.scene.sampleHeight(c);
}
export { getDisAndLabelPos };
