/**
 * 指定模型坐标a和b，和对应在地球上的A和B，求模型的位置姿态信息
 * @param {Cesium.Cartesian3} a 模型本地坐标点a，从3dmax中获取，数值应该都不大
 * @param {Cesium.Cartesian3} b 模型本地坐标点b，从3dmax中获取，数值应该都不大
 * @param {Cesium.Cartesian3} A 以地球球心为原点建立的笛卡尔坐标系下的坐标点A，数值应该会很大
 * @param {Cesium.Cartesian3} B 以地球球心为原点建立的笛卡尔坐标系下的坐标点A，数值应该会很大
 * @returns {
 *      scale: number, // 缩放值  
 *      rotation: Cesium.Quaternion, // 四元数旋转量  
 *      positionInCartesian: Cesium.Cartesian3, // 位置 世界坐标系  
 *      positionInRadians: Cesium.HeadingPitchRoll, // 位置 经纬度弧度  
 *      positionInDegrees: {  
 *          longitude: number,  
 *          latitude: number,  
 *          height: number,  
 *      }, // 位置 经纬度度数  
 *      hpr: Cesium.HeadingPitchRoll, // 欧拉角，弧度单位  
 *      hprInDegrees: {  
 *          heading: number,  
 *          pitch: number,  
 *          roll: number,  
 *      }, // 欧拉角，度数单位  
 *      modelMatrix: Cesium.Matrix4, // 矩阵  
 * }  
 */
