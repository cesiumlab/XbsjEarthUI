function AddPoint(earth, e) {

    var pinBuilder = new Cesium.XbsjPinBuilder();
    const entity = earth.czm.viewer.entities.add({
        name: e.Equipment_Name,
        position: Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
        point: {
            pixelSize: 1,
            outlineWidth: 0,
        },
        polyline: {
            positions: [
                Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height - 50),
                Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
            ],
            width: 2.0,
            material: Cesium.Color.BLUE,
        },
        billboard: {
            image: pinBuilder.fromColor(new Cesium.Color(0.2, 0.2, 0.2, 1.0), 50, Cesium.Color.WHITE),
            color: new Cesium.Color(1, 0, 0, 1),
            verticalOrigin: Cesium.VerticalOrigin.MIDDLE,
            scale: 1,
            show: true,
        },
        label: {
            text: e.value.toFixed() + '',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            font: '20px 微软雅黑',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 6,
            scale: 1,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER
        }
    });
    return entity;
}