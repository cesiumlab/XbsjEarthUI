function getPositionsHeightFromTileset (earth, positions, resultCallback) {
  if (!earth.czm.scene.globe.depthTestAgainstTerrain) {
    console.warn(
      "scene.globe.depthTestAgainstTerrain is false, may not get the height!"
    );
  }

  const cps = [];
  for (let p of positions) {
    cps.push(new Cesium.Cartographic(p[0], p[1], p[2]));
  }

  earth.czm.scene
    .sampleHeightMostDetailed(cps)
    .then(r => {
      try {
        let i = 0;
        for (let p of positions) {
          if (r[i].height === undefined) {
            throw new Error("r[i].height === undefined");
          }
          p[2] = r[i].height;
          i++;
        }
        // console.log(p);
        resultCallback(true);
      } catch (error) {
        console.error("sampleHeightMostDetailed error 1!");
        resultCallback(false);
      }
    })
    .otherwise(error => {
      resultCallback(false);
      console.error("sampleHeightMostDetailed error 2!");
    });
}

function getPositionsHeightFromTerrain (earth, positions, resultCallback) {
  // Query the terrain height of two Cartographic positions
  var terrainProvider = earth.czm.scene.terrainProvider;

  if (terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
    console.warn("没加载地形，可能获取不到高程信息");
  }

  const cps = [];
  for (let p of positions) {
    cps.push(new Cesium.Cartographic(p[0], p[1], p[2]));
  }

  var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, cps);
  Cesium.when(
    promise,
    function (r) {
      try {
        let i = 0;
        for (let p of positions) {
          if (r[i].height === undefined) {
            throw new Error("r[i].height === undefined");
          }
          p[2] = r[i].height;
          i++;
        }
        resultCallback(true);
      } catch (error) {
        console.error("sampleTerrainMostDetailed error 1!");
        resultCallback(false);
      }
    },
    function (error) {
      resultCallback(false);
      console.error("sampleTerrainMostDetailed error 2!" + error);
    }
  );
}

export { getPositionsHeightFromTerrain, getPositionsHeightFromTileset }