var ab2Ab = (function (a, b, A, B) {
    var rotationTo = (function () {
        const vec3 = {
            create: () => new Cesium.Cartesian3(),
            fromValues: Cesium.Cartesian3.fromElements,
            dot: Cesium.Cartesian3.dot,
            cross: (r, a, b) => Cesium.Cartesian3.cross(a, b, r),
            len: Cesium.Cartesian3.magnitude,
            normalize: (r, a) => Cesium.Cartesian3.normalize(a, r),
        }
        const setAxisAngle = (r, a, b) => Cesium.Quaternion.fromAxisAngle(a, b, r);
        const normalize = (r, a) => Cesium.Quaternion.normalize(a, r);
    
        let tmpvec3 = vec3.create();
        let xUnitVec3 = vec3.fromValues(1, 0, 0);
        let yUnitVec3 = vec3.fromValues(0, 1, 0);
    
        return function (out, a, b) {
            let dot = vec3.dot(a, b);
            if (dot < -0.999999) {
                vec3.cross(tmpvec3, xUnitVec3, a);
                if (vec3.len(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, a);
                vec3.normalize(tmpvec3, tmpvec3);
                setAxisAngle(out, tmpvec3, Math.PI);
                return out;
            } else if (dot > 0.999999) {
                out.x = 0;
                out.y = 0;
                out.z = 0;
                out.w = 1;
                return out;
            } else {
                vec3.cross(tmpvec3, a, b);
                out.x = tmpvec3.x;
                out.y = tmpvec3.y;
                out.z = tmpvec3.z;
                out.w = 1 + dot;
                return normalize(out, out);
            }
        };
    })();
    
    function ab2ABInner(a, b, A, B) {
        var enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(A);
        var inverseEnuMatrix = new Cesium.Matrix4();
        inverseEnuMatrix = Cesium.Matrix4.inverse(enuMatrix, inverseEnuMatrix);
    
        var lA = new Cesium.Cartesian3();
        lA = Cesium.Matrix4.multiplyByPoint(inverseEnuMatrix, A, lA);
        // lA (0, 0, 0)
    
        var lB = new Cesium.Cartesian3();
        lB = Cesium.Matrix4.multiplyByPoint(inverseEnuMatrix, B, lB);
    
        var d = new Cesium.Cartesian3();
        Cesium.Cartesian3.subtract(b, a, d);
        var lD = new Cesium.Cartesian3();
        Cesium.Cartesian3.subtract(lB, lA, lD);
    
        var dl = Cesium.Cartesian3.magnitude(d);
        Cesium.Cartesian3.normalize(d, d);
    
        var lDl = Cesium.Cartesian3.magnitude(lD);
        Cesium.Cartesian3.normalize(lD, lD);
    
        var q = new Cesium.Quaternion();
        rotationTo(q, d, lD);
    
        var s = lDl / dl;
    
        var srM = Cesium.Matrix4.fromTranslationQuaternionRotationScale(Cesium.Cartesian3.ZERO, q, Cesium.Cartesian3.fromElements(s, s, s));
    
        var ta = new Cesium.Cartesian3();
        ta = Cesium.Matrix4.multiplyByPoint(srM, a, ta);
    
        var t = Cesium.Cartesian3.subtract(lA, ta, new Cesium.Cartesian3());
    
        var p = Cesium.Matrix4.multiplyByPoint(enuMatrix, t, new Cesium.Cartesian3());
    
        var modelMatrix = new Cesium.Matrix4();
        {
            const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(p);
            Cesium.Matrix4.multiply(enuMatrix, srM, modelMatrix);
        }
    
        { // 验证矩阵是否可用
            var AA = Cesium.Matrix4.multiplyByPoint(modelMatrix, a, new Cesium.Cartesian3());
            var BB = Cesium.Matrix4.multiplyByPoint(modelMatrix, b, new Cesium.Cartesian3());
            var ba = Cesium.Cartesian3.equalsEpsilon(A, AA, 0.000001);
            var bb = Cesium.Cartesian3.equalsEpsilon(B, BB, 0.000001);
            console.log(`ba: ${ba} bb: ${bb}`);
        }
    
        var pd = Cesium.Cartographic.fromCartesian(p);
        var pdd = {
            longitude: Cesium.Math.toDegrees(pd.longitude),
            latitude: Cesium.Math.toDegrees(pd.latitude),
            height: pd.height,
        };
    
        var hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
        var hprInDegrees = {
            heading: Cesium.Math.toDegrees(hpr.heading),
            pitch: Cesium.Math.toDegrees(hpr.pitch),
            roll: Cesium.Math.toDegrees(hpr.roll),
        }
    
        return {
            scale: s, // 缩放值
            rotation: q, // 四元数旋转量
            positionInCartesian: p, // 位置 世界坐标系
            positionInRadians: pd, // 位置 经纬度弧度
            positionInDegrees: pdd, // 位置 经纬度度数
            hpr, // 欧拉角
            hprInDegrees, // 欧拉角度数
            modelMatrix, // 矩阵
        }
    }

    return ab2ABInner;
})();

// 测试代码
// var d = 90 / 6378137 * Math.cos(39.9*Math.PI/180.0) * 180.0 / Math.PI;
// var r = ab2AB(new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3(9, 0, 0), Cesium.Cartesian3.fromDegrees(116.39, 39.9, 10), Cesium.Cartesian3.fromDegrees(116.39+d, 39.9+d, 10));

// 测试结果
// r
// hpr: HeadingPitchRoll {heading: -0.9144926619303422, pitch: -0.000006817781220470006, roll: 0.0000033545107762258553}
// hprInDegrees: {heading: -52.39656992429262, pitch: -0.0003906300895764828, roll: 0.00019219930980889525}
// modelMatrix: Matrix4 {0: -3.097668797368073, 1: -7.016404683562405, 2: 5.8702447516825496, 3: 0, 4: 8.534799207794942, 5: 0.01471073108238698, 6: 4.521310228614556, 7: 0, 8: -3.293464833696548, 9: 6.637402279298378, 10: 6.195420928260614, 11: 0, 12: -2177877.4065915043, 13: 4389228.925361875, 14: 4069480.0899964543, 15: 1}
// positionInCartesian: Cartesian3 {x: -2177877.4065915043, y: 4389228.925361875, z: 4069480.0899964543}
// positionInDegrees: {longitude: 116.39000000000004, latitude: 39.900000000000006, height: 9.999999999239673}
// positionInRadians: Cartographic {longitude: 2.0313887163962008, latitude: 0.6963863715457376, height: 9.999999999239673}
// rotation: Quaternion {x: -0, y: 0.000003799173703503064, z: 0.4414789948994098, w: 0.8972715848884179}
// scale: 9.658429484463856
