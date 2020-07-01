<template>
  <div
    v-show="show"
    style="width: 100%; height: 30px;background: rgba(71, 71, 71, 0.8); position: absolute; bottom: 0; font-size: 14px;line-height:30px;z-index:9999;"
  >{{ statusString }} {{ velocityString }}</div>
</template>

<script>
export default {
  data: function() {
    return {
      show: true,
      cameraString: "",
      fpsString: "",
      baseVelocity: 0.0,
      velocity: 0.0,
      velocityRatio: 1.0,
      langs: {
        zh: {
          longitude: "经度",
          latitude: "纬度",
          height: "高度",
          fps: "帧率",
          heading: "偏航角",
          pitch: "俯仰角",
          roll: "翻滚角",
          meter: "米",
          velocity: "键盘运动速度",
          createPolylineTip: "左键添加点，右键删除点，shift+右键创建完成",
          editPolylineTip:
            "鼠标移动到其中一个点会出现一个操作栏，点击移动按钮，可以移动折线位置；点击增加按钮，可以在该位置增加一个点；点击删除按钮，可以删除该点",
          createRectangleTip:
            "点击左键确定矩形中心点，移动鼠标确定矩形方向和对角线长度，再次点击左键创建完成",
          editRectangleTip: "左键点击其中一个点移动矩形位置",
          createCircleTip:
            "点击左键确定圆的圆心，移动鼠标确定圆的半径，再次点击左键创建完成",
          editCircleTip: "左键点击其中一个点移动圆位置",
          createDoubleArrowTip: "在四个不同位置点击左键创建双箭头",
          editDoubleArrowTip: "左键点击其中一个点移动双箭头位置",
          createFlattenedPolygonTip:
            "左键添加点，右键删除点，shift+右键停止绘制，上下移动鼠标确定高度，再次点击左键创建完成",
          editFlattenedPolygonTip:
            "鼠标移动到其中一个点会出现一个操作栏，点击移动按钮，可以移动折线位置；点击增加按钮，可以在该位置增加一个点；点击删除按钮，可以删除该点",
          movableObjectTip:
            "鼠标左键点击坐标轴x,y,z任意一个轴，轴变黄色，可沿着相应位置进行移动，再次点击，轴恢复原色，停止移动，点击右键坐标轴消失",
          rotatableObjectTip:
            "鼠标左键点击旋转坐标轴任意一个轴，轴变黄色，可沿着相应位置进行旋转，再次点击，轴恢复原色，停止旋转，点击右键旋转坐标轴消失",
          positionPickingTip: "点击鼠标左键拾取位置"
        },
        en: {
          longitude: "LNG",
          latitude: "LAT",
          height: "HEIGHT",
          fps: " FRAME RATE",
          heading: "HEADING",
          pitch: "PITCH",
          roll: "ROLL",
          meter: " M",
          velocity: "Keyboard Velocity",
          createPolylineTip:
            "Left click to add points, right click to delete points, shift + right click to finish creating",
          editPolylineTip:
            "When the mouse moves to one of the points, an operation bar will appear. Click the move button to move the polyline position; click the Add button to add a point in the position; click the delete button to delete the point",
          createRectangleTip:
            "Click the left button to determine the center point of the rectangle, move the mouse to determine the direction of the rectangle and the length of the diagonal, and click the left button again to complete the creation",
          editRectangleTip:
            "Left click one of the points to move the rectangular position",
          createCircleTip:
            "Click the left button to determine the center of the circle, move the mouse to determine the radius of the circle, and click the left button again to complete the creation",
          editCircleTip:
            "Left click one of the points to move the circle position",
          createDoubleArrowTip:
            "Left click in four different places to create a double arrow",
          editDoubleArrowTip:
            "Left click one of the points to move the double arrow position",
          createFlattenedPolygonTip:
            "Left click to add points, right click to delete points, shift + right click to stop drawing, move the mouse up and down to determine the height, and click left button again to finish creating",
          editFlattenedPolygonTip:
            "When the mouse moves to one of the points, an operation bar will appear. Click the move button to move the polyline position; click the Add button to add a point in the position; click the delete button to delete the point",
          movableObjectTip:
            "Click any axis X, y, Z with the left mouse button, and the axis turns yellow. You can move along the corresponding position. Click again, the axis will return to its original color, stop moving, and click the right button to disappear the coordinate axis",
          rotatableObjectTip:
            "Click any axis of the rotation coordinate axis with the left mouse button, the axis turns yellow, and you can rotate along the corresponding position. Click again, the axis will return to its original color, stop rotating, and click the right button to rotate the coordinate axis and disappear",
          positionPickingTip:
            "Click the left mouse button to pick up the position"
        }
      },
      lang: undefined,
      _uw1: undefined,
      _uw2: undefined,
      _uw3: undefined,
      _uw4: undefined,
      _uw5: undefined,
      _uw6: undefined,
      _uw7: undefined,
      _uw8: undefined
    };
  },
  created() {},
  mounted() {
    this._scene = this.$root.$earth.czm.scene;
    this._camera = this.$root.$earth.czm.camera;

    const td = Cesium.Math.toDegrees;

    const updateCameraString = () => {
      const camera = this._camera;

      var l = td(camera.positionCartographic.longitude).toFixed(5);
      var b = td(camera.positionCartographic.latitude).toFixed(5);
      var h = camera.positionCartographic.height.toFixed(2);
      var y = td(camera.heading).toFixed(2);
      var p = td(camera.pitch).toFixed(2);
      var r = td(camera.roll).toFixed(2);

      this.cameraString = `${this.lang.longitude}: ${l}° ${this.lang.latitude}: ${b}° ${this.lang.height}: ${h}${this.lang.meter} ${this.lang.heading}: ${y}° ${this.lang.pitch}: ${p}° ${this.lang.roll}: ${r}°`;
    };

    this._disposers = [];
    this._disposers.push(
      this._camera.changed.addEventListener(updateCameraString)
    );
    updateCameraString();

    // 帧率的计算借助了Cesium中的东西，需要开启debugShowFramesPerSecond
    this._scene.debugShowFramesPerSecond = true;
    const tempDisposer = this._scene._postRender.addEventListener(() => {
      tempDisposer();
      this._scene._performanceContainer.style.visibility = "hidden"; // 隐藏默认的帧率显示窗口
    });

    this._disposers.push(
      this._scene._postRender.addEventListener(() => {
        if (this._scene._performanceDisplay) {
          this.fpsString = `${this.lang.fps}: ${this._scene._performanceDisplay._fpsText.nodeValue} `;
        } else {
          this.fpsString = "";
        }
      })
    );

    this._disposers.push(
      XE.MVVM.track(
        this,
        "baseVelocity",
        this.$root.$earth.camera.immersion,
        "baseVelocity"
      )
    );
    this._disposers.push(
      XE.MVVM.track(
        this,
        "velocity",
        this.$root.$earth.camera.immersion,
        "velocity"
      )
    );
    this._disposers.push(
      XE.MVVM.bind(
        this,
        "velocityRatio",
        this.$root.$earth.camera.immersion,
        "velocityRatio"
      )
    );

    if (this._uw1) {
      this._uw1 = this._uw1();
    } else {
      this._uw1 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.creatingPolylineBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.creatingPolylineBinding.target !==
            undefined
          ) {
            if (
              this.$root.$earth.interaction.creatingPolylineBinding.target
                .xbsjType === "GeoRectangle"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.createRectangleTip);
            } else if (
              this.$root.$earth.interaction.creatingPolylineBinding.target
                .xbsjType === "GeoCircle"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.createCircleTip);
            } else if (
              this.$root.$earth.interaction.creatingPolylineBinding.target
                .xbsjType === "GeoDoubleArrow"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.createDoubleArrowTip);
            } else {
              this.$root.$earthUI.promptInfo(this.lang.createPolylineTip);
            }
          }
        }
      );
    }
    if (this._uw2) {
      this._uw2 = this._uw2();
    } else {
      this._uw2 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.editingPolylineBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.editingPolylineBinding.target !==
            undefined
          ) {
            if (
              this.$root.$earth.interaction.editingPolylineBinding.target
                .xbsjType === "GeoRectangle"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.editRectangleTip);
            } else if (
              this.$root.$earth.interaction.editingPolylineBinding.target
                .xbsjType === "GeoCircle"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.editCircleTip);
            } else if (
              this.$root.$earth.interaction.editingPolylineBinding.target
                .xbsjType === "GeoDoubleArrow"
            ) {
              this.$root.$earthUI.promptInfo(this.lang.editDoubleArrowTip);
            } else {
              this.$root.$earthUI.promptInfo(this.lang.editPolylineTip);
            }
          }
        }
      );
    }
    if (this._uw3) {
      this._uw3 = this._uw3();
    } else {
      this._uw3 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.creatingPolygonBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.creatingPolygonBinding.target !==
            undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.createPolygonTip);
          }
        }
      );
    }
    if (this._uw4) {
      this._uw4 = this._uw4();
    } else {
      this._uw4 = XE.MVVM.watch(
        () =>
          this.$root.$earth.interaction.flattenedPolygonCreatingBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.flattenedPolygonCreatingBinding
              .target !== undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.createFlattenedPolygonTip);
          }
        }
      );
    }
    if (this._uw5) {
      this._uw5 = this._uw5();
    } else {
      this._uw5 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.editingPolygonBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.editingPolygonBinding.target !==
            undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.editFlattenedPolygonTip);
          }
        }
      );
    }
    if (this._uw6) {
      this._uw6 = this._uw4();
    } else {
      this._uw6 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.movableObjectBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.movableObjectBinding.target !==
            undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.movableObjectTip);
          }
        }
      );
    }
    if (this._uw7) {
      this._uw7 = this._uw4();
    } else {
      this._uw7 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.rotatableObjectBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.rotatableObjectBinding.target !==
            undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.rotatableObjectTip);
          }
        }
      );
    }
    if (this._uw8) {
      this._uw8 = this._uw4();
    } else {
      this._uw8 = XE.MVVM.watch(
        () => this.$root.$earth.interaction.positionPickingBinding.target,
        () => {
          if (
            this.$root.$earth.interaction.positionPickingBinding.target !==
            undefined
          ) {
            this.$root.$earthUI.promptInfo(this.lang.positionPickingTip);
          }
        }
      );
    }
  },
  computed: {
    statusString() {
      return this.fpsString + this.cameraString;
    },
    velocityString() {
      return ` ${this.lang.velocity}: ${this.velocity.toFixed(
        1
      )} km/h (${this.baseVelocity.toFixed(1)} × ${this.velocityRatio.toFixed(
        1
      )})`;
    }
  },
  beforeDestroy() {
    this._disposers.forEach(d => d());
    this._disposers.length = 0;
    this._uw1 = this._uw1 && this._uw1();
    this._uw2 = this._uw2 && this._uw2();
    this._uw3 = this._uw3 && this._uw3();
    this._uw4 = this._uw4 && this._uw4();
    this._uw5 = this._uw5 && this._uw5();
    this._uw6 = this._uw6 && this._uw6();
    this._uw7 = this._uw7 && this._uw7();
    this._uw8 = this._uw8 && this._uw8();
  }
};
</script>

<style>
</style>
